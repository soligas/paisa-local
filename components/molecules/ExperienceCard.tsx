
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Sparkles, Users, Calendar, ArrowUpRight, Award, Camera, Play, Search } from 'lucide-react';
import { CultureExperience } from '../../types';
import { SafeImage } from '../atoms/SafeImage';
import { Badge } from '../atoms/Badge';

interface ExperienceCardProps {
  experience: CultureExperience;
  isFavorite: boolean;
  onToggleFavorite: (title: string) => void;
  onClick?: () => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, isFavorite, onToggleFavorite, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-slate-900 rounded-[40px] overflow-hidden group flex flex-col h-full border border-white/5 cursor-pointer shadow-2xl"
      onClick={onClick}
    >
      <div className="relative h-48">
        <SafeImage alt={experience.titulo} type="experience" className="w-full h-full opacity-80 group-hover:scale-110 transition-transform duration-700" />
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(experience.titulo); }}
          className={`absolute top-6 right-6 p-4 rounded-full backdrop-blur-md border transition-all ${isFavorite ? 'bg-red-500 text-white border-red-400' : 'bg-white/10 border-white/20 text-white'}`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-8 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <Badge color="gold">{experience.categoria}</Badge>
          <h4 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-paisa-gold transition-colors">{experience.titulo}</h4>
          <p className="text-sm italic text-white/40 font-serif line-clamp-2">"{experience.descripcion}"</p>
        </div>

        <div className="mt-8 space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 text-paisa-gold">
            <Users size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">{experience.impactoSocial}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
             <a 
                href={`https://www.google.com/search?q=${experience.titulo}+${experience.ubicacion}+Antioquia+fotos&tbm=isch`} 
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
              >
                <Camera size={12} /> Fotos
              </a>
              <a 
                href={`https://www.youtube.com/results?search_query=${experience.titulo}+${experience.ubicacion}+Antioquia`} 
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all border border-white/5"
              >
                <Play size={12} /> Videos
              </a>
          </div>

          <div className="flex justify-between items-center text-white/30 pt-4">
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <MapPin size={12} /> {experience.ubicacion}
            </div>
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
