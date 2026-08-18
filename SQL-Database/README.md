# Employee Management System - Database

MySQL database schema for Employee Management System

## Setup Instructions

### Option 1: Using MySQL Command Line

1. Open MySQL:
```bash
mysql -u root -p
```

2. Run the schema file:
```bash
mysql -u root -p < employee_management_db.sql
```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Create a new SQL tab
3. Open the `employee_management_db.sql` file
4. Execute the script

### Option 3: Using phpmyadmin

1. Open phpmyadmin
2. Go to Import tab
3. Select the `employee_management_db.sql` file
4. Click Import

## Database Schema

### Tables

- **users**: User authentication and authorization
- **employees**: Employee information
- **leaves**: Leave requests
- **attendance**: Employee check-in/check-out records
- **salaries**: Employee salary information
- **expenses**: Employee expense records
- **kpis**: Key Performance Indicators
- **work_history**: Employee position and department changes

## Sample Users

- Admin: username: `admin`, password: `admin123`
- Employee: username: `employee`, password: `emp123`

## Connection Details

```
Host: localhost
User: root
Password: your_password
Database: employee_management_db
```

Update these credentials in the backend `.env` file.
