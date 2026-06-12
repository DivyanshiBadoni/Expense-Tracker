import { CATEGORIES, getMonthRange, getLastMonthRange, todayISO } from '../utils/format';

const DATE_PRESETS = [
  { label: 'All time', value: 'all' },
  { label: 'This month', value: 'this_month' },
  { label: 'Last month', value: 'last_month' },
  { label: 'Custom', value: 'custom' },
];

export default function FilterBar({ filters, onFiltersChange }) {
  function handlePreset(preset) {
    if (preset === 'all') {
      onFiltersChange({ ...filters, preset, startDate: '', endDate: '' });
    } else if (preset === 'this_month') {
      const { startDate, endDate } = getMonthRange();
      onFiltersChange({ ...filters, preset, startDate, endDate });
    } else if (preset === 'last_month') {
      const { startDate, endDate } = getLastMonthRange();
      onFiltersChange({ ...filters, preset, startDate, endDate });
    } else {
      onFiltersChange({ ...filters, preset });
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
      <div style={{ minWidth: '140px' }}>
        <label htmlFor="filter-category">Category</label>
        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label>Date range</label>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {DATE_PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => handlePreset(p.value)}
              style={{
                padding: '7px 12px',
                fontSize: '13px',
                background: filters.preset === p.value ? 'var(--color-primary)' : 'var(--color-surface)',
                color: filters.preset === p.value ? 'white' : 'var(--color-text)',
                border: `1px solid ${filters.preset === p.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {filters.preset === 'custom' && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label htmlFor="start-date">From</label>
            <input
              id="start-date"
              type="date"
              max={todayISO()}
              value={filters.startDate}
              onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
              style={{ width: '150px' }}
            />
          </div>
          <div>
            <label htmlFor="end-date">To</label>
            <input
              id="end-date"
              type="date"
              max={todayISO()}
              value={filters.endDate}
              onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
              style={{ width: '150px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
