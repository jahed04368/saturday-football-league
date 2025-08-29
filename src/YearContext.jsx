import React, { createContext, useState } from 'react';
import moment from 'moment';

const YearContext = createContext();

export const YearProvider = ({ children }) => {
  const currentYear = moment().year();
  const allYears = ['2027', '2026', '2025'];
  
  // Filter out future years
  const availableYears = allYears.filter(year => parseInt(year) <= currentYear);
  
  // Set default to current year if available, otherwise the latest available year
  const defaultYear = availableYears.includes(currentYear.toString()) 
    ? currentYear.toString() 
    : availableYears[0] || '2025';
  
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  return (
    <YearContext.Provider value={{
      selectedYear,
      setSelectedYear,
      availableYears
    }}>
      {children}
    </YearContext.Provider>
  );
};

export default YearContext;
