import { useState } from 'react';
import Dashboard from '../components/Dashboard';
import GuestList from '../components/GuestList';

export default function Planner() {
  const [tab, setTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'guests', label: 'Guest List' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', padding: '2rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, marginBottom: 8 }}>
          Stephen & Laura
        </h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>Wedding planner</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 32, borderBottom: '0.5px solid rgba(0,0,0,0.1)', paddingBottom: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, padding: '8px 16px',
              borderBottom: tab === t.id ? '2px solid #1a1a1a' : '2px solid transparent',
              color: tab === t.id ? '#1a1a1a' : '#888',
              fontWeight: tab === t.id ? 500 : 400,
              marginBottom: -1
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && <Dashboard />}
        {tab === 'guests' && <GuestList />}
      </div>
    </div>
  );
}