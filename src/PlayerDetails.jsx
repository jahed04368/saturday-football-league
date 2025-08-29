import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useYear } from './useYear';
import YearSelector from './YearSelector';

function PlayerDetails() {
  const { id } = useParams();
  const { selectedYear } = useYear();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageUrl = player && player?.image ? player?.image : '/player-images/image-example.jpg';

  useEffect(() => {
    const fetchPlayerData = async () => {
      setLoading(true);
      
      if (selectedYear === 'all-time') {
        // Fetch data from all years and combine
        const currentYear = moment().year();
        const allYears = ['2027', '2026', '2025'];
        const years = allYears.filter(year => parseInt(year) <= currentYear);
        let allPlayers = [];

        for (const year of years) {
          try {
            const [mainRes, replacementRes] = await Promise.all([
              fetch(`/data/${year}/mainPlayers.json`),
              fetch(`/data/${year}/replacementPlayers.json`)
            ]);
            
            const mainData = await mainRes.json();
            const replacementData = await replacementRes.json();
            
            // Combine and add year info
            const yearPlayers = [
              ...Object.values(mainData).map(p => ({...p, year})),
              ...Object.values(replacementData).map(p => ({...p, year}))
            ];
            allPlayers = [...allPlayers, ...yearPlayers];
          } catch (err) {
            console.log(`No data found for year ${year}`, err);
          }
        }
        
        const found = allPlayers.find(p => p.id === Number(id));
        setPlayer(found);
      } else {
        // Fetch data for specific year
        try {
          const [mainRes, replacementRes] = await Promise.all([
            fetch(`/data/${selectedYear}/mainPlayers.json`),
            fetch(`/data/${selectedYear}/replacementPlayers.json`)
          ]);
          
          const mainData = await mainRes.json();
          const replacementData = await replacementRes.json();
          
          const allPlayers = [...Object.values(mainData), ...Object.values(replacementData)];
          const found = allPlayers.find(p => p.id === Number(id));
          setPlayer(found);
        } catch (err) {
          console.error(`Error fetching player data for year ${selectedYear}:`, err);
          setPlayer(null);
        }
      }
      
      setLoading(false);
    };

    fetchPlayerData();
  }, [id, selectedYear]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '1.2rem' }}>Loading player data...</div>;
  if (!player) return <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '1.2rem', color: '#666' }}>Player not found</div>;

  // Calculate win percentage and determine status
  const winPercentage = player.gamesPlayed > 0 ? ((player.wins / player.gamesPlayed) * 100) : 0;
  
  const getPlayerStatus = (winPercentage) => {
    if (winPercentage >= 70) return { text: 'Excellent', color: '#4caf50', bgColor: '#e8f5e8' };
    if (winPercentage >= 50) return { text: 'Good', color: '#2196f3', bgColor: '#e3f2fd' };
    if (winPercentage >= 30) return { text: 'Average', color: '#ff9800', bgColor: '#fff3e0' };
    return { text: 'Needs Improvement', color: '#f44336', bgColor: '#ffebee' };
  };

  const status = getPlayerStatus(winPercentage);

  return (
    <div style={{ paddingTop: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <YearSelector />
      </div>
      <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', background: '#eafbe7', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <img src={imageUrl} alt={player.FullName || player.playerName || player.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #eaeaea', background: '#fff', marginBottom: '18px' }} />
        </div>
        <div style={{ flex: '1', textAlign: 'left', fontSize: '1.1rem', fontWeight: 500, color: '#111', minWidth: '180px' }}>
          <div style={{ marginBottom: '18px', fontWeight: 700, fontSize: '1.2rem', textAlign: 'center' }}>{player.FullName || player.playerName || player.name}</div>
          
          {/* Status Badge */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '18px' 
          }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 12px',
              backgroundColor: status.bgColor,
              color: status.color,
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 600,
              border: `1px solid ${status.color}20`
            }}>
              {status.text}
            </span>
          </div>
          
          <div style={{ marginBottom: '12px' }}><strong>Position:</strong> {player.position}</div>
          {/* <div style={{ marginBottom: '12px' }}><strong>Age:</strong> {player.age}</div> */}
          <div style={{ marginBottom: '12px' }}><strong>Games Played:</strong> {player.gamesPlayed}</div>
          <div style={{ marginBottom: '12px' }}><strong>Wins:</strong> {player.wins}</div>
          <div style={{ marginBottom: '12px' }}><strong>Draws:</strong> {player.draws}</div>
          <div style={{ marginBottom: '12px' }}><strong>Losses:</strong> {player.losses}</div>
          <div style={{ marginBottom: '12px' }}><strong>Points:</strong> {player.points}</div>
          <div style={{ marginBottom: '12px' }}><strong>Rank:</strong> {player.rank}</div>
          <div style={{ marginBottom: '12px' }}><strong>Win Percentage:</strong> {player.gamesPlayed > 0 ? ((player.wins / player.gamesPlayed) * 100).toFixed(1) : 0}%</div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button onClick={() => window.history.back()} style={{ padding: '10px 24px', background: '#1976d2', color: '#fff', borderRadius: '8px', fontWeight: 500, border: 'none', cursor: 'pointer', width: '100%', maxWidth: '220px' }}>
          Back
        </button>
      </div>
      <style>{`
        @media (max-width: 600px) {
          div[style*='max-width: 600px'] {
            flex-direction: column !important;
            padding: 16px !important;
            gap: 16px !important;
          }
          img {
            width: 90px !important;
            height: 90px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default PlayerDetails;
