
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, Waves, Mountain, Trees, Compass, Users, 
  ChevronRight, Map as MapIcon, Sparkles, Navigation as NavIcon,
  Sun, Wind, Briefcase, Zap, Star, LayoutGrid
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
    icon: Wind, color: '#1B4731', 
    path: "M15,25 L35,15 L55,20 L60,35 L45,55 L25,60 L15,45 Z",
    tesoros: { es: ['Necoclí', 'Apartadó', 'Turbo', 'Arboletes'], en: ['Necocli', 'Apartado', 'Turbo', 'Arboletes'], pt: ['Necocli', 'Apartadó', 'Turbo', 'Arboletes'] }
  },
  { 
    id: 'norte', name: { es: 'Norte', en: 'North', pt: 'Norte' }, municipios: 17, 
    vibe: { es: 'Ruta de la Leche', en: 'The Milk Route', pt: 'Rota do Leite' }, 
    icon: Trees, color: '#2d7a4c', 
    path: "M55,20 L80,15 L95,30 L75,50 L60,35 Z",
    tesoros: { es: ['Belmira', 'S. Rosa de Osos', 'Entrerríos', 'Yarumal'], en: ['Belmira', 'Santa Rosa', 'Entrerrios', 'Yarumal'], pt: ['Belmira', 'Santa Rosa', 'Entrerríos', 'Yarumal'] }
  },
  { 
    id: 'occidente', name: { es: 'Occidente', en: 'West', pt: 'Ocidente' }, municipios: 19, 
    vibe: { es: 'Historia y Sol', en: 'History & Sun', pt: 'História e Sol' }, 
    icon: Sun, color: '#1A4731', 
    path: "M45,55 L65,55 L65,75 L40,85 L25,60 Z",
    tesoros: { es: ['Sta Fe de Antioquia', 'Sopetrán', 'San Jerónimo', 'Liborina'], en: ['Santa Fe', 'Sopetran', 'San Jeronimo', 'Liborina'], pt: ['Santa Fé', 'Sopetran', 'São Jerônimo', 'Liborina'] }
  },
  { 
    id: 'aburra', name: { es: 'Valle de Aburrá', en: 'Aburra Valley', pt: 'Vale de Aburrá' }, municipios: 10, 
    vibe: { es: 'Corazón Urbano', en: 'Urban Heart', pt: 'Coração Urbano' }, 
    icon: NavIcon, color: '#2d7a4c', 
    path: "M65,55 L85,55 L90,70 L70,80 L65,75 Z",
    tesoros: { es: ['Medellín', 'Envigado', 'Sabaneta', 'Bello'], en: ['Medellin', 'Envigado', 'Sabaneta', 'Bello'], pt: ['Medellín', 'Envigado', 'Sabaneta', 'Bello'] }
  },
  { 
    id: 'oriente', name: { es: 'Oriente', en: 'East', pt: 'Oriente' }, municipios: 23, 
    vibe: { es: 'Aguas y Flores', en: 'Waters & Flowers', pt: 'Águas e Flores' }, 
    icon: Waves, color: '#1A4731', 
    path: "M85,55 L110,65 L100,85 L85,100 L70,95 L70,80 Z",
    tesoros: { es: ['Guatapé', 'El Carmen', 'Rionegro', 'La Ceja', 'San Rafael'], en: ['Guatape', 'El Carmen', 'Rionegro', 'La Ceja', 'San Rafael'], pt: ['Guatapé', 'El Carmen', 'Rionegro', 'La Ceja', 'San Rafael'] }
  },
  { 
    id: 'suroeste', name: { es: 'Suroeste', en: 'Southwest', pt: 'Sudoeste' }, municipios: 23, 
    vibe: { es: 'Cuna del Café', en: 'Coffee Cradle', pt: 'Berço do Café' }, 
    icon: Coffee, color: '#2d7a4c', 
    path: "M40,85 L65,75 L70,80 L70,95 L60,110 L45,105 Z",
    tesoros: { es: ['Jardín', 'Jericó', 'Támesis', 'Urrao'], en: ['Jardin', 'Jerico', 'Tamesis', 'Urrao'], pt: ['Jardín', 'Jericó', 'Támesis', 'Urrao'] }
  }
];

interface EpicAntioquiaMapProps {
  onSelectRegion: (name: string) => void;
  lang: SupportedLang;
}

