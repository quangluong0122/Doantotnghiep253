import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, DollarSign } from 'lucide-react';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, fetch from API based on id
  const employee = {
    id: id,
    employeeId: 'EMP001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0912345678',
    position: 'Senior Developer',
    department: 'IT',
    salary: '25000000',
    joinDate: '01/01/2022',
    address: '123 Đường ABC, Quận 1, TP.HCM',
  };

  const leaveHistory = [
    { id: 1, type: 'Nghỉ phép', startDate: '15/12/2025', endDate: '20/12/2025', status: 'approved' },
    { id: 2, type: 'Nghỉ ốm', startDate: '05/11/2025', endDate: '06/11/2025', status: 'approved' },
  ];

  return (
    <Layout>
      <div>
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/admin/employees')}
            className="mr-4 p-2 hover:bg-gray-200 rounded"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Chi Tiết Nhân Viên</h1>
        </div>

        {/* Employee Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
              {employee.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{employee.name}</h2>
              <p className="text-gray-600">{employee.employeeId} - {employee.position}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {employee.department}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3 text-gray-700">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{employee.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-700">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Số Điện Thoại</p>
                <p className="font-medium">{employee.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Ngày Vào Làm</p>
                <p className="font-medium">{employee.joinDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-700">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Lương</p>
                <p className="font-medium">{parseInt(employee.salary).toLocaleString()} VNĐ</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-700 md:col-span-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Địa Chỉ</p>
                <p className="font-medium">{employee.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leave History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Lịch Sử Nghỉ Phép</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Loại</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Từ Ngày</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Đến Ngày</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map((leave) => (
                  <tr key={leave.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{leave.type}</td>
                    <td className="py-3 px-4">{leave.startDate}</td>
                    <td className="py-3 px-4">{leave.endDate}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Đã duyệt
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDetail;
