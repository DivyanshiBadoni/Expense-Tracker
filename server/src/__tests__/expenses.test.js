const request = require('supertest');
const app = require('../index');

describe('Expenses API', () => {
  let createdId;

  const validExpense = {
    amount: 250,
    category: 'Food',
    date: '2024-06-01',
    note: 'Lunch with team',
  };

  test('POST /api/expenses - creates a valid expense', async () => {
    const res = await request(app).post('/api/expenses').send(validExpense);
    expect(res.status).toBe(201);
    expect(res.body.amount).toBe(250);
    expect(res.body.category).toBe('Food');
    expect(res.body.id).toBeDefined();
    createdId = res.body.id;
  });

  test('POST /api/expenses - rejects negative amount', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({ ...validExpense, amount: -50 });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('amount must be a positive number');
  });

  test('POST /api/expenses - rejects invalid category', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({ ...validExpense, category: 'Shopping' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toMatch(/category must be one of/);
  });

  test('GET /api/expenses - returns array sorted newest first', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length >= 2) {
      const dates = res.body.map((e) => new Date(e.date).getTime());
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
      }
    }
  });

  test('GET /api/expenses?category=Food - filters by category', async () => {
    const res = await request(app).get('/api/expenses?category=Food');
    expect(res.status).toBe(200);
    res.body.forEach((e) => expect(e.category).toBe('Food'));
  });

  test('PUT /api/expenses/:id - updates an existing expense', async () => {
    if (!createdId) return;
    const res = await request(app)
      .put(`/api/expenses/${createdId}`)
      .send({ ...validExpense, amount: 300 });
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(300);
  });

  test('DELETE /api/expenses/:id - deletes an expense', async () => {
    if (!createdId) return;
    const del = await request(app).delete(`/api/expenses/${createdId}`);
    expect(del.status).toBe(204);
    const get = await request(app).get(`/api/expenses/${createdId}`);
    expect(get.status).toBe(404);
  });

  test('GET /api/expenses/summary - returns summary data', async () => {
    const res = await request(app).get('/api/expenses/summary');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalThisMonth');
    expect(res.body).toHaveProperty('byCategory');
    expect(res.body.byCategory).toHaveProperty('Food');
  });
});
