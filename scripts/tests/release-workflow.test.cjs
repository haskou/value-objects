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
test('maintenance dependency PRs never enter the npm release queue', () => {
  const filter = workflow.match(
    /jq -c '(\s*sort_by[\s\S]*?)'\s*<<< "\$prs_json"/,
  );
  assert.ok(filter, 'Missing release PR filter');
  const prs = [
    {
      number: 33,
      headRefName: 'break/actions-checkout-7.x',
      title: 'chore(deps): ⬆️ update actions/checkout',
      mergedAt: '2026-09-05T10:00:00Z',
    },
    {
      number: 39,
      headRefName: 'break/typescript-7.x',
      title: 'chore(deps): ⬆️ update typescript',
      mergedAt: '2026-09-05T10:01:00Z',
    },
    {
      number: 62,
      headRefName: 'chore/non-major-dev-dependencies',
      title: 'chore(deps): ⬆️ update dev dependencies',
      mergedAt: '2026-09-05T10:02:00Z',
    },
    {
      number: 63,
      headRefName: 'break/uuid-14.x',
      title: 'fix(deps): ⬆️ update uuid',
      mergedAt: '2026-09-05T10:03:00Z',
    },
    {
      number: 64,
      headRefName: 'fix/runtime-dependencies',
      title: 'fix(deps): ⬆️ update runtime dependencies',
      mergedAt: '2026-09-05T10:04:00Z',
    },
    {
      number: 65,
      headRefName: 'feat/example',
      title: 'feat: ✨ Add feature',
      mergedAt: null,
    },
    {
      number: 66,
      headRefName: 'break/package',
      title: 'break(package): 💥 Change exports',
      mergedAt: '2026-09-05T10:05:00Z',
    },
    {
      number: 67,
      headRefName: 'break/runtime-major',
      title: 'break(deps): ⬆️ update runtime dependency',
      mergedAt: '2026-09-05T10:06:00Z',
    },
  ];
  const selected = execFileSync('jq', ['-cs', `${filter[1]} | .number`], {
    input: prs.map((pr) => JSON.stringify(pr)).join('\n'),
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .map(Number);
  assert.deepEqual(selected, [63, 64, 66, 67]);
});
test('Renovate classifies runtime majors as releases and tooling as maintenance', () => {
  const config = JSON.parse(
    readFileSync(resolve(__dirname, '../../renovate.json'), 'utf8'),
  );
  const classify = (manager, depType, updateType) => {
    let result = {
      semanticCommitType: 'chore',
      additionalBranchPrefix: '',
      automerge: false,
    };
    for (const rule of config.packageRules) {
      if (rule.matchManagers && !rule.matchManagers.includes(manager)) continue;
      if (rule.matchDepTypes && !rule.matchDepTypes.includes(depType)) continue;
      if (rule.matchUpdateTypes && !rule.matchUpdateTypes.includes(updateType))
        continue;
      result = { ...result, ...rule };
    }
    return [
      result.semanticCommitType,
      result.additionalBranchPrefix,
      result.automerge,
    ];
  };
  assert.deepEqual(classify('npm', 'dependencies', 'major'), [
    'break',
    'break/',
    false,
  ]);
  assert.deepEqual(classify('npm', 'optionalDependencies', 'major'), [
    'break',
    'break/',
    false,
  ]);
  assert.deepEqual(classify('npm', 'dependencies', 'minor'), [
    'fix',
    'fix/',
    true,
  ]);
  assert.deepEqual(classify('npm', 'devDependencies', 'major'), [
    'chore',
    'chore/',
    false,
  ]);
  assert.deepEqual(classify('npm', 'devDependencies', 'patch'), [
    'chore',
    'chore/',
    true,
  ]);
  assert.deepEqual(classify('github-actions', 'action', 'major'), [
    'chore',
    'chore/',
    false,
  ]);
  assert.deepEqual(classify('github-actions', 'uses-with', 'major'), [
    'chore',
    'chore/',
    false,
  ]);
});
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
