import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import KPIManagement from './KPIManagement';
import ApiService from '../../services/ApiService';

jest.mock('../../components/Layout', () => ({ children }) => <main>{children}</main>);
jest.mock('../../services/ApiService');

const kpiRows = [{
  id: 1,
  employee_id: 1,
  employee_code: 'EMP001',
  employee_name: 'John Doe',
  department: 'IT',
  metric: 'Doanh số',
  target: 100,
  actual: 80,
  period: '2026-09',
}];
const employees = [{ id: 1, employee_id: 'EMP001', first_name: 'John', last_name: 'Doe' }];

describe('KPIManagement', () => {
  beforeEach(() => {
    ApiService.getKPIs.mockResolvedValue(kpiRows);
    ApiService.getEmployees.mockResolvedValue(employees);
    ApiService.createKPI.mockResolvedValue({ success: true, id: 2 });
    ApiService.getKpiDetails.mockResolvedValue([]);
  });

  test('loads KPI rows and employee options', async () => {
    render(<KPIManagement />);
    await waitFor(() => expect(screen.getByText('Doanh số')).toBeInTheDocument());
    expect(screen.getByText('EMP001')).toBeInTheDocument();
  });

  test('filters KPI rows by employee code', async () => {
    render(<KPIManagement />);
    await waitFor(() => expect(screen.getByText('Doanh số')).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/Tìm kiếm theo tên/i), { target: { value: 'EMP999' } });
    expect(screen.getByText('Chưa có dữ liệu KPI')).toBeInTheDocument();
  });

  test('rejects an invalid target before calling the API', async () => {
    render(<KPIManagement />);
    fireEvent.click(screen.getByRole('button', { name: /tạo kpi mới/i }));
    await waitFor(() => expect(screen.getByRole('option', { name: /EMP001/ })).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Nhân viên'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Chỉ tiêu'), { target: { value: 'Doanh số' } });
    fireEvent.change(screen.getByLabelText('Mục tiêu'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('Thực tế'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Kỳ đánh giá'), { target: { value: '2026-09' } });
    fireEvent.click(screen.getByRole('button', { name: 'Tạo KPI' }));
    expect(await screen.findByText('Mục tiêu KPI phải lớn hơn 0.')).toBeInTheDocument();
    expect(ApiService.createKPI).not.toHaveBeenCalled();
  });

  test('creates a valid KPI and reloads the table', async () => {
    render(<KPIManagement />);
    fireEvent.click(screen.getByRole('button', { name: /tạo kpi mới/i }));
    await waitFor(() => expect(screen.getByRole('option', { name: /EMP001/ })).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Nhân viên'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Chỉ tiêu'), { target: { value: 'Doanh số tháng' } });
    fireEvent.change(screen.getByLabelText('Mục tiêu'), { target: { value: '120' } });
    fireEvent.change(screen.getByLabelText('Thực tế'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Kỳ đánh giá'), { target: { value: '2026-09' } });
    fireEvent.click(screen.getByRole('button', { name: 'Tạo KPI' }));
    await waitFor(() => expect(ApiService.createKPI).toHaveBeenCalledWith({
      employee_id: '1', metric: 'Doanh số tháng', target: 120, actual: 100, period: '2026-09',
    }));
    expect(ApiService.getKPIs).toHaveBeenCalledTimes(2);
  });
});
