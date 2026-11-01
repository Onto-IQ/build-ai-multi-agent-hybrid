'use strict';

/**
 * Vercel notes are read-only on purpose.
 *
 * The local server (server.js) writes data/notes.json so `npm run gate`
 * can prove a note survives a restart. That disk is the learner's laptop.
 *
 * A Vercel function does not have a durable disk. A write would vanish on
 * the next request or fail outright. This handler therefore serves one
 * demo note and refuses POST. It must not call writeFile, appendFile,
 * or createWriteStream.
 */

const DEMO = [
  {
    text: 'ตัวอย่างโน้ตสำหรับเดโม อ่านอย่างเดียวบน Vercel',
    demo: true,
  },
];

module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, mode: 'readonly', notes: DEMO }));
    return;
  }
  res.statusCode = 405;
  res.setHeader('Allow', 'GET');
  res.end(JSON.stringify({
    ok: false,
    error: 'NOTES_READONLY',
    message: 'โน้ตบน Vercel เป็นตัวอย่างอ่านอย่างเดียว เพราะดิสก์ของ serverless ไม่เก็บไฟล์ถาวร',
  }));
};
