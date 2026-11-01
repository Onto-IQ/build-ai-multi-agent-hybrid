'use strict';

const fs = require('fs');
const path = require('path');

const dropIn = path.join(__dirname, 'drop-in');
let failed = 0;
function check(label, pass) {
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${label}`);
  if (!pass) failed += 1;
}

const mcp = JSON.parse(fs.readFileSync(path.join(dropIn, '.mcp.json'), 'utf8'));
const duck = Object.values(mcp.mcpServers || {}).find((server) => JSON.stringify(server).includes('mcp-server-motherduck'));
check('DuckDB MCP is registered', Boolean(duck));
check('DuckDB MCP stays read-only', duck && !JSON.stringify(duck).includes('--read-write'));
const sql = fs.readFileSync(path.join(dropIn, 'scripts', 'analysis.sql'), 'utf8');
check('analysis SQL reads a csv and writes region totals', sql.includes('read_csv') && sql.includes('region-capital'));
const analysis = fs.readFileSync(path.join(dropIn, 'docs', 'ANALYSIS.md'), 'utf8');
check('analysis names the real registry', analysis.includes('data.go.th') || analysis.includes('2558') || analysis.length > 200);

if (failed > 0) process.exit(1);
console.log('w6 check: passed');
