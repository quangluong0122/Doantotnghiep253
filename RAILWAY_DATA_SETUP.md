# 🚀 QUICK START - Add Dữ Liệu Railway

## 📋 Các Bước Nhanh

### Bước 1: Copy SQL Script
File: `SQL-Database/RAILWAY_SEED.sql`

Nội dung: 112 records đầy đủ cho hệ thống
- ✅ 4 Users (admin + 3 employees)
- ✅ 30 Leave requests
- ✅ 25 Expenses
- ✅ 9 Salaries
- ✅ 24 Attendance records
- ✅ 15 KPIs
- ✅ 6 Work history records

### Bước 2: Chọn Phương Pháp Add Dữ Liệu

#### **Phương Pháp 1: Dùng Railway Web Console (Dễ nhất)**
1. Vào https://railway.app
2. Chọn MySQL plugin
3. Click "WebConsole" hoặc "Adminer"
4. Paste toàn bộ script `SQL-Database/RAILWAY_SEED.sql`
5. Click Execute

#### **Phương Pháp 2: Dùng MySQL Workbench / DBeaver**
1. Download: https://www.mysql.com/products/workbench/ (Workbench) hoặc https://dbeaver.io (DBeaver)
2. Kết nối tới Railway MySQL (lấy credentials từ Railway Dashboard)
3. Mở file `SQL-Database/RAILWAY_SEED.sql`
4. Run script

#### **Phương Pháp 3: Command Line (Linux/Mac/Windows Git Bash)**
```bash
cd d:\Frontend-dacn
mysql -h [RAILWAY_MYSQL_HOST] \
       -u [RAILWAY_MYSQL_USER] \
       -p[RAILWAY_MYSQL_PASSWORD] \
       employee_management_db < SQL-Database/RAILWAY_SEED.sql
```

### Bước 3: Xác Minh Dữ Liệu

Chạy query này để kiểm tra:
```sql
SELECT 'Users' as `Table`, COUNT(*) as `Records` FROM users
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
| Table | Records |
|-------|---------|
| Users | 4 |
| Employees | 3 |
| Leaves | 30 |
| Expenses | 25 |
| Salaries | 9 |
| Attendance | 24 |
| KPIs | 15 |
| Work History | 6 |

## 🔐 Test Accounts

```
📌 Admin Account:
   Username: admin
   Password: admin123

👤 Employee Accounts:
   1. Username: employee
      Password: emp123
      Role: Backend Developer (IT)

   2. Username: nguyenvana
      Password: Pass123!
      Role: HR Manager (HR)

   3. Username: tranvanb
      Password: Pass123!
      Role: Accountant (Finance)
```

## ✅ Test Lại System

1. **Đăng nhập Admin Dashboard:**
   - URL: http://localhost:3000
   - Username: `admin` / Password: `admin123`
   - Kỳ vọng: Xem tất cả employees, leaves, expenses, salaries

2. **Đăng nhập Employee Dashboard:**
   - Username: `employee` / Password: `emp123`
   - Kỳ vọng: Xem dữ liệu riêng (8 leaves, 10 expenses, salary)

3. **Test API:**
   ```bash
   # Login
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   
   # Get leaves (with token)
   curl -X GET http://localhost:5000/api/leaves \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## 📚 Documentation
Xem chi tiết: `SQL-Database/RAILWAY_SETUP_GUIDE.md`

## 🎯 Tiếp Theo
- Deploy lên Railway
- Cập nhật `REACT_APP_API_URL` trỏ tới Railway backend
- Test toàn hệ thống

## ❓ Vấn Đề?
Xem troubleshooting: `SQL-Database/RAILWAY_SETUP_GUIDE.md#troubleshooting`
