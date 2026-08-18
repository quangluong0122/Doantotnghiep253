import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import AccountManagement from './pages/AccountManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeList from './pages/admin/EmployeeList';
import AddEmployee from './pages/admin/AddEmployee';
import EmployeeDetail from './pages/admin/EmployeeDetail';
import LeaveManagement from './pages/admin/LeaveManagement';
import ExpenseManagement from './pages/admin/ExpenseManagement';
import SalaryManagement from './pages/admin/SalaryManagement';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeLeaves from './pages/employee/EmployeeLeaves';
import AttendanceHistory from './pages/employee/AttendanceHistory';
import WorkHistory from './pages/admin/WorkHistory';
import KPIManagement from './pages/admin/KPIManagement';
import EmployeeKPI from './pages/employee/EmployeeKPI';
import ChatbotSupport from './pages/ChatbotSupport';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Account Management - Available for all authenticated users */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountManagement />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute role="admin">
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees/add"
            element={
              <ProtectedRoute role="admin">
                <AddEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees/:id"
            element={
              <ProtectedRoute role="admin">
                <EmployeeDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leaves"
            element={
              <ProtectedRoute role="admin">
                <LeaveManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/expenses"
            element={
              <ProtectedRoute role="admin">
                <ExpenseManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/salary"
            element={
              <ProtectedRoute role="admin">
                <SalaryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/work-history"
            element={
              <ProtectedRoute role="admin">
                <WorkHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/kpi"
            element={
              <ProtectedRoute role="admin">
                <KPIManagement />
              </ProtectedRoute>
            }
          />
          
          {/* Employee Routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute role="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/leaves"
            element={
              <ProtectedRoute role="employee">
                <EmployeeLeaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/attendance-history"
            element={
              <ProtectedRoute role="employee">
                <AttendanceHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/kpi"
            element={
              <ProtectedRoute role="employee">
                <EmployeeKPI />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support/chatbot"
            element={
              <ProtectedRoute>
                <ChatbotSupport />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
