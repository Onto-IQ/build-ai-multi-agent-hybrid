'use strict';

const fs = require('fs');
const path = require('path');

function frontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const fence = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(text);
  if (!fence) return null;
  const meta = {};
  for (const line of fence[1].split(/\r?\n/)) {
    const match = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (match) meta[match[1]] = match[2].trim();
  }
  return { meta, body: fence[2], raw: fence[1] };
}

let failed = 0;
function check(label, pass) {
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${label}`);
  if (!pass) failed += 1;
}

const claude = frontmatter(path.join(__dirname, 'drop-in', '.claude', 'agents', 'data-researcher.md'));
check('claude frontmatter', Boolean(claude));
if (claude) {
  const tools = (claude.meta.tools || '').split(',').map((item) => item.trim());
  check('claude name', claude.meta.name === 'data-researcher');
  check('claude read-only tools', tools.includes('Read') && !tools.includes('Bash') && !tools.includes('Edit') && !tools.includes('Write'));
  check('claude cites file:line', /file:line/.test(claude.body));
}

const open = frontmatter(path.join(__dirname, 'drop-in', '.opencode', 'agents', 'data-researcher.md'));
check('opencode frontmatter', Boolean(open));
if (open) {
  check('opencode denies edits', /edit:\s*deny/.test(open.raw));
  check('opencode denies bash', /bash:\s*deny/.test(open.raw));
  check('opencode cites file:line', /file:line/.test(open.body));
}

if (failed > 0) process.exit(1);
console.log('w2 check: passed');
