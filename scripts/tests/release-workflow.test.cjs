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

test('version sync preserves newer remote commits and is idempotent', (t) => {
  const f = fixture(t);
  writeFileSync(
    join(f.cwd, 'package.json'),
    '{\n  "name": "test",\n  "version": "4.0.1"\n}\n',
  );
  f.commit('add manifest');
  const remote = mkdtempSync(join(tmpdir(), 'release-sync-remote-'));
  t.after(() => rmSync(remote, { recursive: true, force: true }));
  execFileSync('git', ['clone', '--bare', f.cwd, remote], { stdio: 'pipe' });
  f.git('remote', 'add', 'origin', remote);
  const newer = f.commit('unrelated newer change');
  f.git('push', 'origin', 'master');
  f.git('checkout', '--detach', 'HEAD~1');
  const sync = () =>
    spawnSync(
      'bash',
      [
        '-c',
        `set -euo pipefail\n${shellFunction('sync_package_version')}\nbase_branch=master; package_name=test; auth_header=''; npm() { echo 7.0.2; }; sync_package_version`,
      ],
      { cwd: f.cwd, encoding: 'utf8' },
    );
  const result = sync();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(f.git('rev-parse', 'HEAD^'), newer);
  assert.equal(
    JSON.parse(readFileSync(join(f.cwd, 'package.json'))).version,
    '7.0.2',
  );
  assert.equal(f.git('diff', '--name-only', newer, 'HEAD'), 'package.json');
  const first = f.git('rev-parse', 'HEAD');
  assert.equal(sync().status, 0);
  assert.equal(f.git('rev-parse', 'HEAD'), first);
  assert.equal(
    f.git(
      'log',
      '--first-parent',
      '-n',
      '1',
      '--format=%H',
      '--extended-regexp',
      '--grep=^chore\\(release\\): .*Release v[^ ]+ for #[0-9]+$',
    ),
    f.baseline,
  );

  for (const npm of [
    'npm() { return 1; }',
    'npm() { echo invalid; }',
    'npm() { echo 6.0.0; }',
  ]) {
    const failed = spawnSync(
      'bash',
      [
        '-c',
        `set -euo pipefail\n${shellFunction('sync_package_version')}\nbase_branch=master; package_name=test; auth_header=''; ${npm}; sync_package_version`,
      ],
      { cwd: f.cwd, encoding: 'utf8' },
    );
    assert.notEqual(failed.status, 0);
    assert.equal(f.git('rev-parse', 'HEAD'), first);
    assert.equal(
      JSON.parse(readFileSync(join(f.cwd, 'package.json'))).version,
      '7.0.2',
    );
  }
});

test('version sync retries a concurrent push without losing its changes', (t) => {
  const f = fixture(t);
  writeFileSync(
    join(f.cwd, 'package.json'),
    '{"name":"test","version":"7.0.2"}\n',
  );
  f.commit('add manifest');
  const root = mkdtempSync(join(tmpdir(), 'release-sync-race-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const remote = join(root, 'remote.git');
  const competitor = join(root, 'competitor');
  execFileSync('git', ['clone', '--bare', f.cwd, remote], { stdio: 'pipe' });
  execFileSync('git', ['clone', remote, competitor], { stdio: 'pipe' });
  f.git('remote', 'add', 'origin', remote);
  const result = spawnSync(
    'bash',
    [
      '-c',
      `
set -euo pipefail
${shellFunction('sync_package_version')}
base_branch=master; package_name=test; auth_header=''
npm() { echo 7.0.3; }
competed=false
git() {
  if [[ "$*" == *"push origin"* ]] && [ "$competed" = false ]; then
    competed=true
    echo concurrent > "$COMPETITOR/concurrent"
    command git -C "$COMPETITOR" add concurrent
    command git -C "$COMPETITOR" -c user.name=Test -c user.email=test@example.invalid commit -m concurrent
    command git -C "$COMPETITOR" push origin master
  fi
  command git "$@"
}
sync_package_version
`,
    ],
    {
      cwd: f.cwd,
      encoding: 'utf8',
      env: { ...process.env, COMPETITOR: competitor },
    },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /retrying/);
  assert.equal(readFileSync(join(f.cwd, 'concurrent'), 'utf8'), 'concurrent\n');
  assert.equal(
    JSON.parse(readFileSync(join(f.cwd, 'package.json'))).version,
    '7.0.3',
  );
  assert.equal(f.git('log', '-1', '--format=%s', 'HEAD^'), 'concurrent');
  assert.equal(f.git('rev-parse', 'HEAD'), f.git('rev-parse', 'origin/master'));
});
