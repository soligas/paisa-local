
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, Waves, Mountain, Trees, Compass, Users, 
  ChevronRight, Map as MapIcon, Sparkles, Navigation as NavIcon,
  Sun, Wind, Briefcase, Zap, Star, LayoutGrid, Shield, Activity
} from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { SupportedLang } from '../../types';

interface RegionData {
  id: string;
  name: Record<SupportedLang, string>;
  municipios: number;
  vibe: Record<SupportedLang, string>;
  icon: any;
  path: string;
  color: string;
  tesoros: Record<SupportedLang, string[]>;
}

const REGIONS: RegionData[] = [
  { 
    id: 'uraba', name: { es: 'Urabá', en: 'Uraba', pt: 'Urabá' }, municipios: 11, 
    vibe: { es: 'Mar de Oportunidades', en: 'Sea of Opportunities', pt: 'Mar de Oportunidades' }, 
    icon: Wind, color: '#1e40af', // Blue for Sea
    path: "M15,25 L35,15 L55,20 L60,35 L45,55 L25,60 L15,45 Z",
    tesoros: { es: ['Necoclí', 'Apartadó', 'Turbo', 'Arboletes'], en: ['Necocli', 'Apartado', 'Turbo', 'Arboletes'], pt: ['Necocli', 'Apartadó', 'Turbo', 'Arboletes'] }
  },
  { 
    id: 'norte', name: { es: 'Norte', en: 'North', pt: 'Norte' }, municipios: 17, 
    vibe: { es: 'Ruta de la Leche', en: 'The Milk Route', pt: 'Rota do Leite' }, 
    icon: Trees, color: '#065f46', // Dark Green
    path: "M55,20 L80,15 L95,30 L75,50 L60,35 Z",
    tesoros: { es: ['Belmira', 'S. Rosa de Osos', 'Entrerríos', 'Yarumal'], en: ['Belmira', 'Santa Rosa', 'Entrerrios', 'Yarumal'], pt: ['Belmira', 'Santa Rosa', 'Entrerríos', 'Yarumal'] }
  },
  { 
    id: 'occidente', name: { es: 'Occidente', en: 'West', pt: 'Ocidente' }, municipios: 19, 
    vibe: { es: 'Historia y Sol', en: 'History & Sun', pt: 'História e Sol' }, 
    icon: Sun, color: '#b45309', // Amber
    path: "M45,55 L65,55 L65,75 L40,85 L25,60 Z",
    tesoros: { es: ['Sta Fe de Antioquia', 'Sopetrán', 'San Jerónimo', 'Liborina'], en: ['Santa Fe', 'Sopetran', 'San Jeronimo', 'Liborina'], pt: ['Santa Fé', 'Sopetran', 'São Jerônimo', 'Liborina'] }
  },
  { 
    id: 'aburra', name: { es: 'Valle de Aburrá', en: 'Aburra Valley', pt: 'Vale de Aburrá' }, municipios: 10, 
    vibe: { es: 'Corazón Urbano', en: 'Urban Heart', pt: 'Coração Urbano' }, 
    icon: NavIcon, color: '#2d7a4c', // Emerald
    path: "M65,55 L85,55 L90,70 L70,80 L65,75 Z",
    tesoros: { es: ['Medellín', 'Envigado', 'Sabaneta', 'Bello'], en: ['Medellin', 'Envigado', 'Sabaneta', 'Bello'], pt: ['Medellín', 'Envigado', 'Sabaneta', 'Bello'] }
  },
  { 
    id: 'oriente', name: { es: 'Oriente', en: 'East', pt: 'Oriente' }, municipios: 23, 
    vibe: { es: 'Aguas y Flores', en: 'Waters & Flowers', pt: 'Águas e Flores' }, 
    icon: Waves, color: '#0369a1', // Sky Blue
    path: "M85,55 L110,65 L100,85 L85,100 L70,95 L70,80 Z",
    tesoros: { es: ['Guatapé', 'El Carmen', 'Rionegro', 'La Ceja', 'San Rafael'], en: ['Guatape', 'El Carmen', 'Rionegro', 'La Ceja', 'San Rafael'], pt: ['Guatapé', 'El Carmen', 'Rionegro', 'La Ceja', 'San Rafael'] }
  },
  { 
    id: 'suroeste', name: { es: 'Suroeste', en: 'Southwest', pt: 'Sudoeste' }, municipios: 23, 
    vibe: { es: 'Cuna del Café', en: 'Coffee Cradle', pt: 'Berço do Café' }, 
    icon: Coffee, color: '#78350f', // Coffee Brown
    path: "M40,85 L65,75 L70,80 L70,95 L60,110 L45,105 Z",
    tesoros: { es: ['Jardín', 'Jericó', 'Támesis', 'Urrao'], en: ['Jardin', 'Jerico', 'Tamesis', 'Urrao'], pt: ['Jardín', 'Jericó', 'Támesis', 'Urrao'] }
  }
];

