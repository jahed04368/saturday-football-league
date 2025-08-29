import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PlayerDetails() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const imageUrl = player && player?.image ? player?.image : '/player-images/image-example.jpg';
console.log(imageUrl)
  useEffect(() => {
    Promise.all([
      fetch('/data/mainPlayers.json').then(res => res.json()),
      fetch('/data/replacementPlayers.json').then(res => res.json())
    ]).then(([mainData, replacementData]) => {
      const allPlayers = [...Object.values(mainData), ...Object.values(replacementData)];
      const found = allPlayers.find(p => p.id === Number(id));
      setPlayer(found);
    });
  }, [id]);

  if (!player) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', background: '#eafbe7', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <img src={imageUrl} alt={player.playerName || player.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #eaeaea', background: '#fff', marginBottom: '18px' }} />
        </div>
        <div style={{ flex: '1', textAlign: 'left', fontSize: '1.1rem', fontWeight: 500, color: '#111', minWidth: '180px' }}>
          <div style={{ marginBottom: '18px', fontWeight: 700, fontSize: '1.2rem', textAlign: 'center' }}>{player.playerName || player.name}</div>
          <div style={{ marginBottom: '12px' }}><strong>Position:</strong> {player.position}</div>
          <div style={{ marginBottom: '12px' }}><strong>Age:</strong> {player.age}</div>
          <div style={{ marginBottom: '12px' }}><strong>Games Played:</strong> {player.gamesPlayed}</div>
          <div style={{ marginBottom: '12px' }}><strong>Wins:</strong> {player.wins}</div>
          <div style={{ marginBottom: '12px' }}><strong>Draws:</strong> {player.draws}</div>
          <div style={{ marginBottom: '12px' }}><strong>Losses:</strong> {player.losses}</div>
          <div style={{ marginBottom: '12px' }}><strong>Points:</strong> {player.points}</div>
          <div style={{ marginBottom: '12px' }}><strong>Rank:</strong> {player.rank}</div>
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
