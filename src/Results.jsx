import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useYear } from './useYear';
import YearSelector from './YearSelector';

function Results() {
  const { selectedYear } = useYear();
  const [fixtures, setFixtures] = useState([]);
  const [playerIds, setPlayerIds] = useState({});

  useEffect(() => {
    const fetchResults = async () => {
      if (selectedYear === 'all-time') {
        // Fetch results from all years (excluding future years)
        const currentYear = moment().year();
        const allYears = ['2027', '2026', '2025'];
        const years = allYears.filter(year => parseInt(year) <= currentYear);
        let allFixtures = [];

        for (const year of years) {
          try {
            const response = await fetch(`/data/${year}/results.json`);
            const data = await response.json();
            allFixtures = [...allFixtures, ...data.fixtures];
          } catch (err) {
            console.log(`No results found for year ${year}`, err);
          }
        }

        // Sort by date (newest first)
        allFixtures.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFixtures(allFixtures);
      } else {
        // Fetch results for specific year
        try {
          const response = await fetch(`/data/${selectedYear}/results.json`);
          const data = await response.json();
          setFixtures(data.fixtures);
        } catch (err) {
          console.error(`Error fetching results for year ${selectedYear}:`, err);
          setFixtures([]);
        }
      }
    };

    const fetchPlayerIds = async () => {
      // Fetch player data to get IDs for linking
      try {
        if (selectedYear === 'all-time') {
          // For all-time, collect player IDs from all years
          const currentYear = moment().year();
          const allYears = ['2027', '2026', '2025'];
          const years = allYears.filter(year => parseInt(year) <= currentYear);
          const idMap = {};

          for (const year of years) {
            try {
              const [mainRes, replacementRes] = await Promise.all([
                fetch(`/data/${year}/mainPlayers.json`),
                fetch(`/data/${year}/replacementPlayers.json`)
              ]);
              
              const mainData = await mainRes.json();
              const replacementData = await replacementRes.json();
              
              // Add player IDs to map (later years will overwrite earlier ones)
              Object.entries(mainData).forEach(([name, data]) => {
                idMap[name] = data.id;
              });
              Object.entries(replacementData).forEach(([name, data]) => {
                idMap[name] = data.id;
              });
            } catch (err) {
              console.log(`No player data found for year ${year}`, err);
            }
          }
          
          setPlayerIds(idMap);
        } else {
          // For specific year
          const [mainRes, replacementRes] = await Promise.all([
            fetch(`/data/${selectedYear}/mainPlayers.json`),
            fetch(`/data/${selectedYear}/replacementPlayers.json`)
          ]);
          
          const mainData = await mainRes.json();
          const replacementData = await replacementRes.json();
          
          // Create a mapping of player names to IDs
          const idMap = {};
          Object.entries(mainData).forEach(([name, data]) => {
            idMap[name] = data.id;
          });
          Object.entries(replacementData).forEach(([name, data]) => {
            idMap[name] = data.id;
          });
          
          setPlayerIds(idMap);
        }
      } catch (err) {
        console.error(`Error fetching player data:`, err);
        setPlayerIds({});
      }
    };

    fetchResults();
    fetchPlayerIds();
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
        position: 'relative'
      }}>
        {/* Home Icon linking to saturday-games */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px'
        }}>
          <Link to="/saturday-games" style={{
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
            }}>⚽</span>
          </Link>
        </div>
        <h2 style={{ color: '#1976d2', fontWeight: 800, fontSize: '2rem', marginBottom: '24px', fontFamily: 'Inter, Segoe UI, Arial, sans-serif', letterSpacing: '1px' }}>
          Match Results
        </h2>
        
        <YearSelector />
        <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
          {fixtures.map(fixture => (
            <div key={fixture.id} style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  {playerIds[fixture.homePlayer] ? (
                    <Link to={`/player/${playerIds[fixture.homePlayer]}`} style={{
                      fontWeight: 600, 
                      color: '#1976d2',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#1565c0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#1976d2';
                    }}>
                      {fixture.homePlayer}
                    </Link>
                  ) : (
                    <span style={{ fontWeight: 600, color: '#1976d2' }}>{fixture.homePlayer}</span>
                  )}
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#333' }}>
                    {fixture.homeScore} - {fixture.awayScore}
                  </span>
                  {playerIds[fixture.awayPlayer] ? (
                    <Link to={`/player/${playerIds[fixture.awayPlayer]}`} style={{
                      fontWeight: 600, 
                      color: '#1976d2',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#1565c0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#1976d2';
                    }}>
                      {fixture.awayPlayer}
                    </Link>
                  ) : (
                    <span style={{ fontWeight: 600, color: '#1976d2' }}>{fixture.awayPlayer}</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {fixture.youtubeLink && (
                    <a 
                      href={fixture.youtubeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#ff0000',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <span style={{ color: 'white', fontSize: '14px' }}>▶</span>
                    </a>
                  )}
                  <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'right' }}>
                    <div>{new Date(fixture.date).toLocaleDateString()}</div>
                    <div style={{ color: '#43a047', fontWeight: 500 }}>{fixture.status}</div>
                  </div>
                </div>
              </div>
              
              {fixture.goalScorers && fixture.goalScorers.length > 0 && (
                <div style={{ 
                  background: '#e8f5e8', 
                  padding: '12px', 
                  borderRadius: '8px',
                  marginTop: '8px'
                }}>
                  <h4 style={{ 
                    margin: '0 0 8px 0', 
                    color: '#2e7d32', 
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}>Goal Scorers:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {fixture.goalScorers
                      .filter(scorer => scorer.goals > 0)
                      .map((scorer, index) => (
                        <span key={index} style={{
                          background: '#fff',
                          padding: '4px 8px',
                          borderRadius: '16px',
                          fontSize: '0.85rem',
                          color: '#2e7d32',
                          fontWeight: 500,
                          border: '1px solid #c8e6c9'
                        }}>
                          {playerIds[scorer.player] ? (
                            <Link to={`/player/${playerIds[scorer.player]}`} style={{
                              color: '#2e7d32',
                              textDecoration: 'none',
                              transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.color = '#1b5e20';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = '#2e7d32';
                            }}>
                              {scorer.player}
                            </Link>
                          ) : (
                            scorer.player
                          )} ({scorer.goals} goal{scorer.goals > 1 ? 's' : ''})
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
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

export default Results;
