// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   CORS CONFIG (แก้ปัญหา Netlify)
========================= */
const corsOptions = {
  origin: [
    'https://adisak-praseot-395-06-04-2026.netlify.app',
    'http://localhost:9000',
    'http://localhost:5173'
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/* =========================
   Middleware
========================= */
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

/* =========================
   Logs directory
========================= */
const logsDir = path.join(__dirname, '../logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/* =========================
   Demo Endpoint
========================= */
app.get('/api/demo', (req, res) => {

  const logMessage = `Request at ${new Date().toISOString()} : ${req.ip}\n`;

  fs.appendFileSync(
    path.join(logsDir, 'access.log'),
    logMessage
  );

  res.json({
    git: {
      title: 'Advanced Git Workflow',
      detail:
        'ใช้ branch protection บน GitHub, code review ใน PR, และ squash merge เพื่อ history สะอาด',
    },
    docker: {
      title: 'Advanced Docker',
      detail:
        'ใช้ multi-stage build, healthcheck ใน Dockerfile, และ orchestration ด้วย Compose/Swarm',
    },
  });
});

/* =========================
   Root Endpoint
========================= */
app.get('/', (_req, res) => {
  res.json({
    message: 'API พร้อมใช้งาน (Supabase + Prisma + Quasar Frontend)',
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   Health Check
========================= */
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

/* =========================
   Task API
========================= */
app.use('/api/tasks', taskRoutes);

/* =========================
   404 Handler
========================= */
app.use((req, res) => {
  res.status(404).json({
    message: 'ไม่พบเส้นทาง',
    path: req.originalUrl,
  });
});

/* =========================
   Start Server
========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});