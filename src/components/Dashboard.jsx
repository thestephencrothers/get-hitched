import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSheetData } from '../hooks/useSheetData';

const parseNum = (val) => parseFloat((val || '').toString().replace(/[£,]/g, '')) || 0;
const fmt = (n) => `£${Number(n).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
const pct = (a, b) => b > 0 ? Math.min(Math.round((a / b) * 100), 100) : 0;

function MetricCard({ label, value, sub, color }) {
  return (
    <div style={{ background: '#eeede9', borderRadius: 8, padding: '14px 16px' }}>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: color || '#1a1a1a' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ label, value, total, color, showPct }) {
  const p = pct(value, total);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13 }}>{label}</span>
        <span style={{ fontSize: 12, color: '#888' }}>{fmt(value)}{showPct ? ` (${p}%)` : ''}</span>
      </div>
      <div style={{ height: 6, background: '#e8e7e3', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${p}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function Card({ title, icon, children, noPad }) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: noPad ? 0 : '1.25rem', marginBottom: '1rem', overflow: 'hidden' }}>
      {title && (
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: noPad ? 0 : '1rem', display: 'flex', alignItems: 'center', gap: 8, padding: noPad ? '1.25rem 1.25rem 1rem' : 0 }}>
          {icon} {title}
        </div>
      )}
      {children}
    </div>
  );
}

function PersonSavings({ name, actual, target, projected, color }) {
  const onTrack = actual >= projected;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{name}</span>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: onTrack ? '#E1F5EE' : '#FAEEDA', color: onTrack ? '#0F6E56' : '#854F0B' }}>
          {onTrack ? 'On track' : 'Behind'}
        </span>
      </div>
      <ProgressBar label="Saved vs target" value={actual} total={target} color={color} showPct />
      <ProgressBar label="Saved vs projected to date" value={actual} total={projected} color={color} showPct />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 8 }}>
        {[
          { label: 'Target', value: fmt(target) },
          { label: 'Saved', value: fmt(actual) },
          { label: 'Remaining', value: fmt(Math.round(target - actual)) },
        ].map(m => (
          <div key={m.label} style={{ background: '#f5f4f0', borderRadius: 6, padding: '8px 10px' }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CostsTable({ title, items }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: '#f5f4f0', border: 'none',
        borderBottom: '0.5px solid rgba(0,0,0,0.1)',
        padding: '10px 1.25rem', textAlign: 'left', fontSize: 13,
        fontWeight: 500, cursor: 'pointer',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        {title}
        <span style={{ fontSize: 11, color: '#888' }}>{open ? '▲ collapse' : '▼ expand'}</span>
      </button>
      {open && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafaf8' }}>
                {['Item', 'Detail', 'Qty', 'Unit Cost', 'Total', 'Deposit', 'Paid By'].map(h => (
                  <th key={h} style={{
                    padding: '8px 12px',
                    textAlign: h === 'Item' || h === 'Detail' ? 'left' : 'right',
                    color: '#888', fontWeight: 400,
                    borderBottom: '0.5px solid rgba(0,0,0,0.08)',
                    whiteSpace: 'nowrap'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row, i) => (
                <tr key={i} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.05)', background: i % 2 === 0 ? '#fff' : '#fdfdf9' }}>
                  <td style={{ padding: '8px 12px', color: '#1a1a1a' }}>{row.name}</td>
                  <td style={{ padding: '8px 12px', color: '#888', fontStyle: 'italic' }}>{row.detail}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#888' }}>{row.qty || '—'}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#888' }}>{row.unitCost ? fmt(row.unitCost) : '—'}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 500 }}>{row.total ? fmt(row.total) : '—'}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: row.deposit ? '#0F6E56' : '#ccc' }}>{row.deposit ? fmt(row.deposit) : '—'}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#888' }}>{row.paidBy || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function parseSavings(rows) {
  if (!rows || rows.length < 3) return { chartData: [], stephen: { target: 27500, actual: 0 }, laura: { target: 12500, actual: 0 }, goalTotal: 42795 };

  const goalTotal = parseNum(rows[2]?.[10]);
  const totalRow = rows.find(r => (r[2] || '').trim() === 'Total Each');
  const stephenActual = parseNum(totalRow?.[6]);
  const lauraActual = parseNum(totalRow?.[7]);

  const chartData = [];
  rows.slice(3).forEach(row => {
    const month = (row[2] || '').trim();
    const sPlanned = parseNum(row[3]);
    const lPlanned = parseNum(row[4]);
    const sActual = parseNum(row[6]) || null;
    const lActual = parseNum(row[7]) || null;
    if (!month || month === 'Total Each' || month === 'Total') return;
    chartData.push({ month: month.slice(0, 3), sPlanned, lPlanned, sActual, lActual });
  });

  return {
    chartData,
    stephen: { target: 27500, actual: stephenActual },
    laura: { target: 12500, actual: lauraActual },
    goalTotal
  };
}

function parseCosts(rows) {
  if (!rows || rows.length < 5) return { total: 0, paid: 0, preReception: 0, reception: 0, postReception: 0, preItems: [], recItems: [], postItems: [] };

  const total = parseNum(rows[1]?.[2]);
  const paid = parseNum(rows[2]?.[5]);
  const preReception = parseNum(rows[2]?.[2]);
  const reception = parseNum(rows[3]?.[2]);
  const postReception = parseNum(rows[4]?.[2]);

  const parseItems = (startIdx) => {
    const items = [];
    for (let i = startIdx; i < rows.length; i++) {
      const row = rows[i];
      const name = (row[1] || '').trim();
      if (!name || name === 'Cost Type') continue;
      if (name.startsWith('Total')) break;
      items.push({
        name,
        detail: (row[2] || '').trim(),
        qty: row[3] || '',
        unitCost: parseNum(row[4]),
        total: parseNum(row[5]),
        deposit: parseNum(row[7]),
        paidBy: (row[8] || '').trim(),
      });
    }
    return items;
  };

  const preHeaderIdx = rows.findIndex((r, i) => i > 6 && (r[1] || '').trim() === 'Cost Type');
  const preItems = preHeaderIdx > 0 ? parseItems(preHeaderIdx + 1) : [];

  const recHeaderIdx = rows.findIndex((r, i) => i > preHeaderIdx + 1 && (r[1] || '').trim() === 'Cost Type');
  const recItems = recHeaderIdx > 0 ? parseItems(recHeaderIdx + 1) : [];

  const postHeaderIdx = rows.findIndex((r, i) => i > recHeaderIdx + 1 && (r[1] || '').trim() === 'Cost Type');
  const postItems = postHeaderIdx > 0 ? parseItems(postHeaderIdx + 1) : [];

  return { total, paid, preReception, reception, postReception, preItems, recItems, postItems };
}

export default function Dashboard() {
  const { data: savingsRows, loading: savingsLoading } = useSheetData('Saving', 'A1:L50');
  const { data: costsRows, loading: costsLoading } = useSheetData('Costs', 'A1:I90');

  if (savingsLoading || costsLoading) {
    return <div style={{ padding: '2rem', color: '#888', fontSize: 14 }}>Loading your data...</div>;
  }

  const { chartData, stephen, laura, goalTotal } = parseSavings(savingsRows);
  const { total, paid, preReception, reception, postReception, preItems, recItems, postItems } = parseCosts(costsRows);

  const stillToPay = total - paid;
  const totalSaved = stephen.actual + laura.actual;
  const stillToSave = Math.max(goalTotal - totalSaved, 0);
  const tickColor = 'rgba(0,0,0,0.4)';

  const startDate = new Date(2026, 1, 1);
  const now = new Date();
  const monthsElapsed = Math.max(1, (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth()));
  const stephenProjected = Math.round((stephen.target / 20) * monthsElapsed);
  const lauraProjected = Math.round((laura.target / 20) * monthsElapsed);

  const allDeposits = [...preItems, ...recItems, ...postItems].filter(d => d.deposit > 0);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
        <MetricCard label="Total cost" value={fmt(total)} sub="full wedding" />
        <MetricCard label="Total paid" value={fmt(paid)} sub={`${pct(paid, total)}% of total`} color="#BA7517" />
        <MetricCard label="Still to pay" value={fmt(stillToPay)} color="#A32D2D" />
        <MetricCard label="Saved to date" value={fmt(totalSaved)} sub="inc. initial savings" color="#0F6E56" />
        <MetricCard label="Still to save" value={fmt(stillToSave)} color="#BA7517" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <Card title="Spend by category" icon="🧾">
            <ProgressBar label="Pre-reception" value={preReception} total={total} color="#378ADD" showPct />
            <ProgressBar label="Reception" value={reception} total={total} color="#1D9E75" showPct />
            <ProgressBar label="Post-reception" value={postReception} total={total} color="#D85A30" showPct />
          </Card>

          <Card title="Deposits paid" icon="💳">
            {allDeposits.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.07)', fontSize: 13 }}>
                <div>
                  <div>{d.name}</div>
                  {d.detail && <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{d.detail}</div>}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  <div style={{ fontWeight: 500, color: '#0F6E56' }}>{fmt(d.deposit)}</div>
                  {d.paidBy && <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{d.paidBy}</div>}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '0.5px solid rgba(0,0,0,0.1)', fontSize: 13, fontWeight: 500 }}>
              <span>Total deposits paid</span>
              <span style={{ color: '#0F6E56' }}>{fmt(paid)}</span>
            </div>
          </Card>
        </div>

        <Card title="Savings breakdown" icon="🐷">
          <PersonSavings name="Stephen" actual={stephen.actual} target={stephen.target} projected={stephenProjected} color="#378ADD" />
          <PersonSavings name="Laura" actual={laura.actual} target={laura.target} projected={lauraProjected} color="#1D9E75" />
          <div style={{ paddingTop: 12, borderTop: '0.5px solid rgba(0,0,0,0.07)', fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#666' }}>Total saved</span>
              <span style={{ fontWeight: 500, color: '#0F6E56' }}>{fmt(totalSaved)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#666' }}>Still to save</span>
              <span style={{ fontWeight: 500, color: '#A32D2D' }}>{fmt(stillToSave)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#666' }}>Goal</span>
              <span style={{ fontWeight: 500 }}>{fmt(goalTotal)}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Monthly savings — planned vs actual" icon="📊">
        <div style={{ display: 'flex', gap: 16, marginBottom: 10, fontSize: 12, color: '#888', flexWrap: 'wrap' }}>
          {[
            { color: '#378ADD', label: 'Stephen planned' },
            { color: '#B5D4F4', label: 'Stephen actual' },
            { color: '#1D9E75', label: 'Laura planned' },
            { color: '#9FE1CB', label: 'Laura actual' },
          ].map(l => (
            <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, background: l.color, borderRadius: 2 }}></span>
              {l.label}
            </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 10 }}>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} />
            <YAxis tick={{ fontSize: 11, fill: tickColor }} tickFormatter={v => `£${v}`} />
            <Tooltip formatter={(v, n) => [fmt(v), n]} />
            <Bar dataKey="sPlanned" fill="#378ADD" radius={[2, 2, 0, 0]} />
            <Bar dataKey="sActual" fill="#B5D4F4" radius={[2, 2, 0, 0]} />
            <Bar dataKey="lPlanned" fill="#1D9E75" radius={[2, 2, 0, 0]} />
            <Bar dataKey="lActual" fill="#9FE1CB" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Full cost breakdown" icon="💰" noPad>
        <CostsTable title={`Pre-reception — ${fmt(preReception)}`} items={preItems} />
        <CostsTable title={`Reception — ${fmt(reception)}`} items={recItems} />
        <CostsTable title={`Post-reception — ${fmt(postReception)}`} items={postItems} />
      </Card>
    </div>
  );
}