const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store');

const router = express.Router();

const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

function validateExpense(body) {
  const errors = [];

  const amount = parseFloat(body.amount);
  if (isNaN(amount) || amount <= 0) {
    errors.push('amount must be a positive number');
  }

  if (!body.category || !VALID_CATEGORIES.includes(body.category)) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (!body.date) {
    errors.push('date is required');
  } else {
    const inputDate = new Date(body.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (isNaN(inputDate.getTime())) {
      errors.push('date is invalid');
    } else if (inputDate > today) {
      errors.push('date cannot be in the future');
    }
  }

  return errors;
}

// GET /api/expenses
// Query params: category, startDate, endDate
router.get('/', (req, res) => {
  let expenses = store.getAll();

  const { category, startDate, endDate } = req.query;

  if (category && category !== 'All') {
    expenses = expenses.filter((e) => e.category === category);
  }

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    expenses = expenses.filter((e) => new Date(e.date) >= start);
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    expenses = expenses.filter((e) => new Date(e.date) <= end);
  }

  expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(expenses);
});

// GET /api/expenses/summary
router.get('/summary', (req, res) => {
  const all = store.getAll();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonth = all.filter((e) => new Date(e.date) >= monthStart);
  const totalThisMonth = thisMonth.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = {};
  VALID_CATEGORIES.forEach((cat) => {
    byCategory[cat] = 0;
  });
  thisMonth.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });

  const highest = all.reduce(
    (max, e) => (e.amount > (max?.amount || 0) ? e : max),
    null
  );

  res.json({ totalThisMonth, byCategory, highest });
});

// GET /api/expenses/:id
router.get('/:id', (req, res) => {
  const expense = store.getById(req.params.id);
  if (!expense) return res.status(404).json({ error: 'Expense not found' });
  res.json(expense);
});

// POST /api/expenses
router.post('/', (req, res) => {
  const errors = validateExpense(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const expense = {
    id: uuidv4(),
    amount: parseFloat(req.body.amount),
    category: req.body.category,
    date: req.body.date,
    note: req.body.note?.trim() || '',
    createdAt: new Date().toISOString(),
  };

  const created = store.create(expense);
  res.status(201).json(created);
});

// PUT /api/expenses/:id
router.put('/:id', (req, res) => {
  const existing = store.getById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Expense not found' });

  const errors = validateExpense(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const updated = store.update(req.params.id, {
    amount: parseFloat(req.body.amount),
    category: req.body.category,
    date: req.body.date,
    note: req.body.note?.trim() || '',
  });

  res.json(updated);
});

// DELETE /api/expenses/:id
router.delete('/:id', (req, res) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Expense not found' });
  res.status(204).send();
});

module.exports = router;
