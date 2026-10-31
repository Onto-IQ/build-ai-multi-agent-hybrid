import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

let failed = false;

function run(args) {
  const result = spawnSync(process.execPath, args, { cwd: repoRoot, encoding: 'utf8' });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) failed = true;
  return result.status;
}

const shape = run(['scripts/verify-setup.mjs', '--course-files']);
const contracts = run(['shared/scripts/validate-json.mjs']);
const packs = run(['scripts/check-solutions.mjs']);

if (shape !== 0 || contracts !== 0 || packs !== 0 || failed) {
  console.error('Quality gate FAILED');
  process.exit(1);
}
console.log('Quality gate PASSED');
