import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { AuraProvider } from './context/AuraContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <AuraProvider>
        <App />
      </AuraProvider>
    </AuthProvider>
  </BrowserRouter>
)
