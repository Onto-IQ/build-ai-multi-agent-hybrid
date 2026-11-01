'use strict';

const fs = require('fs');
const path = require('path');

const dropIn = path.join(__dirname, 'drop-in');
let failed = 0;
function check(label, pass) {
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${label}`);
  if (!pass) failed += 1;
}

const design = fs.readFileSync(path.join(dropIn, 'docs', 'DESIGN.md'), 'utf8');
check('DESIGN.md names the cleaning contract', design.includes('reg_date') && design.includes('capital') && design.includes('2558'));
check('clean-export.sql exists', fs.existsSync(path.join(dropIn, 'scripts', 'clean-export.sql')));
const sql = fs.readFileSync(path.join(dropIn, 'scripts', 'clean-export.sql'), 'utf8');
check('SQL reads the parquet extract', sql.includes('dbd-2558.parquet'));

const server = fs.readFileSync(path.join(dropIn, 'server.js'), 'utf8');
check('summary uses the shared CSV reader', server.includes('parseCsv'));
check('notes crash is still present for Lab 06', server.includes('JSON.parse(raw)') && !server.includes('INVALID_JSON'));
check('health sample token is still present for Lab 06', server.includes('sampleToken'));

check('OpenCode planner exists', fs.existsSync(path.join(dropIn, '.opencode', 'agents', 'planner.md')));
check('OpenCode developer exists', fs.existsSync(path.join(dropIn, '.opencode', 'agents', 'developer.md')));

if (failed > 0) process.exit(1);
console.log('w3 check: passed');
