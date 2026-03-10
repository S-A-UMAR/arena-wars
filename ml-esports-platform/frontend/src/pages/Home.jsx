import Card from '../components/Card'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl neon-text">Scrim Marketplace</h2>
            <p className="text-gray-300">Find and organize scrims</p>
          </div>
          <Link to="/scrims" className="btn">Browse</Link>
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl neon-text">Tournaments</h2>
            <p className="text-gray-300">Create and join events</p>
          </div>
          <Link to="/tournaments" className="btn">Explore</Link>
        </div>
      </Card>
      <Card className="md:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl neon-text">Leaderboards</h2>
            <p className="text-gray-300">Top players and guilds</p>
          </div>
          <Link to="/leaderboard" className="btn">View</Link>
        </div>
      </Card>
    </div>
  )
}

export default Home
