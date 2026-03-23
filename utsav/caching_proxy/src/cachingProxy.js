const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const path = require("path");

const CACHE_FILE = path.join(__dirname, "../cache.json");
let cache = {};

// Load cache from file if exists
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  } catch (e) {
    cache = {};
  }
}

function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function clearCache() {
  cache = {};
  saveCache();
}

function getCacheKey(req) {
  return req.method + ":" + req.url;
}

function startProxy(port, origin) {
  const originUrl = url.parse(origin);
  const client = originUrl.protocol === "https:" ? https : http;

  const server = http.createServer((req, res) => {
    const cacheKey = getCacheKey(req);
    if (cache[cacheKey]) {
      // Serve from cache
      const cached = cache[cacheKey];
      res.writeHead(cached.statusCode, { ...cached.headers, "X-Cache": "HIT" });
      res.end(Buffer.from(cached.body, "base64"));
      return;
    }

    // Forward request to origin      
    const options = { 
      protocol: originUrl.protocol,
      hostname: originUrl.hostname,
      port: originUrl.port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = client.request(options, (proxyRes) => {
      let body = [];
      proxyRes.on("data", (chunk) => body.push(chunk));
      proxyRes.on("end", () => {
        const responseBody = Buffer.concat(body);
        // Cache the response
        cache[cacheKey] = {
          statusCode: proxyRes.statusCode,
          headers: proxyRes.headers,
          body: responseBody.toString("base64"),
        };
        saveCache();
        res.writeHead(proxyRes.statusCode, {
          ...proxyRes.headers,
          "X-Cache": "MISS",
        });
        res.end(responseBody);
      });
    });

    proxyReq.on("error", (err) => {
      res.writeHead(502);
      res.end("Proxy error: " + err.message);
    });

    req.pipe(proxyReq);
  });

  server.listen(port, () => {
    console.log(
      `Caching proxy server running on port ${port}, forwarding to ${origin}`,
    );
  });
}

module.exports = { startProxy, clearCache };