export const EpicAntioquiaMap: React.FC<EpicAntioquiaMapProps> = ({ onSelectRegion, lang }) => {
  const [hovered, setHovered] = useState<RegionData | null>(null);
  const [selected, setSelected] = useState<RegionData | null>(REGIONS[0]);

  const activeRegion = hovered || selected;

  return (
    <div className="relative w-full rounded-[64px] overflow-hidden shadow-4xl border border-slate-100 flex flex-col lg:flex-row bg-white h-auto lg:h-[650px]">
      
      {/* Panel de Info - Optimización visual táctica */}
      <div className="z-20 w-full lg:w-[45%] p-10 md:p-14 flex flex-col justify-center bg-white/80 backdrop-blur-3xl border-r border-slate-50 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeRegion && (
            <motion.div 
              key={activeRegion.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                 <motion.div 
                   layoutId="region-icon"
                   className="w-16 h-16 rounded-[24px] bg-paisa-emerald text-white flex items-center justify-center shadow-xl ring-4 ring-emerald-50"
                 >
                    <activeRegion.icon size={32} />
                 </motion.div>
                 <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-paisa-gold">SUBREGIÓN TÁCTICA</h4>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-950 leading-none">
                      {activeRegion.name[lang]}
                    </h2>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 rounded-[32px] bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                    <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2">CENSO TOTAL</span>
                    <div className="flex items-center gap-3">
                       <MapIcon size={18} className="text-slate-300" />
                       <span className="text-2xl font-black text-slate-900">{activeRegion.municipios} Pueblos</span>
                    </div>
                 </div>
                 <div className="p-6 rounded-[32px] bg-emerald-50 border border-emerald-100 group hover:bg-white hover:shadow-xl transition-all">
                    <span className="block text-[8px] font-black uppercase tracking-widest text-paisa-emerald mb-2">PULSO LOCAL</span>
                    <div className="flex items-center gap-3">
                       <Sparkles size={18} className="text-paisa-gold animate-pulse" />
                       <span className="text-2xl font-black text-paisa-emerald">Top Vibe</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <p className="text-slate-500 text-3xl italic font-serif leading-tight">
                   "{activeRegion.vibe[lang]}"
                 </p>
                 
                 <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <LayoutGrid size={12} /> LISTA OPTIMIZADA DE TESOROS
                       </span>
                       <div className="h-px flex-1 bg-slate-100 ml-4"></div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                       {activeRegion.tesoros[lang].map((t, idx) => (
                         <motion.button 
                           key={t}
                           whileHover={{ scale: 1.05, y: -2 }}
                           onClick={() => onSelectRegion(t)}
                           className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-100 text-slate-700 hover:bg-paisa-emerald hover:text-white hover:border-paisa-emerald transition-all shadow-sm hover:shadow-xl"
                         >
                            <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-white/20 flex items-center justify-center">
                               <span className="text-[9px] font-black">{idx + 1}</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">
                               {t}
                            </span>
                            <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                         </motion.button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => onSelectRegion(activeRegion.name[lang])}
                  className="group w-full py-6 bg-slate-950 text-white rounded-[32px] font-black uppercase text-[13px] tracking-[0.25em] shadow-4xl hover:bg-paisa-emerald transition-all flex items-center justify-center gap-4 active:scale-95"
                >
                  <Zap size={20} className="text-paisa-gold group-hover:animate-pulse" />
                  EXPLORAR {activeRegion.name[lang].toUpperCase()}
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mapa Táctico - Estilo Geométrico Minimalista */}
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50/50 relative overflow-hidden">
        <div className="absolute top-10 right-10 flex flex-col items-end gap-1 opacity-20 pointer-events-none">
           <span className="text-[10px] font-black uppercase tracking-widest">Antioquia Data Index</span>
           <div className="flex gap-1">
              {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 bg-paisa-emerald rounded-full" />)}
           </div>
        </div>

        <svg viewBox="0 0 150 120" className="w-full h-full max-h-[500px] drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)] overflow-visible">
          {REGIONS.map((region) => (
            <motion.path
              key={region.id}
              d={region.path}
              fill={activeRegion?.id === region.id ? '#D4A574' : region.color}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              whileHover={{ scale: 1.05, zIndex: 10 }}
              onClick={() => setSelected(region)}
              onMouseEnter={() => setHovered(region)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer transition-all duration-300 outline-none"
              initial={false}
              animate={{
                fill: activeRegion?.id === region.id ? '#D4A574' : region.color,
                strokeWidth: activeRegion?.id === region.id ? 2 : 1.5,
                filter: activeRegion?.id === region.id ? 'brightness(1.1)' : 'brightness(1)'
              }}
            />
          ))}
          {/* Medellín Marker */}
          <motion.circle 
            cx="75" cy="65" r="2" fill="white" 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="pointer-events-none shadow-xl" 
          />
        </svg>

        {/* Legend / Overlay */}
        <div className="absolute bottom-10 right-10 text-right space-y-2">
           <div className="flex items-center gap-3 justify-end">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Arriero Pro Tactical Map v2.9</span>
              <NavIcon size={14} className="text-paisa-gold" />
           </div>
        </div>
        
        <div className="absolute top-10 left-10 flex items-center gap-4">
           <div className="w-2 h-2 rounded-full bg-paisa-emerald animate-ping" />
           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">LIVE REGIONAL DATA SINK</span>
        </div>
      </div>
    </div>
  );
};
