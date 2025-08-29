
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { YearProvider } from './YearContext';
import Home from './Home';
import MainMatches from './MainMatches';
import SaturdayGames from './SaturdayGames';
import PlayerDetails from './PlayerDetails';
import SaturdayGamesHome from './SaturdayGamesHome';
import ReplacementsTable from './ReplacementsTable';
import MainPlayersTable from './MainPlayersTable';
import Results from './Results';
import Stats from './Stats';

function App() {
  return (
    <YearProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main-matches" element={<MainMatches />} />
          <Route path="/saturday-games" element={<SaturdayGames />}>
            <Route index element={<SaturdayGamesHome />} />
            <Route path="main" element={<MainPlayersTable />} />
            <Route path="replacements" element={<ReplacementsTable />} />
            <Route path="results" element={<Results />} />
            <Route path="stats" element={<Stats />} />
          </Route>
          <Route path="/player/:id" element={<PlayerDetails />} />
        </Routes>
      </Router>
    </YearProvider>
  );
}

export default App;
