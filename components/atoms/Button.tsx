
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  isDark?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isDark, 
  className = '', 
  ...props 
}) => {
  const base = "px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg";
  
  const variants = {
    primary: isDark ? 'bg-paisa-gold text-slate-900 hover:brightness-110' : 'bg-paisa-emerald text-white hover:bg-[#1a5a35]',
    secondary: 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20',
    ghost: isDark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-paisa-emerald',
    accent: 'bg-paisa-gold text-slate-900 shadow-gold'
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props as any}
    >
      {children}
    </motion.button>
  );
};
