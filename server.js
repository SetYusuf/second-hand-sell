/* eslint-disable @typescript-eslint/no-require-imports */
/* Custom Next.js server with Socket.io integration.
 * This allows real-time chat delivery (message events, unread counts)
 * to work alongside the existing Next.js app router API routes.
 */
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');


const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '7001', 10);

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Expose the io instance globally so API route handlers (running in the
  // same Node process) can emit events without needing a separate server.
  global.io = io;

  io.on('connection', (socket) => {
    // Each logged-in client joins a room named after their own userId.
    // Server-side code emits to `io.to(userId).emit(...)` to reach them.
    socket.on('join', (userId) => {
      if (userId) {
        socket.join(userId);
      }
    });

    socket.on('leave', (userId) => {
      if (userId) {
        socket.leave(userId);
      }
    });

    socket.on('disconnect', () => {
      // no-op — rooms are cleaned up automatically
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
});
