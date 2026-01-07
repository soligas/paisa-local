
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin } from 'lucide-react';

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

/**
 * SafeImage ahora actúa como un contenedor decorativo sin cargar imágenes externas.
 * Mantiene la estética "Paisa Local" con gradientes y tipografía.
 */
export const SafeImage: React.FC<SafeImageProps> = ({ alt, className = "" }) => {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-b border-slate-100 ${className}`}>
      {/* Patrón decorativo de fondo */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #2D7A4C 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />
      
      <div className="relative z-10 flex flex-col items-center gap-3 text-paisa-emerald/30 group-hover:text-paisa-emerald/50 transition-colors">
        <div className="p-4 rounded-full bg-white/50 backdrop-blur-sm border border-white">
          <Sparkles size={24} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-center px-6 leading-tight">
          {alt}
        </span>
      </div>

      {/* Esquinas decorativas */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-paisa-gold/20" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-paisa-gold/20" />
    </div>
  );
};
