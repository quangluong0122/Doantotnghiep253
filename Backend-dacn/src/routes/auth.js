import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Detailed validation
  if (!username && !password) {
    return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
  }
  if (!username) {
    return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Vui lòng nhập mật khẩu' });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Tên đăng nhập không tồn tại' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ: ' + error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  const { username, password, fullName, email, role } = req.body;

  // Validation
  if (!username || !password || !fullName || !email) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const [existingUsername] = await connection.execute(
        'SELECT id FROM users WHERE username = ?',
        [username.trim()]
      );
      if (existingUsername.length > 0) {
        return res.status(409).json({ message: 'Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.' });
      }

      const [existingEmail] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email.trim().toLowerCase()]
      );
      if (existingEmail.length > 0) {
        return res.status(409).json({ message: 'Email đã được đăng ký. Vui lòng sử dụng email khác.' });
      }

      await connection.beginTransaction();
      const hashedPassword = await bcrypt.hash(password, 10);
      const [userResult] = await connection.execute(
        'INSERT INTO users (username, password_hash, name, email, role) VALUES (?, ?, ?, ?, ?)',
        [username.trim(), hashedPassword, fullName.trim(), email.trim().toLowerCase(), role || 'employee']
      );

      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts.shift();
      const lastName = nameParts.join(' ') || '';
      const employeeId = `EMP${userResult.insertId}`;
      await connection.execute(
        `INSERT INTO employees (user_id, employee_id, first_name, last_name, email, status)
         VALUES (?, ?, ?, ?, ?, 'active')`,
        [userResult.insertId, employeeId, firstName, lastName, email.trim().toLowerCase()]
      );
      await connection.commit();
    } catch (registrationError) {
      await connection.rollback();
      throw registrationError;
    } finally {
      connection.release();
    }

    res.status(201).json({ 
      success: true, 
      message: 'Đăng ký thành công! Bạn có thể đăng nhập bằng tài khoản mới.',
      email: email.trim().toLowerCase()
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Tên đăng nhập hoặc email đã tồn tại.' });
    }
    res.status(500).json({ message: 'Lỗi máy chủ: ' + error.message });
  }
});

export default router;

// Admin endpoint to reset/create sample accounts (DEV ONLY)
router.post('/reset-sample-accounts', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Hash passwords
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const employeePasswordHash = await bcrypt.hash('emp123', 10);
    
    // Delete existing sample accounts
    await connection.execute('DELETE FROM users WHERE username IN (?, ?)', ['admin', 'employee']);
    
    // Create new sample accounts
    await connection.execute(
      'INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)',
      ['admin', adminPasswordHash, 'Admin User', 'admin']
    );
    
    await connection.execute(
      'INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)',
      ['employee', employeePasswordHash, 'Employee User', 'employee']
    );
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Sample accounts reset successfully',
      accounts: [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'employee', password: 'emp123', role: 'employee' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting accounts', error: error.message });
  }
});
