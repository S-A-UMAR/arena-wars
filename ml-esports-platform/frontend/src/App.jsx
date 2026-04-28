import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background text-foreground font-display selection:bg-accent/30 selection:text-white">
      <NavBar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Routes location={location}>
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
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
