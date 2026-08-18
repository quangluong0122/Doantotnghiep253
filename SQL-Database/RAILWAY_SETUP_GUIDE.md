# Hướng Dẫn Add Dữ Liệu lên Railway MySQL

## 📋 Tổng Quan
Hệ thống quản lý nhân viên cần toàn bộ dữ liệu phải được lưu trữ trên Railway (không dữ liệu cứng trong code).

## 🗂️ Dữ Liệu Cần Add

| Table | Records | Mô Tả |
|-------|---------|-------|
| **users** | 4 | 1 Admin + 3 Employees |
| **employees** | 3 | Profiles của 3 nhân viên |
| **leaves** | 30 | Đơn xin nghỉ |
| **expenses** | 25 | Chi phí |
| **salaries** | 9 | Lương (3 nhân viên × 3 tháng) |
| **attendance** | 24 | Chấm công |
| **kpis** | 15 | Chỉ tiêu |
| **work_history** | 6 | Lịch sử công tác |
| **TOTAL** | **112 records** | Đầy đủ dữ liệu cho system |

## 🔐 Test Accounts

```
Admin Account:
- Username: admin
- Password: admin123

Employee Accounts:
- Username: employee / Password: emp123
- Username: nguyenvana / Password: Pass123!
- Username: tranvanb / Password: Pass123!
```

## 🚀 Hướng Dẫn Add Dữ Liệu

### Cách 1: Dùng MySQL Client Tool (Recommended)

1. **Kết nối tới Railway MySQL:**
   - Mở Railway Dashboard: https://railway.app
   - Vào project của bạn
   - Chọn MySQL plugin
   - Copy connection string (hoặc credentials)

2. **Sử dụng MySQL Workbench, DBeaver, hoặc TablePlus:**
   - Paste connection info
   - Mở file: `SQL-Database/RAILWAY_SEED.sql`
   - Chạy script

3. **Nếu dùng Command Line:**
   ```bash
   mysql -h [host] -u [user] -p[password] employee_management_db < SQL-Database/RAILWAY_SEED.sql
   ```

### Cách 2: Dùng Railway Web Console

1. Vào Railway Dashboard
2. Chọn MySQL
3. Click "WebConsole" hoặc "Connect"
4. Paste toàn bộ script từ `SQL-Database/RAILWAY_SEED.sql`
5. Nhấn Execute

### Cách 3: Dùng Node.js Script (nếu không có MySQL client)

Tạo file `seed-railway.js`:

```javascript
import mysql from 'mysql2/promise';
import fs from 'fs';

const connection = await mysql.createConnection({
  host: process.env.RAILWAY_MYSQL_HOST,
  user: process.env.RAILWAY_MYSQL_USER,
  password: process.env.RAILWAY_MYSQL_PASSWORD,
  database: process.env.RAILWAY_MYSQL_DB,
  port: process.env.RAILWAY_MYSQL_PORT
});

const sql = fs.readFileSync('./SQL-Database/RAILWAY_SEED.sql', 'utf8');
const statements = sql.split(';').filter(s => s.trim());

for (const statement of statements) {
  if (statement.trim() && !statement.trim().startsWith('--')) {
    try {
      await connection.execute(statement);
      console.log('✓', statement.substring(0, 50) + '...');
    } catch (error) {
      console.error('✗', error.message);
    }
  }
}

await connection.end();
console.log('✓ Seed data inserted successfully!');
```

Chạy:
```bash
node seed-railway.js
```

## 📊 Xác Minh Dữ Liệu

Sau khi chạy script, chạy câu lệnh này để kiểm tra:

