import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import { getMatchDraft, saveMatchDraft } from '../services/api'

function DraftLobby() {
  const { matchId } = useParams()
  const [draft, setDraft] = useState({
    team_a_bans: [],
    team_b_bans: [],
    team_a_picks: [],
    team_b_picks: []
  })
  const [turn, setTurn] = useState('A_BAN')

  const heroes = ['Ling', 'Fanny', 'Lancelot', 'Kagura', 'Pharsa', 'Lunox', 'Tigreal', 'Khufra', 'Atlas', 'Claude', 'Karrie', 'Wanwan']

  async function loadDraft() {
    try {
      const res = await getMatchDraft(matchId)
      if (res.data && res.data.length > 0) setDraft(res.data[0])
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    loadDraft()
    const interval = setInterval(loadDraft, 3000)
    return () => clearInterval(interval)
  }, [matchId])

  async function handleAction(hero) {
    let newDraft = { ...draft }
    if (turn === 'A_BAN') {
      newDraft.team_a_bans.push(hero)
      setTurn('B_BAN')
    } else if (turn === 'B_BAN') {
      newDraft.team_b_bans.push(hero)
      setTurn('A_PICK')
    } else if (turn === 'A_PICK') {
      newDraft.team_a_picks.push(hero)
      setTurn('B_PICK')
    } else if (turn === 'B_PICK') {
      newDraft.team_b_picks.push(hero)
      setTurn('A_PICK')
    }
    setDraft(newDraft)
    await saveMatchDraft({ match: matchId, ...newDraft })
  }

  return (
    <div className="space-y-10 pb-20">
      <header className="text-center">
        <h1 className="text-3xl font-black italic uppercase italic-font-orbitron text-white">Match <span className="text-primary">Draft</span></h1>
        <div className="text-[10px] text-accent font-bold uppercase tracking-[0.4em] mt-2">Strategic Ban & Pick Phase</div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-6">
           <h2 className="text-lg font-bold text-blue-400 uppercase italic">Team Alpha</h2>
           <Card className="border-blue-500/20 bg-blue-500/5">
              <div className="text-[10px] font-bold text-blue-300 mb-4 uppercase">Bans</div>
              <div className="flex gap-2">
                 {draft.team_a_bans.map((h, i) => <div key={i} className="w-10 h-10 rounded border border-red-500/50 bg-red-500/10 flex items-center justify-center text-[8px] text-red-500 font-bold">{h}</div>)}
                 {draft.team_a_bans.length === 0 && <div className="w-10 h-10 rounded border border-white/5 bg-white/5" />}
              </div>
              <div className="text-[10px] font-bold text-blue-300 mt-6 mb-4 uppercase">Picks</div>
              <div className="space-y-2">
                 {draft.team_a_picks.map((h, i) => <div key={i} className="p-2 rounded bg-blue-500/20 border border-blue-500/30 text-white font-bold text-xs">{h}</div>)}
                 {draft.team_a_picks.length === 0 && <div className="p-2 rounded border border-dashed border-white/10 text-muted-foreground text-[10px] text-center italic">Waiting for picks...</div>}
              </div>
           </Card>
        </div>

        <div>
           <Card className="glass border-white/10">
              <div className="text-center text-[10px] font-bold text-muted-foreground uppercase mb-6 tracking-widest">Select Hero - {turn}</div>
              <div className="grid grid-cols-3 gap-3">
                 {heroes.map(h => (
                   <button 
                     key={h} 
                     disabled={draft.team_a_bans.includes(h) || draft.team_b_bans.includes(h) || draft.team_a_picks.includes(h) || draft.team_b_picks.includes(h)}
                     onClick={() => handleAction(h)}
                     className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-bold text-gray-400 hover:border-primary hover:text-white transition disabled:opacity-30"
                   >
                     {h}
                   </button>
                 ))}
              </div>
           </Card>
        </div>

        <div className="space-y-6 text-right">
           <h2 className="text-lg font-bold text-secondary uppercase italic">Team Omega</h2>
           <Card className="border-secondary/20 bg-secondary/5">
              <div className="text-[10px] font-bold text-secondary mb-4 uppercase">Bans</div>
              <div className="flex gap-2 justify-end">
                 {draft.team_b_bans.map((h, i) => <div key={i} className="w-10 h-10 rounded border border-red-500/50 bg-red-500/10 flex items-center justify-center text-[8px] text-red-500 font-bold">{h}</div>)}
                 {draft.team_b_bans.length === 0 && <div className="w-10 h-10 rounded border border-white/5 bg-white/5" />}
              </div>
              <div className="text-[10px] font-bold text-secondary mt-6 mb-4 uppercase">Picks</div>
              <div className="space-y-2">
                 {draft.team_b_picks.map((h, i) => <div key={i} className="p-2 rounded bg-secondary/20 border border-secondary/30 text-white font-bold text-xs">{h}</div>)}
                 {draft.team_b_picks.length === 0 && <div className="p-2 rounded border border-dashed border-white/10 text-muted-foreground text-[10px] text-center italic">Waiting for picks...</div>}
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}

export default DraftLobby
