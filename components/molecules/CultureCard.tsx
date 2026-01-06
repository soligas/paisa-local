
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface CultureCardProps {
  word: string;
  meaning: string;
  isDark?: boolean;
}

export const CultureCard: React.FC<CultureCardProps> = ({ word, meaning, isDark }) => (
  <motion.div 
    whileHover={{ scale: 1.05, y: -5 }}
    className={`shrink-0 w-[260px] p-10 rounded-[40px] border shadow-xl flex flex-col gap-4 transition-all ${isDark ? 'bg-slate-800 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'}`}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-paisa-emerald/10 flex items-center justify-center text-paisa-emerald">
        <MessageSquare size={16} />
      </div>
      <span className="text-paisa-emerald font-black text-2xl tracking-tighter uppercase">{word}</span>
    </div>
    <div className="h-px bg-slate-100 w-full opacity-50" />
    <span className={`text-sm italic font-medium leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
      "{meaning}"
    </span>
  </motion.div>
);
