# Employee Management System - Backend API

Node.js/Express API for Employee Management System

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with database credentials:
```bash
cp .env.example .env
```

3. Update `.env` with your MySQL credentials

4. Start the server:
```bash
npm run dev
```

The API will run on `http://localhost:5000`

## API Endpoints

### Auth
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Employees
- `GET /api/employees` - Get all employees (admin only)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee (admin only)
- `PUT /api/employees/:id` - Update employee (admin only)
- `DELETE /api/employees/:id` - Delete employee (admin only)

### Leaves
- `GET /api/leaves` - Get leaves
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id` - Update leave status (admin only)

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out

### Salary
- `GET /api/salary` - Get all salaries (admin only)
- `PUT /api/salary/:id` - Update salary (admin only)

### Expenses
- `GET /api/expenses` - Get expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Approve/reject expense (admin only)

### KPI
- `GET /api/kpi` - Get KPIs
- `POST /api/kpi` - Create KPI (admin only)
- `PUT /api/kpi/:id` - Update KPI (admin only)

## Deployment

Deploy to Heroku or Railways platform.
