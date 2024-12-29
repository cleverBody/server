const request = require('supertest');
const app = require('../app');

describe('API Tests', () => {
  test('GET /test should return server status', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Server is working');
  });

  test('GET /api/home/categories should return categories', async () => {
    const response = await request(app).get('/api/home/categories');
    expect(response.status).toBe(200);
    expect(response.body.code).toBe(0);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
}); 