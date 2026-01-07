
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Heart, Users, Star, CheckCircle, Bus, Wallet, Shield, Sparkles, Send, MessageSquare, User, Award
} from 'lucide-react';
import { PlaceData, SupportedLang } from '../types';
import { Badge } from './atoms/Badge';
import { SafeImage } from './atoms/SafeImage';
import { getPlaceUGC, insertUGC, UGCContent } from '../services/supabaseService';
import { Button } from './atoms/Button';

interface PlaceCardProps {
  data: PlaceData;
  lang: SupportedLang;
  i18n: any;
  isFavorite: boolean;
  isVisited?: boolean;
  onToggleFavorite: (title: string) => void;
  onToggleVisited?: (title: string) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ 
  data, isFavorite, isVisited, onToggleFavorite, onToggleVisited 
}) => {
  const [reviews, setReviews] = useState<UGCContent[]>([]);
  const [newReview, setNewReview] = useState({ name: '', comment: '', stars: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUGC();
  }, [data.titulo]);

  const loadUGC = async () => {
    const results = await getPlaceUGC(data.titulo);
    setReviews(results);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    
    setIsSubmitting(true);
    try {
      await insertUGC({
        place_slug: data.titulo,
        user_name: newReview.name,
        comment: newReview.comment,
        stars: newReview.stars
      });
      setNewReview({ name: '', comment: '', stars: 5 });
      await loadUGC();
    } catch (err) {
      console.error("Error al guardar reseña:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-12 pb-20">
      {/* Hero Section - Rediseñado para no usar imágenes de fondo reales */}
      <section className="relative min-h-[400px] md:min-h-[500px] rounded-[56px] overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 flex items-center p-12 lg:p-24">
        {/* Fondo decorativo abstracto */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
           <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_#2D7A4C_0%,_transparent_70%)] blur-[100px]" />
           <div className="absolute top-0 right-0 w-full h-full opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #D4A574 0px, #D4A574 1px, transparent 1px, transparent 10px)' }} />
        </div>
        
        <div className="absolute top-8 right-8 z-20 flex gap-3">
          <Button 
            variant={isVisited ? "accent" : "secondary"}
            onClick={() => onToggleVisited?.(data.titulo)}
            className="px-6 h-12 text-[9px]"
          >
            {isVisited ? <CheckCircle size={14} /> : <Award className="hidden" />}
            {isVisited ? "Sello Listo" : "Sellar Pasaporte"}
          </Button>
          <button 
            onClick={() => onToggleFavorite(data.titulo)}
            className={`p-3 rounded-full backdrop-blur-xl border ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/10 text-white border-white/20'}`}
          >
            <Heart size={20} fill={isFavorite ? 'white' : 'none'} />
          </button>
        </div>

        <div className="relative z-10 space-y-8 max-w-4xl">
           <div className="flex flex-wrap gap-2">
             <Badge color="gold">{data.region}</Badge>
             {data.isVerified && <Badge color="emerald">Logística Verificada</Badge>}
             <div className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={10} className="text-paisa-gold" /> Destino Auténtico
             </div>
           </div>
           
           <div className="space-y-4">
             <h2 className="text-white text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85]">
               {data.titulo}
             </h2>
             <div className="h-1 w-24 bg-paisa-gold rounded-full" />
           </div>
           
           <p className="text-white/80 text-xl md:text-3xl font-serif italic max-w-2xl leading-relaxed">
             "{data.descripcion}"
           </p>
        </div>
      </section>

      {/* Info Logística */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50 p-10 rounded-[48px] border border-emerald-100 space-y-4">
             <div className="flex items-center gap-3 text-paisa-emerald">
                <Bus size={28} />
                <h4 className="font-black uppercase text-xs tracking-widest">Transporte</h4>
             </div>
             <p className="text-slate-700 font-bold text-lg">{data.trivia || "Bus en Terminal del Norte/Sur."}</p>
             <div className="flex items-center gap-2 text-paisa-emerald/60 text-[10px] font-black uppercase">
                <Clock size={12} /> {data.tiempoDesdeMedellin} aprox.
             </div>
          </div>

          <div className="bg-amber-50 p-10 rounded-[48px] border border-amber-100 space-y-4">
             <div className="flex items-center gap-3 text-amber-600">
                <Wallet size={28} />
                <h4 className="font-black uppercase text-xs tracking-widest">Presupuesto</h4>
             </div>
             <p className="text-slate-700 font-bold text-lg">Pasaje: ${data.budget.busTicket.toLocaleString()} COP</p>
             <p className="text-slate-700 font-bold text-lg">Almuerzo: ${data.budget.averageMeal.toLocaleString()} COP</p>
          </div>

          <div className="bg-blue-50 p-10 rounded-[48px] border border-blue-100 space-y-4">
             <div className="flex items-center gap-3 text-blue-600">
                <Shield size={28} />
                <h4 className="font-black uppercase text-xs tracking-widest">Seguridad</h4>
             </div>
             <p className="text-slate-700 font-bold text-lg">{data.seguridadTexto}</p>
          </div>
      </section>

      {/* Community / UGC Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl space-y-8">
           <div className="flex items-center gap-4">
              <MessageSquare className="text-paisa-emerald" size={32} />
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Muro del Arriero</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Reseñas de la comunidad</p>
              </div>
           </div>

           <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar pr-4">
              {reviews.length === 0 ? (
                <div className="py-20 text-center space-y-4 opacity-30">
                   <Users size={48} className="mx-auto" />
                   <p className="font-serif italic text-lg">Sé el primero en contar tu aventura...</p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <motion.div key={rev.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-2">
                          <User size={12} className="text-paisa-emerald" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{rev.user_name}</span>
                       </div>
                       <div className="flex gap-1 text-paisa-gold">
                          {[...Array(rev.stars)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                       </div>
                    </div>
                    <p className="text-sm font-serif italic text-slate-600 leading-relaxed">"{rev.comment}"</p>
                    <p className="text-[8px] text-slate-300 uppercase font-black">{new Date(rev.created_at).toLocaleDateString()}</p>
                  </motion.div>
                ))
              )}
           </div>
        </div>

        <div className="bg-slate-900 p-12 rounded-[56px] text-white space-y-8">
           <div className="flex items-center gap-4">
              <Send className="text-paisa-gold" size={32} />
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Deja tu Huella</h3>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Gana 200 XP por comentar</p>
              </div>
           </div>

           <form onSubmit={handleSubmitReview} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Tu Nombre</label>
                <input 
                  type="text" 
                  value={newReview.name}
                  onChange={e => setNewReview(prev => ({...prev, name: e.target.value}))}
                  placeholder="Ej: El Berraquito" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-paisa-gold transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Tu Experiencia</label>
                <textarea 
                  value={newReview.comment}
                  onChange={e => setNewReview(prev => ({...prev, comment: e.target.value}))}
                  placeholder="¿Qué tal el pueblo mijo?" 
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-paisa-gold transition-all resize-none"
                />
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase text-white/40">Calificación:</span>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(s => (
                        <button type="button" key={s} onClick={() => setNewReview(prev => ({...prev, stars: s}))} className={`transition-all ${newReview.stars >= s ? 'text-paisa-gold scale-125' : 'text-white/20'}`}>
                          <Star size={16} fill={newReview.stars >= s ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                 </div>
                 <Button disabled={isSubmitting} type="submit" variant="accent" className="h-12 px-8">
                    {isSubmitting ? <Sparkles className="animate-spin" /> : "Publicar"}
                 </Button>
              </div>
           </form>
        </div>
      </section>

      {/* Neighbor Tip */}
      {data.neighborTip && (
        <section className="p-12 rounded-[56px] bg-emerald-50 text-slate-900 border border-emerald-100 relative overflow-hidden group">
           <div className="relative z-10 space-y-6 text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3">
                 <Sparkles className="text-paisa-emerald animate-pulse" />
                 <span className="text-paisa-emerald font-black uppercase text-[10px] tracking-[0.3em]">Tip de Local</span>
              </div>
              <p className="text-3xl md:text-5xl font-serif italic leading-tight text-emerald-900">
                 "{data.neighborTip}"
              </p>
           </div>
        </section>
      )}
    </motion.div>
  );
};
