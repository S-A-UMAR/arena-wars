import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`pointer-events-auto min-w-[300px] p-4 rounded-2xl border flex items-center gap-4 shadow-2xl backdrop-blur-xl ${
                toast.type === 'error' 
                  ? 'bg-red-500/10 border-red-500/50 text-red-500' 
                  : toast.type === 'success' 
                  ? 'bg-primary/10 border-primary/50 text-primary' 
                  : 'bg-white/5 border-white/20 text-white'
              }`}
            >
              <div className="text-xl">
                {toast.type === 'error' ? '⚠️' : toast.type === 'success' ? '✅' : 'ℹ️'}
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">
                   {toast.type === 'error' ? 'Critical Interference' : 'Neural Update'}
                </div>
                <div className="text-sm font-bold uppercase italic italic-font-orbitron tracking-tight">
                  {toast.message}
                </div>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="opacity-40 hover:opacity-100 transition"
              >
                 ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
