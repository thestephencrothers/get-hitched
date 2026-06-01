import { useState } from 'react';
import { useSheetData } from '../hooks/useSheetData';

const CATEGORY_COLORS = {
  'Parents': { bg: '#E1F5EE', color: '#0F6E56' },
  'Sibling': { bg: '#E6F1FB', color: '#185FA5' },
  'Aunty Uncle': { bg: '#FAEEDA', color: '#854F0B' },
  'Cousin': { bg: '#EEEDFE', color: '#534AB7' },
  'Friends': { bg: '#FAECE7', color: '#993C1D' },
};

function Badge({ label }) {
  if (!label) return null;
  const style = CATEGORY_COLORS[label] || { bg: '#f0f0f0', color: '#666' };
  return (
    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: style.bg, color: style.color, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

function formatNames(row) {
  const first = row[0] || '';
  const second = row[1];
  const surname = row[3] || '';
  if (!second || second === '') return `${first} ${surname}`.trim();
  if (second === '1') return `${first} ${surname} +1`;
  return `${first} & ${second} ${surname}`.trim();
}

export default function GuestList() {
  const { data: rows, loading } = useSheetData('Guest List', 'A1:K150');
  const [filter, setFilter] = useState('All');

  if (loading) return <div style={{ padding: '2rem', color: '#888', fontSize: 14 }}>Loading guest list...</div>;

  const allRows = (rows || []).slice(7);

const guests = allRows.filter(row => row[0] && row[3] && (row[5] === 'Laura' || row[5] === 'Stephen' || row[5] === 'Shared'));
  const filtered = filter === 'All' ? guests : guests.filter(r => r[5] === filter);

  const stats = {
    total: guests.length,
    laura: guests.filter(r => r[5] === 'Laura').length,
    stephen: guests.filter(r => r[5] === 'Stephen').length,
    shared: guests.filter(r => !r[5] || r[5] === '').length,
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
        {[
          { label: 'Total families', value: stats.total },
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

      <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
{['All', 'Laura', 'Stephen', 'Shared'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? '#1a1a1a' : 'transparent',
              color: filter === f ? '#fff' : '#666',
              border: '0.5px solid rgba(0,0,0,0.15)',
              borderRadius: 6, padding: '4px 14px', fontSize: 12,
              cursor: 'pointer'
            }}>{f}</button>
          ))}
        </div>

        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.1)' }}>
              {['Name(s)', 'Category', 'Side', 'Kids'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 8px 10px 0', color: '#888', fontWeight: 400, fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                <td style={{ padding: '9px 8px 9px 0' }}>{formatNames(row)}</td>
                <td style={{ padding: '9px 8px' }}><Badge label={row[4]} /></td>
                <td style={{ padding: '9px 8px', color: row[5] === 'Laura' ? '#185FA5' : '#0F6E56', fontSize: 12 }}>{row[5]}</td>
                <td style={{ padding: '9px 0', color: '#888' }}>{row[2] || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}