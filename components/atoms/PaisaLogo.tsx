
import React from 'react';

export interface PaisaLogoProps {
  className?: string;
  isDark?: boolean;
  onClick?: () => void;
}

export function PaisaLogo({ className = '', isDark, onClick }: PaisaLogoProps) {
  return (
    <div 
      className={`flex items-center gap-4 ${className}`} 
      onClick={onClick} 
      role={onClick ? "button" : undefined} 
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <svg width="60" height="40" viewBox="0 0 120 80" className="drop-shadow-sm">
        <path d="M20 70 L60 10 L100 70 H20Z" fill="#2D7A4C"/>
        <path d="M15 70 C 15 70, 35 25, 110 45 C 110 45, 80 90, 15 70 Z" fill="#D4A574" opacity="0.9"/>
      </svg>
      <div className="flex flex-col -space-y-2">
        <span className="font-paisa text-3xl tracking-tight text-paisa-emerald">PAISA</span>
        <span className={`font-paisa text-3xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>LOCAL</span>
      </div>
    </div>
  );
}
