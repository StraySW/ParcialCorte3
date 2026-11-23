import cors from 'cors';
import express from 'express';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import materiasRoutes from './routes/materias.routes';
import estudianteRoutes from './routes/estudiante.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode}`);
  });
  next();
});

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/materias', materiasRoutes);
app.use('/api/v1/estudiante', estudianteRoutes);

app.use(errorHandler);

export default app;
