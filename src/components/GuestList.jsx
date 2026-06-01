import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useSheetData } from '../hooks/useSheetData';

const SIDE_COLORS = {
  'Laura': '#185FA5',
  'Stephen': '#0F6E56',
  'Shared': '#854F0B',
};

const RELATIONSHIP_COLORS = {
  'Parents': { bg: '#E1F5EE', color: '#0F6E56' },
  'Sibling': { bg: '#E6F1FB', color: '#185FA5' },
  'Aunty Uncle': { bg: '#FAEEDA', color: '#854F0B' },
  'Cousin': { bg: '#EEEDFE', color: '#534AB7' },
  'Friends': { bg: '#FAECE7', color: '#993C1D' },
};

const STATUS_COLORS = {
  'Invited': { bg: '#E6F1FB', color: '#185FA5' },
  'Confirmed': { bg: '#E1F5EE', color: '#0F6E56' },
  'Declined': { bg: '#FCEBEB', color: '#A32D2D' },
  'To discuss': { bg: '#FAEEDA', color: '#854F0B' },
};

function Badge({ label, type }) {
  const map = type === 'status' ? STATUS_COLORS : RELATIONSHIP_COLORS;
  if (!label) return null;
  const style = map[label] || { bg: '#f0f0f0', color: '#666' };
  return (
    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: style.bg, color: style.color, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

function formatNames(row) {
  const first = (row[0] || '').trim();
  const second = (row[1] || '').trim();
  const surname = (row[3] || '').trim();
  if (!second) return `${first} ${surname}`.trim();
  if (second === '1') return `${first} ${surname} +1`;
  return `${first} & ${second} ${surname}`.trim();
}

function Card({ title, children }) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
      {title && <div style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem' }}>{title}</div>}
      {children}
    </div>
  );
}

export default function GuestList() {
  const { data: rows, loading } = useSheetData('Guest List', 'A1:H150');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  if (loading) return <div style={{ padding: '2rem', color: '#888', fontSize: 14 }}>Loading guest list...</div>;

  const guests = (rows || []).slice(7).filter(row =>
    row[0] && row[3] && (row[5] === 'Laura' || row[5] === 'Stephen' || row[5] === 'Shared')
  );

  const filtered = guests
     .filter(r => filter === 'All' || (filter === 'Kids' ? parseInt(r[2]) > 0 : r[5] === filter))
    .filter(r => {
      if (!search) return true;
      const name = formatNames(r).toLowerCase();
      return name.includes(search.toLowerCase());
    });

  const countGuests = (list) => list.reduce((acc, r) => {
    const adults = 1 + (r[1] ? 1 : 0);
    const kids = parseInt(r[2]) || 0;
    return { adults: acc.adults + adults, kids: acc.kids + kids };
  }, { adults: 0, kids: 0 });

const stats = {
  families: guests.length,
  laura: guests.filter(r => r[5] === 'Laura').length,
  stephen: guests.filter(r => r[5] === 'Stephen').length,
  shared: guests.filter(r => r[5] === 'Shared').length,
  ...countGuests(guests),
};

  const byRelationship = Object.entries(
    guests.reduce((acc, r) => {
      const rel = r[4] || 'Other';
      acc[rel] = (acc[rel] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const bySide = [
    { name: "Laura's", value: stats.laura, color: '#378ADD' },
    { name: "Stephen's", value: stats.stephen, color: '#1D9E75' },
    { name: 'Shared', value: stats.shared, color: '#BA7517' },
  ];

  const statusCounts = guests.reduce((acc, r) => {
    const s = (r[6] || '').trim() || 'Not set';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 10 }}>
  {[
    { label: 'Total guests', value: stats.adults + stats.kids },
    { label: 'Total adults', value: stats.adults, color: '#185FA5' },
    { label: 'Total children', value: stats.kids, color: '#0F6E56' },
    { label: 'Total families', value: stats.families, color: '#854F0B' },
  ].map(m => (
    <div key={m.label} style={{ background: '#eeede9', borderRadius: 8, padding: '14px 16px' }}>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{m.label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: m.color || '#1a1a1a' }}>{m.value}</div>
    </div>
  ))}
</div>

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: '1.5rem' }}>
  {[
    { label: "Laura's side", value: stats.laura, color: '#185FA5' },
    { label: "Stephen's side", value: stats.stephen, color: '#0F6E56' },
    { label: 'Shared', value: stats.shared, color: '#854F0B' },
  ].map(m => (
    <div key={m.label} style={{ background: '#eeede9', borderRadius: 8, padding: '14px 16px' }}>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{m.label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: m.color || '#1a1a1a' }}>{m.value}</div>
    </div>
  ))}
</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <Card title="Guests by relationship">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={byRelationship} layout="vertical" margin={{ left: 10, right: 10 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#378ADD" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Split by side">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={bySide} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                {bySide.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {Object.keys(statusCounts).length > 1 && (
        <Card title="Invite status">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} style={{ background: '#eeede9', borderRadius: 8, padding: '10px 16px', minWidth: 100 }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>{status}</div>
                <div style={{ fontSize: 20, fontWeight: 500 }}>{count}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            placeholder="Search guests..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: 13, padding: '6px 12px', borderRadius: 6, border: '0.5px solid rgba(0,0,0,0.15)', flex: 1, minWidth: 160 }}
          />
          {['All', 'Laura', 'Stephen', 'Shared', 'Kids'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? '#1a1a1a' : 'transparent',
              color: filter === f ? '#fff' : '#666',
              border: '0.5px solid rgba(0,0,0,0.15)',
              borderRadius: 6, padding: '4px 14px', fontSize: 12, cursor: 'pointer'
            }}>{f}</button>
          ))}
        </div>

        <div style={{ fontSize: 12, color: '#aaa', marginBottom: 12 }}>{filtered.length} families</div>

        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.1)' }}>
              {['Name(s)', 'Relationship', 'Side', 'Kids', 'Status', 'Comment'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 8px 10px 0', color: '#888', fontWeight: 400, fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                <td style={{ padding: '9px 8px 9px 0' }}>{formatNames(row)}</td>
                <td style={{ padding: '9px 8px' }}><Badge label={row[4]} type="relationship" /></td>
                <td style={{ padding: '9px 8px', color: SIDE_COLORS[row[5]] || '#666', fontSize: 12 }}>{row[5]}</td>
                <td style={{ padding: '9px 8px', color: '#888' }}>{row[2] || '—'}</td>
                <td style={{ padding: '9px 8px' }}><Badge label={(row[6] || '').trim()} type="status" /></td>
                <td style={{ padding: '9px 0', color: '#888', fontSize: 12 }}>{row[7] || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
} 