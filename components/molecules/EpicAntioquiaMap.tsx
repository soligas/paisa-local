
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, Waves, Mountain, Trees, Compass, Users, 
  ChevronRight, MoveUpRight, Info, Map as MapIcon
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
    id: 'uraba', name: { es: 'Urabá', en: 'Uraba Gulf', pt: 'Urabá' }, municipios: 11, 
    vibe: { es: 'Mar de Oportunidades', en: 'Sea of Opportunities', pt: 'Mar de Oportunidades' }, 
    icon: Waves, color: '#1a4731', 
    path: "M15,25 L35,15 L55,20 L60,35 L45,55 L25,60 L15,45 Z",
    tesoros: { es: ['Necoclí', 'Capurganá'], en: ['Necocli', 'Capurgana'], pt: ['Necocli', 'Capurganá'] }
  },
  { 
    id: 'norte', name: { es: 'Norte', en: 'North Highlands', pt: 'Norte' }, municipios: 17, 
    vibe: { es: 'Ruta de la Leche', en: 'The Milk Route', pt: 'Rota do Leite' }, 
    icon: Trees, color: '#2d7a4c', 
    path: "M55,20 L80,15 L95,30 L75,50 L60,35 Z",
    tesoros: { es: ['Belmira', 'San Pedro'], en: ['Belmira Moor', 'San Pedro'], pt: ['Belmira', 'São Pedro'] }
  },
  { 
    id: 'bajo-cauca', name: { es: 'Bajo Cauca', en: 'Lower Cauca', pt: 'Baixo Cauca' }, municipios: 6, 
    vibe: { es: 'Riqueza Hídrica', en: 'Hydric Wealth', pt: 'Riqueza Hídrica' }, 
    icon: Compass, color: '#1a4731', 
    path: "M80,15 L115,10 L125,25 L100,40 L95,30 Z",
    tesoros: { es: ['Caucasia', 'El Bagre'], en: ['Caucasia', 'El Bagre'], pt: ['Caucasia', 'El Bagre'] }
  },
  { 
    id: 'nordeste', name: { es: 'Nordeste', en: 'Northeast', pt: 'Nordeste' }, municipios: 10, 
    vibe: { es: 'Minería y Bosques', en: 'Mining & Forests', pt: 'Mineração e Florestas' }, 
    icon: Compass, color: '#22633d', 
    path: "M95,30 L100,40 L110,65 L90,75 L75,50 Z",
    tesoros: { es: ['Amalfi', 'Segovia'], en: ['Amalfi', 'Segovia'], pt: ['Amalfi', 'Segóvia'] }
  },
  { 
    id: 'occidente', name: { es: 'Occidente', en: 'West Heritage', pt: 'Ocidente' }, municipios: 19, 
    vibe: { es: 'Historia y Sol', en: 'History & Sun', pt: 'História e Sol' }, 
    icon: Mountain, color: '#328554', 
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
    id: 'magdalena', name: { es: 'Magdalena Medio', en: 'Magdalena Valley', pt: 'Magdalena Médio' }, municipios: 6, 
    vibe: { es: 'Puerta del Río', en: 'River Gateway', pt: 'Porta do Rio' }, 
    icon: Waves, color: '#1a4731', 
    path: "M110,65 L135,60 L135,90 L115,100 L100,85 Z",
    tesoros: { es: ['Puerto Triunfo', 'Río Claro'], en: ['Puerto Triunfo', 'Rio Claro'], pt: ['Porto Triunfo', 'Rio Claro'] }
  },
  { 
    id: 'oriente', name: { es: 'Oriente', en: 'East Plateau', pt: 'Oriente' }, municipios: 23, 
    vibe: { es: 'Aguas y Flores', en: 'Waters & Flowers', pt: 'Águas e Flores' }, 
    icon: Waves, color: '#3a915c', 
    path: "M85,55 L110,65 L100,85 L85,100 L70,95 L70,80 Z",
    tesoros: { es: ['Guatapé', 'Rionegro'], en: ['Guatape', 'Rionegro'], pt: ['Guatapé', 'Rionegro'] }
  },
  { 
    id: 'suroeste', name: { es: 'Suroeste', en: 'Southwest Coffee', pt: 'Sudoeste' }, municipios: 23, 
    vibe: { es: 'Cuna del Café', en: 'Coffee Cradle', pt: 'Berço do Café' }, 
    icon: Coffee, color: '#22633d', 
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
  const [selected, setSelected] = useState<RegionData | null>(null);

  const activeRegion = hovered || selected;

  const translations = {
    es: {
      mapTitle: 'Antioquia Legendaria',
      mapSubtitle: 'Descubre las 9 subregiones que agrupan nuestros 125 municipios.',
      explore: 'Explorar',
      municipios: 'Municipios',
      selectRegion: 'Selecciona una subregión...',
      cartography: 'Cartografía Unificada'
    },
    en: {
      mapTitle: 'Legendary Antioquia',
      mapSubtitle: 'Discover the 9 subregions that group our 125 towns.',
      explore: 'Explore',
      municipios: 'Towns',
      selectRegion: 'Select a region...',
      cartography: 'Unified Cartography'
    },
    pt: {
      mapTitle: 'Antioquia Lendária',
      mapSubtitle: 'Descubra as 9 sub-regiões que agrupam nossos 125 municípios.',
      explore: 'Explorar',
      municipios: 'Municípios',
      selectRegion: 'Selecione uma região...',
      cartography: 'Cartografia Unificada'
    }
  }[lang];

  return (
    <div className="relative w-full min-h-[600px] lg:min-h-[700px] bg-white rounded-[48px] lg:rounded-[64px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col lg:flex-row">
      
      {/* Panel de Información */}
      <div className="z-20 w-full lg:w-[45%] p-8 lg:p-16 flex flex-col justify-center bg-white/40 backdrop-blur-md">
        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-2">
            <MapIcon size={16} className="text-paisa-emerald" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-paisa-emerald/70">{translations.cartography}</span>
          </div>
          <h3 className="text-slate-900 text-5xl xl:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
            {translations.mapTitle.split(' ')[0]} <br /> <span className="text-paisa-emerald">{translations.mapTitle.split(' ')[1]}</span>
          </h3>
          <p className="text-slate-500 text-lg font-serif italic leading-relaxed max-w-sm">
            {translations.mapSubtitle}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {activeRegion ? (
            <motion.div 
              key={activeRegion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-paisa-emerald text-white flex items-center justify-center shadow-xl shadow-paisa-emerald/20">
                  <activeRegion.icon size={30} />
                </div>
                <div>
                  <h4 className="text-slate-900 text-3xl font-black uppercase tracking-tighter leading-none mb-1">{activeRegion.name[lang]}</h4>
                  <Badge color="gold">{activeRegion.municipios} {translations.municipios}</Badge>
                </div>
              </div>

              <div className="space-y-4">
                 <p className="text-slate-400 text-lg italic font-serif leading-snug border-l-2 border-paisa-gold pl-6">
                   "{activeRegion.vibe[lang]}"
                 </p>
                 <div className="flex flex-wrap gap-2">
                    {activeRegion.tesoros[lang].map((t) => (
                      <span key={t} className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{t}</span>
                    ))}
                 </div>
              </div>

              <button 
                onClick={() => onSelectRegion(activeRegion.name[lang])}
                className="w-full py-5 bg-paisa-emerald text-white rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-paisa-emerald/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {translations.explore} {activeRegion.name[lang]}
                <ChevronRight size={18} />
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 rounded-[40px] border-2 border-dashed border-slate-100 text-center gap-6">
              <Compass size={48} className="text-slate-200 animate-spin-slow" />
              <p className="text-slate-300 text-xl font-serif italic">{translations.selectRegion}</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Mapa SVG */}
      <div className="relative flex-1 flex items-center justify-center p-8 lg:p-12 overflow-hidden bg-slate-50/50">
        <motion.svg 
          viewBox="0 0 150 120" 
          className="w-full h-full max-h-[60vh] drop-shadow-2xl"
          preserveAspectRatio="xMidYMid meet"
        >
          {REGIONS.map((region) => (
            <motion.path
              key={region.id}
              d={region.path}
              fill={activeRegion?.id === region.id ? '#D4A574' : region.color}
              stroke="#FFFFFF"
              strokeWidth={activeRegion?.id === region.id ? "1.2" : "0.5"}
              strokeLinejoin="round"
              whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
              onClick={() => setSelected(region)}
              onMouseEnter={() => setHovered(region)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer transition-all duration-300 outline-none"
              style={{ originX: "50%", originY: "50%" }}
            />
          ))}
          
          <motion.g transform="translate(75, 65)">
             <circle r="1" fill="white" />
          </motion.g>
        </motion.svg>
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
};
