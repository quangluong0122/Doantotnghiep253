import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

const seedData = async () => {
  try {
    console.log('🌱 Bắt đầu seed dữ liệu...');
    
    const connection = await pool.getConnection();
    
    // Hash passwords
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const employeePasswordHash = await bcrypt.hash('emp123', 10);
    
    // Clear existing data (optional - remove if you don't want to clear)
    // await connection.execute('DELETE FROM users');
    
    // Check if users exist
    const [existingUsers] = await connection.execute(
      'SELECT username FROM users WHERE username IN (?, ?)',
      ['admin', 'employee']
    );
    
    if (existingUsers.length === 0) {
      // Insert sample users
      await connection.execute(
        'INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)',
        ['admin', adminPasswordHash, 'Admin User', 'admin']
      );
      console.log('✅ Tài khoản admin đã được tạo');
      
      await connection.execute(
        'INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)',
        ['employee', employeePasswordHash, 'Employee User', 'employee']
      );
      console.log('✅ Tài khoản employee đã được tạo');
      
      console.log('\n📝 Thông tin tài khoản:');
      console.log('Admin: username="admin", password="admin123"');
      console.log('Employee: username="employee", password="emp123"');
    } else {
      console.log('⚠️  Tài khoản mẫu đã tồn tại!');
      
      // Show existing users info
      const [users] = await connection.execute('SELECT username, role FROM users');
      console.log('\n📋 Tài khoản hiện có:');
      users.forEach(user => {
        console.log(`  - ${user.username} (${user.role})`);
      });
    }
    
    connection.release();
    console.log('\n✨ Seed dữ liệu hoàn tất!');
    
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu:', error.message);
  } finally {
    process.exit(0);
  }
};

seedData();
