import React from 'react';
import { Link } from 'react-router-dom';

function SaturdayGamesHome() {
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
        position: 'relative'
      }}>
        {/* Home Icon inside white div */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px'
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            background: '#f5f5f5',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textDecoration: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}>
            <span style={{
              fontSize: '20px',
              color: '#1976d2'
            }}>🏠</span>
          </Link>
        </div>
        <h2 style={{ color: '#1976d2', fontWeight: 800, fontSize: '2rem', marginBottom: '18px', fontFamily: 'Inter, Segoe UI, Arial, sans-serif', letterSpacing: '1px' }}>
          Saturday Games
        </h2>
        <p style={{ color: '#333', fontSize: '1.05rem', marginBottom: '32px', fontWeight: 500 }}>
          View leaderboards for main players and replacements. Choose a section below!
        </p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
          <Link to="/saturday-games/main" style={{
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
          }}>Main Players</Link>
          <Link to="/saturday-games/replacements" style={{
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
          }}>Replacements</Link>
                    <Link to="results" style={{
            padding: '12px 0',
            background: 'linear-gradient(90deg, #81c784 0%, #a5d6a7 100%)',
            borderRadius: '10px',
            fontWeight: 600,
            color: '#fff',
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            textDecoration: 'none',
            transition: 'background 0.2s, color 0.2s',
            width: '100%'
          }}>Results</Link>
          
          <Link to="stats" style={{
            padding: '12px 0',
            background: 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)',
            borderRadius: '10px',
            fontWeight: 600,
            color: '#fff',
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            textDecoration: 'none',
            transition: 'background 0.2s, color 0.2s',
            width: '100%'
          }}>Stats</Link>
        </nav>
      </div>
           <div style={{ color: '#888', fontSize: '1.0rem', marginTop: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        From The River To The Sea 🇵🇸 Will Be Free
      </div>
    </div>
  );
}

export default SaturdayGamesHome;
