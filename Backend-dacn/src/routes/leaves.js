import express from 'express';
import pool from '../config/database.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Get all leaves
router.get('/', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = req.user.role === 'admin'
      ? `SELECT l.*, e.employee_id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name
         FROM leaves l
         INNER JOIN employees e ON e.id = l.employee_id
         ORDER BY l.created_at DESC, l.id DESC`
      : `SELECT l.* FROM leaves l
         INNER JOIN employees e ON e.id = l.employee_id
         WHERE e.user_id = ? ORDER BY l.created_at DESC, l.id DESC`;
    
    const params = req.user.role === 'admin' ? [] : [req.user.id];
    const [rows] = await connection.execute(query, params);
    connection.release();

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create leave request
router.post('/', verifyToken, async (req, res) => {
  const { leave_type, start_date, end_date, reason } = req.body;
  const validLeaveTypes = ['annual', 'sick', 'personal', 'unpaid'];

  if (!validLeaveTypes.includes(leave_type)) {
    return res.status(400).json({ message: 'Loại nghỉ phép không hợp lệ' });
  }
  if (!start_date || !end_date || start_date > end_date) {
    return res.status(400).json({ message: 'Khoảng thời gian nghỉ phép không hợp lệ' });
  }
  if (!reason || !reason.trim()) {
    return res.status(400).json({ message: 'Vui lòng nhập lý do nghỉ phép' });
  }

  try {
    const connection = await pool.getConnection();
    const [employees] = await connection.execute(
      'SELECT id FROM employees WHERE user_id = ?',
      [req.user.id]
    );
    if (!employees.length) {
      connection.release();
      return res.status(404).json({ message: 'Chưa có hồ sơ nhân viên' });
    }
    const [overlappingLeaves] = await connection.execute(
      `SELECT id FROM leaves
       WHERE employee_id = ? AND status IN ('pending', 'approved')
       AND start_date <= ? AND end_date >= ? LIMIT 1`,
      [employees[0].id, end_date, start_date]
    );
    if (overlappingLeaves.length) {
      connection.release();
      return res.status(409).json({ message: 'Khoảng thời gian này đã có đơn nghỉ phép đang chờ hoặc đã được duyệt' });
    }
    const [result] = await connection.execute(
      'INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [employees[0].id, leave_type, start_date, end_date, reason, 'pending']
    );
    connection.release();

    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve/Reject leave (admin only)
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Trạng thái đơn nghỉ phép không hợp lệ' });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'UPDATE leaves SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    connection.release();

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Không tìm thấy đơn nghỉ phép' });
    }

    res.json({ success: true, message: 'Leave updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
