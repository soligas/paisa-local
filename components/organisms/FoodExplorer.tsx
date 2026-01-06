
import React from 'react';
import { Search, Loader2, ChevronRight, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

interface FoodExplorerProps {
  query: string;
  setQuery: (val: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  placeholder: string;
  isDark?: boolean;
}

export const FoodExplorer: React.FC<FoodExplorerProps> = ({ 
  query, setQuery, onSearch, isLoading, placeholder, isDark 
}) => {
  return (
    <div className="max-w-4xl mx-auto px-8 mb-24 space-y-8">
      <div className={`group relative h-24 rounded-[40px] border flex items-center transition-all shadow-4xl
        ${isDark ? 'bg-slate-900 border-white/5 focus-within:border-paisa-gold' : 'bg-white border-slate-100 focus-within:border-paisa-emerald'}`}>
        <div className="ml-10 text-slate-300 group-focus-within:text-paisa-emerald transition-colors">
          <Utensils size={32} />
        </div>
        <input 
          type="text" 
          placeholder={placeholder} 
          className="flex-1 bg-transparent border-none outline-none px-8 text-2xl font-medium placeholder:text-slate-300" 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && onSearch()} 
        />
        <button 
          onClick={onSearch} 
          className={`mr-4 w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90
            ${isDark ? 'bg-paisa-gold text-slate-900' : 'bg-paisa-emerald text-white'}`}
        >
          {isLoading ? <Loader2 className="animate-spin" size={28} /> : <ChevronRight size={28} />}
        </button>
      </div>
      <div className="flex gap-4 justify-center overflow-x-auto no-scrollbar pb-2">
        {['Bandeja Paisa', 'Chicharrón', 'Café', 'Trucha', 'Mecato'].map(tag => (
          <button 
            key={tag}
            onClick={() => { setQuery(tag); onSearch(); }}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap
              ${isDark ? 'border-white/10 text-white/40 hover:text-paisa-gold' : 'border-slate-200 text-slate-400 hover:text-paisa-emerald'}`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
