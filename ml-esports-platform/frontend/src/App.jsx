import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PlayerProfile from './pages/PlayerProfile'
import Guild from './pages/Guild'
import Tournament from './pages/Tournament'
import Scrims from './pages/Scrims'
import Leaderboard from './pages/Leaderboard'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-display">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/player/:username" element={<PlayerProfile />} />
          <Route path="/guilds" element={<Guild />} />
          <Route path="/tournaments" element={<Tournament />} />
          <Route path="/scrims" element={<Scrims />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
