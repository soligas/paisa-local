
// @google/genai: World-class senior frontend engineer fix
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Heart, Users, Star, CheckCircle, Bus, Wallet, Shield, Sparkles, Send, 
  MessageSquare, User, Award, Sun, Cloud, CloudRain, Zap, Wifi, Signal, AlertCircle, Info, Navigation,
  Coffee, Camera, Play, ExternalLink, ShieldCheck, Share2, Accessibility, ShieldAlert, Phone
} from 'lucide-react';
import { PlaceData, SupportedLang } from '../types';
import { Badge } from './atoms/Badge';
import { SafeImage } from './atoms/SafeImage';
import { getPlaceUGC, insertUGC, UGCContent } from '../services/supabaseService';
import { generateSmartItinerary } from '../services/geminiService';
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
  const [itinerary, setItinerary] = useState<any>(null);
  const [loadingItinerary, setLoadingItinerary] = useState(false);

  useEffect(() => { loadUGC(); }, [data.titulo]);

  const loadUGC = async () => {
    const results = await getPlaceUGC(data.titulo);
    setReviews(results);
  };

  const handleGenerateItinerary = async () => {
    setLoadingItinerary(true);
    const result = await generateSmartItinerary(data.titulo);
    setItinerary(result);
    setLoadingItinerary(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Paisa Local Pro: ${data.titulo}`,
      text: `¡Mijo! Mirá este itinerario táctico para ${data.titulo}, Antioquia. ${data.descripcion}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Enlace copiado al portapapeles mijo.');
      }
    } catch (err) { console.error('Error sharing:', err); }
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
    } finally { setIsSubmitting(false); }
  };

  const WeatherIcon = ({ condition }: { condition?: string }) => {
    if (condition?.toLowerCase().includes('lluvia')) return <CloudRain size={20} className="text-blue-400" />;
    if (condition?.toLowerCase().includes('nube')) return <Cloud size={20} className="text-slate-400" />;
    return <Sun size={20} className="text-paisa-gold" />;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-10 pb-20">
      
      {/* Alerta de Seguridad Prioritaria (Gap 5.2 Seguridad y Confianza) */}
      {data.security && (
        <div className={`p-4 rounded-3xl flex items-center justify-between ${data.security.status === 'Seguro' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'} border border-current/10 shadow-sm`}>
          <div className="flex items-center gap-3">
             <ShieldCheck size={20} />
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest">Estado de Seguridad: {data.security.status}</p>
                <p className="text-[9px] opacity-70">Última verificación por comunidad: {data.security.lastReported}</p>
             </div>
          </div>
          <div className="flex gap-2">
            <a href={`tel:${data.security.emergencyNumber}`} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-[10px] font-black uppercase hover:bg-white/80 transition-all">
               <Phone size={14} /> Policía Turismo
            </a>
          </div>
        </div>
      )}

      {/* Hero Generativo de Subregión */}
      <section className="relative min-h-[500px] rounded-[56px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row">
        <SafeImage alt={data.titulo} region={data.region} className="w-full md:w-1/2 min-h-[300px] md:min-h-full" />
        
        <div className="flex-1 p-10 lg:p-20 bg-white flex flex-col justify-center gap-8">
           <div className="flex justify-between items-start">
              <Badge color="gold">{data.region}</Badge>
              <div className="flex gap-2">
                <button onClick={handleShare} className="p-3 rounded-full border border-slate-100 bg-slate-50 text-slate-400 hover:text-paisa-emerald transition-all">
                  <Share2 size={18} />
                </button>
                {data.weather && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 flex items-center gap-3 text-slate-600">
                     <WeatherIcon condition={data.weather.condition} />
                     <span className="text-lg font-black">{data.weather.temp}°C</span>
                  </div>
                )}
                <button onClick={() => onToggleFavorite(data.titulo)} className={`p-3 rounded-full border transition-all ${isFavorite ? 'bg-red-500 text-white border-red-400' : 'bg-slate-50 text-slate-300 border-slate-100 hover:text-paisa-emerald'}`}>
                  <Heart size={20} fill={isFavorite ? 'white' : 'none'} />
                </button>
              </div>
           </div>

           <div className="space-y-4">
              <h2 className="text-slate-900 text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">{data.titulo}</h2>
              <p className="text-slate-500 text-lg md:text-xl font-serif italic max-w-2xl leading-relaxed">"{data.descripcion}"</p>
           </div>

           {/* Grid de Logística y Accesibilidad (Vacío 5.1 Personas con Discapacidad / Adultos Mayores) */}
           <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-100">
                 <div className="flex items-center gap-2 text-emerald-700 mb-2">
                    <Accessibility size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">Inclusión Física</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-emerald-900">{data.accessibility?.score || 85}% Accesible</p>
                    <div className="flex gap-1">
                      {data.accessibility?.wheelchairFriendly && <div className="w-5 h-5 rounded-lg bg-emerald-200 flex items-center justify-center text-[10px] font-black" title="Silla de Ruedas OK">♿</div>}
                      {data.accessibility?.elderlyApproved && <div className="w-5 h-5 rounded-lg bg-emerald-200 flex items-center justify-center text-[10px] font-black" title="Adulto Mayor OK">👴</div>}
                    </div>
                 </div>
              </div>
              <div className="p-5 rounded-3xl bg-blue-50 border border-blue-100">
                 <div className="flex items-center gap-2 text-blue-700 mb-1">
                    <Navigation size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">Logística Vía</span>
                 </div>
                 <p className="text-sm font-bold text-blue-900">{data.viaEstado || 'Despejada'}</p>
              </div>
           </div>

           <div className="flex flex-wrap gap-4 pt-4">
             <Button variant="primary" onClick={handleGenerateItinerary} disabled={loadingItinerary} className="h-14 px-8">
                {loadingItinerary ? <Zap className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {itinerary ? "Refrescar Plan IA" : "Generar Itinerario Táctico"}
             </Button>
             <Button variant="ghost" onClick={() => onToggleVisited?.(data.titulo)} className="h-14 px-8 border border-slate-100">
                {isVisited ? <CheckCircle size={18} className="text-paisa-emerald" /> : <Award size={18} />}
                {isVisited ? "Pueblo Visitado" : "Sellar Pasaporte"}
             </Button>
           </div>
           
           {/* Enlaces de Verificación de Confianza (Gap 5.1/5.2) */}
           <div className="flex flex-wrap gap-6 pt-6 border-t border-slate-50">
              <a 
                href={`https://www.google.com/search?q=${data.titulo}+Antioquia+fotos+turismo&tbm=isch`} 
                target="_blank" 
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-paisa-emerald transition-all"
              >
                <Camera size={14} /> Ver Fotos Reales
              </a>
              <a 
                href={`https://www.youtube.com/results?search_query=${data.titulo}+Antioquia+guia+viaje`} 
                target="_blank" 
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all"
              >
                <Play size={14} /> Videos de Viajeros
              </a>
              <a 
                href={`https://www.google.com/maps/search/${data.titulo}+Antioquia+pueblo`} 
                target="_blank" 
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-all"
              >
                <MapPin size={14} /> Abrir Mapa
              </a>
           </div>
        </div>
      </section>

      {/* Itinerario Generado por IA (Modo Inclusivo) */}
      <AnimatePresence>
        {itinerary && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {['morning', 'afternoon', 'evening'].map((time, idx) => (
               <div key={time} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     {idx === 0 ? <Sun size={60} /> : idx === 1 ? <Cloud size={60} /> : <Zap size={60} />}
                  </div>
                  <span className="text-[10px] font-black uppercase text-paisa-gold tracking-[0.3em]">{time === 'morning' ? 'Mañana' : time === 'afternoon' ? 'Tarde' : 'Noche'}</span>
                  <p className="text-base font-medium leading-relaxed text-slate-700 relative z-10">{itinerary[time]}</p>
               </div>
             ))}
          </motion.section>
        )}
      </AnimatePresence>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-lg space-y-4">
             <div className="flex items-center justify-between text-paisa-emerald">
                <div className="flex items-center gap-3">
                   <Bus size={24} />
                   <h4 className="font-black uppercase text-[10px] tracking-widest">Transporte</h4>
                </div>
                <Badge color="slate">Verificado</Badge>
             </div>
             <div className="space-y-2">
                <p className="text-slate-700 font-bold">{data.terminalInfo || "Terminal del Norte"}</p>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                   <Clock size={12} /> <span>Frecuencia: {data.busFrequency || 'Cada hora'}</span>
                </div>
                {data.busCompanies && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {data.busCompanies.map(c => <span key={c} className="px-2 py-1 bg-slate-50 rounded-lg text-[8px] font-black uppercase text-slate-400">{c}</span>)}
                  </div>
                )}
             </div>
          </div>
          
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-lg space-y-4">
             <div className="flex items-center justify-between text-paisa-gold">
                <div className="flex items-center gap-3">
                   <Wallet size={24} />
                   <h4 className="font-black uppercase text-[10px] tracking-widest">Presupuesto</h4>
                </div>
                <Badge color="gold">COP</Badge>
             </div>
             <div className="space-y-1">
                <div className="flex justify-between items-center">
                   <span className="text-xs text-slate-400 font-medium">Pasaje Bus:</span>
                   <span className="font-black text-slate-900">${data.budget.busTicket.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs text-slate-400 font-medium">Almuerzo Prom:</span>
                   <span className="font-black text-slate-900">${data.budget.averageMeal.toLocaleString()}</span>
                </div>
                <p className="text-[9px] text-paisa-gold font-black uppercase mt-3">* Precios estimados temporada 2024</p>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-lg space-y-4">
             <div className="flex items-center justify-between text-blue-600">
                <div className="flex items-center gap-3">
                   <ShieldCheck size={24} />
                   <h4 className="font-black uppercase text-[10px] tracking-widest">Seguridad</h4>
                </div>
                <Badge color="emerald">OK</Badge>
             </div>
             <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full animate-pulse ${data.viaEstado === 'Despejada' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <p className="text-slate-700 font-bold text-lg">{data.viaEstado || 'Despejada'}</p>
             </div>
             <p className="text-xs text-slate-400 leading-snug">{data.seguridadTexto || 'Vía monitoreada por la comunidad arriera.'}</p>
          </div>
      </section>

      {/* Sugerencias de Local "Neighbor Tips" */}
      {data.neighborTip && (
        <section className="bg-paisa-emerald rounded-[40px] p-10 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
              <Coffee size={120} />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
                 <User size={32} />
              </div>
              <div className="space-y-2 text-center md:text-left">
                 <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-paisa-gold">Tip del Arriero Local</h5>
                 <p className="text-2xl font-serif italic leading-relaxed">"{data.neighborTip}"</p>
              </div>
           </div>
        </section>
      )}

      {/* Muro de la Comunidad e Información IA */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-6">
           <div className="flex items-center gap-3">
              <MessageSquare className="text-paisa-emerald" size={24} />
              <h3 className="text-xl font-black uppercase tracking-tight">Reportes de la Comunidad</h3>
           </div>
           <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
              {reviews.length > 0 ? reviews.map((rev) => (
                <div key={rev.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-3 transition-all hover:bg-white hover:shadow-md">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-paisa-gold/20 text-paisa-gold flex items-center justify-center font-black text-[10px]">
                          {rev.user_name.charAt(0).toUpperCase()}
                       </div>
                       <span className="text-[10px] font-black uppercase text-slate-900">{rev.user_name}</span>
                    </div>
                    <div className="flex text-paisa-gold">
                       {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < rev.stars ? "currentColor" : "none"} />)}
                    </div>
                  </div>
                  <p className="text-sm italic text-slate-600 leading-relaxed">"{rev.comment}"</p>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4 opacity-20">
                   <Users size={48} />
                   <p className="font-serif italic">Se el primero en reportar este pueblo.</p>
                </div>
              )}
           </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[48px] text-white space-y-8 relative overflow-hidden">
           <div className="absolute -bottom-10 -right-10 opacity-5">
              <Sparkles size={200} />
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tight">¿Pasaste por aquí?</h3>
              <p className="text-white/40 text-sm">Ayudá a otros arrieros reportando precios, internet o seguridad.</p>
           </div>
           <form onSubmit={handleSubmitReview} className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                 <input type="text" value={newReview.name} onChange={e => setNewReview(prev => ({...prev, name: e.target.value}))} placeholder="Tu nombre" className="w-full bg-white/5 border border-white/10 rounded-[20px] p-4 text-white outline-none focus:border-paisa-gold transition-all" />
                 <select value={newReview.stars} onChange={e => setNewReview(prev => ({...prev, stars: parseInt(e.target.value)}))} className="w-full bg-white/5 border border-white/10 rounded-[20px] p-4 text-white outline-none focus:border-paisa-gold appearance-none">
                    <option value="5" className="bg-slate-900">⭐⭐⭐⭐⭐</option>
                    <option value="4" className="bg-slate-900">⭐⭐⭐⭐</option>
                    <option value="3" className="bg-slate-900">⭐⭐⭐</option>
                 </select>
              </div>
              <textarea value={newReview.comment} onChange={e => setNewReview(prev => ({...prev, comment: e.target.value}))} placeholder="Contanos qué tal el parche..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-[32px] p-6 text-white outline-none focus:border-paisa-gold resize-none transition-all" />
              <Button disabled={isSubmitting} type="submit" variant="accent" className="w-full h-14 uppercase tracking-[0.3em]">Enviar Reporte Táctico</Button>
           </form>
        </div>
      </section>
    </motion.div>
  );
};
