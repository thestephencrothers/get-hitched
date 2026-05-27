import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const costs = {
  total: 45746,
  paid: 2950,
  remaining: 42796,
  savings: 14400,
  gap: 28396,
  categories: [
    { name: 'Pre-reception', amount: 19960, color: '#378ADD' },
    { name: 'Reception', amount: 25786, color: '#1D9E75' },
    { name: 'Post-reception', amount: 0, color: '#D85A30' },
  ],
  deposits: [
    { name: 'Florist (By Charlotte)', amount: 150 },
    { name: 'Alterations (Kelly Black)', amount: 100 },
    { name: 'Video (J Donovan)', amount: 300 },
    { name: 'Photographer (Harpers)', amount: 400 },
    { name: 'Venue', amount: 1000 },
    { name: 'Meal (gold package)', amount: 1000 },
  ],
};

const savingsData = [
  { month: 'Feb', sPlanned: 800, sActual: 800, lPlanned: 400, lActual: 477 },
  { month: 'Mar', sPlanned: 800, sActual: 800, lPlanned: 400, lActual: 973 },
  { month: 'Apr', sPlanned: 800, sActual: 800, lPlanned: 400, lActual: 550 },
  { month: 'May', sPlanned: 800, sActual: null, lPlanned: 400, lActual: null },
  { month: 'Jun', sPlanned: 800, sActual: null, lPlanned: 400, lActual: null },
  { month: 'Jul', sPlanned: 800, sActual: null, lPlanned: 400, lActual: null },
  { month: 'Aug', sPlanned: 800, sActual: null, lPlanned: 400, lActual: null },
  { month: 'Sep', sPlanned: 800, sActual: null, lPlanned: 400, lActual: null },
  { month: 'Oct', sPlanned: 800, sActual: null, lPlanned: 400, lActual: null },
  { month: 'Nov', sPlanned: 800, sActual: null, lPlanned: 400, lActual: null },
  { month: 'Dec', sPlanned: 6800, sActual: null, lPlanned: 400, lActual: null },
  { month: 'Jan', sPlanned: 800, sActual: null, lPlanned: 400, lActual: null },
];

const actions = [
  { text: 'Decide on Ballyness wine vs corkage', owner: 'Stephen', status: 'todo' },
  { text: 'Grazing table vs canapés vs scones', owner: 'Laura', status: 'todo' },
  { text: 'Review guest list for accurate numbers', owner: 'Stephen', status: 'todo' },
  { text: 'Email Arbutus for cake quote', owner: 'Stephen', status: 'todo' },
  { text: 'Figure out church singer', owner: '—', status: 'todo' },
  { text: 'Confirm church', owner: 'Laura', status: 'done' },
];

const fmt = (n) => `£${n.toLocaleString()}`;

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
  const pct = Math.round((amount / total) * 100);
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

export default function Dashboard() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
        <MetricCard label="Total budget" value={fmt(costs.total)} sub="across all categories" />
        <MetricCard label="Total paid" value={fmt(costs.paid)} sub="6.4% of budget" color="#BA7517" />
        <MetricCard label="Still to pay" value={fmt(costs.remaining)} sub="remaining" color="#A32D2D" />
        <MetricCard label="Savings so far" value={fmt(costs.savings)} sub="starting + contributions" color="#0F6E56" />
        <MetricCard label="Savings gap" value={fmt(costs.gap)} sub="still to save" color="#BA7517" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <Card title="Spend by category" icon="🧾">
          {costs.categories.map(c => (
            <ProgressBar key={c.name} name={c.name} amount={c.amount} total={costs.total} color={c.color} />
          ))}
          <ProgressBar name="Deposits paid" amount={costs.paid} total={costs.total} color="#BA7517" />
        </Card>

        <Card title="Savings progress" icon="🐷">
          <ProgressBar name="Projected total" amount={40000} total={costs.gap + 40000} color="#378ADD" />
          <ProgressBar name="Actual so far" amount={costs.savings} total={costs.gap + costs.savings} color="#1D9E75" />
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '0.5px solid rgba(0,0,0,0.07)' }}>
            <Row label="Stephen target" value="£22,000" />
            <Row label="Laura target" value="£8,000" />
            <Row label="Stephen actual" value="£2,400" valueColor="#0F6E56" />
            <Row label="Laura actual" value="£2,000" valueColor="#0F6E56" />
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
          <BarChart data={savingsData} margin={{ top: 0, right: 0, bottom: 0, left: 10 }}>
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
          {costs.deposits.map((d, i) => (
            <Row key={i} label={d.name} value={fmt(d.amount)} />
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '0.5px solid rgba(0,0,0,0.1)', fontSize: 13, fontWeight: 500 }}>
            <span>Total paid</span>
            <span style={{ color: '#0F6E56' }}>{fmt(costs.paid)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}