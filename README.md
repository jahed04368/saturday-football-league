# Saturday Football League Management System

A comprehensive React application for managing Saturday football league activities, including player statistics, match results, and leaderboards.

## Features

- **Player Management**: Track main players and replacement players
- **Match Results**: View and manage match fixtures with scores
- **Statistics**: Comprehensive stats including most wins, goals, and assists
- **Year-based Data**: Organize data by years (2025, 2026, 2027) with year selector
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Updates**: Live match result tracking

## Technology Stack

This application is built with:
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Moment.js** - Date handling and year filtering
- **CSS Modules** - Scoped component styling

## Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jahed04368/saturday-football-league.git
cd saturday-football-league
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/           # React components
├── data/                # JSON data files organized by year
├── styles/              # CSS modules and global styles
└── utils/               # Helper functions and hooks

public/
├── data/                # Public data files
│   ├── 2025/           # 2025 season data
│   ├── 2026/           # 2026 season data
│   └── 2027/           # 2027 season data
└── images/              # Static images and avatars
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

This is a personal project for managing Saturday football league activities. Feel free to fork and adapt for your own use.

## License

This project is open source and available under the [MIT License](LICENSE).
