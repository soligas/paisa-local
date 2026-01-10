
// @google/genai: World-class senior frontend engineer fix
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Heart, Users, Star, CheckCircle, Bus, Wallet, Shield, Sparkles, Send, 
  MessageSquare, User, Award, Sun, Cloud, CloudRain, Zap, Wifi, Signal, AlertCircle, Info, Navigation,
  Coffee, Camera, Play, ExternalLink, ShieldCheck, Share2, Accessibility, ShieldAlert, Phone,
  AlertTriangle, Search, Activity, BookOpen, Share
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
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);

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
    const currentUrl = window.location.href;
    const isValidUrl = currentUrl.startsWith('http');
    const shareUrl = isValidUrl ? currentUrl : 'https://paisalocal.pro';

    const shareData = {
      title: `Paisa Local Pro: ${data.titulo}`,
      text: `¡Mijo! Mirá este itinerario táctico para ${data.titulo}, Antioquia.`,
      url: shareUrl,
    };

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('¡Enlace copiado! Compartilo con los parceros mijo.');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await copyToClipboard();
      }
    } catch (err) {
      console.warn('Navigator share failed, falling back to clipboard:', err);
      await copyToClipboard();
    }
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
      
      {/* Hero Card Split Layout (Matching jerico/montebello screenshots) */}
      <section className="relative min-h-[500px] rounded-[56px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row bg-white">
        
        {/* Left Side: Patterned Placeholder (Sin Imágenes) */}
        <div className="md:w-5/12 min-h-[350px] relative bg-slate-50 flex flex-col items-center justify-center p-8">
           <SafeImage 
              alt={data.titulo} 
              region={data.region} 
              className="absolute inset-0 w-full h-full opacity-15" 
           />
           {/* Decorative Central Badge and Text Overlay (Faded) */}
           <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="w-28 h-28 rounded-[36px] bg-white shadow-2xl flex items-center justify-center border border-slate-100/50">
                 <Coffee size={48} className="text-slate-900" />
              </div>
              <div className="text-center space-y-1">
                <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-900/40">
                  {data.region}
                </span>
                <h3 className="text-3xl font-black uppercase tracking-widest text-slate-900/60 leading-none">
                  {data.titulo}
                </h3>
              </div>
           </div>
        </div>

        {/* Right Side: Content Area */}
        <div className="flex-1 p-10 lg:p-20 bg-white flex flex-col justify-center gap-8 relative">
           
           {/* Subregion Badge & Action Icons Row */}
           <div className="flex justify-between items-center mb-2">
              <div className="bg-[#D4A574]/15 px-6 py-2 rounded-full border border-[#D4A574]/10">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A67C52]">{data.region}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={handleShare} className="p-3 rounded-full text-slate-300 hover:text-slate-900 transition-all active:scale-90 border border-slate-50">
                  <Share size={20} />
                </button>
                <button onClick={() => onToggleFavorite(data.titulo)} className={`p-3 rounded-full transition-all active:scale-90 border border-slate-50 ${isFavorite ? 'text-red-500' : 'text-slate-300'}`}>
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
           </div>

           {/* Title & Description (Styled for jerico/montebello style) */}
           <div className="space-y-4">
              <h2 className="text-slate-900 text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">{data.titulo}</h2>
              <p className="text-slate-400 text-2xl md:text-3xl font-serif italic max-w-2xl leading-relaxed">"{data.descripcion}"</p>
           </div>

           {/* Grid de Datos (Matching jerico/montebello screenshots: Mint & Light Blue) */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 rounded-[36px] bg-[#EEF9F1] border border-emerald-100/30 flex flex-col justify-center">
                 <div className="flex items-center gap-3 text-[#2D7A4C] mb-2">
                    <Accessibility size={18} /> 
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Inclusión Física</span>
                 </div>
                 <p className="text-xl font-bold text-[#1A4731]">{data.accessibility?.score || 85}% Accesible</p>
              </div>
              <div className="p-8 rounded-[36px] bg-[#F0F7FF] border border-blue-100/30 flex flex-col justify-center">
                 <div className="flex items-center gap-3 text-[#2563EB] mb-2">
                    <Navigation size={18} /> 
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Logística Vía</span>
                 </div>
                 <p className="text-xl font-bold text-[#1E3A8A]">{data.viaEstado || 'Despejada'}</p>
              </div>
           </div>

           {/* Primary Action Buttons (Pill shape, precisely matching jerico screenshot) */}
           <div className="flex flex-col sm:flex-row gap-4 pt-6">
             <button 
               onClick={handleGenerateItinerary} 
               disabled={loadingItinerary} 
               className="h-16 px-10 rounded-full bg-[#2D7A4C] text-white flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-emerald-900/10 flex-1"
             >
                {loadingItinerary ? <Zap className="animate-spin" size={20} /> : <div className="w-1.5 h-1.5 rounded-full bg-white/40" />}
                {itinerary ? "Refrescar Plan IA" : "Generar Itinerario Táctico"}
             </button>
             
             <button 
               onClick={() => setShowSecurityAlert(!showSecurityAlert)} 
               className={`h-16 px-10 rounded-full flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 flex-1 shadow-sm
                 ${showSecurityAlert ? 'bg-red-50 text-red-600' : 'bg-[#E5E7EB]/50 text-slate-500 hover:bg-[#E5E7EB]'}`}
             >
                <ShieldAlert size={20} />
                {showSecurityAlert ? "Reportes Activos" : "Seguridad & SOS"}
             </button>
           </div>
           
           <AnimatePresence>
             {showSecurityAlert && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-8 bg-red-50 border border-red-100 rounded-[40px] space-y-4">
                 <div className="flex items-center gap-3 text-red-700 font-black uppercase text-[12px] tracking-widest">
                   <Activity size={18} /> Alerta en Tiempo Real
                 </div>
                 <p className="text-sm text-red-600 font-medium leading-relaxed">"Mijo, reporte de la comunidad: vía {data.viaEstado || 'Despejada'}. Si necesitás algo urgente, llamá al {data.security?.emergencyNumber || '123'}."</p>
                 <a href={`tel:${data.security?.emergencyNumber || '123'}`} className="block w-full py-4 bg-red-600 text-white text-center rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors">Llamar Ahora</a>
               </motion.div>
             )}
           </AnimatePresence>
           
           {/* Colored Grounding Links Row */}
           <div className="flex flex-wrap gap-8 pt-8 border-t border-slate-50">
              <a 
                href={`https://www.google.com/search?q=${data.titulo}+Antioquia+fotos+turismo&tbm=isch`} 
                target="_blank" 
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 group"
              >
                <Camera size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" /> Ver Fotos Reales
              </a>
              <a 
                href={`https://www.youtube.com/results?search_query=${data.titulo}+Antioquia+guia+viaje`} 
                target="_blank" 
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 group"
              >
                <Play size={18} className="text-red-500 group-hover:scale-110 transition-transform" /> Videos de Viajeros
              </a>
              <a 
                href={`https://www.google.com/maps/search/${data.titulo}+Antioquia+pueblo`} 
                target="_blank" 
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 group"
              >
                <MapPin size={18} className="text-blue-500 group-hover:scale-110 transition-transform" /> Abrir Mapa
              </a>
           </div>
        </div>
      </section>

      {/* Generated Itinerary Section */}
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

      {/* Logistics Breakdown Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-lg space-y-4">
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
             </div>
          </div>
          
          <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-lg space-y-4">
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
                   <span className="font-black text-slate-900">${data.budget?.busTicket?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs text-slate-400 font-medium">Almuerzo Prom:</span>
                   <span className="font-black text-slate-900">${data.budget?.averageMeal?.toLocaleString() || 0}</span>
                </div>
                <p className="text-[9px] text-paisa-gold font-black uppercase mt-3">* Precios estimados en el índice</p>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-lg space-y-4">
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
             <p className="text-xs text-slate-400 leading-snug">Vía monitoreada por la comunidad arriera.</p>
          </div>
      </section>

      {/* Neighbor Tips (Enhanced with specific categories and icons) */}
      {data.neighborTip && (
        <section className="bg-paisa-emerald rounded-[56px] p-12 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12">
              <Coffee size={140} />
           </div>
           <div className="relative z-10 space-y-10">
              <div className="flex flex-col md:flex-row items-center gap-10">
                 <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
                    <User size={40} />
                 </div>
                 <div className="space-y-3 text-center md:text-left">
                    <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-paisa-gold">Guía del Arriero Local</h5>
                    <p className="text-3xl md:text-4xl font-serif italic leading-tight">"{data.neighborTip}"</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Coffee, label: 'Comida', text: 'Probá los platos típicos, ¡la sazón de pueblo es única!' },
                  { icon: BookOpen, label: 'Cultura', text: 'Saludá con un "Buenas", el respeto abre todas las puertas.' },
                  { icon: Clock, label: 'Horarios', text: 'El comercio madruga mucho, ¡aprovechá el día mijo!' },
                  { icon: Users, label: 'Personas', text: 'Los locales son los mejores guías, no dudés en preguntar.' }
                ].map((tip, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-[32px] border border-white/10 flex flex-col gap-4 group hover:bg-white/20 transition-all">
                    <tip.icon size={24} className="text-paisa-gold group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-1">{tip.label}</p>
                      <p className="text-sm font-medium leading-relaxed">{tip.text}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </section>
      )}

      {/* Community Wall & Reporting Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl space-y-8">
           <div className="flex items-center gap-3">
              <MessageSquare className="text-paisa-emerald" size={28} />
              <h3 className="text-2xl font-black uppercase tracking-tight">Reportes de la Comunidad</h3>
           </div>
           <div className="space-y-6 max-h-[450px] overflow-y-auto no-scrollbar pr-4">
              {reviews.length > 0 ? reviews.map((rev) => (
                <div key={rev.id} className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-4 transition-all hover:bg-white hover:shadow-md">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-paisa-gold/20 text-paisa-gold flex items-center justify-center font-black text-xs">
                          {rev.user_name.charAt(0).toUpperCase()}
                       </div>
                       <span className="text-[11px] font-black uppercase text-slate-900 tracking-wider">{rev.user_name}</span>
                    </div>
                    <div className="flex text-paisa-gold gap-0.5">
                       {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < rev.stars ? "currentColor" : "none"} />)}
                    </div>
                  </div>
                  <p className="text-base italic text-slate-600 leading-relaxed font-serif">"{rev.comment}"</p>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-24 text-center gap-6 opacity-20">
                   <Users size={64} />
                   <p className="text-xl font-serif italic">Se el primero en reportar este pueblo.</p>
                </div>
              )}
           </div>
        </div>

        <div className="bg-slate-900 p-12 rounded-[56px] text-white space-y-10 relative overflow-hidden shadow-2xl">
           <div className="absolute -bottom-12 -right-12 opacity-5">
              <Sparkles size={250} />
           </div>
           <div className="space-y-3 relative z-10">
              <h3 className="text-3xl font-black uppercase tracking-tight">¿Pasaste por aquí?</h3>
              <p className="text-white/50 text-base font-serif italic">Tu reporte ayuda a que el índice táctico sea 100% confiable para el próximo arriero.</p>
           </div>
           <form onSubmit={handleSubmitReview} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <input type="text" value={newReview.name} onChange={e => setNewReview(prev => ({...prev, name: e.target.value}))} placeholder="Tu nombre" className="w-full bg-white/5 border border-white/10 rounded-[24px] p-5 text-white outline-none focus:border-paisa-gold transition-all text-sm font-medium" />
                 <div className="relative">
                   <select value={newReview.stars} onChange={e => setNewReview(prev => ({...prev, stars: parseInt(e.target.value)}))} className="w-full bg-white/5 border border-white/10 rounded-[24px] p-5 text-white outline-none focus:border-paisa-gold appearance-none text-sm cursor-pointer">
                      <option value="5" className="bg-slate-900">⭐⭐⭐⭐⭐ (Excelente)</option>
                      <option value="4" className="bg-slate-900">⭐⭐⭐⭐ (Muy Bueno)</option>
                      <option value="3" className="bg-slate-900">⭐⭐⭐ (Normal)</option>
                   </select>
                 </div>
              </div>
              <textarea value={newReview.comment} onChange={e => setNewReview(prev => ({...prev, comment: e.target.value}))} placeholder="Contanos qué tal el parche, precios, internet o seguridad..." rows={5} className="w-full bg-white/5 border border-white/10 rounded-[32px] p-8 text-white outline-none focus:border-paisa-gold resize-none transition-all text-base font-serif" />
              <button disabled={isSubmitting} type="submit" className="w-full h-16 bg-paisa-gold text-slate-900 rounded-full text-[11px] font-black uppercase tracking-[0.4em] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-amber-900/20 disabled:opacity-50">
                 {isSubmitting ? 'Enviando...' : 'Enviar Reporte Táctico'}
              </button>
           </form>
        </div>
      </section>
    </motion.div>
  );
};
