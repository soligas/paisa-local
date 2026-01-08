
import React from 'react';

export type BadgeColor = 'emerald' | 'gold' | 'slate' | 'white' | 'red' | 'blue';

interface BadgeProps {
  children?: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'emerald', className = '' }) => {
  const styles = {
    emerald: 'bg-emerald-600 text-white',
    gold: 'bg-paisa-gold text-slate-900',
    slate: 'bg-slate-100 text-slate-600',
    white: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-600 text-white'
  };
  
  return (
    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm transition-all ${styles[color]} ${className}`}>
      {children}
    </span>
  );
};
