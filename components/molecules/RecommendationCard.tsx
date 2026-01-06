
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Sparkles, Navigation } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { SafeImage } from '../atoms/SafeImage';

interface RecommendationCardProps {
  title: string;
  desc: string;
  img: string;
  action: () => void;
  tag: string;
  subtitle?: string;
  isDark?: boolean;
  wide?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  title, desc, img, action, tag, subtitle, isDark, wide 
}) => (
  <motion.button 
    whileHover={{ y: -16 }} 
    whileTap={{ scale: 0.98 }}
    onClick={action}
    className={`relative shrink-0 ${wide ? 'w-full md:w-[500px]' : 'w-full'} aspect-[4/5] rounded-[56px] overflow-hidden shadow-2xl group text-left border border-slate-100/50`}
  >
    <SafeImage src={`${img}?auto=format&fit=crop&q=80&w=1200`} alt={title} className="absolute inset-0 w-full h-full transition-transform duration-1000 ease-out group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none transition-opacity group-hover:opacity-90" />
    
    <div className="absolute top-10 left-10 flex flex-col gap-3 pointer-events-none">
      <Badge color="gold" className="shadow-lg backdrop-blur-sm bg-paisa-gold/90">{tag}</Badge>
      {subtitle && (
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-[9px] font-black uppercase tracking-widest">
           <MapPin size={10} className="text-paisa-gold" /> {subtitle}
        </div>
      )}
    </div>

    <div className="absolute bottom-12 left-12 right-12 space-y-4 pointer-events-none">
      <div className="space-y-1">
        <h4 className="text-white text-5xl md:text-6xl font-serif italic tracking-tighter leading-none group-hover:text-paisa-gold transition-colors duration-500">{title}</h4>
      </div>
      <p className="text-white/60 text-sm italic line-clamp-2 leading-relaxed font-medium transition-all group-hover:text-white/80">
        "{desc}"
      </p>
      
      <div className="flex items-center justify-between pt-6 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
        <div className="flex items-center gap-4 text-paisa-gold">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ver aventura</span>
          <ArrowRight size={16} />
        </div>
        <div className="flex items-center gap-2 text-white/40">
           <Navigation size={12} />
           <span className="text-[9px] font-bold">Ruta Verificada</span>
        </div>
      </div>
    </div>
  </motion.button>
);
