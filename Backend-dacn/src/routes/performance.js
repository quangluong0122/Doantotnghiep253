import express from 'express';
import pool from '../config/database.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { getAiStatus, predictPerformance } from '../services/aiService.js';

const router = express.Router();
const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

const calculateScore = (target, actual) => (Number(target) > 0
  ? Math.round((Number(actual) / Number(target)) * 10000) / 100
  : 0);

const scoreTrend = (current, previous) => {
  if (previous === null) return 'insufficient-data';
  if (current > previous + 2) return 'improving';
  if (current < previous - 2) return 'declining';
  return 'stable';
};

router.get('/summary', verifyToken, verifyRole(['admin']), async (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  if (!monthPattern.test(month)) return res.status(400).json({ message: 'Tháng phải có định dạng YYYY-MM' });

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT k.period AS month,
              AVG((k.actual / NULLIF(k.target, 0)) * 100) AS average_score,
              COUNT(DISTINCT k.employee_id) AS employees,
              SUM(k.actual >= k.target) AS completed
       FROM kpis k
       GROUP BY k.period
       ORDER BY month DESC
       LIMIT 13`
    );
    const current = rows.find((row) => row.month === month);
    const previous = rows.find((row) => row.month < month);
    const averageScore = Number(current?.average_score || 0);
    const previousScore = previous ? Number(previous.average_score) : null;
    res.json({
      month,
      overallPercentage: Math.round(averageScore * 100) / 100,
      completedCount: Number(current?.completed || 0),
      totalEmployees: Number(current?.employees || 0),
      trend: scoreTrend(averageScore, previousScore),
      trendPercent: previousScore ? Math.round(((averageScore - previousScore) / previousScore) * 10000) / 100 : null,
      history: rows.reverse().map((row) => ({
        month: row.month,
        score: Math.round(Number(row.average_score || 0) * 100) / 100,
        employees: Number(row.employees || 0),
        completed: Number(row.completed || 0),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Không thể tính tổng quan hiệu suất.' });
  } finally {
    if (connection) connection.release();
  }
});

router.get('/employee/:employeeId', verifyToken, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const employeeFilter = req.user.role === 'admin'
      ? 'e.id = ?'
      : 'e.user_id = ?';
    const [rows] = await connection.execute(
      `SELECT k.period AS month, k.metric, k.target, k.actual,
              e.id AS employee_id, e.employee_id AS employee_code
       FROM kpis k INNER JOIN employees e ON e.id = k.employee_id
       WHERE ${employeeFilter}
       ORDER BY month ASC, k.id ASC`,
      [req.user.role === 'admin' ? req.params.employeeId : req.user.id]
    );
    const monthly = new Map();
    rows.forEach((row) => {
      const current = monthly.get(row.month) || { month: row.month, target: 0, actual: 0, factors: [] };
      current.target += Number(row.target || 0);
      current.actual += Number(row.actual || 0);
      current.factors.push({
        metric: row.metric,
        score: calculateScore(row.target, row.actual),
      });
      monthly.set(row.month, current);
    });
    const history = [...monthly.values()].map((item, index, list) => {
      const score = calculateScore(item.target, item.actual);
      const previous = index ? calculateScore(list[index - 1].target, list[index - 1].actual) : null;
      const factors = item.factors.filter((factor) => factor.score < 80).map((factor) => `${factor.metric} đạt ${factor.score}%`);
      return {
        ...item,
        score,
        trend: scoreTrend(score, previous),
        factors: factors.length ? factors : ['Kết quả KPI đang đạt mức kỳ vọng'],
      };
    });
    res.json({ employeeId: rows[0]?.employee_id || null, history });
  } catch (error) {
    res.status(500).json({ message: 'Không thể tính hiệu suất nhân viên.' });
  } finally {
    if (connection) connection.release();
  }
});

router.get('/employee/:employeeId/prediction', verifyToken, verifyRole(['admin']), rateLimit({
  windowMs: 60_000,
  max: 10,
  key: (req) => `prediction:${req.user.id}`,
}), async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT period AS month, metric, target, actual,
              ROUND((actual / NULLIF(target, 0)) * 100, 2) AS score
       FROM kpis WHERE employee_id = ? ORDER BY period ASC, id ASC`,
      [req.params.employeeId]
    );
    if (!rows.length) return res.status(404).json({ message: 'Chưa có dữ liệu KPI để dự đoán.' });
    const aiStatus = getAiStatus();
    if (!aiStatus.configured) {
      return res.status(503).json({ message: 'Trợ lý AI chưa được cấu hình trên máy chủ.' });
    }
    try {
      const prediction = await predictPerformance(rows);
      if (!prediction) return res.status(503).json({ message: 'Trợ lý AI chưa trả về kết quả dự đoán.' });
      return res.json({
        employeeId: Number(req.params.employeeId),
        basedOn: rows,
        prediction,
        provider: 'groq',
        model: process.env.GROQ_MODEL?.trim() || 'qwen/qwen3.8-27b',
      });
    } catch (error) {
      console.error('Groq performance prediction failed:', error.message);
      return res.status(502).json({
        message: 'Trợ lý AI không trả được dự đoán. Kiểm tra GROQ_API_KEY, GROQ_MODEL và quota trong log backend.',
        code: 'GROQ_API_ERROR',
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Không thể tạo dự đoán hiệu suất.' });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
