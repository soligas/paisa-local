
import React from 'react';
import { Mic, MicOff, Search, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  onReset: () => void;
  isLiveActive: boolean;
  onLiveToggle: () => void;
  hasResults: boolean;
  label: string;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  onReset, isLiveActive, onLiveToggle, hasResults, label
}) => {
  return (
    <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-[400]">
      <motion.div 
        layout
        className="px-4 py-3 rounded-full bg-[#121A21]/90 shadow-4xl border border-white/10 backdrop-blur-3xl flex items-center gap-2"
      >
        {/* Botón de Nueva Búsqueda / Reset */}
        <button 
          onClick={onReset}
          className={`relative flex items-center justify-center h-14 w-14 rounded-full transition-all duration-500 text-white/40 hover:text-white hover:bg-white/5 active:scale-90`}
          title="Nueva Búsqueda"
        >
          {hasResults ? <RotateCcw size={20} /> : <Search size={20} />}
          <AnimatePresence>
            {hasResults && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-paisa-gold rounded-full border-2 border-[#121A21]"
              />
            )}
          </AnimatePresence>
        </button>

        <div className="w-[1px] h-8 bg-white/10 mx-1 shrink-0" />

        {/* Arriero Live - Acción Principal */}
        <button 
          onClick={onLiveToggle} 
          aria-label={label}
          className={`relative h-14 rounded-full flex items-center gap-4 px-8 transition-all duration-500 overflow-hidden active:scale-95
            ${isLiveActive 
              ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' 
              : 'bg-[#2D7A4C] hover:bg-[#3d9c63] shadow-lg shadow-emerald-900/20'}`}
        >
          <div className="relative z-10 flex items-center gap-3">
            {isLiveActive ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white whitespace-nowrap">
              {label}
            </span>
          </div>
          
          {isLiveActive && (
            <motion.div 
              animate={{ 
                x: ['-100%', '100%'],
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          )}
        </button>
      </motion.div>
    </nav>
  );
};
