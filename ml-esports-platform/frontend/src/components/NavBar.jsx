import { Link, NavLink } from 'react-router-dom'

function NavBar() {
  return (
    <div className="border-b border-gray-800 bg-black/60 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl neon-text">ML Esports</Link>
        <div className="flex gap-4">
          <NavLink to="/scrims" className="hover:text-neon-blue">Scrims</NavLink>
          <NavLink to="/tournaments" className="hover:text-neon-blue">Tournaments</NavLink>
          <NavLink to="/leaderboard" className="hover:text-neon-blue">Leaderboard</NavLink>
          <NavLink to="/guilds" className="hover:text-neon-blue">Guilds</NavLink>
          <NavLink to="/dashboard" className="hover:text-neon-blue">Dashboard</NavLink>
          <NavLink to="/login" className="hover:text-neon-pink">Login</NavLink>
        </div>
      </div>
    </div>
  )
}

export default NavBar
