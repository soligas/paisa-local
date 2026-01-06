
import React from 'react';
import { Trophy, Star, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChallengeData } from '../../types';
import { Badge } from '../atoms/Badge';

interface ChallengeCardProps {
  challenge: ChallengeData;
  isDark?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, isDark }) => {
  const difficultyColors = {
    'Fácil': 'emerald',
    'Media': 'gold',
    'Arriero': 'red'
  } as const;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`p-10 rounded-[48px] border transition-all relative overflow-hidden flex flex-col justify-between h-full shadow-xl
        ${challenge.completado ? 'bg-paisa-emerald text-white' : (isDark ? 'bg-slate-800 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900')}`}
    >
      <div className="space-y-6 relative z-10">
        <div className="flex justify-between items-start">
          <div className={`p-4 rounded-2xl ${challenge.completado ? 'bg-white/20' : 'bg-paisa-gold/10 text-paisa-gold'}`}>
            <Trophy size={24} />
          </div>
          <Badge color={challenge.completado ? 'white' : difficultyColors[challenge.dificultad]}>
            {challenge.dificultad}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-3xl font-black uppercase tracking-tighter leading-none">{challenge.titulo}</h4>
          <p className={`text-sm italic font-medium leading-relaxed ${challenge.completado ? 'text-white/70' : 'text-slate-400'}`}>
            "{challenge.mision}"
          </p>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Zap size={14} className={challenge.completado ? 'text-white' : 'text-paisa-gold'} fill="currentColor" />
          <span className="text-xs font-black uppercase tracking-widest">{challenge.recompensa}</span>
        </div>
        {challenge.completado && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle2 size={24} className="text-white" />
          </motion.div>
        )}
      </div>

      {/* Decorative background element */}
      <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none">
        <Trophy size={120} strokeWidth={1} />
      </div>
    </motion.div>
  );
};
