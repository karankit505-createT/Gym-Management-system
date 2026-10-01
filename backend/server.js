const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const mongoose = require('mongoose');
const { connectDB, sequelize } = require('./config/db');
const { autoSeed } = require('./utils/autoSeed');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for reverse proxies like Render / Vercel / Cloudflare
app.set('trust proxy', 1);

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Live Request Logger for Render Logs
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API Request] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Serve static uploaded files (profile / staff images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Landing Route
app.get('/', (req, res) => {
  res.status(200).send(`
    <div style="font-family: system-ui, sans-serif; text-align: center; padding: 60px 20px; background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <h1 style="color: #f97316; font-size: 2.5rem; margin-bottom: 10px;">🏋️ IronPulse Gym API Server</h1>
      <p style="font-size: 1.1rem; color: #94a3b8; max-width: 500px; margin-bottom: 25px;">
        Backend API is live and running successfully on Render.
      </p>
      <a href="/api/health" style="background: #f97316; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Check API Health Status
      </a>
    </div>
  `);
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'IronPulse Gym API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/contact', contactRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global API Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Connect to DB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync(); // Auto-create tables if missing
    console.log('[Database] Models synchronized with DB schema.');

    await autoSeed(); // Seed initial demo credentials if database is empty

    // Connect to MongoDB Atlas if MONGO_URI is configured
    if (process.env.MONGO_URI) {
      try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
        console.log('[Database] Connected successfully to MongoDB Atlas!');
      } catch (mongoErr) {
        console.warn('[Database Notice] MongoDB Atlas Connection Notice:', mongoErr.message);
      }
    }

    app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(`🚀 IronPulse Gym Server running on http://localhost:${PORT}`);
      console.log(`==================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();

module.exports = app;
