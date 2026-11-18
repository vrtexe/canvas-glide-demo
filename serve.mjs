// Serves dist/ for a local look at the built site: node serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = new URL('./dist/', import.meta.url).pathname;
const port = Number(process.argv[2] ?? 4400);
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
};

createServer(async (request, response) => {
  let path = join(root, normalize(decodeURIComponent(new URL(request.url, 'http://localhost').pathname)));
  if (!path.startsWith(root)) return response.writeHead(403).end();
  try {
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
    response.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' }).end(await readFile(path));
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, () => console.log(`http://localhost:${port}/`));
