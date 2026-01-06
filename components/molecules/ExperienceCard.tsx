
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Sparkles, Users, Calendar, ArrowUpRight, Award } from 'lucide-react';
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
      whileHover={{ y: -16, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
      className="bg-slate-950 rounded-[56px] overflow-hidden group flex flex-col h-full border border-white/5 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SafeImage src={`${experience.imagen}?auto=format&fit=crop&q=80&w=1200`} alt={experience.titulo} className="w-full h-full opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
        
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(experience.titulo); }}
          className={`absolute top-8 right-8 p-5 rounded-full backdrop-blur-xl border transition-all duration-500 ${isFavorite ? 'bg-red-500 text-white border-red-400 shadow-2xl scale-110' : 'bg-white/10 border-white/20 text-white hover:bg-white/30'}`}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <div className="absolute bottom-8 left-10 flex items-center gap-2">
           <Badge color="gold" className="shadow-2xl">{experience.categoria}</Badge>
           <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={10} className="text-paisa-gold" /> Experiencia Real
           </div>
        </div>
      </div>

      <div className="p-12 flex-1 flex flex-col justify-between space-y-10">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <h4 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] group-hover:text-paisa-gold transition-colors duration-500">{experience.titulo}</h4>
            <div className="p-4 rounded-full bg-white/5 text-white/40 group-hover:text-paisa-gold group-hover:bg-paisa-gold/10 transition-all">
              <ArrowUpRight size={24} />
            </div>
          </div>
          <p className="text-white/50 text-base italic leading-relaxed font-serif">"{experience.descripcion}"</p>

          {/* NUEVA SECCIÓN: MAESTRO DE OFICIO */}
          {experience.maestroOficio && (
            <div className="mt-8 flex items-center gap-5 p-6 bg-white/5 rounded-[32px] border border-white/10">
               <div className="w-14 h-14 rounded-full border-2 border-paisa-gold/50 flex items-center justify-center bg-paisa-gold/10 text-paisa-gold">
                  <Award size={28} />
               </div>
               <div>
                  <p className="text-paisa-gold text-[10px] font-black uppercase tracking-widest mb-1">Maestro de Oficio</p>
                  <p className="text-white font-black text-lg leading-none uppercase">{experience.maestroOficio.nombre}</p>
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-wider mt-1">
                    {experience.maestroOficio.especialidad} • {experience.maestroOficio.años} Años de Legado
                  </p>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6 pt-10 border-t border-white/10">
          <div className="flex items-center gap-4 text-paisa-gold">
            <div className="w-10 h-10 rounded-2xl bg-paisa-gold/10 flex items-center justify-center animate-pulse">
               <Users size={20} />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Impacto Social</span>
               <span className="text-xs font-black uppercase tracking-widest">{experience.impactoSocial}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-white/30 bg-white/5 p-6 rounded-[32px]">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <MapPin size={14} className="text-white/20" /> {experience.ubicacion}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <Calendar size={14} className="text-white/20" /> {experience.horarioRecomendado || 'Agendar cita'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
