'use strict';

/**
 * Production health check. Returns ok and nothing else.
 * Do not echo tokens, sample keys, or environment variables.
 */

module.exports = function handler(req, res) {
  const body = JSON.stringify({ ok: true });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(body);
};
