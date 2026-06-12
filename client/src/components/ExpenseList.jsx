import { useState } from 'react';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../utils/format';
import ExpenseForm from './ExpenseForm';

function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] || '#64748b';
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 500,
      background: `${color}18`,
      color: color,
      border: `1px solid ${color}30`,
    }}>
      {category}
    </span>
  );
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 24px',
      color: 'var(--color-text-muted)',
    }}>
      <p style={{ fontSize: '36px', marginBottom: '12px' }}>💸</p>
      <p style={{ fontWeight: 500, marginBottom: '6px' }}>No expenses found</p>
      <p style={{ fontSize: '13px' }}>Add your first expense using the form above.</p>
    </div>
  );
}

export default function ExpenseList({ expenses, onEdit, onDelete, loading }) {
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function handleEdit(id, data) {
    setActionLoading(true);
    try {
      await onEdit(id, data);
      setEditingId(null);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(id) {
    setActionLoading(true);
    try {
      await onDelete(id);
      setConfirmDeleteId(null);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading expenses…
      </div>
    );
  }

  if (expenses.length === 0) return <EmptyState />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {expenses.map((expense) => (
        <div key={expense.id}>
          {editingId === expense.id ? (
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '14px', color: 'var(--color-text-muted)' }}>
                Edit expense
              </h3>
              <ExpenseForm
                initial={{
                  amount: String(expense.amount),
                  category: expense.category,
                  date: expense.date,
                  note: expense.note,
                }}
                onSubmit={(data) => handleEdit(expense.id, data)}
                onCancel={() => setEditingId(null)}
                loading={actionLoading}
              />
            </div>
          ) : confirmDeleteId === expense.id ? (
            <div className="card" style={{
              padding: '16px',
              border: '1px solid #fecaca',
              background: '#fff5f5',
            }}>
              <p style={{ marginBottom: '12px', fontSize: '14px' }}>
                Delete <strong>{formatCurrency(expense.amount)}</strong> on {formatDate(expense.date)}?
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-danger" onClick={() => handleDelete(expense.id)} disabled={actionLoading}>
                  {actionLoading ? 'Deleting…' : 'Yes, delete'}
                </button>
                <button className="btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="card" style={{
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>
                    {formatCurrency(expense.amount)}
                  </span>
                  <CategoryBadge category={expense.category} />
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  {formatDate(expense.date)}
                  {expense.note && (
                    <span> · {expense.note}</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                  onClick={() => setEditingId(expense.id)}
                >
                  Edit
                </button>
                <button
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    background: 'transparent',
                    color: 'var(--color-danger)',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius)',
                  }}
                  onClick={() => setConfirmDeleteId(expense.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
