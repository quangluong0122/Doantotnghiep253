import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Search, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

const EmployeeKPI = () => {
  const [kpis] = useState([
    { id: 1, metric: 'Doanh số bán hàng', target: '50,000,000 VNĐ', actual: '52,500,000 VNĐ', percentage: 105, period: 'Q4 2025' },
    { id: 2, metric: 'Tỷ lệ khách hài lòng', target: '95%', actual: '97%', percentage: 102, period: 'Q4 2025' },
    { id: 3, metric: 'Hoàn thành dự án', target: '100%', actual: '100%', percentage: 100, period: 'Q4 2025' },
    { id: 4, metric: 'Năng suất làm việc', target: '90%', actual: '88%', percentage: 98, period: 'Q4 2025' },
    { id: 5, metric: 'Đạt tiêu chuẩn chất lượng', target: '100%', actual: '96%', percentage: 96, period: 'Q3 2025' },
    { id: 6, metric: 'Giao tiếp nhóm', target: '90%', actual: '92%', percentage: 102, period: 'Q3 2025' },
    { id: 7, metric: 'Thời gian phản hồi', target: '24h', actual: '20h', percentage: 119, period: 'Q3 2025' },
    { id: 8, metric: 'Tỷ lệ chỉ báo hiệu suất', target: '85%', actual: '87%', percentage: 102, period: 'Q2 2025' },
    { id: 9, metric: 'Đạt thành tích mục tiêu', target: '80%', actual: '85%', percentage: 106, period: 'Q2 2025' },
    { id: 10, metric: 'Sáng tạo và cải tiến', target: '75%', actual: '80%', percentage: 107, period: 'Q2 2025' },
    { id: 11, metric: 'Kỹ năng lãnh đạo', target: '85%', actual: '83%', percentage: 98, period: 'Q1 2025' },
    { id: 12, metric: 'Phối hợp đội nhóm', target: '90%', actual: '91%', percentage: 101, period: 'Q1 2025' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredKPIs = kpis.filter(kpi =>
    kpi.metric.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kpi.period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredKPIs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedKPIs = filteredKPIs.slice(startIdx, endIdx);

  const getPercentageColor = (percentage) => {
    if (percentage >= 100) return 'text-green-700 bg-green-100';
    if (percentage >= 90) return 'text-blue-700 bg-blue-100';
    return 'text-red-700 bg-red-100';
  };

  const overallPercentage = Math.round(kpis.reduce((acc, kpi) => acc + kpi.percentage, 0) / kpis.length);

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">KPI Của Tôi</h1>
          <p className="text-gray-600 mt-2">Theo dõi tiến độ hoàn thành các chỉ tiêu của bạn</p>
        </div>

        {/* Overall KPI Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Hiệu suất chung</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{overallPercentage}%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-300" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow p-6">
            <div>
              <p className="text-gray-600 text-sm">Chỉ tiêu hoàn thành</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{kpis.filter(k => k.percentage >= 100).length}/{kpis.length}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow p-6">
            <div>
              <p className="text-gray-600 text-sm">Trạng thái</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {overallPercentage >= 100 ? 'Vượt chỉ tiêu' : 'Trong kế hoạch'}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo chỉ tiêu, quý..."
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
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Chỉ tiêu</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Kỳ khoá</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Mục tiêu</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Thực tế</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Hoàn thành</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                {paginatedKPIs.map((kpi) => (
                  <tr key={kpi.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{kpi.metric}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{kpi.period}</td>
                    <td className="py-4 px-6">{kpi.target}</td>
                    <td className="py-4 px-6 font-medium">{kpi.actual}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPercentageColor(kpi.percentage)}`}>
                        {kpi.percentage}%
                      </span>
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
            Hiển thị {startIdx + 1}-{Math.min(endIdx, filteredKPIs.length)} / {filteredKPIs.length} chỉ tiêu
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

export default EmployeeKPI;
