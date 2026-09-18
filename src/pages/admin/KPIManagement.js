import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Search, ChevronLeft, ChevronRight, Plus, Eye, X } from 'lucide-react';
import ApiService from '../../services/ApiService';

const KPIManagement = () => {
  const [kpis, setKpis] = useState([]);
  const [selectedKpi, setSelectedKpi] = useState(null);
  const [history, setHistory] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({ employee_id: '', metric: '', target: '', actual: '', period: '' });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const loadKpis = async () => {
      try {
        const [rows, employeeRows] = await Promise.all([
          ApiService.getKPIs(),
          ApiService.getEmployees(),
        ]);
        setEmployees(employeeRows);
        setKpis(rows.map((row) => ({
          ...row,
          employeeId: row.employee_code,
          name: row.employee_name,
          department: row.department,
          target: row.target,
          actual: row.actual,
          percentage: Number(row.target) ? (Number(row.actual || 0) / Number(row.target)) * 100 : 0
        })));
      } catch (loadError) {
        setError(loadError.message || 'Không thể tải dữ liệu KPI');
      } finally {
        setLoading(false);
      }
    };
    loadKpis();
  }, []);

  const handleCreateKpi = async (event) => {
    event.preventDefault();
    setError('');
    if (Number(createForm.target) <= 0) {
      setError('Mục tiêu KPI phải lớn hơn 0.');
      return;
    }
    if (Number(createForm.actual) < 0) {
      setError('Thực tế không được nhỏ hơn 0.');
      return;
    }

    setSubmitting(true);
    try {
      await ApiService.createKPI({
        ...createForm,
        target: Number(createForm.target),
        actual: Number(createForm.actual),
      });
      const rows = await ApiService.getKPIs();
      setKpis(rows.map((row) => ({
        ...row,
        employeeId: row.employee_code,
        name: row.employee_name,
        department: row.department,
        percentage: Number(row.target) ? (Number(row.actual || 0) / Number(row.target)) * 100 : 0,
      })));
      setCreateForm({ employee_id: '', metric: '', target: '', actual: '', period: '' });
      setShowCreateForm(false);
    } catch (createError) {
      setError(createError.message || 'Không thể tạo KPI');
    } finally {
      setSubmitting(false);
    }
  };

  const openDetails = async (kpi) => {
    try {
      setSelectedKpi(kpi);
      setDetailLoading(true);
      setHistory(await ApiService.getKpiDetails(kpi.employee_id));
      setError('');
    } catch (detailError) {
      setError(detailError.message || 'Không thể tải chi tiết KPI');
      setSelectedKpi(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const getPrediction = () => {
    const scores = history
      .map((row) => Number(row.target) ? (Number(row.actual || 0) / Number(row.target)) * 100 : 0)
      .filter((score) => Number.isFinite(score));
    if (!scores.length) return null;
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const recent = scores[scores.length - 1];
    const previous = scores.length > 1 ? scores[scores.length - 2] : recent;
    const trend = recent - previous;
    const prediction = Math.max(0, Math.min(150, recent + trend * 0.5));
    const outlook = prediction >= 100 ? 'có khả năng đạt hoặc vượt mục tiêu' : 'cần được hỗ trợ để đạt mục tiêu';
    return { average, prediction, trend, outlook };
  };

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
          <button onClick={() => { setError(''); setShowCreateForm(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Tạo KPI Mới</span>
          </button>
        </div>

        {showCreateForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleCreateKpi} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Tạo KPI mới</h2>
              <button type="button" onClick={() => setShowCreateForm(false)} className="rounded p-1 text-gray-500 hover:bg-gray-100" aria-label="Đóng"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-gray-700 sm:col-span-2">Nhân viên
                <select value={createForm.employee_id} onChange={(event) => setCreateForm({ ...createForm, employee_id: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" required>
                  <option value="">Chọn nhân viên</option>
                  {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.employee_id} - {employee.first_name} {employee.last_name}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium text-gray-700 sm:col-span-2">Chỉ tiêu
                <input type="text" value={createForm.metric} onChange={(event) => setCreateForm({ ...createForm, metric: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" placeholder="Ví dụ: Doanh số tháng" required />
              </label>
              <label className="text-sm font-medium text-gray-700">Mục tiêu
                <input type="number" min="0.01" step="any" value={createForm.target} onChange={(event) => setCreateForm({ ...createForm, target: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" required />
              </label>
              <label className="text-sm font-medium text-gray-700">Thực tế
                <input type="number" min="0" step="any" value={createForm.actual} onChange={(event) => setCreateForm({ ...createForm, actual: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" required />
              </label>
              <label className="text-sm font-medium text-gray-700 sm:col-span-2">Kỳ đánh giá
                <input type="text" value={createForm.period} onChange={(event) => setCreateForm({ ...createForm, period: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" placeholder="Ví dụ: 2026-Q3 hoặc 2026-09" required />
              </label>
            </div>
            <button disabled={submitting} className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60">{submitting ? 'Đang tạo...' : 'Tạo KPI'}</button>
          </form>
        </div>}

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
                {loading && <tr><td colSpan="9" className="py-8 text-center text-gray-500">Đang tải dữ liệu KPI...</td></tr>}
                {!loading && !paginatedKPIs.length && <tr><td colSpan="9" className="py-8 text-center text-gray-500">Chưa có dữ liệu KPI</td></tr>}
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
                        <button onClick={() => openDetails(kpi)} title="Xem chi tiết KPI" className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {error && <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div>}

        {selectedKpi && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Chi tiết KPI: {selectedKpi.name}</h2>
                <p className="text-gray-500">{selectedKpi.employeeId} · {selectedKpi.department || 'Chưa có phòng ban'}</p>
              </div>
              <button onClick={() => setSelectedKpi(null)} className="text-2xl text-gray-500 hover:text-gray-800" aria-label="Đóng">×</button>
            </div>
            {detailLoading ? <p className="py-8 text-center text-gray-500">Đang tải lịch sử KPI...</p> : <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b bg-gray-50"><tr><th className="p-3">Kỳ</th><th className="p-3">Chỉ tiêu</th><th className="p-3">Mục tiêu</th><th className="p-3">Thực tế</th><th className="p-3">Hoàn thành</th></tr></thead>
                  <tbody>{history.map((row) => {
                    const score = Number(row.target) ? (Number(row.actual || 0) / Number(row.target)) * 100 : 0;
                    return <tr key={row.id} className="border-b"><td className="p-3">{row.period}</td><td className="p-3">{row.metric}</td><td className="p-3">{row.target}</td><td className="p-3">{row.actual}</td><td className="p-3 font-semibold">{score.toFixed(1)}%</td></tr>;
                  })}</tbody>
                </table>
              </div>
              {getPrediction() && <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="font-bold text-blue-900">Dự đoán hiệu suất bằng AI nội bộ</h3>
                <p className="mt-2 text-blue-900">Dựa trên xu hướng các kỳ đã ghi nhận, hiệu suất kỳ tiếp theo dự kiến khoảng <strong>{getPrediction().prediction.toFixed(1)}%</strong>, {getPrediction().outlook}.</p>
                <p className="mt-1 text-sm text-blue-700">Điểm trung bình lịch sử: {getPrediction().average.toFixed(1)}% · Xu hướng gần nhất: {getPrediction().trend >= 0 ? '+' : ''}{getPrediction().trend.toFixed(1)} điểm.</p>
                <p className="mt-2 text-xs text-blue-700">Đây là dự đoán tham khảo chạy cục bộ từ dữ liệu KPI, không thay thế đánh giá của quản lý.</p>
              </div>}
            </>}
            <div className="mt-5 flex justify-end"><button onClick={() => setSelectedKpi(null)} className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300">Đóng</button></div>
          </div>
        </div>}

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
