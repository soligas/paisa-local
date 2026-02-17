
import React, { useState, useEffect, useRef } from 'react';
// Added MapPin to the lucide-react import to fix the "Cannot find name 'MapPin'" error
import { Search, ArrowRight, Utensils, Palette, Loader2, CheckCircle2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBoxProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: (val?: string) => void;
  suggestions?: string[];
  placeholder: string;
  searchLabel?: string;
  isDark?: boolean;
  activeTab?: string;
  isSearchingSuggestions?: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ 
  value, onChange, onSearch, suggestions = [], placeholder, searchLabel = 'BUSCAR', isDark, activeTab, isSearchingSuggestions 
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
      case 'gastronomy': return <Utensils size={24} strokeWidth={3} />;
      case 'culture': return <Palette size={24} strokeWidth={3} />;
      default: return <MapPin size={24} strokeWidth={3} />;
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto px-4 space-y-4 flex flex-col items-center relative z-[60]">
      {/* Search Input Container - Slightly reduced height */}
      <div className="w-full group relative">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 transition-transform group-focus-within:scale-110">
          <Search className={isDark ? 'text-[#D4A574]' : 'text-slate-400'} size={24} strokeWidth={3} />
        </div>
        <input 
          type="text" 
          placeholder={placeholder}
          className={`w-full h-20 pl-16 pr-8 rounded-full border-2 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] outline-none text-lg transition-all font-bold tracking-tight
            ${isDark 
              ? 'bg-slate-900/80 border-white/10 text-white focus:border-[#D4A574] placeholder:text-white/20' 
              : 'bg-white border-slate-100 focus:border-[#2D7A4C] placeholder:text-slate-400'}`}
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
               className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2"
             >
               <Loader2 className={`animate-spin ${isDark ? 'text-[#D4A574]' : 'text-[#2D7A4C]'}`} size={20} strokeWidth={3} />
             </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Tracking Button - More balanced height */}
      <button 
        onClick={() => { onSearch(); setShowSuggestions(false); }} 
        className={`w-full max-w-xs py-5 rounded-[40px] shadow-[0_20px_50px_-15px_rgba(45,122,76,0.3)] active:scale-95 transition-all flex flex-col items-center justify-center border-4 border-white group relative
          ${isDark 
            ? 'bg-[#D4A574] text-[#13011a] hover:brightness-110' 
            : 'bg-[#2D7A4C] text-white hover:bg-[#1a5a35]'}`}
      >
        <div className="flex items-center gap-4">
           <span className="font-black uppercase tracking-[0.3em] text-[18px]">{searchLabel}</span>
           <ArrowRight size={22} strokeWidth={4} className="group-hover:translate-x-2 transition-transform" />
        </div>
      </button>

      {/* Suggestions Popup */}
      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || isSearchingSuggestions) && value.length >= 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className={`absolute top-full left-4 right-4 mt-2 z-[600] rounded-[32px] overflow-hidden border-2 shadow-2xl backdrop-blur-3xl
              ${isDark ? 'bg-slate-950/95 border-white/10' : 'bg-white/95 border-slate-200'}`}
          >
            <div className="p-4 space-y-1">
              <div className="px-6 py-2 flex items-center justify-between border-b border-slate-100/50 mb-2">
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-50 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  SUGERENCIAS TÁCTICAS
                </p>
              </div>

              <div className="space-y-1">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSuggestion(s)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] text-left transition-all group
                      ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-50 text-slate-800'}`}
                  >
                    <div className="flex flex-col">
                      <span className="font-black text-lg leading-none uppercase tracking-tight">{s}</span>
                      <span className={`text-[8px] font-black uppercase tracking-widest mt-1 flex items-center gap-2 text-paisa-emerald`}>
                        <CheckCircle2 size={10} strokeWidth={3} /> INDEXADO
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
