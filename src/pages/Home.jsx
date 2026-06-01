import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import venueImg from '../assets/venue.png';

const GOLD = '#c9a84c';
const CREAM = '#f9f6f0';
const DARK = '#2c2720';

function GoldDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '1rem auto', maxWidth: 280 }}>
      <div style={{ flex: 1, height: 0.5, background: GOLD }} />
      <div style={{ width: 6, height: 6, background: GOLD, transform: 'rotate(45deg)', flexShrink: 0 }} />
      <div style={{ flex: 1, height: 0.5, background: GOLD }} />
    </div>
  );
}

function useCountdown(target) {
  const [time, setTime] = useState({});
  useEffect(() => {
    const tick = () => {
      const diff = new Date(target) - new Date();
      if (diff <= 0) return setTime({ d: 0, h: 0, m: 0, s: 0 });
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

export default function Home() {
  const { d, h, m, s } = useCountdown('2027-09-02T14:00:00');
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const quickLinks = [
    { label: 'Dashboard', sub: 'Costs & savings', path: '/planner', tab: 'dashboard', icon: '£' },
    { label: 'Guest list', sub: `96 families`, path: '/planner', tab: 'guests', icon: '♡' },
    { label: 'To-do', sub: 'Actions & timeline', path: '/planner', tab: 'todo', icon: '✓' },
  ];

  return (
    <div style={{ background: CREAM, minHeight: '100vh', fontFamily: "'Cormorant Garamond', serif", color: DARK }}>
      <NavBar />

      <div style={{ maxWidth: 680, margin: '0 auto', borderLeft: `0.5px solid ${GOLD}`, borderRight: `0.5px solid ${GOLD}` }}>

        <div style={{ textAlign: 'center', padding: '2.5rem 2rem 1rem' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD }}>
            2nd September 2027
          </p>
          <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(48px, 10vw, 72px)', lineHeight: 1.2, margin: '0.25rem 0' }}>
            Laura & Stephen
          </div>
          <p style={{ fontSize: 14, fontWeight: 300, fontStyle: 'italic', color: '#5a4a3a' }}>
            Ballyness Resort
          </p>
          <GoldDivider />
        </div>

        <img src={venueImg} alt="Ballyness Resort" style={{ width: '100%', display: 'block' }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: `0.5px solid ${GOLD}`,
          borderLeft: `0.5px solid ${GOLD}`,
        }}>
          {[
            { num: d, label: 'Days' },
            { num: String(h ?? '--').padStart(2, '0'), label: 'Hours' },
            { num: String(m ?? '--').padStart(2, '0'), label: 'Minutes' },
            { num: String(s ?? '--').padStart(2, '0'), label: 'Seconds' },
          ].map(({ num, label }) => (
            <div key={label} style={{
              textAlign: 'center',
              padding: '1.5rem 0.5rem',
              borderRight: `0.5px solid ${GOLD}`,
              borderBottom: `0.5px solid ${GOLD}`,
            }}>
              <div style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 300, fontFamily: "'Cormorant Garamond', serif" }}>{num}</div>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '2rem', borderBottom: `0.5px solid ${GOLD}` }}>
          <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: 16, textAlign: 'center' }}>
            Planning
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {quickLinks.map(link => (
              <button
                key={link.label}
                onClick={() => navigate(link.path, { state: { tab: link.tab } })}
                style={{
                  background: '#f4f0e8',
                  border: `0.5px solid ${GOLD}`,
                  borderRadius: 4,
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontFamily: "'Cormorant Garamond', serif",
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#ede8dc'}
                onMouseLeave={e => e.currentTarget.style.background = '#f4f0e8'}
              >
                <div style={{ fontSize: 20, color: GOLD, marginBottom: 6 }}>{link.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 400, color: DARK }}>{link.label}</div>
                <div style={{ fontSize: 12, color: '#9a8a7a', marginTop: 3, fontStyle: 'italic' }}>{link.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '1.5rem' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9a8a7a' }}>
            Laura & Stephen &nbsp;·&nbsp; 2nd September 2027 &nbsp;·&nbsp; Ballyness Resort
          </p>
        </div>

      </div>
    </div>
  );
}