'use strict';

const fs = require('fs');
const path = require('path');

function read(rel) {
  return fs.readFileSync(path.join(__dirname, 'drop-in', rel), 'utf8');
}

const opencode = read('opencode.json');
const claude = read('.claude/settings.json');
const notes = read('docs/PERMISSION-NOTES.md');
const checks = [
  ['opencode denies quality-gate.js', opencode.includes('quality-gate.js') && opencode.includes('deny')],
  ['opencode denies git push', /git push/.test(opencode) && opencode.includes('deny')],
  ['opencode keeps the key in the environment', opencode.includes('{env:OPENROUTER_API_KEY}')],
  ['opencode has no raw key', !new RegExp(['sk-', 'or-v1-', '|', 'sk-', 'ant-'].join('')).test(opencode)],
  ['claude denies git push', claude.includes('git push') && claude.includes('deny')],
  ['claude denies quality-gate edits', claude.includes('quality-gate.js')],
  ['notes record both refusals', notes.includes('quality-gate.js') && notes.includes('git push')],
];
let failed = 0;
for (const [label, pass] of checks) {
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${label}`);
  if (!pass) failed += 1;
}
if (failed > 0) process.exit(1);
console.log('perm check: passed');
