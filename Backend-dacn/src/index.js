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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS
app.use(cors({
  origin: [
    'https://ravishing-enjoyment-production.up.railway.app',  // Current production frontend
    'https://testdacn.vercel.app',  // Old Vercel frontend
    'http://localhost:3000',  // Development
    'http://localhost:3001'   // Alternative dev port
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/leaves', leaveRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/kpi', kpiRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
