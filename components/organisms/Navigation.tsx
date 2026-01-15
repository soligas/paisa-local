
import React, { useState } from 'react';
import { Mic, MicOff, Search, RotateCcw, Accessibility, Languages, Check, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SupportedLang } from '../../types';

interface NavigationProps {
  onReset: () => void;
  isLiveActive: boolean;
  onLiveToggle: () => void;
  hasResults: boolean;
  label: string;
  // Nuevas props para Idiomas y Accesibilidad
  currentLang: SupportedLang;
  onLangChange: (lang: SupportedLang) => void;
  isAccessibilityActive: boolean;
  onAccessibilityToggle: () => void;
}

const LANGUAGES: { code: SupportedLang; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: '🇨🇴' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' }
];

export const Navigation: React.FC<NavigationProps> = ({ 
  onReset, isLiveActive, onLiveToggle, hasResults, label,
  currentLang, onLangChange, isAccessibilityActive, onAccessibilityToggle
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-[400] w-max max-w-[95vw]">
      
      {/* Módulo Izquierdo: Accesibilidad e Idiomas */}
      <div className="flex items-center gap-2 p-2 rounded-full bg-[#121A21]/90 border border-white/10 backdrop-blur-3xl shadow-4xl">
        {/* Accesibilidad */}
        <button 
          onClick={onAccessibilityToggle}
          className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${isAccessibilityActive ? 'bg-paisa-gold text-slate-900 shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          title="Modo Accesibilidad"
        >
          <Accessibility size={20} />
        </button>

        {/* Selector de Idiomas */}
        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className={`h-12 px-4 rounded-full flex items-center gap-3 transition-all duration-300 ${showLangMenu ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Languages size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">{currentLang}</span>
            <ChevronUp size={14} className={`transition-transform duration-300 ${showLangMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showLangMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full mb-4 left-0 w-48 rounded-[24px] bg-[#121A21] border border-white/10 shadow-2xl p-2 overflow-hidden"
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLangChange(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl transition-all ${currentLang === lang.code ? 'bg-paisa-emerald text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{lang.label}</span>
                    </div>
                    {currentLang === lang.code && <Check size={14} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Módulo Central: Acción Principal & Búsqueda */}
      <motion.div 
        layout
        className="px-3 py-2 rounded-full bg-[#121A21]/90 shadow-4xl border border-white/10 backdrop-blur-3xl flex items-center gap-3"
      >
        <button 
          onClick={onReset}
          className="relative flex items-center justify-center h-12 w-12 rounded-full transition-all duration-500 text-white/40 hover:text-white hover:bg-white/5 active:scale-90"
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

        <button 
          onClick={onLiveToggle} 
          className={`relative h-12 rounded-full flex items-center gap-4 px-8 transition-all duration-500 overflow-hidden active:scale-95
            ${isLiveActive 
              ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' 
              : 'bg-paisa-emerald hover:bg-emerald-500 shadow-lg shadow-emerald-900/20'}`}
        >
          <div className="relative z-10 flex items-center gap-3">
            {isLiveActive ? <MicOff size={18} className="text-white" /> : <Mic size={18} className="text-white" />}
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white whitespace-nowrap">
              {label}
            </span>
          </div>
          
          {isLiveActive && (
            <motion.div 
              animate={{ x: ['-100%', '100%'], opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          )}
        </button>
      </motion.div>
    </nav>
  );
};
