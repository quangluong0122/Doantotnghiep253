-- Create Database
CREATE DATABASE IF NOT EXISTS employee_management_db;
USE employee_management_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  role ENUM('admin', 'employee') DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  employee_id VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  department VARCHAR(100),
  position VARCHAR(100),
  hire_date DATE,
  salary_grade VARCHAR(50),
  status ENUM('active', 'inactive', 'terminated') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Leaves Table
CREATE TABLE IF NOT EXISTS leaves (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  leave_type ENUM('annual', 'sick', 'personal', 'unpaid') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  check_in_date DATE NOT NULL,
  check_in_time DATETIME,
  check_out_time DATETIME,
  status ENUM('present', 'absent', 'late', 'half-day') DEFAULT 'present',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Salaries Table
CREATE TABLE IF NOT EXISTS salaries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL UNIQUE,
  base_salary DECIMAL(10, 2) NOT NULL,
  allowances DECIMAL(10, 2) DEFAULT 0,
  deductions DECIMAL(10, 2) DEFAULT 0,
  effective_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  date DATE NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'paid') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- KPI Table
CREATE TABLE IF NOT EXISTS kpis (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  metric VARCHAR(255) NOT NULL,
  target DECIMAL(10, 2) NOT NULL,
  actual DECIMAL(10, 2),
  period VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Work History Table
CREATE TABLE IF NOT EXISTS work_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  previous_position VARCHAR(100),
  current_position VARCHAR(100),
  previous_department VARCHAR(100),
  current_department VARCHAR(100),
  transfer_date DATE,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_leaves_employee_id ON leaves(employee_id);
CREATE INDEX idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX idx_salaries_employee_id ON salaries(employee_id);
CREATE INDEX idx_expenses_employee_id ON expenses(employee_id);
CREATE INDEX idx_kpis_employee_id ON kpis(employee_id);
CREATE INDEX idx_work_history_employee_id ON work_history(employee_id);

INSERT INTO users (username, password_hash, name, role) 
VALUES ('admin', '$2a$10$2QakONQqxZfpi5QhTH/AR.PFoaL9talll2u3Nym4uK3g9/qP/X/UW', 'Administrator', 'admin');

-- Insert sample employee user (password: emp123)
INSERT INTO users (username, password_hash, name, role) 
VALUES ('employee', '$2a$10$oR8lp3RvjrQXnr4j6jdJq.giSS1l6b5JJ2MD94iORHWChjN1x1MXW', 'John Doe', 'employee');