import express from 'express';
import pool from '../config/database.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', verifyToken, verifyRole(['admin']), async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [[employees]] = await connection.query("SELECT COUNT(*) AS total, SUM(status = 'active') AS active FROM employees");
    const [[leaves]] = await connection.query("SELECT COUNT(*) AS total, SUM(status = 'pending') AS pending FROM leaves");
    const [[expenses]] = await connection.query(
      `SELECT COALESCE(SUM(amount), 0) AS total, COALESCE(SUM(status IN ('approved', 'paid')), 0) AS approved
       FROM expenses WHERE DATE_FORMAT(date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')`
    );
    const [[salary]] = await connection.query(
      `SELECT COUNT(*) AS total
       FROM salaries WHERE DATE_FORMAT(effective_date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')`
    );
    const [[latestKpi]] = await connection.query(
      `SELECT period AS month,
              AVG((actual / NULLIF(target, 0)) * 100) AS overall_percentage,
              SUM(actual >= target) AS completed_count,
              COUNT(*) AS total_count,
              COUNT(DISTINCT employee_id) AS total_employees
       FROM kpis
       WHERE period = (SELECT MAX(period) FROM kpis)
       GROUP BY period`
    );
    res.json({
      employees: { total: Number(employees.total || 0), active: Number(employees.active || 0) },
      leaves: { total: Number(leaves.total || 0), pending: Number(leaves.pending || 0) },
      expenses: { total: Number(expenses.total || 0), approved: Number(expenses.approved || 0) },
      salary: { total: Number(salary.total || 0) },
      kpi: {
        month: latestKpi.month || null,
        overallPercentage: Math.round(Number(latestKpi.overall_percentage || 0) * 100) / 100,
        completedCount: Number(latestKpi.completed_count || 0),
        totalCount: Number(latestKpi.total_count || 0),
        totalEmployees: Number(latestKpi.total_employees || 0),
      },
    });
  } catch (error) {
    console.error('Dashboard summary query failed:', error.message);
    res.status(500).json({ message: 'Không thể tải tổng quan dashboard.' });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
