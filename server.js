const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if dist exists, if not, build it
const distPath = path.join(__dirname, 'calendar-app', 'dist');
if (!fs.existsSync(distPath)) {
  console.log('Building app...');
  execSync('cd calendar-app && npm install && npm run build', { stdio: 'inherit' });
}

// Serve static files
const http = require('http');
const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(distPath, req.url === '/' ? 'index.html' : req.url);

  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback — serve index.html for any route not found
      fs.readFile(path.join(distPath, 'index.html'), (err2, indexData) => {
        if (err2) {
          res.writeHead(500);
          res.end('Server Error');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(indexData);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Calendar running on port ${PORT}`);
});
