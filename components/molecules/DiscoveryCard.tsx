
import React from 'react';
import { motion } from 'framer-motion';
import { SafeImage } from '../atoms/SafeImage';

interface DiscoveryCardProps {
  title: string;
  subtitle: string;
  image: string;
  onClick?: () => void;
}

export const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ title, subtitle, image, onClick }) => {
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
      
      <div className="absolute bottom-10 left-8 right-8 space-y-2 pointer-events-none">
        <h4 className="text-white text-3xl md:text-4xl font-serif font-bold leading-[0.9] tracking-tight transition-colors group-hover:text-paisa-gold">
          {title}
        </h4>
        <p className="text-white/70 text-xs md:text-sm font-sans font-medium tracking-widest uppercase opacity-80">
          {subtitle}
        </p>
      </div>
    </motion.button>
  );
};
