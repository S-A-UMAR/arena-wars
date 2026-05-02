import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../components/Card'
import { getMatch } from '../services/api'
import { useToast } from '../context/ToastContext'

function WarRoom() {
  const { id } = useParams()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hype, setHype] = useState(0)
  const { showToast } = useToast()

  // Tactical Map WebSockets & Canvas
  const canvasRef = useRef(null)
  const ws = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#3b82f6') // default blue

  useEffect(() => {
    async function load() {
      try {
        const res = await getMatch(id)
        setMatch(res.data)
        setHype(res.data.hype_score || 0)
      } catch (err) {
        showToast("Signal Lost: Match telemetry unreachable", "error")
      } finally {
        setLoading(false)
      }
    }
    load()

    // Initialize WebSocket for WarRoom
    ws.current = new WebSocket(`ws://localhost:8000/ws/warroom/${id}/`)
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'draw') {
        drawLine(data.x0, data.y0, data.x1, data.y1, data.color, false)
      } else if (data.type === 'clear') {
        clearCanvas(false)
      }
    }

    return () => {
      ws.current?.close()
    }
  }, [id])

  const drawLine = (x0, y0, x1, y1, strokeColor, emit = true) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.closePath()

    if (!emit) return
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'draw', x0, y0, x1, y1, color: strokeColor }))
    }
  }

  const clearCanvas = (emit = true) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (emit && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'clear' }))
    }
  }

  // Pointer refs for drawing
  const currentPos = useRef({ x: 0, y: 0 })

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const onMouseDown = (e) => {
    setIsDrawing(true)
    const pos = getPos(e)
    currentPos.current = pos
  }

  const onMouseUp = () => {
    setIsDrawing(false)
  }

  const onMouseMove = (e) => {
    if (!isDrawing) return
    const pos = getPos(e)
    drawLine(currentPos.current.x, currentPos.current.y, pos.x, pos.y, color, true)
    currentPos.current = pos
  }

  const onHype = () => {
    setHype(prev => prev + 1)
  }

  if (loading) return <div className="h-screen flex items-center justify-center text-white italic animate-pulse">Establishing Satellite Link...</div>

  return (
    <div className="space-y-8 pb-32">
      <div className="relative h-[250px] rounded-[4rem] overflow-hidden border border-white/5 bg-black">
         <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" />
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
         
         <div className="relative h-full flex flex-col items-center justify-center p-10 text-center">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase italic-font-orbitron tracking-tighter text-white">Tactical <span className="text-primary">War Room</span></h1>
            <p className="text-muted-foreground mt-2 uppercase tracking-widest text-xs font-bold">Collaborative Strategy Board</p>
         </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-8 relative z-10">
         
         {/* Tools Panel */}
         <Card className="p-6 border-white/5 bg-white/[0.01] backdrop-blur-2xl rounded-[3rem] space-y-6 h-fit">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-white/10 pb-4">Marker Palette</h3>
            <div className="flex gap-4">
               <button onClick={() => setColor('#3b82f6')} className={`w-10 h-10 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition ${color === '#3b82f6' ? 'ring-2 ring-white scale-110' : 'opacity-50'}`}></button>
               <button onClick={() => setColor('#ef4444')} className={`w-10 h-10 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition ${color === '#ef4444' ? 'ring-2 ring-white scale-110' : 'opacity-50'}`}></button>
               <button onClick={() => setColor('#eab308')} className={`w-10 h-10 rounded-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)] transition ${color === '#eab308' ? 'ring-2 ring-white scale-110' : 'opacity-50'}`}></button>
               <button onClick={() => setColor('#22c55e')} className={`w-10 h-10 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] transition ${color === '#22c55e' ? 'ring-2 ring-white scale-110' : 'opacity-50'}`}></button>
            </div>
            <button onClick={() => clearCanvas(true)} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition">
               Clear Board
            </button>
         </Card>

         {/* Tactical Map Canvas */}
         <div className="lg:col-span-3">
            <Card className="relative overflow-hidden border border-white/10 rounded-[3rem] bg-black shadow-2xl group">
               {/* Grid Background simulating a blueprint/map */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
               
               {/* 3 Lanes visualization */}
               <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                     {/* Top Lane */}
                     <path d="M 50 750 Q 50 50 750 50" fill="transparent" stroke="#eab308" strokeWidth="8" strokeDasharray="20 10"/>
                     {/* Mid Lane */}
                     <path d="M 50 750 L 750 50" fill="transparent" stroke="#eab308" strokeWidth="8" strokeDasharray="20 10"/>
                     {/* Bot Lane */}
                     <path d="M 50 750 Q 750 750 750 50" fill="transparent" stroke="#eab308" strokeWidth="8" strokeDasharray="20 10"/>
                     {/* River */}
                     <path d="M 0 0 L 800 800" fill="transparent" stroke="#3b82f6" strokeWidth="20" opacity="0.5"/>
                  </svg>
               </div>

               <canvas
                  ref={canvasRef}
                  width={800}
                  height={800}
                  onMouseDown={onMouseDown}
                  onMouseUp={onMouseUp}
                  onMouseOut={onMouseUp}
                  onMouseMove={onMouseMove}
                  className="relative z-10 w-full h-auto aspect-square cursor-crosshair touch-none"
               />
               <div className="absolute top-4 right-4 bg-black/50 backdrop-blur border border-primary/30 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 pointer-events-none">
                 <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Live Sync
               </div>
            </Card>
         </div>
      </div>
    </div>
  )
}

export default WarRoom
