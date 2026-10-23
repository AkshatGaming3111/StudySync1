const http = require('http');

/**
 * Pings a local or remote URL to check if it's responsive and measures roundtrip latency.
 * @param {string} urlString
 * @param {number} timeoutMs
 * @returns {Promise<{online: boolean, latencyMs: number, statusCode: number|null, message: string}>}
 */
function checkEndpointHealth(urlString, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    try {
      const url = new URL(urlString);
      const options = {
        hostname: url.hostname,
        port: url.port || 80,
        path: url.pathname || '/',
        method: 'GET',
        timeout: timeoutMs,
        headers: {
          'User-Agent': 'StudySync-Suite-HealthChecker/1.0'
        }
      };

      const req = http.request(options, (res) => {
        const latencyMs = Date.now() - startTime;
        resolve({
          online: res.statusCode >= 200 && res.statusCode < 500,
          latencyMs,
          statusCode: res.statusCode,
          message: `Responded with status ${res.statusCode}`
        });
        // Consume response data to free up memory
        res.resume();
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          online: false,
          latencyMs: Date.now() - startTime,
          statusCode: null,
          message: 'Connection timed out'
        });
      });

      req.on('error', (err) => {
        resolve({
          online: false,
          latencyMs: Date.now() - startTime,
          statusCode: null,
          message: err.code === 'ECONNREFUSED' ? 'Server not running on port' : err.message
        });
      });

      req.end();
    } catch (e) {
      resolve({
        online: false,
        latencyMs: Date.now() - startTime,
        statusCode: null,
        message: e.message
      });
    }
  });
}

module.exports = {
  checkEndpointHealth
};
