import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { Calendar, CheckCircle, Clock, FileText, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [salaries, setSalaries] = useState([]);

  // Fetch employee profile and data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

        // Fetch employee profile
        const empRes = await fetch(`${apiUrl}/employees/profile/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (empRes.ok) {
          setEmployee(await empRes.json());
        }

        // Fetch leaves - filter by current employee
        const leavesRes = await fetch(`${apiUrl}/leaves`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (leavesRes.ok) {
          const allLeaves = await leavesRes.json();
          // Note: This would need to be filtered by employee_id in backend
          setLeaves(allLeaves.slice(0, 12));
        }

        // Fetch expenses - filter by current employee
        const expensesRes = await fetch(`${apiUrl}/expenses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (expensesRes.ok) {
          const allExpenses = await expensesRes.json();
          setExpenses(allExpenses.slice(0, 10));
        }

        // Fetch salaries - filter by current employee
        const salariesRes = await fetch(`${apiUrl}/salary`, {
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

  const stats = [
    { 
      title: 'Nghỉ Phép Còn Lại', 
      value: '14', 
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

  // Use fetched data or defaults
  const leavesData = leaves.length > 0 ? leaves : [
    { id: 1, type: 'Nghỉ phép', date: '15/12/2025 - 20/12/2025', days: 6, status: 'approved' },
    { id: 2, type: 'Nghỉ ốm', date: '05/11/2025 - 06/11/2025', days: 2, status: 'approved' },
    { id: 3, type: 'Nghỉ phép', date: '10/01/2026 - 12/01/2026', days: 3, status: 'pending' },
    { id: 4, type: 'Nghỉ phép', date: '20/01/2026 - 25/01/2026', days: 6, status: 'pending' },
    { id: 5, type: 'Nghỉ việc riêng', date: '20/10/2025', days: 1, status: 'approved' },
    { id: 6, type: 'Nghỉ phép', date: '05/02/2026 - 08/02/2026', days: 4, status: 'approved' },
    { id: 7, type: 'Nghỉ ốm', date: '15/02/2026 - 16/02/2026', days: 2, status: 'pending' },
    { id: 8, type: 'Nghỉ phép', date: '25/02/2026 - 28/02/2026', days: 4, status: 'approved' },
  ];

  const expensesData = expenses.length > 0 ? expenses : [
    { id: 1, category: 'Văn phòng phẩm', amount: 5000000, date: '05/01/2026', description: 'Mua máy in, giấy A4, bút viết', status: 'approved' },
    { id: 2, category: 'Điện nước', amount: 8000000, date: '01/01/2026', description: 'Hóa đơn tháng 12/2025', status: 'approved' },
    { id: 3, category: 'Marketing', amount: 15000000, date: '03/01/2026', description: 'Chi phí quảng cáo Facebook Ads', status: 'pending' },
    { id: 4, category: 'Đào tạo', amount: 12000000, date: '02/01/2026', description: 'Khóa học React Advanced', status: 'approved' },
    { id: 5, category: 'Văn phòng phẩm', amount: 3500000, date: '04/01/2026', description: 'Mua bàn ghế văn phòng', status: 'approved' },
    { id: 6, category: 'Marketing', amount: 20000000, date: '06/01/2026', description: 'Quảng cáo Google Ads', status: 'pending' },
    { id: 7, category: 'Du lịch công tác', amount: 25000000, date: '08/01/2026', description: 'Tham dự hội thảo HN', status: 'approved' },
    { id: 8, category: 'Bảo hiểm', amount: 18000000, date: '10/01/2026', description: 'Bảo hiểm sức khỏe nhân viên', status: 'approved' },
  ];

  const salaryData = salaries.length > 0 ? salaries : [
    { id: 1, month: '01/2026', baseSalary: 25000000, bonus: 5000000, deduction: 0, total: 30000000, status: 'paid' },
    { id: 2, month: '12/2025', baseSalary: 25000000, bonus: 3000000, deduction: 0, total: 28000000, status: 'paid' },
    { id: 3, month: '11/2025', baseSalary: 25000000, bonus: 4000000, deduction: 500000, total: 28500000, status: 'paid' },
    { id: 4, month: '10/2025', baseSalary: 25000000, bonus: 2500000, deduction: 0, total: 27500000, status: 'paid' },
  ];

  // State for leaves table
  const [leavesSearch, setLeavesSearch] = useState('');
  const [leavesPage, setLeavesPage] = useState(1);
  
  // State for expenses table
  const [expensesSearch, setExpensesSearch] = useState('');
  const [expensesPage, setExpensesPage] = useState(1);
  
  // State for salary table
  const [salarySearch, setSalarySearch] = useState('');
  const [salaryPage, setSalaryPage] = useState(1);

  const itemsPerPage = 8;

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
      sal.month.includes(salarySearch) ||
      sal.status.toLowerCase().includes(salarySearch.toLowerCase())
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
        <div className="mb-8 bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-2xl border border-indigo-200">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            👋 Xin chào, {employee ? `${employee.first_name} ${employee.last_name}` : user?.name || 'Nhân viên'}
          </h1>
          <p className="text-gray-600 text-lg">Chào mừng bạn trở lại với hệ thống quản lý</p>
        </div>

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