```sql
SELECT 'Users' as `Table`, COUNT(*) as `Count` FROM users
UNION ALL
SELECT 'Employees', COUNT(*) FROM employees
UNION ALL
SELECT 'Leaves', COUNT(*) FROM leaves
UNION ALL
SELECT 'Expenses', COUNT(*) FROM expenses
UNION ALL
SELECT 'Salaries', COUNT(*) FROM salaries
UNION ALL
SELECT 'Attendance', COUNT(*) FROM attendance
UNION ALL
SELECT 'KPIs', COUNT(*) FROM kpis
UNION ALL
SELECT 'Work History', COUNT(*) FROM work_history;
```

**Kết quả mong đợi:**
```
Users          | 4
Employees      | 3
Leaves         | 30
Expenses       | 25
Salaries       | 9
Attendance     | 24
KPIs           | 15
Work History   | 6
```

## 🔄 API Integration

Tất cả API endpoints đã cấu hình để lấy dữ liệu từ Railway:

```javascript
// Backend config (src/config/database.js)
const pool = mysql.createPool({
  host: process.env.RAILWAY_MYSQL_HOST,
  user: process.env.RAILWAY_MYSQL_USER,
  password: process.env.RAILWAY_MYSQL_PASSWORD,
  database: process.env.RAILWAY_MYSQL_DB,
  port: process.env.RAILWAY_MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Frontend config (React)
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

## ✅ Kiểm Tra Sau Khi Add Dữ Liệu

### 1. Test Login
- Mở app: http://localhost:3000
- Đăng nhập: `admin / admin123`
- Kỳ vọng: Vào Admin Dashboard

### 2. Test Employee Data
- Đăng nhập: `employee / emp123`
- Vào employee dashboard
- Kỳ vọng: Xem dữ liệu riêng của employee (leaves, expenses, salary)

### 3. Kiểm Tra APIs
```bash
# Test auth
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test get leaves
curl -X GET http://localhost:5000/api/leaves \
  -H "Authorization: Bearer [TOKEN]"

# Test get employees
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer [TOKEN]"
```

## 🗑️ Reset Dữ Liệu

Nếu cần xóa tất cả dữ liệu và insert lại:

```sql
-- Option 1: Clear all data (keep schema)
DELETE FROM work_history;
DELETE FROM kpis;
DELETE FROM salaries;
DELETE FROM attendance;
DELETE FROM expenses;
DELETE FROM leaves;
DELETE FROM employees;
DELETE FROM users;

-- Option 2: Drop and recreate tables
DROP TABLE IF EXISTS work_history;
DROP TABLE IF EXISTS kpis;
DROP TABLE IF EXISTS salaries;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS leaves;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS users;

-- Then run the schema creation and seed data scripts
```

## 📝 Ghi Chú Quan Trọng

1. **Password hashing:** Tất cả password trong SQL đều đã hash bằng bcryptjs
2. **Timezone:** Dữ liệu dùng NOW() để đảm bảo timezone consistency
3. **Foreign Keys:** Tất cả employee_id references đến employee records tương ứng
4. **Data Integrity:** Dữ liệu được thiết kế để test toàn bộ features
5. **Scalability:** Có thể thêm dữ liệu sau bằng API hoặc script

## 🎯 Tiếp Theo

Sau khi add dữ liệu xong:

1. **Deploy lên Railway:**
   - Push code lên git
   - Railway auto-deploy

2. **Update Frontend:**
   - Thay đổi `REACT_APP_API_URL` để trỏ tới Railway backend
   - Test lại tất cả features

3. **Monitor:**
   - Kiểm tra logs trên Railway
   - Xác minh data consistency

## ❓ Troubleshooting

**Vấn đề:** Connection timeout
- **Giải pháp:** Kiểm tra firewall, Railway IP whitelist

**Vấn đề:** Foreign key constraint error
- **Giải pháp:** Đảm bảo employee_id tồn tại trước khi insert leaves/expenses

**Vấn đề:** Data dupicate
- **Giải pháp:** Chạy DELETE statement đầu tiên để clear data cũ

**Vấn đề:** Character encoding issue
- **Giải pháp:** Đảm bảo MySQL charset là utf8mb4
