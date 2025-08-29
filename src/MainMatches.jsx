import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useYear } from './useYear';
import YearSelector from './YearSelector';

function MainMatches() {
  const { selectedYear } = useYear();
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    const fetchMainMatches = async () => {
      // Fetch main matches for specific year only
      try {
        const response = await fetch(`/data/${selectedYear}/mainMatches.json`);
        const data = await response.json();
        setFixtures(data.fixtures);
      } catch (err) {
        console.error(`Error fetching main matches for year ${selectedYear}:`, err);
        setFixtures([]);
      }
    };

    // Only fetch if selectedYear is not 'all-time'
    if (selectedYear !== 'all-time') {
      fetchMainMatches();
    } else {
      setFixtures([]);
    }
  }, [selectedYear]);

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
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center',
        marginBottom: '32px',
      }}>
        <h2 style={{ color: '#1976d2', fontWeight: 800, fontSize: '2rem', marginBottom: '24px', fontFamily: 'Inter, Segoe UI, Arial, sans-serif', letterSpacing: '1px' }}>
          Main Matches
        </h2>
        
        <YearSelector />
        
        {selectedYear === 'all-time' ? (
          <div style={{
            background: '#fff3e0',
            borderRadius: '12px',
            padding: '24px',
            margin: '32px 0',
            border: '2px solid #ffcc80',
            color: '#e65100'
          }}>
            <h3 style={{ color: '#e65100', marginBottom: '12px' }}>📅 Year Selection Required</h3>
            <p style={{ margin: 0, fontSize: '1rem' }}>
              Please select a specific year to view main matches. All-time view is not available for this section.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
            {fixtures.map(fixture => (
            <div key={fixture.id} style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={{ fontWeight: 600, color: '#1976d2' }}>{fixture.homePlayer}</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#333' }}>
                  {fixture.homeScore} - {fixture.awayScore}
                </span>
                <span style={{ fontWeight: 600, color: '#1976d2' }}>{fixture.awayPlayer}</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'right' }}>
                <div>{new Date(fixture.date).toLocaleDateString()}</div>
                <div style={{ color: '#43a047', fontWeight: 500 }}>{fixture.status}</div>
              </div>
            </div>
          ))}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
          <Link to="/saturday-games" style={{
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
          }}>Back to Saturday Games</Link>
        </div>
      </div>
    <div style={{ color: '#888', fontSize: '1.0rem', marginTop: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          From The River To The Sea 🇵🇸 Will Be Free
      </div>
    </div>
  );
}

export default MainMatches;
