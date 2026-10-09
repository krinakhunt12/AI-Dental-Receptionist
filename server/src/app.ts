import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app: Express = express();

// Security Header Helmet
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Rate Limiter for general endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // max 300 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again after 15 minutes',
      details: null,
    },
  },
});
app.use(limiter);

// Cookie parser middleware
app.use(cookieParser());

// JSON body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'SmileCare AI Backend API',
  });
});

// API v1 Routes
app.use('/api/v1', routes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'API Route not found',
      details: null,
    },
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
