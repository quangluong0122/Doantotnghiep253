import ApiService from './ApiService';

describe('ApiService KPI contract', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('createKPI sends the admin KPI payload and parses the response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      text: async () => JSON.stringify({ success: true, token: 'test-token' }),
    });
    await ApiService.login('admin', 'password');
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, id: 10 }),
    });

    await expect(ApiService.createKPI({
      employee_id: 4,
      metric: 'Doanh số',
      target: 100,
      actual: 80,
      period: '2026-09',
    })).resolves.toEqual({ success: true, id: 10 });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/kpi'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          employee_id: 4,
          metric: 'Doanh số',
          target: 100,
          actual: 80,
          period: '2026-09',
        }),
      })
    );
  });

  test('createKPI surfaces the API error message', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Thông tin KPI không hợp lệ' }),
    });

    await expect(ApiService.createKPI({})).rejects.toThrow('Thông tin KPI không hợp lệ');
  });
});
