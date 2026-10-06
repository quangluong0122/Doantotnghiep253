import assert from 'node:assert/strict';
import test, { after } from 'node:test';
import 'dotenv/config';

const hasDatabaseConfig = Boolean(
  process.env.TEST_DB === '1' &&
  (process.env.TEST_DATABASE_URL || (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME))
);
const canWrite = hasDatabaseConfig && process.env.TEST_DB_WRITE === '1';

let app;
let pool;
let adminToken;
let employeeToken;
let employeeId;

after(async () => {
  if (pool) await pool.end();
});

const setupDatabase = async () => {
  if (!hasDatabaseConfig) return;
  const appModule = await import('../src/app.js');
  const poolModule = await import('../src/config/database.js');
  app = appModule.default;
  pool = poolModule.default;
};

const login = async (username, password) => {
  const response = await (await import('supertest')).default(app)
    .post('/api/auth/login')
    .send({ username, password });
  assert.equal(response.status, 200, `Đăng nhập ${username} thất bại: ${response.body.message || response.text}`);
  return response.body.token;
};

test('database connection is available', { skip: !hasDatabaseConfig }, async () => {
  await setupDatabase();
  const connection = await pool.getConnection();
  const [rows] = await connection.execute('SELECT 1 AS connected');
  connection.release();
  assert.equal(rows[0].connected, 1);
});

test('admin can read KPI records from the database', { skip: !hasDatabaseConfig }, async () => {
  if (!adminToken) adminToken = await login(process.env.TEST_ADMIN_USERNAME || 'admin', process.env.TEST_ADMIN_PASSWORD || 'admin123');
  const response = await (await import('supertest')).default(app)
    .get('/api/kpi')
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
});

test('employee can read only the employee expense records', { skip: !hasDatabaseConfig }, async () => {
  if (!employeeToken) employeeToken = await login(process.env.TEST_EMPLOYEE_USERNAME || 'employee', process.env.TEST_EMPLOYEE_PASSWORD || 'emp123');
  const response = await (await import('supertest')).default(app)
    .get('/api/expenses')
    .set('Authorization', `Bearer ${employeeToken}`);
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.every((expense) => !Object.prototype.hasOwnProperty.call(expense, 'employee_name')));
});

test('expense summary returns numeric monthly totals', { skip: !hasDatabaseConfig }, async () => {
  if (!adminToken) adminToken = await login(process.env.TEST_ADMIN_USERNAME || 'admin', process.env.TEST_ADMIN_PASSWORD || 'admin123');
  const response = await (await import('supertest')).default(app)
    .get('/api/expenses/summary?month=2026-01')
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(response.status, 200);
  assert.equal(response.body.month, '2026-01');
  assert.equal(typeof response.body.total_amount, 'number');
  assert.equal(typeof response.body.approved_amount, 'number');
});

test('attendance records expose calculated work duration', { skip: !hasDatabaseConfig }, async () => {
  if (!employeeToken) employeeToken = await login(process.env.TEST_EMPLOYEE_USERNAME || 'employee', process.env.TEST_EMPLOYEE_PASSWORD || 'emp123');
  const response = await (await import('supertest')).default(app)
    .get('/api/attendance')
    .set('Authorization', `Bearer ${employeeToken}`);
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
  const completedRecord = response.body.find((record) => record.check_in_time && record.check_out_time);
  if (completedRecord) {
    assert.equal(typeof completedRecord.work_duration_minutes, 'number');
    assert.match(completedRecord.work_duration, /giờ/);
  }
});

test('employee can create and admin can approve an expense with cleanup', { skip: !canWrite }, async () => {
  adminToken = adminToken || await login(process.env.TEST_ADMIN_USERNAME || 'admin', process.env.TEST_ADMIN_PASSWORD || 'admin123');
  employeeToken = employeeToken || await login(process.env.TEST_EMPLOYEE_USERNAME || 'employee', process.env.TEST_EMPLOYEE_PASSWORD || 'emp123');
  const [employeeRows] = await pool.execute('SELECT id FROM employees WHERE user_id = (SELECT id FROM users WHERE username = ?)', [process.env.TEST_EMPLOYEE_USERNAME || 'employee']);
  assert.equal(employeeRows.length, 1);
  employeeId = employeeRows[0].id;

  const request = (await import('supertest')).default;
  const createResponse = await request(app)
    .post('/api/expenses')
    .set('Authorization', `Bearer ${employeeToken}`)
    .send({ amount: 12345, category: 'Automated test', description: 'Integration test expense', date: '2026-01-20' });
  assert.equal(createResponse.status, 201);

  const approveResponse = await request(app)
    .put(`/api/expenses/${createResponse.body.id}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ status: 'approved' });
  assert.equal(approveResponse.status, 200);

  await pool.execute('DELETE FROM expenses WHERE id = ? AND employee_id = ?', [createResponse.body.id, employeeId]);
});

if (!hasDatabaseConfig) {
  test('database integration tests require TEST_DB=1 and DB_* or TEST_DATABASE_URL', { skip: false }, () => {
    assert.ok(true, 'Database tests skipped because no test database configuration is available');
  });
}
