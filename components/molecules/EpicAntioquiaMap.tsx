
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, Waves, Mountain, Trees, Compass, Users, 
  ChevronRight, Map as MapIcon
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

// Polígonos estilizados basados en la imagen de referencia (Geometría limpia)
const REGIONS: RegionData[] = [
  { 
    id: 'uraba', name: { es: 'Urabá', en: 'Uraba', pt: 'Urabá' }, municipios: 11, 
    vibe: { es: 'Mar de Oportunidades', en: 'Sea of Opportunities', pt: 'Mar de Oportunidades' }, 
    icon: Waves, color: '#D4A574', // Oro para el activo inicial en la imagen
    path: "M15,25 L35,15 L55,20 L60,35 L45,55 L25,60 L15,45 Z",
    tesoros: { es: ['Necoclí', 'Capurganá'], en: ['Necocli', 'Capurgana'], pt: ['Necocli', 'Capurganá'] }
  },
  { 
    id: 'norte', name: { es: 'Norte', en: 'North', pt: 'Norte' }, municipios: 17, 
    vibe: { es: 'Ruta de la Leche', en: 'The Milk Route', pt: 'Rota do Leite' }, 
    icon: Trees, color: '#2d7a4c', 
    path: "M55,20 L80,15 L95,30 L75,50 L60,35 Z",
    tesoros: { es: ['Belmira', 'San Pedro'], en: ['Belmira', 'San Pedro'], pt: ['Belmira', 'São Pedro'] }
  },
  { 
    id: 'occidente', name: { es: 'Occidente', en: 'West', pt: 'Ocidente' }, municipios: 19, 
    vibe: { es: 'Historia y Sol', en: 'History & Sun', pt: 'História e Sol' }, 
    icon: Mountain, color: '#1A4731', 
    path: "M45,55 L65,55 L65,75 L40,85 L25,60 Z",
    tesoros: { es: ['Sta Fe de Antioquia', 'Liborina'], en: ['Santa Fe', 'Liborina'], pt: ['Santa Fé', 'Liborina'] }
  },
  { 
    id: 'aburra', name: { es: 'Valle de Aburrá', en: 'Aburra Valley', pt: 'Vale de Aburrá' }, municipios: 10, 
    vibe: { es: 'Corazón Urbano', en: 'Urban Heart', pt: 'Coração Urbano' }, 
    icon: Users, color: '#2d7a4c', 
    path: "M65,55 L85,55 L90,70 L70,80 L65,75 Z",
    tesoros: { es: ['Medellín', 'Bello'], en: ['Medellin', 'Bello'], pt: ['Medellín', 'Bello'] }
  },
  { 
    id: 'oriente', name: { es: 'Oriente', en: 'East', pt: 'Oriente' }, municipios: 23, 
    vibe: { es: 'Aguas y Flores', en: 'Waters & Flowers', pt: 'Águas e Flores' }, 
    icon: Waves, color: '#1A4731', 
    path: "M85,55 L110,65 L100,85 L85,100 L70,95 L70,80 Z",
    tesoros: { es: ['Guatapé', 'Rionegro'], en: ['Guatape', 'Rionegro'], pt: ['Guatapé', 'Rionegro'] }
  },
  { 
    id: 'suroeste', name: { es: 'Suroeste', en: 'Southwest', pt: 'Sudoeste' }, municipios: 23, 
    vibe: { es: 'Cuna del Café', en: 'Coffee Cradle', pt: 'Berço do Café' }, 
    icon: Coffee, color: '#2d7a4c', 
    path: "M40,85 L65,75 L70,80 L70,95 L60,110 L45,105 Z",
    tesoros: { es: ['Jardín', 'Jericó'], en: ['Jardin', 'Jerico'], pt: ['Jardín', 'Jericó'] }
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
    <div className="relative w-full min-h-[500px] bg-white rounded-[48px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col lg:flex-row">
      
      {/* Panel Info Estilo Minimalista */}
      <div className="z-20 w-full lg:w-[40%] p-10 flex flex-col justify-center bg-white/60 backdrop-blur-xl">
        <AnimatePresence mode="wait">
          {activeRegion && (
            <motion.div 
              key={activeRegion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-paisa-gold">SUBREGIÓN {activeRegion.id}</h4>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                {activeRegion.name[lang]}
              </h2>
              <div className="flex items-center gap-3">
                 <Badge color="emerald">{activeRegion.municipios} Municipios</Badge>
              </div>
              <p className="text-slate-400 text-xl italic font-serif leading-snug">
                "{activeRegion.vibe[lang]}"
              </p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                 {activeRegion.tesoros[lang].map(t => (
                   <span key={t} className="px-3 py-1 rounded-full bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t}</span>
                 ))}
              </div>

              <button 
                onClick={() => onSelectRegion(activeRegion.name[lang])}
                className="w-full py-5 bg-paisa-emerald text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Explorar {activeRegion.name[lang]} <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mapa de Polígonos Geométricos (Simulando la imagen) */}
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50 relative overflow-hidden">
        <svg viewBox="0 0 150 120" className="w-full h-full max-h-[400px] drop-shadow-xl overflow-visible">
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
                fill: activeRegion?.id === region.id ? '#D4A574' : region.color
              }}
            />
          ))}
          {/* Indicador de punto central (Medellín) */}
          <circle cx="75" cy="65" r="1.5" fill="white" className="pointer-events-none" />
        </svg>
      </div>
    </div>
  );
};
