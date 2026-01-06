
import React from 'react';
import { Search, History, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../atoms/Button';

interface SearchHeroProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: (val?: string) => void;
  placeholder: string;
  isDark?: boolean;
  history?: { titulo: string }[];
}

export const SearchHero: React.FC<SearchHeroProps> = ({ value, onChange, onSearch, placeholder, isDark, history }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 px-4">
      <div className="flex flex-col md:flex-row gap-8 items-stretch h-auto md:h-24">
        <div className="relative flex-1 group">
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 transition-transform group-focus-within:scale-110">
            <Search className={isDark ? 'text-white/30' : 'text-slate-300'} size={24} />
          </div>
          <input 
            type="text" 
            placeholder={placeholder}
            className={`w-full h-full pl-20 pr-8 py-8 md:py-0 rounded-[32px] border shadow-4xl outline-none text-xl md:text-3xl transition-all font-medium
              ${isDark 
                ? 'bg-slate-900/80 border-white/5 text-white focus:border-paisa-gold' 
                : 'bg-white border-slate-100 focus:border-paisa-emerald'}`}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
          />
        </div>
        <Button 
          variant="primary" 
          isDark={isDark}
          onClick={() => onSearch()}
          className="h-full px-12"
        >
          <Sparkles size={20} />
          Explorar
        </Button>
      </div>

      {history && history.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {history.slice(0, 4).map((h, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -4, scale: 1.05 }}
              onClick={() => onSearch(h.titulo)}
              className={`flex items-center gap-4 px-8 py-4 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all shadow-sm
                ${isDark ? 'border-white/10 text-white/40 hover:text-paisa-gold bg-white/5' : 'border-slate-200 text-slate-400 hover:text-paisa-emerald bg-slate-50'}`}
            >
              <History size={14} />
              {h.titulo}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
};
