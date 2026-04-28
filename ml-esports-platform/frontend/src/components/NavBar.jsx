import { Link, NavLink } from 'react-router-dom'

function NavBar() {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-white hover:text-accent transition-all duration-300">
          ARENA<span className="text-accent italic">WARS</span>
        </Link>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
            <NavLink to="/scrims" className={({isActive})=> isActive ? 'text-accent' : 'hover:text-white transition'}>Scrims</NavLink>
            <NavLink to="/tournaments" className={({isActive})=> isActive ? 'text-accent' : 'hover:text-white transition'}>Tournaments</NavLink>
            <NavLink to="/leaderboard" className={({isActive})=> isActive ? 'text-accent' : 'hover:text-white transition'}>Leaderboard</NavLink>
            <NavLink to="/guilds" className={({isActive})=> isActive ? 'text-accent' : 'hover:text-white transition'}>Guilds</NavLink>
          </div>
          
          <div className="flex items-center gap-4">
            <NavLink to="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition">Dashboard</NavLink>
            <Link to="/login" className="px-5 py-1.5 rounded-full border border-white/10 text-sm font-semibold hover:bg-white/5 transition">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
