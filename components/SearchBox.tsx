
import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, ArrowRight, MapPin, Utensils, Palette, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBoxProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: (val?: string) => void;
  suggestions?: string[];
  placeholder: string;
  isDark?: boolean;
  activeTab?: string;
  isSearchingSuggestions?: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ 
  value, onChange, onSearch, suggestions = [], placeholder, isDark, activeTab, isSearchingSuggestions 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (s: string) => {
    onChange(s);
    onSearch(s);
    setShowSuggestions(false);
  };

  const getTabIcon = () => {
    switch(activeTab) {
      case 'gastronomy': return <Utensils size={18} />;
      case 'culture': return <Palette size={18} />;
      default: return <MapPin size={18} />;
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto px-4 relative">
      <div className="flex flex-col md:flex-row gap-6 items-stretch h-auto md:h-24">
        <div className="relative flex-1 group">
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 transition-transform group-focus-within:scale-110">
            <Search className={isDark ? 'text-white/30' : 'text-slate-300'} size={24} />
          </div>
          <input 
            type="text" 
            placeholder={placeholder}
            className={`w-full h-full pl-20 pr-16 py-8 md:py-0 rounded-[32px] border shadow-4xl outline-none text-xl md:text-2xl transition-all font-medium
              ${isDark 
                ? 'bg-slate-900/80 border-white/5 text-white focus:border-paisa-gold placeholder:text-white/20' 
                : 'bg-white border-slate-100 focus:border-paisa-emerald placeholder:text-slate-300'}`}
            value={value}
            onFocus={() => setShowSuggestions(true)}
            onChange={e => {
              onChange(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={e => e.key === 'Enter' && (onSearch(), setShowSuggestions(false))}
          />
          
          <AnimatePresence>
            {isSearchingSuggestions && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2"
               >
                 <Loader2 className={`animate-spin ${isDark ? 'text-paisa-gold' : 'text-paisa-emerald'}`} size={18} />
                 <Sparkles className={isDark ? 'text-paisa-gold/50' : 'text-paisa-emerald/50'} size={14} />
               </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <button 
          onClick={() => { onSearch(); setShowSuggestions(false); }} 
          className={`px-12 py-8 md:py-0 rounded-[32px] font-black uppercase tracking-[0.2em] text-[12px] shadow-4xl active:scale-95 transition-all flex items-center justify-center gap-4 shrink-0
            ${isDark 
              ? 'bg-paisa-gold text-paisa-charcoal hover:brightness-110' 
              : 'bg-paisa-emerald text-white hover:bg-[#1a5a35]'}`}
        >
          Explorar
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Dropdown de Sugerencias Dinámicas */}
      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || isSearchingSuggestions) && value.length >= 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute top-full left-4 right-4 mt-4 z-[600] rounded-[32px] overflow-hidden border shadow-2xl backdrop-blur-3xl
              ${isDark ? 'bg-slate-900/95 border-white/10' : 'bg-white/95 border-slate-100'}`}
          >
            <div className="p-4 space-y-1">
              <div className="px-6 py-3 flex items-center justify-between">
                <p className={`text-[10px] font-black uppercase tracking-widest opacity-30 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isSearchingSuggestions ? 'Consultando guía local...' : 'Sugerencias del Arriero'}
                </p>
                {isSearchingSuggestions && <Loader2 className="animate-spin opacity-20" size={10} />}
              </div>

              <div className="space-y-1">
                {suggestions.map((s, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ x: 10 }}
                    onClick={() => handleSelectSuggestion(s)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all group
                      ${isDark ? 'hover:bg-white/5 text-white/70 hover:text-paisa-gold' : 'hover:bg-slate-50 text-slate-700 hover:text-paisa-emerald'}`}
                  >
                    <div className={`p-2 rounded-xl transition-all duration-300 ${isDark ? 'bg-white/5 text-white/30 group-hover:bg-paisa-gold group-hover:text-slate-950 group-hover:scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-paisa-emerald group-hover:text-white group-hover:scale-110'}`}>
                      {getTabIcon()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-lg leading-none">{s}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-40 transition-opacity mt-1`}>Ver detalle del tesoro</span>
                    </div>
                  </motion.button>
                ))}
                
                {suggestions.length === 0 && !isSearchingSuggestions && (
                  <div className={`px-6 py-8 text-center italic text-sm opacity-40 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    No encontramos pistas mijo, intente otra palabra...
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
