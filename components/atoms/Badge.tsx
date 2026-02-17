
import React from 'react';

export type BadgeColor = 'emerald' | 'gold' | 'slate' | 'white' | 'red' | 'blue';

interface BadgeProps {
  children?: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'emerald', className = '' }) => {
  const styles = {
    emerald: 'bg-[#2D7A4C] text-white border-2 border-[#1a5a35]',
    gold: 'bg-[#D4A574] text-[#1e293b] border-2 border-[#B48444]',
    slate: 'bg-[#f1f5f9] text-[#64748b] border-2 border-[#e2e8f0]',
    white: 'bg-white text-[#0f172a] border-2 border-[#e2e8f0]',
    red: 'bg-[#ef4444] text-white border-2 border-[#b91c1c]',
    blue: 'bg-[#2563eb] text-white border-2 border-[#1d4ed8]'
  };
  
  return (
    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 ${styles[color]} ${className}`}>
      {children}
    </span>
  );
};
