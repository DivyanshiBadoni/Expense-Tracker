import { useState } from 'react';
import { useExpenses } from './hooks/useExpenses';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryPanel from './components/SummaryPanel';
import FilterBar from './components/FilterBar';
import './App.css';

const DEFAULT_FILTERS = {
  category: 'All',
  preset: 'all',
  startDate: '',
  endDate: '',
};

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [formLoading, setFormLoading] = useState(false);
  const { expenses, summary, loading, error, addExpense, editExpense, removeExpense } =
    useExpenses(filters);

  async function handleAdd(data) {
    setFormLoading(true);
    try {
      await addExpense(data);
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div>
            <h1 style={{ fontSize: '22px' }}>Expense Tracker</h1>
            <p style={{ fontSize: '13px', color: '#a5b4fc', marginTop: '2px' }}>
              Track your daily spending
            </p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="layout-grid">
          <aside className="sidebar">
            <div className="card" style={{ padding: '20px' }}>
              <h2 style={{ fontSize: '15px', marginBottom: '16px' }}>Add expense</h2>
              <ExpenseForm onSubmit={handleAdd} loading={formLoading} />
            </div>
          </aside>

          <section className="content">
            {error && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius)',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                marginBottom: '16px',
                fontSize: '14px',
              }}>
                {error}
              </div>
            )}

            <SummaryPanel summary={summary} />

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '15px' }}>
                  Expenses
                  {!loading && (
                    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: '6px' }}>
                      ({expenses.length} result{expenses.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </h2>
              </div>

              <FilterBar filters={filters} onFiltersChange={setFilters} />

              <div style={{ marginTop: '20px' }}>
                <ExpenseList
                  expenses={expenses}
                  onEdit={editExpense}
                  onDelete={removeExpense}
                  loading={loading}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
