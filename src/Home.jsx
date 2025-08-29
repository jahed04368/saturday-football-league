import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #d6f5d6 0%, #b6eeb7 100%)',
      padding: '16px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        padding: '36px 16px',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        marginBottom: '32px',
      }}>
        <h1 style={{
          color: '#1976d2',
          fontWeight: 800,
          fontSize: '2.2rem',
          marginBottom: '18px',
          fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
          letterSpacing: '1px',
        }}>
          ⚽ Football Leaderboard
        </h1>
        <p style={{ color: '#333', fontSize: '1rem', marginBottom: '32px', fontWeight: 500 }}>
          Track wins, games, and stats for all players. Choose a section below to get started!
        </p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
          <Link to="/main-matches" style={{
            padding: '12px 0',
            background: 'linear-gradient(90deg, #b6eeb7 0%, #d6f5d6 100%)',
            borderRadius: '10px',
            fontWeight: 600,
            color: '#1976d2',
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            textDecoration: 'none',
            transition: 'background 0.2s, color 0.2s',
            width: '100%'
          }}>Main Matches</Link>
          <Link to="/saturday-games" style={{
            padding: '12px 0',
            background: 'linear-gradient(90deg, #1976d2 0%, #b6eeb7 100%)',
            borderRadius: '10px',
            fontWeight: 600,
            color: '#fff',
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            textDecoration: 'none',
            transition: 'background 0.2s, color 0.2s',
            width: '100%'
          }}>Saturday Games</Link>
        </nav>
      </div>
    <div style={{ color: '#888', fontSize: '1.0rem', marginTop: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          From The River To The Sea 🇵🇸 Will Be Free
      </div>
      <style>{`
        @media (max-width: 600px) {
          h1 { font-size: 1.5rem !important; }
          .nav-links { flex-direction: column !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
}

export default Home;
