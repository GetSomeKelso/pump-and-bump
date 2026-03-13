import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { globalLimiter } from './middleware/rateLimiter.js';
import { setCsrfToken, verifyCsrf } from './middleware/csrf.js';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import setupRoutes from './routes/setup.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Trust Railway's proxy
app.set('trust proxy', 1);

// Parse JSON and cookies
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Rate limiting
app.use(globalLimiter);

// CSRF protection for API routes
app.use('/api', setCsrfToken);
app.use('/api', verifyCsrf);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/setup', setupRoutes);

// Serve static frontend in production
const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
