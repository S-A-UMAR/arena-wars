import React, { createContext, useContext, useState, useEffect } from 'react'

const AuraContext = createContext()

export const AURAS = {
  cyberpunk: { label: 'Cyberpunk Gold', color: '45 100% 50%' }, // #ffcc00
  neon: { label: 'Neon Blue', color: '190 100% 50%' }, // #00e5ff
  crimson: { label: 'Crimson Surge', color: '350 100% 60%' }, // #ff3355
  toxic: { label: 'Toxic Green', color: '130 100% 50%' }, // #00ff44
  amethyst: { label: 'Void Amethyst', color: '280 100% 65%' } // #b24dff
}

export function AuraProvider({ children }) {
  const [aura, setAura] = useState(() => {
    return localStorage.getItem('arena_aura') || 'cyberpunk'
  })

  useEffect(() => {
    const selectedAura = AURAS[aura] || AURAS.cyberpunk
    document.documentElement.style.setProperty('--primary', selectedAura.color)
    document.documentElement.style.setProperty('--accent', selectedAura.color)
    localStorage.setItem('arena_aura', aura)
  }, [aura])

  return (
    <AuraContext.Provider value={{ aura, setAura, AURAS }}>
      {children}
    </AuraContext.Provider>
  )
}

export const useAura = () => useContext(AuraContext)
