import React from 'react';
import { useYear } from './useYear';

function YearSelector() {
  const { selectedYear, setSelectedYear, availableYears } = useYear();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      justifyContent: 'center'
    }}>
      <label style={{
        fontSize: '1rem',
        fontWeight: 600,
        color: '#1976d2'
      }}>
        Season:
      </label>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: '2px solid #e0e0e0',
          background: '#fff',
          fontSize: '1rem',
          fontWeight: 600,
          color: '#1976d2',
          cursor: 'pointer',
          outline: 'none',
          transition: 'border-color 0.2s'
        }}
        onFocus={(e) => e.target.style.borderColor = '#1976d2'}
        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
      >
        {availableYears.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
        <option value="all-time">All Time</option>
      </select>
    </div>
  );
}

export default YearSelector;
