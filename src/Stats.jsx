import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useYear } from './useYear';
import YearSelector from './YearSelector';

function Stats() {
  const { selectedYear } = useYear();
  const [mainPlayers, setMainPlayers] = useState({});
  const [fixtures, setFixtures] = useState([]);
  const [playerIds, setPlayerIds] = useState({});
  const [stats, setStats] = useState({
    mostWins: [],
    mostCaptainedWins: [],
    goalScorers: [],
    assistProviders: []
  });

  useEffect(() => {
    const fetchData = async () => {
      if (selectedYear === 'all-time') {
        // Fetch data from all years (excluding future years)
        const currentYear = moment().year();
        const allYears = ['2027', '2026', '2025'];
        const years = allYears.filter(year => parseInt(year) <= currentYear);
        let allPlayers = {};
        let allFixtures = [];
        let idMap = {};

        for (const year of years) {
          try {
            const [playersRes, fixturesRes, replacementRes] = await Promise.all([
              fetch(`/data/${year}/mainPlayers.json`),
              fetch(`/data/${year}/results.json`),
              fetch(`/data/${year}/replacementPlayers.json`)
            ]);
            
            const playersData = await playersRes.json();
            const fixturesData = await fixturesRes.json();
            const replacementData = await replacementRes.json();

            // Merge players data
            Object.keys(playersData).forEach(playerName => {
              if (allPlayers[playerName]) {
                // Combine stats
                allPlayers[playerName].gamesPlayed += playersData[playerName].gamesPlayed;
                allPlayers[playerName].wins += playersData[playerName].wins;
                allPlayers[playerName].draws += playersData[playerName].draws;
                allPlayers[playerName].losses += playersData[playerName].losses;
                allPlayers[playerName].points += playersData[playerName].points;
              } else {
                allPlayers[playerName] = { ...playersData[playerName] };
              }
              // Add to ID map (later years will overwrite earlier ones)
              idMap[playerName] = playersData[playerName].id;
            });

            // Add replacement players
            Object.keys(replacementData).forEach(playerName => {
              if (allPlayers[playerName]) {
                allPlayers[playerName].wins += replacementData[playerName].wins;
              } else {
                allPlayers[playerName] = { ...replacementData[playerName] };
              }
              // Add to ID map
              idMap[playerName] = replacementData[playerName].id;
            });

            // Add fixtures
            allFixtures = [...allFixtures, ...fixturesData.fixtures];
          } catch (err) {
            console.log(`No data found for year ${year}`, err);
          }
        }

        setMainPlayers(allPlayers);
        setFixtures(allFixtures);
        setPlayerIds(idMap);
      } else {
        // Fetch data for specific year
        try {
          const [playersRes, fixturesRes, replacementRes] = await Promise.all([
            fetch(`/data/${selectedYear}/mainPlayers.json`),
            fetch(`/data/${selectedYear}/results.json`),
            fetch(`/data/${selectedYear}/replacementPlayers.json`)
          ]);
          
          const playersData = await playersRes.json();
          const fixturesData = await fixturesRes.json();
          const replacementData = await replacementRes.json();

          // Create ID map for this year
          const idMap = {};
          Object.entries(playersData).forEach(([name, data]) => {
            idMap[name] = data.id;
          });
          Object.entries(replacementData).forEach(([name, data]) => {
            idMap[name] = data.id;
          });

          setMainPlayers(playersData);
          setFixtures(fixturesData.fixtures);
          setPlayerIds(idMap);
        } catch (err) {
          console.error(`Error fetching data for year ${selectedYear}:`, err);
        }
      }
    };

    fetchData();
  }, [selectedYear]);

  useEffect(() => {
    if (Object.keys(mainPlayers).length > 0 && fixtures.length > 0) {
      const calculateStats = async () => {
        // Find all players with the most wins
        const maxWins = Math.max(...Object.values(mainPlayers).map(player => player.wins || 0));
        const playersWithMostWins = Object.keys(mainPlayers)
          .filter(playerName => (mainPlayers[playerName]?.wins || 0) === maxWins)
          .map(playerName => ({
            player: playerName,
            wins: mainPlayers[playerName]?.wins || 0
          }));

        // Calculate goals and assists (only if goalScorers data exists)
        const goalStats = {};
        const assistStats = {};
        const captainedWinsStats = {};

        fixtures.forEach(fixture => {
          // Count captained wins (when player won as home or away player)
          if (fixture.status === 'completed') {
            if (fixture.homeScore > fixture.awayScore) {
              // Home player won
              captainedWinsStats[fixture.homePlayer] = (captainedWinsStats[fixture.homePlayer] || 0) + 1;
            } else if (fixture.awayScore > fixture.homeScore) {
              // Away player won
              captainedWinsStats[fixture.awayPlayer] = (captainedWinsStats[fixture.awayPlayer] || 0) + 1;
            }
          }

          if (fixture.goalScorers) {
            fixture.goalScorers.forEach(scorer => {
              // Count goals
              if (scorer.goals > 0) {
                goalStats[scorer.player] = (goalStats[scorer.player] || 0) + scorer.goals;
              }
              // Count assists
              if (scorer.assists > 0) {
                assistStats[scorer.player] = (assistStats[scorer.player] || 0) + scorer.assists;
              }
            });
          }
        });

        // Sort captained wins in descending order
        const captainedWinsValues = Object.values(captainedWinsStats);
        const maxCaptainedWins = captainedWinsValues.length > 0 ? Math.max(...captainedWinsValues) : 0;
        const playersWithMostCaptainedWins = Object.entries(captainedWinsStats)
          .filter(([, wins]) => wins === maxCaptainedWins && wins > 0)
          .map(([player, wins]) => ({ player, wins }));

        // Sort goals and assists in descending order
        const sortedGoalScorers = Object.entries(goalStats)
          .sort(([,a], [,b]) => b - a)
          .map(([player, goals]) => ({ player, goals }));

        const sortedAssistProviders = Object.entries(assistStats)
          .sort(([,a], [,b]) => b - a)
          .map(([player, assists]) => ({ player, assists }));

        setStats({
          mostWins: playersWithMostWins,
          mostCaptainedWins: playersWithMostCaptainedWins,
          goalScorers: sortedGoalScorers,
          assistProviders: sortedAssistProviders
        });
      };

      calculateStats();
    }
  }, [mainPlayers, fixtures]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
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
        <h2 style={{ 
          color: '#ff9800', 
          fontWeight: 800, 
          fontSize: '2rem', 
          marginBottom: '32px', 
          fontFamily: 'Inter, Segoe UI, Arial, sans-serif', 
          letterSpacing: '1px' 
        }}>
          Player Statistics
        </h2>

        <YearSelector />

        {/* Most Wins Section */}
        {stats.mostWins && stats.mostWins.length > 0 && (
          <div style={{
            background: '#fff3e0',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            border: '2px solid #ffcc80'
          }}>
            <h3 style={{ color: '#e65100', marginBottom: '16px', fontSize: '1.4rem' }}>
              🏆 Most Wins
            </h3>
            {stats.mostWins.map((playerData, index) => (
              <div key={playerData.player} style={{
                background: '#ff9800',
                color: '#fff',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: 700,
                marginBottom: index < stats.mostWins.length - 1 ? '8px' : '0'
              }}>
                {playerIds[playerData.player] ? (
                  <Link to={`/player/${playerIds[playerData.player]}`} style={{
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#fff3e0';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#fff';
                  }}>
                    {playerData.player}
                  </Link>
                ) : (
                  playerData.player
                )} - {playerData.wins} wins
              </div>
            ))}
          </div>
        )}

        {/* Most Captained Wins Section */}
        {stats.mostCaptainedWins && stats.mostCaptainedWins.length > 0 && (
          <div style={{
            background: '#f3e5f5',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            border: '2px solid #ce93d8'
          }}>
            <h3 style={{ color: '#7b1fa2', marginBottom: '16px', fontSize: '1.4rem' }}>
              👑 Most Captained Wins
            </h3>
            {stats.mostCaptainedWins.map((playerData, index) => (
              <div key={playerData.player} style={{
                background: '#9c27b0',
                color: '#fff',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: 700,
                marginBottom: index < stats.mostCaptainedWins.length - 1 ? '8px' : '0'
              }}>
                {playerIds[playerData.player] ? (
                  <Link to={`/player/${playerIds[playerData.player]}`} style={{
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#f3e5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#fff';
                  }}>
                    {playerData.player}
                  </Link>
                ) : (
                  playerData.player
                )} - {playerData.wins} captained wins
              </div>
            ))}
          </div>
        )}

        {/* Goals Section */}
        <div style={{
          background: '#e8f5e8',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '2px solid #c8e6c9'
        }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '16px', fontSize: '1.4rem' }}>
            ⚽ Goal Scorers (Descending Order)
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {stats.goalScorers.map((scorer, index) => (
              <div key={scorer.player} style={{
                background: index === 0 ? '#4caf50' : '#81c784',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: index === 0 ? 700 : 500
              }}>
                <span>
                  {index + 1}. {playerIds[scorer.player] ? (
                    <Link to={`/player/${playerIds[scorer.player]}`} style={{
                      color: '#fff',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#e8f5e8';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#fff';
                    }}>
                      {scorer.player}
                    </Link>
                  ) : (
                    scorer.player
                  )}
                </span>
                <span>{scorer.goals} goals</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assists Section */}
        <div style={{
          background: '#e3f2fd',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '2px solid #bbdefb'
        }}>
          <h3 style={{ color: '#1565c0', marginBottom: '16px', fontSize: '1.4rem' }}>
            🎯 Assist Providers (Descending Order)
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {stats.assistProviders.map((provider, index) => (
              <div key={provider.player} style={{
                background: index === 0 ? '#2196f3' : '#64b5f6',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: index === 0 ? 700 : 500
              }}>
                <span>
                  {index + 1}. {playerIds[provider.player] ? (
                    <Link to={`/player/${playerIds[provider.player]}`} style={{
                      color: '#fff',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#e3f2fd';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#fff';
                    }}>
                      {provider.player}
                    </Link>
                  ) : (
                    provider.player
                  )}
                </span>
                <span>{provider.assists} assists</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
          <Link to="/saturday-games" style={{
            padding: '12px 0',
            background: 'linear-gradient(90deg, #ffcc80 0%, #fff3e0 100%)',
            borderRadius: '10px',
            fontWeight: 600,
            color: '#ff9800',
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

export default Stats;
