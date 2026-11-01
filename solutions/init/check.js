'use strict';

const fs = require('fs');
const path = require('path');

const text = fs.readFileSync(path.join(__dirname, 'drop-in', 'AGENTS.md'), 'utf8');
const checks = [
  ['names Claude Code', text.includes('Claude Code')],
  ['names OpenCode', text.includes('OpenCode')],
  ['names the quality gate', text.includes('quality gate')],
  ['forbids editing the gate', text.includes('quality-gate.js')],
  ['does not contain an API key', !new RegExp(['sk-', 'or-v1-', '|', 'sk-', 'ant-'].join('')).test(text)],
];
let failed = 0;
for (const [label, pass] of checks) {
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${label}`);
  if (!pass) failed += 1;
}
if (failed > 0) process.exit(1);
console.log('init check: passed');
