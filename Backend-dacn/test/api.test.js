import assert from 'node:assert/strict';
import test from 'node:test';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/app.js';
import { verifyRole, verifyToken } from '../src/middleware/auth.js';

process.env.JWT_SECRET = 'test-secret';

const adminToken = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
const employeeToken = jwt.sign({ id: 2, role: 'employee' }, process.env.JWT_SECRET);

const runMiddleware = (middleware, headers = {}) => new Promise((resolve) => {
  const req = {
    get: (name) => headers[name.toLowerCase()] || '',
  };
  const response = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      resolve(this);
    },
  };
  middleware(req, response, () => resolve({ request: req, response }));
});

test('verifyToken rejects a missing bearer token', async () => {
  const result = await runMiddleware(verifyToken);
  assert.equal(result.statusCode, 401);
  assert.equal(result.body.message, 'No token provided');
});

test('verifyToken decodes a valid token', async () => {
  const result = await runMiddleware(verifyToken, { authorization: `Bearer ${adminToken}` });
  assert.equal(result.request.user.role, 'admin');
  assert.equal(result.response.statusCode, 200);
});

test('verifyRole rejects a non-admin user', async () => {
  const middlewareResult = await new Promise((resolve) => {
    const response = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        this.body = body;
        resolve(this);
      },
    };
    verifyRole(['admin'])({ user: { role: 'employee' } }, response, () => resolve(response));
  });
  assert.equal(middlewareResult.statusCode, 403);
  assert.equal(middlewareResult.body.message, 'Forbidden');
});

test('health endpoint returns a successful service response', async () => {
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'API is running' });
});

test('KPI endpoint requires authentication', async () => {
  const response = await request(app).get('/api/kpi');
  assert.equal(response.status, 401);
  assert.equal(response.body.message, 'No token provided');
});

test('KPI creation rejects invalid input before accessing the database', async () => {
  const response = await request(app)
    .post('/api/kpi')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ employee_id: 1, metric: '', target: 0, actual: -1, period: '' });
  assert.equal(response.status, 400);
  assert.equal(response.body.message, 'Thông tin KPI không hợp lệ');
});

test('KPI creation is forbidden for employees', async () => {
  const response = await request(app)
    .post('/api/kpi')
    .set('Authorization', `Bearer ${employeeToken}`)
    .send({ employee_id: 1, metric: 'Doanh số', target: 10, actual: 5, period: '2026-09' });
  assert.equal(response.status, 403);
});

test('expense summary rejects an invalid month before accessing the database', async () => {
  const response = await request(app)
    .get('/api/expenses/summary?month=2026-13')
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(response.status, 400);
  assert.equal(response.body.message, 'Tháng phải có định dạng YYYY-MM');
});
