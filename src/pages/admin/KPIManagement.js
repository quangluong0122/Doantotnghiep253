import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Search, ChevronLeft, ChevronRight, Plus, Eye } from 'lucide-react';

const KPIManagement = () => {
  const [kpis] = useState([
    { id: 1, employeeId: 'EMP001', name: 'Nguyễn Văn A', department: 'IT', period: 'Q4 2025', metric: 'Doanh số', target: '50M', actual: '52.5M', percentage: 105 },
    { id: 2, employeeId: 'EMP002', name: 'Trần Thị B', department: 'Design', period: 'Q4 2025', metric: 'Dự án hoàn thành', target: '5', actual: '6', percentage: 120 },
    { id: 3, employeeId: 'EMP003', name: 'Lê Văn C', department: 'Management', period: 'Q4 2025', metric: 'Khách hài lòng', target: '95%', actual: '97%', percentage: 102 },
    { id: 4, employeeId: 'EMP004', name: 'Phạm Thị D', department: 'IT', period: 'Q4 2025', metric: 'Chất lượng', target: '90%', actual: '88%', percentage: 98 },
    { id: 5, employeeId: 'EMP005', name: 'Hoàng Văn E', department: 'IT', period: 'Q4 2025', metric: 'Năng suất', target: '90%', actual: '92%', percentage: 102 },
    { id: 6, employeeId: 'EMP006', name: 'Vũ Thị F', department: 'IT', period: 'Q3 2025', metric: 'Deadline', target: '95%', actual: '96%', percentage: 101 },
    { id: 7, employeeId: 'EMP007', name: 'Đỗ Văn G', department: 'IT', period: 'Q3 2025', metric: 'Cải tiến', target: '80%', actual: '85%', percentage: 106 },
    { id: 8, employeeId: 'EMP008', name: 'Bùi Thị H', department: 'Design', period: 'Q3 2025', metric: 'Sáng tạo', target: '75%', actual: '80%', percentage: 107 },
    { id: 9, employeeId: 'EMP009', name: 'Đinh Văn I', department: 'HR', period: 'Q2 2025', metric: 'Tuyển dụng', target: '20', actual: '22', percentage: 110 },
    { id: 10, employeeId: 'EMP010', name: 'Mai Thị K', department: 'Marketing', period: 'Q2 2025', metric: 'Campaign', target: '5', actual: '5', percentage: 100 },
    { id: 11, employeeId: 'EMP011', name: 'Lý Văn L', department: 'Sales', period: 'Q1 2025', metric: 'Doanh số', target: '100M', actual: '105M', percentage: 105 },
    { id: 12, employeeId: 'EMP012', name: 'Trương Thị M', department: 'Finance', period: 'Q1 2025', metric: 'Báo cáo', target: '100%', actual: '100%', percentage: 100 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredKPIs = kpis.filter(kpi =>
    kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kpi.employeeId.includes(searchTerm) ||
    kpi.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kpi.period.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredKPIs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedKPIs = filteredKPIs.slice(startIdx, endIdx);

  const getStatusBadge = (percentage) => {
    if (percentage >= 100) {
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Vượt chỉ tiêu</span>;
    }
    if (percentage >= 90) {
      return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Tốt</span>;
    }
    return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Cần cải thiện</span>;
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quản Lý KPI</h1>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Tạo KPI Mới</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã NV, phòng ban, quý..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* KPI Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Mã NV</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Tên Nhân Viên</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Phòng Ban</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Kỳ</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Chỉ Tiêu</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Mục Tiêu</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Thực Tế</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Hoàn Thành</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Thao Tác</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                {paginatedKPIs.map((kpi) => (
                  <tr key={kpi.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{kpi.employeeId}</td>
                    <td className="py-4 px-6">{kpi.name}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {kpi.department}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">{kpi.period}</td>
                    <td className="py-4 px-6">{kpi.metric}</td>
                    <td className="py-4 px-6 font-medium">{kpi.target}</td>
                    <td className="py-4 px-6 font-medium">{kpi.actual}</td>
                    <td className="py-4 px-6">{getStatusBadge(kpi.percentage)}</td>
                    <td className="py-4 px-6">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-600">
            Hiển thị {startIdx + 1}-{Math.min(endIdx, filteredKPIs.length)} / {filteredKPIs.length} KPI
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default KPIManagement;
