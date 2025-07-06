const { createServer } = require('http');
const { Server } = require('socket.io');
const Redis = require('ioredis');

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Create HTTP server
const httpServer = createServer();

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
});

// Store connected users
const connectedUsers = new Map();

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user room
  socket.on('join_user_room', ({ userId }) => {
    socket.join(`user_${userId}`);
    connectedUsers.set(socket.id, userId);
    console.log(`User ${userId} joined room: user_${userId}`);
  });

  // Leave user room
  socket.on('leave_user_room', ({ userId }) => {
    socket.leave(`user_${userId}`);
    connectedUsers.delete(socket.id);
    console.log(`User ${userId} left room: user_${userId}`);
  });

  // Handle new transaction
  socket.on('new_transaction', (transaction) => {
    console.log('New transaction:', transaction);
    
    // Broadcast to user's room
    socket.to(`user_${transaction.userId}`).emit('transaction_update', {
      type: 'new',
      transaction,
      timestamp: new Date().toISOString()
    });

    // Store in Redis for persistence
    redis.lpush(`transactions_${transaction.userId}`, JSON.stringify(transaction));
    redis.ltrim(`transactions_${transaction.userId}`, 0, 999); // Keep last 1000 transactions
  });

  // Handle balance update
  socket.on('update_balance', (balanceData) => {
    console.log('Balance update:', balanceData);
    
    // Broadcast to user's room
    socket.to(`user_${balanceData.userId}`).emit('balance_update', {
      type: 'update',
      balance: balanceData.balance,
      timestamp: new Date().toISOString()
    });

    // Store in Redis
    redis.set(`balance_${balanceData.userId}`, balanceData.balance);
  });

  // Handle market updates (for future features)
  socket.on('market_update', (marketData) => {
    console.log('Market update:', marketData);
    
    // Broadcast to all connected users
    io.emit('market_update', {
      type: 'update',
      data: marketData,
      timestamp: new Date().toISOString()
    });
  });

  // Handle notifications
  socket.on('send_notification', (notification) => {
    console.log('Notification:', notification);
    
    // Send to specific user
    socket.to(`user_${notification.userId}`).emit('notification', {
      type: notification.type || 'info',
      message: notification.message,
      timestamp: new Date().toISOString()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userId = connectedUsers.get(socket.id);
    if (userId) {
      console.log(`User ${userId} disconnected`);
      connectedUsers.delete(socket.id);
    }
  });
});

// Health check endpoint
httpServer.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      connectedUsers: connectedUsers.size
    }));
  }
});

// Error handling
io.on('error', (error) => {
  console.error('Socket.IO error:', error);
});

redis.on('error', (error) => {
  console.error('Redis error:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('HTTP server closed');
    redis.quit(() => {
      console.log('Redis connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    console.log('HTTP server closed');
    redis.quit(() => {
      console.log('Redis connection closed');
      process.exit(0);
    });
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Real-time server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
}); 