import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useYear } from './useYear';
import YearSelector from './YearSelector';
import styles from './ReplacementsTable.module.css';

function ReplacementsTable() {
  const { selectedYear } = useYear();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (selectedYear === 'all-time') {
        // Fetch and combine data from all years (excluding future years)
        const currentYear = moment().year();
        const allYears = ['2027', '2026', '2025'];
        const years = allYears.filter(year => parseInt(year) <= currentYear);
        let allPlayers = {};

        for (const year of years) {
          try {
            const response = await fetch(`/data/${year}/replacementPlayers.json`);
            const data = await response.json();

            Object.keys(data).forEach(playerName => {
              if (allPlayers[playerName]) {
                // Combine stats
                allPlayers[playerName].gamesPlayed += data[playerName].gamesPlayed;
                allPlayers[playerName].wins += data[playerName].wins;
                allPlayers[playerName].draws += data[playerName].draws;
                allPlayers[playerName].losses += data[playerName].losses;
                allPlayers[playerName].points += data[playerName].points;
              } else {
                allPlayers[playerName] = { ...data[playerName] };
              }
            });
          } catch (err) {
            console.log(`No replacement data found for year ${year}`, err);
          }
        }

        // Convert to array and calculate points
        const playersArray = Object.entries(allPlayers).map(([playerName, player]) => ({
          ...player,
          playerName,
          points: player.wins * 3 + player.draws
        }));

        const sorted = playersArray.sort((a, b) => b.points - a.points);
        sorted.forEach((player, idx) => player.rank = idx + 1);
        setPlayers(sorted);
      } else {
        // Fetch data for specific year
        try {
          const response = await fetch(`/data/${selectedYear}/replacementPlayers.json`);
          const data = await response.json();

          const replacements = Object.entries(data).map(([playerName, player]) => ({
            ...player,
            playerName,
            points: player.wins * 3 + player.draws
          }));

          const sorted = replacements.sort((a, b) => b.points - a.points);
          sorted.forEach((player, idx) => player.rank = idx + 1);
          setPlayers(sorted);
        } catch (err) {
          console.error(`Error fetching replacement players for year ${selectedYear}:`, err);
          setPlayers([]);
        }
      }
    };

    fetchPlayers();
  }, [selectedYear]);

  return (
    <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className={styles.leaderboardTitle} style={{ textAlign: 'center', color: '#1976d2', fontWeight: 700, fontSize: '2.5rem', marginBottom: '24px' }}>Replacements Leaderboard</div>
      
      <YearSelector />
      <table className={styles.table} style={{ margin: '0 auto' }}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Games Played</th>
            <th>Wins</th>
            <th>Draws</th>
            <th>Losses</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id} style={{ textAlign: 'center', cursor: 'pointer' }}>
              <td>{player.rank}</td>
              <td>
                <Link to={`/player/${player.id}`}>{player.playerName}</Link>
              </td>
              <td>{player.gamesPlayed}</td>
              <td>{player.wins}</td>
              <td>{player.draws}</td>
              <td>{player.losses}</td>
              <td>{player.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: '16px', marginTop: '32px', justifyContent: 'center' }}>
        <Link to="/saturday-games" style={{ padding: '8px 18px', background: '#e3f2fd', borderRadius: '8px', fontWeight: 500 }}>Back</Link>
        <Link to="/saturday-games/main" style={{ padding: '8px 18px', background: '#1976d2', color: '#fff', borderRadius: '8px', fontWeight: 500 }}>Go to Main Players</Link>
      </div>
    </div>
  );
}

export default ReplacementsTable;
