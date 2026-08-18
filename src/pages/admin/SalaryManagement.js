import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { DollarSign, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const SalaryManagement = () => {
  const [salaries] = useState([
    { id: 1, employeeId: 'EMP001', employeeName: 'Nguyễn Văn A', baseSalary: 25000000, bonus: 5000000, deduction: 0, total: 30000000, month: '01/2026', status: 'paid' },
    { id: 2, employeeId: 'EMP002', employeeName: 'Trần Thị B', baseSalary: 20000000, bonus: 3000000, deduction: 0, total: 23000000, month: '01/2026', status: 'paid' },
    { id: 3, employeeId: 'EMP003', employeeName: 'Lê Văn C', baseSalary: 30000000, bonus: 7000000, deduction: 0, total: 37000000, month: '01/2026', status: 'pending' },
    { id: 4, employeeId: 'EMP004', employeeName: 'Phạm Thị D', baseSalary: 22000000, bonus: 4000000, deduction: 0, total: 26000000, month: '01/2026', status: 'paid' },
    { id: 5, employeeId: 'EMP005', employeeName: 'Hoàng Văn E', baseSalary: 23000000, bonus: 4500000, deduction: 0, total: 27500000, month: '01/2026', status: 'paid' },
    { id: 6, employeeId: 'EMP006', employeeName: 'Vũ Thị F', baseSalary: 18000000, bonus: 2500000, deduction: 0, total: 20500000, month: '01/2026', status: 'paid' },
    { id: 7, employeeId: 'EMP007', employeeName: 'Đỗ Văn G', baseSalary: 26000000, bonus: 5500000, deduction: 0, total: 31500000, month: '01/2026', status: 'paid' },
    { id: 8, employeeId: 'EMP008', employeeName: 'Bùi Thị H', baseSalary: 19000000, bonus: 3000000, deduction: 0, total: 22000000, month: '01/2026', status: 'paid' },
    { id: 9, employeeId: 'EMP009', employeeName: 'Đinh Văn I', baseSalary: 28000000, bonus: 6000000, deduction: 0, total: 34000000, month: '01/2026', status: 'paid' },
    { id: 10, employeeId: 'EMP010', employeeName: 'Mai Thị K', baseSalary: 21000000, bonus: 3500000, deduction: 0, total: 24500000, month: '01/2026', status: 'paid' },
    { id: 11, employeeId: 'EMP011', employeeName: 'Lý Văn L', baseSalary: 24000000, bonus: 4000000, deduction: 0, total: 28000000, month: '01/2026', status: 'paid' },
    { id: 12, employeeId: 'EMP012', employeeName: 'Trương Thị M', baseSalary: 27000000, bonus: 5500000, deduction: 0, total: 32500000, month: '01/2026', status: 'pending' },
    { id: 13, employeeId: 'EMP013', employeeName: 'Phan Văn N', baseSalary: 25500000, bonus: 5000000, deduction: 0, total: 30500000, month: '01/2026', status: 'paid' },
    { id: 14, employeeId: 'EMP014', employeeName: 'Cao Thị O', baseSalary: 29000000, bonus: 6500000, deduction: 0, total: 35500000, month: '01/2026', status: 'pending' },
    { id: 15, employeeId: 'EMP015', employeeName: 'Tô Văn P', baseSalary: 24500000, bonus: 5000000, deduction: 0, total: 29500000, month: '01/2026', status: 'pending' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredSalaries = salaries.filter((sal) =>
    sal.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sal.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sal.month.includes(searchTerm) ||
    sal.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSalaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSalaries = filteredSalaries.slice(startIndex, startIndex + itemsPerPage);

  const totalSalary = salaries.reduce((sum, s) => sum + s.total, 0);
  const totalBonus = salaries.reduce((sum, s) => sum + s.bonus, 0);
  const paidCount = salaries.filter((s) => s.status === 'paid').length;

  return (
    <Layout>
      <div className="animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản Lý Lương Thưởng</h1>
        <p className="text-gray-600 mb-8">Quản lý và thanh toán lương nhân viên</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100" style={{animation: 'slideUp 0.5s ease-out 0ms backwards'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng Lương Tháng Này</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalSalary)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl shadow-lg p-6 border border-green-100" style={{animation: 'slideUp 0.5s ease-out 100ms backwards'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng Thưởng</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(totalBonus)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-2xl shadow-lg p-6 border border-purple-100" style={{animation: 'slideUp 0.5s ease-out 200ms backwards'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đã Thanh Toán</p>
                <p className="text-3xl font-bold text-purple-600">{paidCount}/{salaries.length}</p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo nhân viên, tháng, trạng thái..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Salary Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 section-enter" style={{animationDelay: '0.2s'}}>
          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Mã NV</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Họ Tên</th>
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
                    <td className="py-4 px-4 font-medium text-gray-800">{salary.employeeId}</td>
                    <td className="py-4 px-4 text-gray-700">{salary.employeeName}</td>
                    <td className="py-4 px-4 text-gray-700">{formatCurrency(salary.baseSalary)}</td>
                    <td className="py-4 px-4 text-green-600 font-semibold">+{formatCurrency(salary.bonus)}</td>
                    <td className="py-4 px-4 text-red-600">
                      {salary.deduction > 0 ? `-${formatCurrency(salary.deduction)}` : '-'}
                    </td>
                    <td className="py-4 px-4 font-bold text-blue-600">{formatCurrency(salary.total)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${
                        salary.status === 'paid' 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {salary.status === 'paid' ? '✓ Đã thanh toán' : '⏳ Chờ thanh toán'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg animate-slideUp">
            <div className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
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
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        .section-enter {
          animation: fadeIn 0.7s ease-out;
        }
        .table-row-enter {
          animation: slideInLeft 0.4s ease-out backwards;
        }
      `}</style>
    </Layout>
  );
};

export default SalaryManagement;
