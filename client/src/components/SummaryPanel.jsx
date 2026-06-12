import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, CATEGORY_COLORS } from '../utils/format';

function StatCard({ label, value }) {
  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius)',
      padding: '14px 16px',
      flex: '1',
      minWidth: '140px',
    }}>
      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text)' }}>{value}</p>
    </div>
  );
}

export default function SummaryPanel({ summary }) {
  if (!summary) return null;

  const { totalThisMonth, byCategory, highest } = summary;

  const chartData = Object.entries(byCategory)
    .filter(([, val]) => val > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>This month's summary</h2>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <StatCard label="Total spent" value={formatCurrency(totalThisMonth)} />
        <StatCard
          label="Highest expense"
          value={highest ? formatCurrency(highest.amount) : '—'}
        />
        {highest && (
          <StatCard label="Biggest category" value={highest.category} />
        )}
      </div>

      {chartData.length > 0 ? (
        <div style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] || '#94a3b8'}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend
                formatter={(value) => (
                  <span style={{ fontSize: '13px', color: 'var(--color-text)' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          No expenses this month yet.
        </p>
      )}
    </div>
  );
}
