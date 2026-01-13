import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import companyRoutes from './routes/companies';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' })); // Payload limit
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply rate limiting to all requests
app.use(limiter);
app.use(hpp()); // HTTP Parameter Pollution
app.use(morgan('dev'));

import cronRoutes from './routes/cron';

// Routes
// Routes - Support both /api prefix (local) and root (potentially stripped by Vercel)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/companies', '/companies'], companyRoutes);
app.use(['/api/user', '/user'], userRoutes);
app.use(['/api/cron', '/cron'], cronRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the SolveIt API' });
});

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
