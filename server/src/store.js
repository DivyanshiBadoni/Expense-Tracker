const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/expenses.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
}

function load() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function save(expenses) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
}

let store = load();

function getAll() {
  return [...store];
}

function getById(id) {
  return store.find((e) => e.id === id) || null;
}

function create(expense) {
  store.push(expense);
  save(store);
  return expense;
}

function update(id, updates) {
  const index = store.findIndex((e) => e.id === id);
  if (index === -1) return null;
  store[index] = { ...store[index], ...updates };
  save(store);
  return store[index];
}

function remove(id) {
  const index = store.findIndex((e) => e.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  save(store);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
