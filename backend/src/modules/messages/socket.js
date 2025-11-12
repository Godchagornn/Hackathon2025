const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.WS_CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('missing auth token'));
      }
      const payload = jwt.verify(token, process.env.AUTH_JWT_SECRET || 'dev-secret');
      socket.userId = payload.sub;
      socket.join(`user:${socket.userId}`);
      next();
    } catch (error) {
      next(new Error('invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      socket.leave(`user:${socket.userId}`);
    });
  });
}

function emitNewMessage(message, recipientId) {
  if (!io) return;
  io.to(`user:${recipientId}`).emit('message:new', message);
}

module.exports = {
  initSocket,
  emitNewMessage,
};
