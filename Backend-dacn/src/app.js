import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import employeeRouter from './routes/employees.js';
import leaveRouter from './routes/leaves.js';
import attendanceRouter from './routes/attendance.js';
import salaryRouter from './routes/salary.js';
import expenseRouter from './routes/expenses.js';
import kpiRouter from './routes/kpi.js';
import chatbotRouter from './routes/chatbot.js';
import performanceRouter from './routes/performance.js';
import dashboardRouter from './routes/dashboard.js';
import tasksRouter from './routes/tasks.js';

dotenv.config();

const app = express();
const corsOrigins = [
  process.env.CORS_ORIGIN,
  process.env.CORS_ORIGINS,
  process.env.FRONTEND_URL
]
  .filter(Boolean)
  .flatMap((origins) => origins.split(','))
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);
const defaultCorsOrigins = [
  'https://doantotnghiep253.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001'
];
const allowedCorsOrigins = [...new Set([...corsOrigins, ...defaultCorsOrigins])];
const vercelOriginPattern = /^https:\/\/doantotnghiep253(?:-[a-z0-9-]+)?\.vercel\.app$/i;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedCorsOrigins.includes(origin) || vercelOriginPattern.test(origin)) {
      return callback(null, true);
    }

    console.warn(`Blocked CORS origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/leaves', leaveRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/kpi', kpiRouter);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/performance', performanceRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/tasks', tasksRouter);

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Employee Management API is running',
    health: '/api/health'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

export default app;
