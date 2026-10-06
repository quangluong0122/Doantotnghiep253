import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EmployeeLeaves from './EmployeeLeaves';
import ApiService from '../../services/ApiService';

jest.mock('../../components/Layout', () => ({ children }) => <main>{children}</main>);
jest.mock('../../services/ApiService');

describe('EmployeeLeaves', () => {
  beforeEach(() => {
    ApiService.getLeaves.mockResolvedValue([]);
    ApiService.createLeave.mockResolvedValue({ success: true });
  });

  test('loads and displays an existing leave request', async () => {
    ApiService.getLeaves.mockResolvedValue([
      { id: 1, leave_type: 'annual', start_date: '2026-09-10', end_date: '2026-09-12', reason: 'Nghỉ phép', status: 'approved' },
    ]);
    render(<EmployeeLeaves />);
    await waitFor(() => expect(screen.getByText('Nghỉ phép năm')).toBeInTheDocument());
    expect(screen.getByText('3 ngày')).toBeInTheDocument();
    expect(screen.getByText('Đã duyệt')).toBeInTheDocument();
  });

  test('rejects a leave request when the end date is before the start date', async () => {
    render(<EmployeeLeaves />);
    fireEvent.click(screen.getByRole('button', { name: /gửi đơn nghỉ phép/i }));
    fireEvent.change(screen.getByLabelText('Ngày bắt đầu'), { target: { value: '2026-09-20' } });
    fireEvent.change(screen.getByLabelText('Ngày kết thúc'), { target: { value: '2026-09-19' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Gửi đơn' }).closest('form'));
    expect(await screen.findByText('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.')).toBeInTheDocument();
    expect(ApiService.createLeave).not.toHaveBeenCalled();
  });

  test('creates a valid leave request and reloads the list', async () => {
    render(<EmployeeLeaves />);
    fireEvent.click(screen.getByRole('button', { name: /gửi đơn nghỉ phép/i }));
    fireEvent.change(screen.getByLabelText('Ngày bắt đầu'), { target: { value: '2026-09-20' } });
    fireEvent.change(screen.getByLabelText('Ngày kết thúc'), { target: { value: '2026-09-21' } });
    fireEvent.change(screen.getByLabelText('Lý do'), { target: { value: 'Việc gia đình' } });
    fireEvent.click(screen.getByRole('button', { name: 'Gửi đơn' }));
    await waitFor(() => expect(ApiService.createLeave).toHaveBeenCalledWith(expect.objectContaining({
      leave_type: 'annual', start_date: '2026-09-20', end_date: '2026-09-21', reason: 'Việc gia đình',
    })));
    expect(ApiService.getLeaves).toHaveBeenCalledTimes(2);
  });
});
