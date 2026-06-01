import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSheetData } from '../hooks/useSheetData';

const parseNum = (val) => parseFloat((val || '').toString().replace(/[£,]/g, '')) || 0;

const fmt = (n) => `£${Number(n).toLocaleString()}`;

function MetricCard({ label, value, sub, color }) {
  return (
    <div style={{ background: '#eeede9', borderRadius: 8, padding: '14px 16px' }}>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: color || '#1a1a1a' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ name, amount, total, color }) {
  const pct = total > 0 ? Math.min(Math.round((amount / total) * 100), 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13 }}>{name}</span>
        <span style={{ fontSize: 12, color: '#888' }}>{fmt(amount)}</span>
      </div>
      <div style={{ height: 6, background: '#e8e7e3', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function Card({ title, icon, children }) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.07)', fontSize: 13 }}>
      <span style={{ color: '#666' }}>{label}</span>
      <span style={{ fontWeight: 500, color: valueColor || '#1a1a1a' }}>{value}</span>
    </div>
  );
}

function parseSavings(rows) {
  if (!rows || rows.length < 3) return { chartData: [], stephen: { target: 22000, actual: 0 }, laura: { target: 8000, actual: 0 } };

  const chartData = [];
  let stephenActual = 0;
  let lauraActual = 0;

  rows.slice(3).forEach(row => {
    const month = row[2];
    const sPlanned = parseNum(row[3]);
    const lPlanned = parseNum(row[4]);
    const sActual = parseNum(row[6]) || null;
    const lActual = parseNum(row[7]) || null;
    if (!month) return;

    if (sActual) stephenActual += sActual;
    if (lActual) lauraActual += lActual;

    chartData.push({ month: month.slice(0, 3), sPlanned, lPlanned, sActual, lActual });
  });

  return { chartData, stephen: { target: 22000, actual: stephenActual }, laura: { target: 8000, actual: lauraActual } };
}

function parseCosts(rows) {
  if (!rows || rows.length < 3) return { total: 0, paid: 0, deposits: [] };

  const total = parseNum(rows[1]?.[2]);
  const paid = parseNum(rows[2]?.[5]);

  const deposits = [];
  rows.slice(9).forEach(row => {
    const name = row[1]; 
    const deposit = parseNum(row[7]);
    if (name && deposit && name !== 'Cost Type') {
      deposits.push({ name, amount: deposit });
    }
  });

  return { total: Math.round(total), paid: Math.round(paid), deposits };
}

export default function Dashboard() {
  const { data: savingsRows, loading: savingsLoading } = useSheetData('Saving', 'A1:L30');
  const { data: costsRows, loading: costsLoading } = useSheetData('Costs', 'A1:H100');
  const { data: actionsRows, loading: actionsLoading } = useSheetData('Actions Tracker', 'A1:E50');

  console.log('savings rows:', savingsRows);
  console.log('costs rows:', costsRows);

  if (savingsLoading || costsLoading || actionsLoading) {
    return <div style={{ padding: '2rem', color: '#888', fontSize: 14 }}>Loading your data...</div>;
  }

  const { chartData, stephen, laura } = parseSavings(savingsRows);
  const { total, paid, deposits } = parseCosts(costsRows);
  const remaining = total - paid;
  const savingsTotal = 10000 + stephen.actual + laura.actual;
  const gap = total - savingsTotal;

  const actions = (actionsRows || []).slice(1)
    .filter(row => row[1])
    .map(row => ({ text: row[1], owner: row[2] || '—', status: (row[3] || '').toLowerCase().includes('done') ? 'done' : 'todo' }))
    .slice(0, 8);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
        <MetricCard label="Total budget" value={fmt(total)} sub="across all categories" />
        <MetricCard label="Total paid" value={fmt(paid)} sub={`${Math.round((paid/total)*100)}% of budget`} color="#BA7517" />
        <MetricCard label="Still to pay" value={fmt(remaining)} sub="remaining" color="#A32D2D" />
        <MetricCard label="Savings so far" value={fmt(savingsTotal)} sub="starting + contributions" color="#0F6E56" />
        <MetricCard label="Savings gap" value={fmt(Math.max(gap, 0))} sub="still to save" color="#BA7517" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <Card title="Spend by category" icon="🧾">
          <ProgressBar name="Total budgeted" amount={total} total={total} color="#378ADD" />
          <ProgressBar name="Deposits paid" amount={paid} total={total} color="#BA7517" />
          <ProgressBar name="Savings vs budget" amount={savingsTotal} total={total} color="#1D9E75" />
        </Card>

        <Card title="Savings progress" icon="🐷">
          <ProgressBar name="Projected total" amount={40000} total={total} color="#378ADD" />
          <ProgressBar name="Actual so far" amount={savingsTotal} total={total} color="#1D9E75" />
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '0.5px solid rgba(0,0,0,0.07)' }}>
            <Row label="Stephen target" value={fmt(stephen.target)} />
            <Row label="Laura target" value={fmt(laura.target)} />
            <Row label="Stephen actual" value={fmt(stephen.actual)} valueColor="#0F6E56" />
            <Row label="Laura actual" value={fmt(laura.actual)} valueColor="#0F6E56" />
          </div>
        </Card>
      </div>

      <Card title="Monthly savings — planned vs actual" icon="📊">
        <div style={{ display: 'flex', gap: 16, marginBottom: 10, fontSize: 12, color: '#888', flexWrap: 'wrap' }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#378ADD', borderRadius: 2, marginRight: 5 }}></span>Stephen planned</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#B5D4F4', borderRadius: 2, marginRight: 5 }}></span>Stephen actual</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#1D9E75', borderRadius: 2, marginRight: 5 }}></span>Laura planned</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#9FE1CB', borderRadius: 2, marginRight: 5 }}></span>Laura actual</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 10 }}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `£${v}`} />
            <Tooltip formatter={(v, n) => [fmt(v), n]} />
            <Bar dataKey="sPlanned" fill="#378ADD" radius={[2,2,0,0]} />
            <Bar dataKey="sActual" fill="#B5D4F4" radius={[2,2,0,0]} />
            <Bar dataKey="lPlanned" fill="#1D9E75" radius={[2,2,0,0]} />
            <Bar dataKey="lActual" fill="#9FE1CB" radius={[2,2,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Card title="Open actions" icon="✅">
          {actions.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: i < actions.length - 1 ? '0.5px solid rgba(0,0,0,0.07)' : 'none' }}>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap', background: a.status === 'done' ? '#E1F5EE' : '#FAEEDA', color: a.status === 'done' ? '#0F6E56' : '#854F0B' }}>
                {a.status === 'done' ? 'Done' : 'To do'}
              </span>
              <div>
                <div style={{ fontSize: 13 }}>{a.text}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{a.owner}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card title="Deposits paid" icon="💳">
          {deposits.map((d, i) => (
            <Row key={i} label={d.name} value={fmt(d.amount)} />
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '0.5px solid rgba(0,0,0,0.1)', fontSize: 13, fontWeight: 500 }}>
            <span>Total paid</span>
            <span style={{ color: '#0F6E56' }}>{fmt(paid)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}