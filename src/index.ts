import fs from 'node:fs';
import http, {IncomingMessage, ServerResponse} from 'node:http';
import path from 'node:path';
import {URL} from 'node:url';
import {WebSocketServer} from 'ws';
import logger from './logger';
import {GameHandler} from './games/gameHandler';
import {initializeDatabase} from './database/database';
import {ExtendedWebSocket} from './interfaces';
import {schedule} from 'node-cron';
import {cleanUpExpiredTokens} from './database/queries';

const port = Number(process.env.PORT ?? 8000);
const webClientDistPath = path.resolve(process.cwd(), 'web/dist');
const server = http.createServer((request, response) => {
  handleHttpRequest(request, response);
});
const webSocketServer = new WebSocketServer({noServer: true});
const gameHandler = new GameHandler();

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const serveFile = (filePath: string, response: ServerResponse) => {
  const extension = path.extname(filePath);
  const contentType = contentTypes[extension] ?? 'application/octet-stream';

  fs.readFile(filePath, (error, data) => {
    if (error) {
      logger.error('Failed to read requested file', error);
      response.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
      response.end('Unable to read the requested file.');
      return;
    }

    response.writeHead(200, {'Content-Type': contentType});
    response.end(data);
  });
};

const handleHttpRequest = (request: IncomingMessage, response: ServerResponse) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

  if (requestUrl.pathname === '/health') {
    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    response.end(JSON.stringify({status: 'ok'}));
    return;
  }

  if (requestUrl.pathname === '/ws') {
    response.writeHead(426, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end('Upgrade Required');
    return;
  }

  if (!fs.existsSync(webClientDistPath)) {
    response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end('Web client not built. Run "npm run build" or use the Vite dev server from ./web.');
    return;
  }

  const relativePath = requestUrl.pathname === '/' ? 'index.html' : requestUrl.pathname.slice(1);
  const sanitizedPath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
  const requestedPath = path.join(webClientDistPath, sanitizedPath);
  const indexPath = path.join(webClientDistPath, 'index.html');

  if (requestedPath.startsWith(webClientDistPath) && fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
    serveFile(requestedPath, response);
    return;
  }

  serveFile(indexPath, response);
};

const launch = async () => {
  await initializeDatabase();
  await gameHandler.createStartingTables();

  webSocketServer.on('connection', (socket: ExtendedWebSocket) => {
    gameHandler.onConnection(socket);

    socket.isAlive = true;

    socket.on('pong', () => {
      socket.isAlive = true;
    });

    socket.on('message', (message: string) => {
      gameHandler.onMessage(socket, message);
    });

    socket.on('error', logger.error);

    socket.on('close', () => {
      gameHandler.onClientDisconnected(socket);
    });
  });

  server.on('upgrade', (request, socket, head) => {
    const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

    if (requestUrl.pathname !== '/ws') {
      socket.destroy();
      return;
    }

    webSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
      webSocketServer.emit('connection', webSocket, request);
    });
  });

  server.listen(port, () => {
    const hasBuiltWebClient = fs.existsSync(webClientDistPath);
    logger.info(`HTTP server is running on http://localhost:${port}`);
    logger.info(`WebSocket server is running on ws://localhost:${port}/ws`);
    logger.info(
      hasBuiltWebClient
        ? `Serving built web client from ${webClientDistPath}`
        : 'Built web client not found. Use the Vite dev server in ./web for browser development.'
    );
  });
};

launch().catch((error: any) => {
  logger.error('Error starting the application:', error);
  process.exit(1);
});

const interval = setInterval(() => {
  webSocketServer.clients.forEach((socket) => {
    const extSocket = socket as ExtendedWebSocket;

    if (!extSocket.isAlive) {
      logger.warn('Terminating unresponsive client');
      return extSocket.terminate();
    }

    extSocket.isAlive = false;
    extSocket.ping();
  });
}, 10 * 1000);

webSocketServer.on('close', () => {
  clearInterval(interval);
});

schedule('0 * * * *', async () => {
  logger.debug('Cleaning expired tokens');
  await cleanUpExpiredTokens();
});
