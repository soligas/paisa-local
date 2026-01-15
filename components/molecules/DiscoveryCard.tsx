
import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Waves, Mountain, Trees, Sparkles, MapPin, ShieldCheck, Plus } from 'lucide-react';
import { SafeImage } from '../atoms/SafeImage';

interface DiscoveryCardProps {
  title: string;
  subtitle: string;
  image: string;
  onClick?: () => void;
}

// Mapa de iconos por palabra clave en el título o subtítulo
const getIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('jardín')) return Coffee;
  if (t.includes('guatapé')) return Waves;
  if (t.includes('jericó')) return Mountain;
  return Sparkles;
};

export const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ title, subtitle, image, onClick }) => {
  const Icon = getIcon(title);

  return (
    <motion.button
      whileHover={{ y: -12, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative shrink-0 w-[260px] md:w-[320px] aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl group text-left border border-white/10"
    >
      <SafeImage 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full transition-transform duration-1000 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
      
      {/* Icono de confianza sobre el título */}
      <div className="absolute bottom-32 left-8 pointer-events-none">
         <motion.div 
           initial={{ opacity: 0, scale: 0.5 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="relative"
         >
           <div className="absolute -top-2 -right-2 text-white/30"><Plus size={12} /></div>
           <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl">
              <Icon size={24} className="text-white" />
              <div className="absolute -top-1 -right-1 p-1 bg-emerald-500 rounded-full text-white shadow-lg">
                <ShieldCheck size={8} strokeWidth={4} />
              </div>
           </div>
         </motion.div>
      </div>

      <div className="absolute bottom-10 left-8 right-8 space-y-4 pointer-events-none">
        <div className="space-y-1">
          <h4 className="text-white text-3xl md:text-5xl font-serif font-bold leading-[0.9] tracking-tight transition-colors group-hover:text-paisa-gold">
            {title}
          </h4>
          <div className="w-12 h-1 bg-paisa-gold/50 rounded-full" />
        </div>
        <p className="text-white/70 text-xs md:text-sm font-sans font-medium tracking-widest uppercase opacity-80">
          {subtitle}
        </p>
      </div>
    </motion.button>
  );
};
