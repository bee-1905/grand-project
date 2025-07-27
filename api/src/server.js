const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const DatabaseManager = require('./config/database');
const emailService = require('./services/email');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}))

app.options('*', cors({
  origin: FRONTEND_URL,
  credentials: true,
}))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: DatabaseManager.getInstance().getPrimaryDatabase(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🚀 Starting Recipe Generator API...');
    
    // Connect to database
    const dbManager = DatabaseManager.getInstance();
    await dbManager.connect();
    
    // Verify email service (optional, won't fail startup)
    try {
      await emailService.verifyConnection();
    } catch (error) {
      console.warn('⚠️  Email service verification failed, but continuing startup');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📊 Database: ${dbManager.getPrimaryDatabase()}`);
      console.log(`🌐 CORS enabled for: ${FRONTEND_URL}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    await DatabaseManager.getInstance().disconnect();
    console.log('✅ Server shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  try {
    await DatabaseManager.getInstance().disconnect();
    console.log('✅ Server shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer();