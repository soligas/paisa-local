
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, MapPin, Coffee, Mountain, Waves, Trees, 
  Utensils, ChefHat, HandMetal, Heart, Compass
} from 'lucide-react';
import { AntioquiaRegion } from '../../types';

interface SafeImageProps {
  src?: string | null | undefined;
  alt: string;
  className?: string;
  region?: AntioquiaRegion | string;
  type?: 'place' | 'dish' | 'experience';
}

export const SafeImage: React.FC<SafeImageProps> = ({ alt, className = "", region = "Valle de Aburrá", type = 'place' }) => {
  
  const getConfig = () => {
    // Configuración por región para lugares
    const regionStyles: Record<string, { color: string, Icon: any, pattern: string }> = {
      'Suroeste': { color: '#4B3621', Icon: Coffee, pattern: 'zócalo' },
      'Oriente': { color: '#2D7A4C', Icon: Mountain, pattern: 'flores' },
      'Urabá': { color: '#1E40AF', Icon: Waves, pattern: 'mar' },
      'Norte': { color: '#166534', Icon: Trees, pattern: 'montaña' },
      'Occidente': { color: '#D97706', Icon: Compass, pattern: 'sol' },
      'Valle de Aburrá': { color: '#059669', Icon: Sparkles, pattern: 'grid' },
    };

    // Configuración por tipo para platos/experiencias
    if (type === 'dish') return { color: '#EA580C', Icon: Utensils, pattern: 'gastronomy' };
    if (type === 'experience') return { color: '#7C3AED', Icon: HandMetal, pattern: 'culture' };

    return regionStyles[region as string] || regionStyles['Valle de Aburrá'];
  };

  const config = getConfig();
  const Icon = config.Icon;

  return (
    <div className={`relative overflow-hidden flex items-center justify-center transition-all duration-700 bg-slate-50 ${className}`}>
      
      {/* Fondo con Patrón SVG - Mejorado con Rombos y mayor escala */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`pattern-${region}-${type}`} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            {config.pattern === 'zócalo' && <rect x="20" y="20" width="20" height="20" transform="rotate(45 30 30)" fill={config.color} />}
            {config.pattern === 'montaña' && <path d="M0 60 L30 10 L60 60 Z" fill={config.color} />}
            {config.pattern === 'mar' && <path d="M0 30 Q 15 10, 30 30 T 60 30" stroke={config.color} fill="none" strokeWidth="2" />}
            {config.pattern === 'gastronomy' && <circle cx="30" cy="30" r="6" fill={config.color} />}
            {config.pattern === 'culture' && <path d="M15 15 L45 45 M45 15 L15 45" stroke={config.color} strokeWidth="1" />}
            {config.pattern === 'grid' && <rect x="25" y="25" width="10" height="10" fill={config.color} opacity="0.5" />}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#pattern-${region}-${type})`} />
      </svg>
      
      {/* Overlay de gradiente suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 flex flex-col items-center gap-3 text-center px-6"
      >
        <div className="p-4 rounded-3xl bg-white shadow-lg border border-slate-100 text-slate-800" style={{ color: config.color }}>
          <Icon size={28} strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <span className="block text-[8px] font-black uppercase tracking-[0.4em] opacity-40 leading-none">
            {type === 'place' ? region : type}
          </span>
          <h4 className="text-lg font-paisa tracking-tighter leading-tight" style={{ color: config.color }}>
            {alt}
          </h4>
        </div>
      </motion.div>
    </div>
  );
};
