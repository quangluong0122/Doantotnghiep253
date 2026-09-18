import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { Calendar, CheckCircle, Clock, FileText, Search, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import ApiService, { API_BASE_URL } from '../../services/ApiService';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ amount: '', category: '', date: new Date().toISOString().slice(0, 10), description: '' });
  const [expenseError, setExpenseError] = useState('');
  const [submittingExpense, setSubmittingExpense] = useState(false);
  const [salarySearch, setSalarySearch] = useState('');
  const [salaryPage, setSalaryPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch employee profile and data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetch employee profile
        const empRes = await fetch(`${API_BASE_URL}/employees/profile/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (empRes.ok) {
          setEmployee(await empRes.json());
        }

        // Fetch leaves - filter by current employee
        const leavesRes = await fetch(`${API_BASE_URL}/leaves`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (leavesRes.ok) {
          const allLeaves = await leavesRes.json();
          // Note: This would need to be filtered by employee_id in backend
          setLeaves(allLeaves.slice(0, 12).map((leave) => ({
            ...leave,
            type: leave.leave_type,
            date: `${new Date(leave.start_date).toLocaleDateString('vi-VN')} - ${new Date(leave.end_date).toLocaleDateString('vi-VN')}`,
            days: Math.floor((new Date(leave.end_date) - new Date(leave.start_date)) / 86400000) + 1
          })));
        }

        // Fetch expenses - filter by current employee
        const expensesRes = await fetch(`${API_BASE_URL}/expenses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (expensesRes.ok) {
          const allExpenses = await expensesRes.json();
          setExpenses(allExpenses.slice(0, 10));
        }

        // Fetch salaries - filter by current employee
        const salariesRes = await fetch(`${API_BASE_URL}/salary`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (salariesRes.ok) {
          const allSalaries = await salariesRes.json();
          setSalaries(allSalaries.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    if (user) {
      fetchEmployeeData();
    }
  }, [user]);

  const submitExpense = async (event) => {
    event.preventDefault();
    setExpenseError('');
    if (Number(expenseForm.amount) <= 0) {
      setExpenseError('Số tiền phải lớn hơn 0.');
      return;
    }
    setSubmittingExpense(true);
    try {
      await ApiService.createExpense({ ...expenseForm, amount: Number(expenseForm.amount) });
      setExpenses((await ApiService.getExpenses()).slice(0, 10));
      setExpenseForm({ amount: '', category: '', date: new Date().toISOString().slice(0, 10), description: '' });
      setShowExpenseForm(false);
    } catch (submitError) {
      setExpenseError(submitError.message || 'Không thể gửi đề xuất chi phí');
    } finally {
      setSubmittingExpense(false);
    }
  };

  const stats = [
    { 
      title: 'Nghỉ Phép Còn Lại', 
      value: Math.max(12 - leaves.filter((leave) => leave.status === 'approved' && leave.leave_type === 'annual')
        .reduce((days, leave) => days + (leave.days || 0), 0), 0).toString(),
      icon: Calendar, 
      color: 'bg-blue-500',
      unit: 'ngày'
    },
    { 
      title: 'Đơn Chờ Duyệt', 
      value: leaves.filter(l => l.status === 'pending').length.toString(), 
      icon: Clock, 
      color: 'bg-yellow-500',
      unit: 'đơn'
    },
    { 
      title: 'Đơn Đã Duyệt', 
      value: leaves.filter(l => l.status === 'approved').length.toString(), 
      icon: CheckCircle, 
      color: 'bg-green-500',
      unit: 'đơn'
    },
    { 
      title: 'Tổng Đơn', 
      value: leaves.length.toString(), 
      icon: FileText, 
      color: 'bg-purple-500',
      unit: 'đơn'
    },
  ];

  const leavesData = leaves;
  const expensesData = expenses;
  const salaryData = salaries;

  // State for leaves table
  const [leavesSearch, setLeavesSearch] = useState('');
  const [leavesPage, setLeavesPage] = useState(1);
  
  // State for expenses table
  const [expensesSearch, setExpensesSearch] = useState('');
  const [expensesPage, setExpensesPage] = useState(1);
  // Filter functions
  const getFilteredLeaves = () => {
    return leavesData.filter(leave =>
      leave.type.toLowerCase().includes(leavesSearch.toLowerCase()) ||
      leave.status.toLowerCase().includes(leavesSearch.toLowerCase())
    );
  };

  const getFilteredExpenses = () => {
    return expensesData.filter(exp =>
      exp.category.toLowerCase().includes(expensesSearch.toLowerCase()) ||
      exp.description.toLowerCase().includes(expensesSearch.toLowerCase()) ||
      exp.status.toLowerCase().includes(expensesSearch.toLowerCase())
    );
  };

  const getFilteredSalaries = () => {
    return salaryData.filter(sal =>
      String(sal.month || '').includes(salarySearch) ||
      String(sal.status || '').toLowerCase().includes(salarySearch.toLowerCase())
    );
  };

  // Paginate data
  const paginateData = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const filteredLeaves = getFilteredLeaves();
  const filteredExpenses = getFilteredExpenses();
  const filteredSalaries = getFilteredSalaries();

  const paginatedLeaves = paginateData(filteredLeaves, leavesPage);
  const paginatedExpenses = paginateData(filteredExpenses, expensesPage);
  const paginatedSalaries = paginateData(filteredSalaries, salaryPage);

  const totalLeavesPages = Math.ceil(filteredLeaves.length / itemsPerPage);
  const totalExpensesPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const totalSalaryPages = Math.ceil(filteredSalaries.length / itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const TableHeader = ({ title, description }) => (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );

  const SearchInput = ({ value, onChange }) => (
    <div className="mb-4 relative">
      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );

  const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg animate-slideUp">
      <div className="text-sm text-gray-600">
        Trang {currentPage} / {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="mb-8 bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-2xl border border-indigo-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              👋 Xin chào, {employee ? `${employee.first_name} ${employee.last_name}` : user?.name || 'Nhân viên'}
            </h1>
            <p className="text-gray-600 text-lg">Chào mừng bạn trở lại với hệ thống quản lý</p>
          </div>
          <button onClick={() => { setExpenseError(''); setShowExpenseForm(true); }} className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Tạo đề xuất chi phí</span>
          </button>
        </div>

        {showExpenseForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <form onSubmit={submitExpense} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Tạo đề xuất chi phí</h2>
                <button type="button" onClick={() => setShowExpenseForm(false)} className="rounded p-1 text-gray-500 hover:bg-gray-100" aria-label="Đóng"><X className="h-5 w-5" /></button>
              </div>
              {expenseError && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{expenseError}</p>}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-gray-700">Số tiền<input type="number" min="1" step="1000" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" required /></label>
                <label className="text-sm font-medium text-gray-700">Danh mục<input type="text" value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" placeholder="Ví dụ: Công tác phí" required /></label>
                <label className="text-sm font-medium text-gray-700">Ngày chi<input type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" required /></label>
              </div>
              <label className="mt-4 block text-sm font-medium text-gray-700">Mô tả<textarea value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" rows="3" required /></label>
              <button disabled={submittingExpense} className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60">{submittingExpense ? 'Đang gửi...' : 'Gửi đề xuất'}</button>
            </form>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-100"
                style={{
                  animation: `slideUp 0.5s ease-out ${index * 100}ms backwards`
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500 font-medium">{stat.unit}</p>
              </div>
            );
          })}
        </div>

        {/* Leaves Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 section-enter" style={{animationDelay: '0.1s'}}>
          <TableHeader title="Đơn Nghỉ Phép" description="Quản lý và theo dõi các đơn nghỉ phép của bạn" />
          <SearchInput 
            value={leavesSearch} 
            onChange={(val) => { setLeavesSearch(val); setLeavesPage(1); }}
          />
          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Loại Nghỉ</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Thời Gian</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Số Ngày</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeaves.map((leave, idx) => (
                  <tr key={leave.id} className="border-b hover:bg-gray-50 transition-all duration-200 table-row-enter" style={{animationDelay: `${idx * 40}ms`}}>
                    <td className="py-3 px-4 font-medium text-gray-800">{leave.type}</td>
                    <td className="py-3 px-4 text-gray-600">{leave.date}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">{leave.days} ngày</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 inline-block ${
                        leave.status === 'approved' 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' 
                          : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {leave.status === 'approved' ? '✓ Đã duyệt' : '⏳ Chờ duyệt'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls 
            currentPage={leavesPage} 
            totalPages={totalLeavesPages}
            onPageChange={setLeavesPage}
          />
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 section-enter" style={{animationDelay: '0.2s'}}>
          <TableHeader title="Chi Phí" description="Danh sách các chi phí của bạn" />
          <SearchInput 
            value={expensesSearch} 
            onChange={(val) => { setExpensesSearch(val); setExpensesPage(1); }}
          />
          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Danh Mục</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Số Tiền</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Ngày</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Mô Tả</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.map((expense, idx) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50 transition-all duration-200 table-row-enter" style={{animationDelay: `${idx * 40}ms`}}>
                    <td className="py-3 px-4 font-medium text-gray-800">{expense.category}</td>
                    <td className="py-3 px-4 font-semibold text-red-600">{formatCurrency(expense.amount)}</td>
                    <td className="py-3 px-4 text-gray-600">{expense.date}</td>
                    <td className="py-3 px-4 text-gray-600 truncate max-w-xs">{expense.description}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${
                        expense.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {expense.status === 'approved' ? '✓ Đã duyệt' : '⏳ Chờ duyệt'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls 
            currentPage={expensesPage} 
            totalPages={totalExpensesPages}
            onPageChange={setExpensesPage}
          />
        </div>

        {/* Salary Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 section-enter" style={{animationDelay: '0.3s'}}>
          <TableHeader title="Lương Thưởng" description="Lịch sử lương và thưởng của bạn" />
          <SearchInput 
            value={salarySearch} 
            onChange={(val) => { setSalarySearch(val); setSalaryPage(1); }}
          />
          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Tháng</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Lương Cơ Bản</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Thưởng</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Khấu Trừ</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Tổng Cộng</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSalaries.map((salary, idx) => (
                  <tr key={salary.id} className="border-b hover:bg-gray-50 transition-all duration-200 table-row-enter" style={{animationDelay: `${idx * 40}ms`}}>
                    <td className="py-3 px-4 font-medium text-gray-800">{salary.month}</td>
                    <td className="py-3 px-4 text-gray-600">{formatCurrency(salary.baseSalary)}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">{formatCurrency(salary.bonus)}</td>
                    <td className="py-3 px-4 text-red-600">{formatCurrency(salary.deduction)}</td>
                    <td className="py-3 px-4 font-bold text-blue-600">{formatCurrency(salary.total)}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800">✓ Đã thanh toán</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls 
            currentPage={salaryPage} 
            totalPages={totalSalaryPages}
            onPageChange={setSalaryPage}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }
        .table-row-enter {
          animation: slideInLeft 0.4s ease-out backwards;
        }
        .section-enter {
          animation: fadeIn 0.7s ease-out;
        }
        tr:hover {
          transition: all 0.3s ease;
        }
      `}</style>
    </Layout>
  );
};

export default EmployeeDashboard;
