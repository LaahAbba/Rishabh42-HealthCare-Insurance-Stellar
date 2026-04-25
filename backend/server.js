const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const medicalRecordsRoutes = require('./routes/medicalRecords');
const claimsRoutes = require('./routes/claims');
const appointmentsRoutes = require('./routes/appointments');
const paymentsRoutes = require('./routes/payments');
const contributorVerificationRoutes = require('./routes/contributorVerification');
const fraudDetectionRoutes = require('./routes/fraudDetection');
const securityRoutes = require('./routes/security');


const { initializeDatabase } = require('./database/init');
const { authenticateToken } = require('./middleware/auth');
const { cacheMiddleware } = require('./middleware/cache');
const { errorHandler } = require('./middleware/errorHandler');
const performanceMonitoringService = require('./services/performanceMonitoringService');
const threatIntelligenceService = require('./services/threatIntelligenceService');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Add performance monitoring middleware
app.use(performanceMonitoringService.apiPerformanceMiddleware());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', authenticateToken, cacheMiddleware, patientRoutes);
app.use('/api/medical-records', authenticateToken, cacheMiddleware, medicalRecordsRoutes);
app.use('/api/claims', authenticateToken, cacheMiddleware, claimsRoutes);
app.use('/api/appointments', authenticateToken, cacheMiddleware, appointmentsRoutes);
app.use('/api/payments', authenticateToken, cacheMiddleware, paymentsRoutes);
app.use('/api/contributor', authenticateToken, contributorVerificationRoutes);
app.use('/api/fraud-detection', authenticateToken, fraudDetectionRoutes);
app.use('/api/security', securityRoutes);


app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-patient-room', (patientId) => {
    socket.join(`patient-${patientId}`);
    console.log(`Socket ${socket.id} joined room for patient ${patientId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use(errorHandler);

async function startServer() {
  try {
    await initializeDatabase();
    
    // Start system monitoring
    startSystemMonitoring();
    
    server.listen(PORT, () => {
      console.log(`🚀 Healthcare API Server running on port ${PORT}`);
      console.log(`📊 Dashboard available at: http://localhost:${PORT}/api/health`);
      console.log(`🔒 Advanced Security API enabled`);
      console.log(`📈 Performance monitoring active`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start system monitoring
function startSystemMonitoring() {
  // Collect system metrics every 30 seconds
  setInterval(async () => {
    try {
      await performanceMonitoringService.collectSystemMetrics();
    } catch (error) {
      console.error('Error collecting system metrics:', error);
    }
  }, 30000);

  // Update threat feeds every hour
  setInterval(async () => {
    try {
      await threatIntelligenceService.updateThreatFeeds();
    } catch (error) {
      console.error('Error updating threat feeds:', error);
    }
  }, 3600000);

  console.log('🔍 System monitoring started');
  console.log('🛡️  Threat intelligence updates scheduled');
}

startServer();

module.exports = { app, io };
