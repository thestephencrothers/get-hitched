import { useState, useEffect } from 'react';
import venueImg from '../assets/venue.png';

const GOLD = '#c9a84c';
const DARK = '#2c2720';
const CREAM = '#f9f6f0';

const styles = {
  page: {
    background: CREAM,
    minHeight: '100vh',
    fontFamily: "'Cormorant Garamond', serif",
    color: DARK,
  },
  hero: {
    textAlign: 'center',
    padding: '3rem 2rem 0',
    maxWidth: 680,
    margin: '0 auto',
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: GOLD,
    margin: '0.5rem 0',
  },
  script: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: 'clamp(40px, 8vw, 64px)',
    color: DARK,
    lineHeight: 1.2,
    margin: '0.5rem 0',
  },
  dateText: {
    fontSize: 22,
    fontWeight: 300,
    fontStyle: 'italic',
    color: DARK,
  },
  venueText: {
    fontSize: 15,
    letterSpacing: '0.12em',
    color: '#5a4a3a',
    marginTop: 6,
  },
  goldDivider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    margin: '1rem auto',
    maxWidth: 280,
  },
  goldLine: {
    flex: 1,
    height: 0.5,
    background: GOLD,
  },
  goldDiamond: {
    width: 6,
    height: 6,
    background: GOLD,
    transform: 'rotate(45deg)',
    flexShrink: 0,
  },
  venueImg: {
    width: '100%',
    maxWidth: 680,
    display: 'block',
    margin: '0 auto',
  },
  countdown: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    maxWidth: 680,
    margin: '0 auto',
    borderTop: `0.5px solid ${GOLD}`,
    borderLeft: `0.5px solid ${GOLD}`,
  },
  countBox: {
    textAlign: 'center',
    padding: '1.5rem 0.5rem',
    borderRight: `0.5px solid ${GOLD}`,
    borderBottom: `0.5px solid ${GOLD}`,
  },
  countNum: {
    fontSize: 'clamp(28px, 5vw, 40px)',
    fontWeight: 300,
    color: DARK,
    fontFamily: "'Cormorant Garamond', serif",
  },
  countLabel: {
    fontSize: 10,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: GOLD,
    marginTop: 4,
  },
  details: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    maxWidth: 680,
    margin: '0 auto',
    borderTop: `0.5px solid ${GOLD}`,
    borderLeft: `0.5px solid ${GOLD}`,
  },
  detailBox: {
    padding: '2rem 1.25rem',
    textAlign: 'center',
    borderRight: `0.5px solid ${GOLD}`,
    borderBottom: `0.5px solid ${GOLD}`,
  },
  detailTitle: {
    fontSize: 10,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: GOLD,
    marginBottom: 10,
  },
  detailBody: {
    fontSize: 15,
    fontWeight: 300,
    fontStyle: 'italic',
    lineHeight: 1.7,
  },
  rsvp: {
    textAlign: 'center',
    padding: '3rem 2rem',
    maxWidth: 680,
    margin: '0 auto',
  },
  rsvpBtn: {
    display: 'inline-block',
    marginTop: '1.5rem',
    padding: '12px 48px',
    border: `1px solid ${GOLD}`,
    color: GOLD,
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 13,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    background: 'transparent',
  },
  footer: {
    textAlign: 'center',
    padding: '1.5rem',
    borderTop: `0.5px solid ${GOLD}`,
    maxWidth: 680,
    margin: '0 auto',
  },
  footerText: {
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#9a8a7a',
  },
};

function GoldDivider() {
  return (
    <div style={styles.goldDivider}>
      <div style={styles.goldLine} />
      <div style={styles.goldDiamond} />
      <div style={styles.goldLine} />
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

export default function Invites() {
  const { d, h, m, s } = useCountdown('2026-09-02T14:00:00');
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div style={styles.page}>
      <div style={{ maxWidth: 680, margin: '0 auto', border: `0.5px solid ${GOLD}` }}>

        <div style={styles.hero}>
          <p style={styles.eyebrow}>Together with their families</p>
          <div style={styles.script}>Laura & Stephen</div>
          <GoldDivider />
          <p style={styles.eyebrow}>request the pleasure of your company at their marriage</p>
          <p style={{ ...styles.dateText, marginTop: 12 }}>Thursday, the 2nd of September 2026</p>
          <p style={styles.venueText}>Ballyness Resort</p>
          <GoldDivider />
        </div>

        <img src={venueImg} alt="Ballyness Resort" style={styles.venueImg} />

        <div style={styles.countdown}>
          {[
            { num: d, label: 'Days' },
            { num: String(h).padStart(2, '0'), label: 'Hours' },
            { num: String(m).padStart(2, '0'), label: 'Minutes' },
            { num: String(s).padStart(2, '0'), label: 'Seconds' },
          ].map(({ num, label }) => (
            <div key={label} style={styles.countBox}>
              <div style={styles.countNum}>{num ?? '--'}</div>
              <div style={styles.countLabel}>{label}</div>
            </div>
          ))}
        </div>

        <div style={styles.details}>
          {[
            { title: 'Ceremony', body: "St Patrick's Church\n2:00pm" },
            { title: 'Reception', body: 'Ballyness Resort\nDrinks from 4:30pm' },
            { title: 'Dress code', body: 'Black tie\noptional' },
          ].map(({ title, body }) => (
            <div key={title} style={styles.detailBox}>
              <div style={styles.detailTitle}>{title}</div>
              <div style={styles.detailBody}>
                {body.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.rsvp}>
          <p style={styles.eyebrow}>Kindly reply by 1st June 2026</p>
          <GoldDivider />
          <p style={{ fontSize: 16, fontWeight: 300, fontStyle: 'italic', color: '#5a4a3a' }}>
            We hope you can join us for our special day
          </p>
          <button
            style={{
              ...styles.rsvpBtn,
              background: hovered ? GOLD : 'transparent',
              color: hovered ? CREAM : GOLD,
              transition: 'all 0.2s',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            RSVP
          </button>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Laura & Stephen &nbsp;·&nbsp; 2nd September 2026 &nbsp;·&nbsp; Ballyness Resort
          </p>
        </div>

      </div>
    </div>
  );
}