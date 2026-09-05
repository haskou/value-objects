const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const { mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { resolve, join } = require('node:path');
const { test } = require('node:test');
const workflow = readFileSync(
  resolve(__dirname, '../../.github/workflows/ci.yml'),
  'utf8',
)
  .split('\n')
  .map((line) => (line.startsWith('          ') ? line.slice(10) : line))
  .join('\n');
function shellFunction(name) {
  const start = workflow.indexOf(`${name}() {`);
  assert.notEqual(start, -1, `Missing workflow function ${name}`);
  const end = workflow.indexOf('\n}', start);
  assert.notEqual(end, -1);
  return workflow.slice(start, end + 2);
}
function fixture(t) {
  const cwd = mkdtempSync(join(tmpdir(), 'release-queue-test-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const git = (...args) =>
    execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  git('init', '-b', 'master');
  git('config', 'user.name', 'Test');
  git('config', 'user.email', 'test@example.invalid');
  const commit = (subject) => {
    writeFileSync(join(cwd, 'file'), subject);
    git('add', '.');
    git('commit', '-m', subject);
    return git('rev-parse', 'HEAD');
  };
  const historical = commit('old feature (#1)');
  const baseline = commit('chore(release): 🔖 Release v4.0.1 for #51');
  const pending = commit('new feature (#53)');
  const head = commit('package feature (#59)');
  const future = commit('later feature (#60)');
  return { cwd, git, commit, historical, baseline, pending, head, future };
}
test('release queue excludes historical and future merges', (t) => {
  const f = fixture(t);
  for (const [commit, expected] of [
    [f.historical, 1],
    [f.baseline, 1],
    [f.pending, 0],
    [f.head, 0],
    [f.future, 1],
  ]) {
    const result = spawnSync(
      'bash',
      [
        '-c',
        `${shellFunction('is_queued_release')}\nrelease_baseline=$1; release_head=$2; is_queued_release "$3"`,
        'test',
        f.baseline,
        f.head,
        commit,
      ],
      { cwd: f.cwd, encoding: 'utf8' },
    );
    assert.equal(result.status, expected, result.stderr);
  }
});
test('annotated release tag records version without creating a new commit', (t) => {
  const f = fixture(t);
  execFileSync(
    'bash',
    [
      '-c',
      `${shellFunction('create_release_tag')}\ntag=v5.0.0; next_version=5.0.0; pr_number=53; merge_commit=$1; create_release_tag`,
      'test',
      f.pending,
    ],
    { cwd: f.cwd },
  );
  assert.equal(f.git('rev-parse', 'v5.0.0^{commit}'), f.pending);
  const result = execFileSync(
    'bash',
    ['-c', `${shellFunction('release_for_pr')}\nrelease_for_pr 53`],
    { cwd: f.cwd, encoding: 'utf8' },
  ).trim();
  assert.equal(result, `v5.0.0\t5.0.0\t${f.pending}`);
});
test('legacy release commits remain recognized and PR numbers match exactly', (t) => {
  const f = fixture(t);
  const release = f.commit('chore(release): 🔖 Release v4.0.1 for #51');
  f.git('tag', '-a', 'v4.0.1', release, '-m', 'v4.0.1');
  const result = execFileSync(
    'bash',
    ['-c', `${shellFunction('release_for_pr')}\nrelease_for_pr 51`],
    { cwd: f.cwd, encoding: 'utf8' },
  ).trim();
  assert.equal(result, `v4.0.1\t4.0.1\t${release}`);
  const absent = spawnSync(
    'bash',
    ['-c', `${shellFunction('release_for_pr')}\nrelease_for_pr 5`],
    { cwd: f.cwd },
  );
  assert.equal(absent.status, 1);
});
