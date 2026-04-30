import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './Card'
import { useAuth } from '../context/AuthContext'

function ChatWidget() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [activeChat, setActiveChat] = useState(null)
  const [message, setMessage] = useState('')
  const [chats, setChats] = useState([
    { id: 1, user: 'LeaderX', lastMessage: 'See you in the arena.', online: true },
    { id: 2, user: 'SgtDoom', lastMessage: 'Check the social wall.', online: false }
  ])

  if (!user) return null

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 h-[28rem] flex flex-col"
          >
            <Card className="flex-1 flex flex-col overflow-hidden glass border-white/10 shadow-2xl">
              <header className="p-4 bg-primary/10 border-b border-white/5 flex justify-between items-center">
                 <h3 className="text-xs font-black uppercase tracking-widest text-white italic">Tactical Comms</h3>
                 <button onClick={() => activeChat ? setActiveChat(null) : setIsOpen(false)} className="text-muted-foreground hover:text-white transition">
                    {activeChat ? '← Back' : '× Close'}
                 </button>
              </header>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {activeChat ? (
                  <div className="space-y-4">
                     <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-2xl bg-white/5 text-xs text-white border border-white/5">
                           Ready for the tournament draft?
                        </div>
                     </div>
                     <div className="flex justify-end">
                        <div className="max-w-[80%] p-3 rounded-2xl bg-primary/20 text-xs text-white border border-primary/30">
                           Affirmative. Ling is ready.
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                     {chats.map(chat => (
                       <button key={chat.id} onClick={() => setActiveChat(chat)} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition group text-left">
                          <div className="flex items-center gap-3">
                             <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-black text-white">
                                   {chat.user[0]}
                                </div>
                                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${chat.online ? 'bg-green-500' : 'bg-gray-500'}`} />
                             </div>
                             <div>
                                <div className="text-[10px] font-bold text-white uppercase">{chat.user}</div>
                                <div className="text-[8px] text-muted-foreground truncate w-32">{chat.lastMessage}</div>
                             </div>
                          </div>
                          <span className="text-[8px] font-black text-primary opacity-0 group-hover:opacity-100 transition tracking-widest">OPEN</span>
                       </button>
                     ))}
                  </div>
                )}
              </div>

              {activeChat && (
                <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
                   <input className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary transition" placeholder="Transmit..." value={message} onChange={e => setMessage(e.target.value)} />
                   <button className="p-2 rounded-xl bg-primary text-background text-xs font-black">▶</button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setIsOpen(!isOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-white/10 scale-90' : 'bg-primary hover:scale-110 active:scale-95 shadow-primary/40'}`}>
         {isOpen ? <span className="text-white text-xl">×</span> : <span className="text-background text-xl">💬</span>}
      </button>
    </div>
  )
}

export default ChatWidget
