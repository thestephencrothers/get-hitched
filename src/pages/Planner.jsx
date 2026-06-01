import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Dashboard from '../components/Dashboard';
import GuestList from '../components/GuestList';

export default function Planner() {
  const location = useLocation();
  const [tab, setTab] = useState(location.state?.tab || 'dashboard');

  useEffect(() => {
    if (location.state?.tab) setTab(location.state.tab);
  }, [location.state]);

 

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: "'Cormorant Garamond', serif" }}>
      <NavBar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
       
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'guests' && <GuestList />}
      </div>
    </div>
  ); 
}