import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PlayerProfile from './pages/PlayerProfile'
import Guild from './pages/Guild'
import Tournament from './pages/Tournament'
import TournamentDetail from './pages/TournamentDetail'
import Scrims from './pages/Scrims'
import Leaderboard from './pages/Leaderboard'
import Dashboard from './pages/Dashboard'
import Market from './pages/Market'
import AdminNexus from './pages/AdminNexus'
import TournamentCreate from './pages/TournamentCreate'
import TournamentManage from './pages/TournamentManage'
import News from './pages/News'
import MatchDetail from './pages/MatchDetail'
import GuildDetail from './pages/GuildDetail'
import GuildCreate from './pages/GuildCreate'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import AdminRoute from './components/AdminRoute'
import MobileNav from './components/MobileNav'
import ChatWidget from './components/ChatWidget'
import { ToastProvider } from './context/ToastContext'

import DraftSimulator from './pages/DraftSimulator'
import WarRoom from './pages/WarRoom'

function App() {
  const location = useLocation()

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground font-inter selection:bg-primary selection:text-background overflow-x-hidden">
        <NavBar />
        <main className="container mx-auto px-4 pt-32 pb-24 md:pb-32">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
              <Route path="/news" element={<News />} />
              <Route path="/draft-sim" element={<DraftSimulator />} />
              <Route path="/war-room/:id" element={<WarRoom />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><PlayerProfile /></ProtectedRoute>} />
              <Route path="/profile/:id" element={<PlayerProfile />} />
              
              <Route path="/guilds" element={<Guild />} />
              <Route path="/guilds/create" element={<ProtectedRoute><GuildCreate /></ProtectedRoute>} />
              <Route path="/guilds/:id" element={<GuildDetail />} />
              
              <Route path="/tournaments" element={<Tournament />} />
              <Route path="/tournaments/create" element={<ProtectedRoute><TournamentCreate /></ProtectedRoute>} />
              <Route path="/tournaments/:id" element={<TournamentDetail />} />
              <Route path="/tournaments/:id/manage" element={<ProtectedRoute><TournamentManage /></ProtectedRoute>} />
              
              <Route path="/matches/:id" element={<MatchDetail />} />
              <Route path="/scrims" element={<ProtectedRoute><Scrims /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/market" element={<Market />} />
              <Route path="/admin" element={<AdminRoute><AdminNexus /></AdminRoute>} />
            </Routes>
          </AnimatePresence>
        </main>
        <MobileNav />
        <ChatWidget />
      </div>
    </ToastProvider>
  )
}

export default App