interface EpicAntioquiaMapProps {
  onSelectRegion: (name: string) => void;
  lang: SupportedLang;
  t: any;
  onRequestPayment?: () => void;
}

export const EpicAntioquiaMap: React.FC<EpicAntioquiaMapProps> = ({ onSelectRegion, lang, t, onRequestPayment }) => {
  const [hovered, setHovered] = useState<RegionData | null>(null);
  const [selected, setSelected] = useState<RegionData | null>(REGIONS[0]);

  const activeRegion = hovered || selected;

  return (
    <div className="relative w-full rounded-[64px] overflow-hidden shadow-4xl border border-slate-100 flex flex-col lg:flex-row bg-white h-auto lg:min-h-[750px]">
      <div className="z-20 w-full lg:w-[45%] p-10 md:p-14 flex flex-col justify-center bg-white/80 backdrop-blur-3xl border-r border-slate-50 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeRegion && (
            <motion.div 
              key={activeRegion.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-[28px] bg-white border-2 flex items-center justify-center shadow-[0_15px_35px_-10px_rgba(0,0,0,0.1)] transition-all duration-500"
                      style={{ borderColor: activeRegion.color + '30' }}>
                    <activeRegion.icon size={40} strokeWidth={2.5} style={{ color: activeRegion.color }} />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-paisa-gold">{t.tag}</h4>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 leading-none">{activeRegion.name[lang]}</h2>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm flex flex-col gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{t.census}</span>
                    <span className="text-3xl font-black text-slate-900 leading-none">{activeRegion.municipios} Pueblos</span>
                 </div>
                 <div className="p-8 rounded-[40px] bg-emerald-50/50 border border-emerald-100 flex flex-col gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-paisa-emerald">{t.pulse}</span>
                    <span className="text-3xl font-black text-paisa-emerald leading-none">Top Vibe</span>
                 </div>
              </div>

              <div className="space-y-6">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 px-2">
                    <LayoutGrid size={12} /> {t.treasures}
                 </span>
                 <div className="flex flex-wrap gap-2.5">
                    {activeRegion.tesoros[lang].map((t_name, idx) => (
                      <button key={t_name} onClick={() => onSelectRegion(t_name)} className="px-6 py-4 rounded-2xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest hover:bg-paisa-emerald hover:text-white transition-all shadow-sm active:scale-95">
                        {t_name}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="pt-6 space-y-4">
                <button 
                  onClick={() => onSelectRegion(activeRegion.name[lang])} 
                  className="w-full py-8 bg-slate-900 text-white rounded-[32px] font-black uppercase text-[14px] tracking-[0.3em] shadow-4xl hover:bg-paisa-emerald transition-all flex items-center justify-center gap-4 group"
                >
                  {t.exploreBtn} {activeRegion.name[lang].toUpperCase()} <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>

                {/* Support Button Pill as shown in screenshot */}
                <button 
                  onClick={onRequestPayment}
                  className="w-full py-5 px-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center gap-4 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all active:scale-95 shadow-sm group"
                >
                   <div className="flex gap-1.5 items-center opacity-40 group-hover:opacity-100 transition-opacity">
                      <div className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                      <div className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                   </div>
                   <span className="text-[12px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                     {t.impulsar}
                   </span>
                   <div className="flex gap-1.5 items-center opacity-40 group-hover:opacity-100 transition-opacity">
                      <div className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                      <div className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                   </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50/50 relative overflow-visible">
        <svg viewBox="0 0 150 120" className="w-full h-full max-h-[550px] drop-shadow-[0_45px_65px_rgba(0,0,0,0.1)] overflow-visible">
          {REGIONS.map((region) => (
            <motion.path
              key={region.id} d={region.path}
              fill={activeRegion?.id === region.id ? '#D4A574' : region.color}
              stroke="#FFFFFF" strokeWidth="1.2"
              onClick={() => setSelected(region)}
              onMouseEnter={() => setHovered(region)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer transition-all duration-300"
              animate={{ 
                fill: activeRegion?.id === region.id ? '#D4A574' : region.color,
                scale: activeRegion?.id === region.id ? 1.02 : 1,
                filter: activeRegion?.id === region.id ? 'brightness(1.1)' : 'brightness(1)'
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};
