import { useNavigate, useLocation } from 'react-router-dom';

const GOLD = '#c9a84c';
const CREAM = '#f9f6f0';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/planner', tab: 'dashboard' },
    { label: 'Guest List', path: '/planner', tab: 'guests' },
    { label: 'To-Do', path: '/planner', tab: 'todo' },
  ];

  return (
    <nav style={{
      background: '#2c2720',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${GOLD}`,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        fontFamily: "'Great Vibes', cursive",
        fontSize: 24,
        color: GOLD,
        padding: '12px 0',
        cursor: 'pointer',
      }} onClick={() => navigate('/')}>
        L & S
      </div>
      <div style={{ display: 'flex', gap: 0 }}>
        {links.map(link => {
            const active = location.pathname === link.path &&
                (!link.tab || location.state?.tab === link.tab ||
                (!location.state?.tab && link.tab === 'dashboard'));
            return (
            <button
              key={link.label}
              onClick={() => navigate(link.path, { state: { tab: link.tab } })}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: active ? `2px solid ${GOLD}` : '2px solid transparent',
                color: active ? GOLD : '#c8b898',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 13,
                letterSpacing: '0.1em',
                padding: '18px 16px 16px',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}