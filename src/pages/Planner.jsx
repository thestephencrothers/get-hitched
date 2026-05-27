import Dashboard from '../components/Dashboard';

export default function Planner() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', padding: '2rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, marginBottom: 8 }}>
          Stephen & Laura
        </h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>Wedding planner</p>
        <Dashboard />
      </div>
    </div>
  );
}