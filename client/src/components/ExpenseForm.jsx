import { useState, useEffect } from 'react';
import { CATEGORIES, todayISO } from '../utils/format';

const EMPTY_FORM = {
  amount: '',
  category: '',
  date: todayISO(),
  note: '',
};

function validate(fields) {
  const errors = {};
  if (!fields.amount || isNaN(fields.amount) || Number(fields.amount) <= 0) {
    errors.amount = 'Enter a valid positive amount';
  }
  if (!fields.category) {
    errors.category = 'Select a category';
  }
  if (!fields.date) {
    errors.date = 'Date is required';
  } else if (fields.date > todayISO()) {
    errors.date = 'Date cannot be in the future';
  }
  return errors;
}

export default function ExpenseForm({ initial, onSubmit, onCancel, loading }) {
  const [fields, setFields] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) setFields(initial);
  }, [initial]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await onSubmit({ ...fields, amount: parseFloat(fields.amount) });
      setFields(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      setErrors({ submit: err.message });
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <label htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={fields.amount}
            onChange={handleChange}
            className={errors.amount ? 'error' : ''}
          />
          {errors.amount && <p className="error-text">{errors.amount}</p>}
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={fields.category}
            onChange={handleChange}
            className={errors.category ? 'error' : ''}
          >
            <option value="">Select…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="error-text">{errors.category}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          max={todayISO()}
          value={fields.date}
          onChange={handleChange}
          className={errors.date ? 'error' : ''}
        />
        {errors.date && <p className="error-text">{errors.date}</p>}
      </div>

      <div>
        <label htmlFor="note">Note (optional)</label>
        <input
          id="note"
          name="note"
          type="text"
          placeholder="e.g. Dinner with friends"
          value={fields.note}
          onChange={handleChange}
        />
      </div>

      {errors.submit && (
        <p className="error-text" style={{ textAlign: 'center' }}>{errors.submit}</p>
      )}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : initial ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
