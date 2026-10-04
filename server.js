import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';

// Database, Cloudinary & Mailer config
import connectDB from './config/db.js';
import { isCloudinaryConfigured } from './config/cloudinary.js';
import { isSmtpConfigured } from './config/mailer.js';

// Route imports
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import authRoutes from './routes/authRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import employeeRoutes, { seedInitialEmployees } from './routes/employeeRoutes.js';
import { callRouter, emailRouter } from './routes/activityRoutes.js';

// Middlewares
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

// Connect to MongoDB
connectDB().then(() => {
  seedInitialEmployees();
});

const app = express();

// Middlewares - Allow requests from frontend (5173), admin (5174), and local development
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root Route
app.get('/', (req, res) => {
  res.json({
    name: 'Edion Royal Guesthouse API',
    status: 'online',
    version: '1.0.0',
    documentation: {
      health: '/api/health',
      content: '/api/content (CMS content for all pages)',
      leads: '/api/leads (Reservations & Inquiries Hub)',
      rooms: '/api/rooms',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
      contact: '/api/contact',
      upload: '/api/upload (POST with multipart/form-data)',
      media: '/api/media',
      auth: '/api/auth',
      employees: '/api/employees'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null
    },
    cloudinary: {
      configured: isCloudinaryConfigured(),
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? `${process.env.CLOUDINARY_CLOUD_NAME.slice(0, 3)}***` : 'not_set'
    },
    smtp: {
      configured: isSmtpConfigured(),
      host: process.env.SMTP_HOST || 'not_set',
      user: process.env.SMTP_USER ? `${process.env.SMTP_USER.slice(0, 3)}***` : 'not_set',
      receiver: process.env.NOTIFICATION_RECEIVER_EMAIL || process.env.SMTP_USER || 'stay@edionroyal.co.za'
    }
  });
});

// API Routes
app.use('/api/content', contentRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/call-logs', callRouter);
app.use('/api/email-logs', emailRouter);
app.use('/api/activity/calls', callRouter);
app.use('/api/activity/emails', emailRouter);
app.use('/api/activities/calls', callRouter);
app.use('/api/activities/emails', emailRouter);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

let PORT = Number(process.env.PORT) || 5001;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 Edion Royal Backend Server is running!`);
    console.log(`📍 URL: http://localhost:${port}`);
    console.log(`🔍 Health Check: http://localhost:${port}/api/health`);
    console.log(`☁️  Cloudinary Status: ${isCloudinaryConfigured() ? 'Configured ✅' : 'Pending API keys in .env ⚠️'}`);
    console.log(`📧 SMTP Email Status: ${isSmtpConfigured() ? 'Configured ✅' : 'Pending credentials in .env (SMTP_USER & SMTP_PASS) ⚠️'}`);
    console.log(`=================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Port Conflict] Port ${port} is currently busy. Trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('[Server Error]', err);
    }
  });

  return server;
};

const server = startServer(PORT);

export default app;
