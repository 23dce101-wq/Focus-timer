import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import sessionRoutes from './routes/session.routes';
import habitRoutes from './routes/habit.routes';
import contactRoutes from './routes/contact.routes';

dotenv.config();
// console.log('GOOGLE_CLIENT_ID from env =', process.env.GOOGLE_CLIENT_ID);


const app: Application = express();
const PORT = Number(process.env.PORT) || 4000;

// Security middleware
// Configure Helmet without enforcing COOP/COEP so that we can
// explicitly control those headers for Google OAuth popups below.
app.use(
  helmet({
    // Disable COEP via Helmet so that it does not interfere with
    // cross-origin resources; we set an explicit header separately.
    crossOriginEmbedderPolicy: false,
    // Disable Helmet's COOP handling; we will set
    // Cross-Origin-Opener-Policy manually to the required value.
    crossOriginOpenerPolicy: false,
  })
);

// Explicit COOP/COEP headers for Google OAuth popups and redirects.
// These must be applied before all routes so that any auth endpoints
// (e.g. /api/auth/google) inherit them.
app.use((req: Request, res: Response, next: NextFunction) => {
  // Allow this origin to open popups (Google OAuth window) without
  // being isolated in a separate browsing context.
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // Keep COEP disabled so that third-party scripts/iframes used by
  // Google Identity Services continue to work.
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// CORS configuration
// Allow localhost by default for development and dynamically allow
// deployed frontends via FRONTEND_URL or FRONTEND_URLS.
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
];

const envOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envOrigins]));

// Dynamic CORS middleware allowing credentials
app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // allow non-browser requests (no Origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS_NOT_ALLOWED_BY_SERVER'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  })
);

// Ensure preflight OPTIONS returns success
app.options(
  '*',
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  })
);

// Body parsing middleware (after CORS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (req: Request, res: Response, _next: NextFunction) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api', contactRoutes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
