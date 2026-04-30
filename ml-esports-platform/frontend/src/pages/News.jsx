import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { listNews } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'

function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await listNews()
        setNews(res.data)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const firstNews = news[0]
  const otherNews = news.slice(1)

  return (
    <div className="space-y-16 pb-32">
      <header className="relative py-20 px-10 rounded-[4rem] overflow-hidden glass border border-white/5 text-center">
        <div className="relative z-10 space-y-4">
           <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Intelligence Broadcast</div>
           <h1 className="text-6xl md:text-8xl font-black italic uppercase italic-font-orbitron text-white leading-none">The <span className="text-primary">Dispatch</span></h1>
           <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed italic opacity-80">"Stay synchronized with global operational updates and community breakthroughs."</p>
        </div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-accent/5 -z-0" />
      </header>

      <AnimatePresence>
        {!loading && news.length > 0 && (
          <div className="space-y-16">
             {/* Hero News */}
             {firstNews && (
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-0 overflow-hidden border-white/5 rounded-[4rem] group hover:border-primary/30 transition-all duration-700">
                     <div className="flex flex-col lg:flex-row h-full lg:h-[500px]">
                        <div className="lg:w-3/5 relative overflow-hidden">
                           <img 
                             src={firstNews.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070"} 
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                           />
                           <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent hidden lg:block" />
                           <div className="absolute top-8 left-8">
                              <span className="px-4 py-1.5 rounded-full bg-primary text-background text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">Breaking Intel</span>
                           </div>
                        </div>
                        <div className="lg:w-2/5 p-12 flex flex-col justify-center space-y-6">
                           <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{new Date(firstNews.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                           <h2 className="text-4xl font-black text-white uppercase italic italic-font-orbitron leading-none group-hover:text-primary transition-colors">{firstNews.title}</h2>
                           <p className="text-gray-400 leading-relaxed font-medium opacity-80">{firstNews.content}</p>
                           <button className="btn w-fit px-10 py-4 text-xs">Analyze Report →</button>
                        </div>
                     </div>
                  </Card>
               </motion.div>
             )}

             {/* Other News Grid */}
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {otherNews.map((item, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={item.id}
                  >
                    <Card className="h-full flex flex-col group overflow-hidden border-white/10 hover:border-primary/50 transition-all duration-500 p-0 rounded-[3rem]">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={item.image || "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071"} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
                        />
                      </div>
                      <div className="p-8 flex-1 flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-[8px] font-black uppercase tracking-widest text-primary">COMMUNIQUE #{item.id}</span>
                           <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase italic group-hover:text-primary transition-colors leading-tight italic-font-orbitron">{item.title}</h2>
                        <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed opacity-60 font-medium">{item.content}</p>
                        <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-primary">HQ</div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Command Center</span>
                          </div>
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline cursor-pointer group-hover:mr-2 transition-all">Read Full Intel →</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
             </div>
          </div>
        )}

        {!loading && news.length === 0 && (
          <div className="py-40 text-center glass rounded-[4rem] border border-white/5 opacity-50 space-y-6">
            <div className="text-6xl animate-pulse">📡</div>
            <p className="text-muted-foreground uppercase tracking-[0.5em] font-black text-xs italic">Awaiting Global Operational Transmissions...</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default News
