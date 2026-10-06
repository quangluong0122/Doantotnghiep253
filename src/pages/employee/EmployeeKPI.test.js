import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EmployeeKPI from './EmployeeKPI';
import ApiService from '../../services/ApiService';

jest.mock('../../components/Layout', () => ({ children }) => <main>{children}</main>);
jest.mock('../../services/ApiService');

describe('EmployeeKPI', () => {
  test('loads and displays KPI progress from the API', async () => {
    ApiService.getKPIs.mockResolvedValue([
      { id: 1, metric: 'Doanh số', period: '2026-09', target: 100, actual: 80 },
    ]);

    render(<EmployeeKPI />);

    expect(screen.getByText('KPI Của Tôi')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Doanh số')).toBeInTheDocument());
    expect(screen.getAllByText('80%')).toHaveLength(2);
    expect(screen.getByText('0/1')).toBeInTheDocument();
  });

  test('shows an empty result when KPI loading fails', async () => {
    ApiService.getKPIs.mockRejectedValue(new Error('Network error'));

    render(<EmployeeKPI />);

    await waitFor(() => expect(screen.getByText('0/0')).toBeInTheDocument());
    expect(screen.queryByText('Doanh số')).not.toBeInTheDocument();
  });
});
