import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function NavBar() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Scrims', path: '/scrims' },
    { name: 'Tournaments', path: '/tournaments' },
    { name: 'Market', path: '/market' },
    { name: 'Draft Sim', path: '/draft-sim' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Guilds', path: '/guilds' },
  ]

  const [theme, setTheme] = useState('dark')
  const [notifOpen, setNotifOpen] = useState(false)

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('light-theme')
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-white hover:text-primary transition-all duration-300">
          ARENA<span className="text-primary italic">WARS</span>
        </Link>

        {/* Global Search */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <input 
              type="text" 
              placeholder="Search players, guilds, or tournaments..." 
              className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-1.5 text-xs focus:border-primary/50 outline-none transition-all group-hover:bg-white/10"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition">🔍</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
            {navLinks.map(link => (
              <NavLink key={link.name} to={link.path} className={({isActive})=> isActive ? 'text-primary drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]' : 'hover:text-white transition'}>
                {link.name}
              </NavLink>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {(user.user?.is_staff || user.user?.is_superuser) && (
                   <NavLink to="/admin" className="hidden md:block text-xs font-bold uppercase text-primary border border-primary/30 px-3 py-1 rounded bg-primary/5 hover:bg-primary/10 transition">Nexus Core</NavLink>
                )}
                <NavLink to="/dashboard" className="hidden md:block text-sm font-medium text-gray-400 hover:text-white transition">Dashboard</NavLink>
                <NavLink to="/profile" className="hidden md:block text-sm font-medium text-gray-400 hover:text-white transition">Profile</NavLink>
                <div className="flex items-center gap-3 md:border-l md:border-white/10 md:pl-4">
                  <div className="flex items-center gap-4 mr-2">
                    <button onClick={toggleTheme} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm hover:bg-white/10 transition">
                      {theme === 'dark' ? '🌙' : '☀️'}
                    </button>
                    <div className="relative">
                      <button onClick={() => setNotifOpen(!notifOpen)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm hover:bg-white/10 transition relative">
                        🔔
                        <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-pulse" />
                      </button>
                      {notifOpen && (
                        <div className="absolute top-full right-0 mt-4 w-64 glass border border-white/10 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-2">
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Tactical Alerts</div>
                          <div className="space-y-3">
                            <div className="text-xs p-2 rounded-lg bg-white/5 border border-white/5">
                               <div className="font-bold text-white mb-1">New Scrim Request</div>
                               <div className="text-gray-400">Guild Vanguard has challenged you.</div>
                            </div>
                            <div className="text-xs p-2 rounded-lg bg-white/5 border border-white/5">
                               <div className="font-bold text-white mb-1">Tournament Starting</div>
                               <div className="text-gray-400">Region Finals begin in 1 hour.</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {user.profile_image ? (
                    <img src={user.profile_image} alt="Avatar" className="w-8 h-8 rounded-full border border-primary/50 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-xs font-bold text-primary">
                      {user.user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button onClick={logout} className="hidden md:block text-xs font-bold uppercase text-red-400 hover:text-red-300 transition">Logout</button>
                  
                  {/* Hamburger Menu Toggle (Mobile) */}
                  <button className="md:hidden ml-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-5 py-1.5 rounded-full border border-white/10 text-sm font-semibold hover:bg-white/5 transition">
                  Login
                </Link>
                <button className="md:hidden ml-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-4 px-6 flex flex-col gap-4">
          {navLinks.map(link => (
             <NavLink key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)} className={({isActive})=> isActive ? 'text-primary font-bold drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]' : 'text-gray-400 font-medium'}>
               {link.name}
             </NavLink>
          ))}
          {user && (
            <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-4">
              {(user.user?.is_staff || user.user?.is_superuser) && (
                 <NavLink to="/admin-nexus" onClick={() => setMobileMenuOpen(false)} className="text-primary font-bold uppercase text-xs">Admin Nexus</NavLink>
              )}
              <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 font-medium hover:text-white">Dashboard</NavLink>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left font-bold uppercase text-red-400">Logout</button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default NavBar
