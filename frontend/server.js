const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config(); // Load environment variables from .env file

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Create proxy configurations
const createWsProxy = (target, path) => {
  if (!target) {
    throw new Error(`Missing target for ${path}. Ensure API_URL or NEXT_PUBLIC_API_URL is set in .env`);
  }
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true,
    pathRewrite: { [`^${path}`]: path },
    logLevel: 'debug',
    onProxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader('Authorization', req.headers.authorization);
        console.log(`Forwarding Authorization for ${path}:`, req.headers.authorization);
      }
      if (req.headers.cookie) {
        proxyReq.setHeader('Cookie', req.headers.cookie);
        console.log(`Forwarding Cookie for ${path}:`, req.headers.cookie);
      }
    },
    onProxyReqWs: (proxyReq, req, socket, options, head) => {
      if (req.headers.authorization) {
        proxyReq.setHeader('Authorization', req.headers.authorization);
        console.log(`Forwarding Authorization for WebSocket ${path}:`, req.headers.authorization);
      }
      if (req.headers.cookie) {
        proxyReq.setHeader('Cookie', req.headers.cookie);
        console.log(`Forwarding Cookie for WebSocket ${path}:`, req.headers.cookie);
      }
    },
    onError: (err, req, res) => {
      console.error(`Proxy error for ${path}:`, err);
      if (res instanceof require('http').ServerResponse) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy error');
      }
    },
  });
};

const apiProxy = createProxyMiddleware({
  target: process.env.NEXT_PUBLIC_API_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/v1': '/api/v1' },
  logLevel: 'debug',
  onProxyReq: (proxyReq, req) => {
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
      console.log('Forwarding Authorization for /api/v1:', req.headers.authorization);
    }
    if (req.headers.cookie) {
      proxyReq.setHeader('Cookie', req.headers.cookie);
      console.log('Forwarding Cookie for /api/v1:', req.headers.cookie);
    }
  },
  onError: (err, req, res) => {
    console.error('Proxy error for /api/v1:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error');
  },
});

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname.startsWith('/chat-websocket')) {
      const wsProxy = createWsProxy(process.env.NEXT_PUBLIC_API_URL, '/chat-websocket');
      wsProxy(req, res);
    } else if (pathname.startsWith('/comments')) {
      const wsProxy = createWsProxy(process.env.NEXT_PUBLIC_API_URL, '/comments');
      wsProxy(req, res);
    } else if (pathname.startsWith('/api/v1')) {
      apiProxy(req, res);
    } else {
      handle(req, res, parsedUrl);
    }
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });

  // Handle WebSocket upgrades
  server.on('upgrade', (req, socket, head) => {
    const pathname = parse(req.url).pathname;
    if (pathname.startsWith('/chat-websocket')) {
      const wsProxy = createWsProxy(process.env.NEXT_PUBLIC_API_URL, '/chat-websocket');
      wsProxy.upgrade(req, socket, head);
    } else if (pathname.startsWith('/comments')) {
      const wsProxy = createWsProxy(process.env.NEXT_PUBLIC_API_URL, '/comments');
      wsProxy.upgrade(req, socket, head);
    } else {
      socket.destroy();
    }
  });
});
