
// @google/genai: World-class senior frontend engineer fix
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Heart, Users, Star, CheckCircle, Bus, Wallet, Shield, Sparkles, Send, 
  MessageSquare, User, Award, Sun, Cloud, CloudRain, Zap, Wifi, Signal, AlertCircle, Info, Navigation,
  Coffee, Camera, Play, ExternalLink, ShieldCheck, Share2, Accessibility, ShieldAlert, Phone,
  AlertTriangle, Search, Activity, BookOpen, Share, Minimize2, Maximize2, MoreHorizontal,
  Moon, Sunrise, Sunset, Ticket, TrendingUp, Languages, Volume2, Utensils, Link as LinkIcon
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
  const [isExpanded, setIsExpanded] = useState(true);
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

  const getRegionTheme = (region: string) => {
    const themes: Record<string, { main: string, bg: string, border: string, text: string }> = {
      'Suroeste': { main: '#4B3621', bg: 'bg-[#4B3621]/5', border: 'border-[#4B3621]/20', text: 'text-[#4B3621]' },
      'Oriente': { main: '#2D7A4C', bg: 'bg-[#2D7A4C]/5', border: 'border-[#2D7A4C]/20', text: 'text-[#2D7A4C]' },
      'Urabá': { main: '#1E40AF', bg: 'bg-[#1E40AF]/5', border: 'border-[#1E40AF]/20', text: 'text-[#1E40AF]' },
      'Norte': { main: '#166534', bg: 'bg-[#166534]/5', border: 'border-[#166534]/20', text: 'text-[#166534]' },
      'Occidente': { main: '#D97706', bg: 'bg-[#D97706]/5', border: 'border-[#D97706]/20', text: 'text-[#D97706]' },
      'Valle de Aburrá': { main: '#059669', bg: 'bg-[#059669]/5', border: 'border-[#059669]/20', text: 'text-[#059669]' },
    };
    return themes[region] || { main: '#2D7A4C', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' };
  };

  const theme = getRegionTheme(data.region);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full space-y-12"
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* COMPACT VIEW */
          <motion.div 
            key="compact"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`flex flex-col sm:flex-row items-center gap-8 p-8 md:p-10 rounded-[48px] border shadow-xl hover:shadow-2xl transition-all group ${theme.bg} ${theme.border}`}
          >
            <div className={`w-18 h-18 rounded-3xl flex items-center justify-center shrink-0 bg-white shadow-md ${theme.text}`}>
              <Coffee size={32} />
            </div>
            
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">{data.titulo}</h3>
                <Badge color="gold" className="self-center sm:self-auto">{data.region}</Badge>
              </div>
              <p className="text-base italic font-serif text-slate-400 line-clamp-1">"{data.descripcion}"</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end px-8 border-r border-slate-200/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Presupuesto</span>
                <span className={`text-lg font-black ${theme.text}`}>${data.budget?.busTicket?.toLocaleString() || 0}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button onClick={() => setIsExpanded(true)} className="p-4 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm transition-all active:scale-90" title="Expandir">
                  <Maximize2 size={24} />
                </button>
                <button onClick={() => onToggleFavorite(data.titulo)} className={`p-4 rounded-full border transition-all active:scale-90 shadow-sm ${isFavorite ? 'bg-red-500 text-white border-red-500' : 'bg-red-50 border-red-100 text-red-400 hover:text-red-600'}`} title="Favorito">
                  <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* FULL VIEW */
          <motion.div 
            key="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-12"
          >
            {/* Hero Card Split Layout */}
            <section className="relative min-h-[550px] rounded-[64px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row bg-white">
              
              {/* Left Side: Photo Area */}
              <div className="md:w-5/12 min-h-[450px] relative bg-slate-50 overflow-hidden">
                 <SafeImage 
                    src={data.imagen}
                    alt={data.titulo} 
                    region={data.region} 
                    className="absolute inset-0 w-full h-full object-cover" 
                 />
              </div>

              {/* Right Side: Content Area */}
              <div className="flex-1 p-12 lg:p-24 bg-white flex flex-col justify-center gap-10 relative">
                 <div className="flex justify-between items-center">
                    <div className="bg-[#D4A574]/15 px-8 py-3 rounded-full border border-[#D4A574]/10">
                       <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#A67C52]">{data.region}</span>
                    </div>
                    <div className="flex gap-5">
                      <button onClick={() => setIsExpanded(false)} className="p-4 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition-all active:scale-90 border border-slate-200 shadow-sm" title="Comprimir">
                        <Minimize2 size={24} />
                      </button>
                      <button onClick={handleShare} className="p-4 rounded-full bg-blue-50 text-blue-500 hover:text-blue-700 transition-all active:scale-90 border border-blue-100 shadow-sm" title="Compartir">
                        <Share size={24} />
                      </button>
                      <button onClick={() => onToggleFavorite(data.titulo)} className={`p-4 rounded-full transition-all active:scale-90 border border-red-100 shadow-sm ${isFavorite ? 'bg-red-500 text-white border-red-500' : 'bg-red-50 text-red-400 hover:text-red-600'}`} title="Favorito">
                        <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h2 className="text-slate-900 text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8]">{data.titulo}</h2>
                    <p className="text-slate-400 text-3xl md:text-4xl font-serif italic max-w-2xl leading-relaxed">"{data.descripcion}"</p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="p-10 rounded-[48px] bg-[#EEF9F1] border border-emerald-100/30 flex flex-col justify-center shadow-sm">
                       <div className="flex items-center gap-4 text-[#2D7A4C] mb-3">
                          <Accessibility size={22} /> 
                          <span className="text-[11px] font-black uppercase tracking-widest leading-none">Inclusión Física</span>
                       </div>
                       <p className="text-2xl font-bold text-[#1A4731]">{data.accessibility?.score || 85}% Accesible</p>
                    </div>
                    <div className="p-10 rounded-[48px] bg-[#F0F7FF] border border-blue-100/30 flex flex-col justify-center shadow-sm">
                       <div className="flex items-center gap-4 text-[#2563EB] mb-3">
                          <Navigation size={22} /> 
                          <span className="text-[11px] font-black uppercase tracking-widest leading-none">Logística Vía</span>
                       </div>
                       <p className="text-2xl font-bold text-[#1E3A8A]">{data.viaEstado || 'Despejada'}</p>
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-6 pt-8">
                   <button onClick={handleGenerateItinerary} disabled={loadingItinerary} className="h-20 px-12 rounded-[32px] bg-[#2D7A4C] text-white flex items-center justify-center gap-5 text-[12px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-emerald-900/10 flex-1">
                      {loadingItinerary ? <Zap className="animate-spin" size={24} /> : <div className="w-2 h-2 rounded-full bg-white/40" />}
                      {itinerary ? "Refrescar Plan IA" : "Generar Itinerario Táctico"}
                   </button>
                   
                   <button onClick={() => setShowSecurityAlert(!showSecurityAlert)} className={`h-20 px-12 rounded-[32px] flex items-center justify-center gap-5 text-[12px] font-black uppercase tracking-widest transition-all active:scale-95 flex-1 shadow-sm ${showSecurityAlert ? 'bg-red-50 text-red-600' : 'bg-[#E5E7EB]/50 text-slate-500 hover:bg-[#E5E7EB]'}`}>
                      <ShieldAlert size={24} />
                      {showSecurityAlert ? "Reportes Activos" : "Seguridad & SOS"}
                   </button>
                 </div>
              </div>
            </section>

            {/* FICHA TÉCNICA DEL VIAJE */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Presupuesto */}
              <div className="p-12 rounded-[56px] bg-amber-50 border border-amber-100/50 flex flex-col gap-8 shadow-sm group hover:bg-amber-100/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-amber-700">
                    <Wallet size={24} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Presupuesto Local</span>
                  </div>
                  <TrendingUp size={16} className="text-amber-300" />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="p-8 bg-white/60 rounded-[32px] border border-amber-200/20">
                    <span className="text-[10px] font-black uppercase text-amber-500 block mb-1">Pasaje Bus</span>
                    <p className="text-4xl font-black text-slate-900 leading-none">${data.budget?.busTicket?.toLocaleString() || '---'}</p>
                  </div>
                  <div className="p-8 bg-white/60 rounded-[32px] border border-amber-200/20">
                    <span className="text-[10px] font-black uppercase text-amber-500 block mb-1">Almuerzo Promedio</span>
                    <p className="text-4xl font-black text-slate-900 leading-none">${data.budget?.averageMeal?.toLocaleString() || '---'}</p>
                  </div>
                </div>
              </div>

              {/* Logística */}
              <div className="p-12 rounded-[56px] bg-blue-50 border border-blue-100/50 flex flex-col gap-8 shadow-sm group hover:bg-blue-100/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-blue-700">
                    <Bus size={24} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Logística Arriera</span>
                  </div>
                  <MapPin size={16} className="text-blue-300" />
                </div>
                <div className="space-y-6">
                  <div className="p-8 bg-white/60 rounded-[32px] border border-blue-200/20">
                    <span className="text-[10px] font-black uppercase text-blue-500 block mb-1">Punto de Salida</span>
                    <p className="text-2xl font-black text-slate-900 leading-tight">{data.terminalInfo || 'Terminal del Norte'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 px-2">
                    {data.busCompanies?.map((c, i) => (
                      <span key={i} className="px-4 py-2 rounded-full bg-blue-600/10 text-blue-600 text-[9px] font-black uppercase tracking-widest border border-blue-600/5">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seguridad */}
              <div className={`p-12 rounded-[56px] border flex flex-col gap-8 shadow-sm transition-all group ${data.security?.status === 'Seguro' ? 'bg-emerald-50 border-emerald-100/50 hover:bg-emerald-100/40' : 'bg-red-50 border-red-100/50 hover:bg-red-100/40'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-slate-900">
                    <ShieldCheck size={24} className={data.security?.status === 'Seguro' ? 'text-emerald-600' : 'text-red-600'} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Seguridad</span>
                  </div>
                  <AlertCircle size={16} className="opacity-20" />
                </div>
                <div className="space-y-6">
                  <Badge color={data.security?.status === 'Seguro' ? 'emerald' : 'red'}>{data.security?.status || 'Bajo Reporte'}</Badge>
                  <div className="p-8 bg-white/60 rounded-[32px] border border-slate-200/20">
                    <p className="text-lg font-serif italic text-slate-600 leading-relaxed">
                      "{data.seguridadTexto || 'Vía reportada con normalidad.'}"
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* GUÍA DEL ARRIERO LOCAL (ESMERALDA) */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[64px] bg-paisa-emerald p-12 lg:p-20 text-white shadow-2xl"
            >
              <div className="relative z-10 space-y-16">
                <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="shrink-0 relative">
                    <div className="w-44 h-44 rounded-full bg-white/10 p-2 border-2 border-dashed border-white/20 flex items-center justify-center">
                       <div className="w-full h-full rounded-full bg-paisa-emerald border-4 border-white/20 flex items-center justify-center overflow-hidden shadow-2xl">
                          <User size={88} className="text-white mt-4" strokeWidth={1} />
                       </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <span className="text-[12px] font-black uppercase tracking-[0.6em] text-white/50">Guía del Arriero Local</span>
                    <h4 className="text-4xl md:text-6xl font-serif italic font-medium leading-[1.1] max-w-4xl">
                      "{data.neighborTip || 'Disfrutá el paisaje mijo, que como este no hay dos.'}"
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: Utensils, label: 'COMIDA', text: 'Probá los platos típicos, ¡la sazón de pueblo es única!' },
                    { icon: BookOpen, label: 'CULTURA', text: 'Saludá con un "Buenas", el respeto abre todas las puertas.' },
                    { icon: Clock, label: 'HORARIOS', text: 'El comercio madruga mucho, ¡aprovechá el día mijo!' },
                    { icon: Users, label: 'PERSONAS', text: 'Los locales son los mejores guías, no dudés en preguntar.' }
                  ].map((tip, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-md p-10 rounded-[48px] border border-white/10 space-y-5 hover:bg-white/20 transition-all text-center sm:text-left">
                       <tip.icon className="text-white opacity-40 mx-auto sm:mx-0" size={28} />
                       <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 block">{tip.label}</span>
                          <p className="text-lg font-medium leading-relaxed text-white/90">{tip.text}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* GROUNDING LINKS (VERIFICACIÓN) */}
            {data.groundingLinks && data.groundingLinks.length > 0 && (
              <section className="bg-white/50 backdrop-blur-sm p-12 rounded-[48px] border border-slate-100 space-y-8">
                 <div className="flex items-center gap-3">
                    <LinkIcon size={20} className="text-paisa-emerald" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Verificación y Referencias</span>
                 </div>
                 <div className="flex flex-wrap gap-4">
                    {data.groundingLinks.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-100 text-slate-600 hover:text-paisa-emerald hover:border-paisa-emerald transition-all text-sm font-medium shadow-sm group"
                      >
                         <span className="line-clamp-1">{link.title}</span>
                         <ExternalLink size={14} className="opacity-30 group-hover:opacity-100" />
                      </a>
                    ))}
                 </div>
              </section>
            )}

            {/* REPORTES COMUNIDAD */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-20">
              <div className="bg-white p-14 rounded-[64px] border border-slate-100 shadow-xl space-y-10">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <MessageSquare size={28} className="text-paisa-emerald" />
                       <h3 className="text-3xl font-black uppercase tracking-tight">Reportes</h3>
                    </div>
                 </div>
                 <div className="space-y-8 max-h-[500px] overflow-y-auto no-scrollbar">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-10 bg-slate-50 rounded-[48px] border border-slate-100 space-y-5">
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] font-black uppercase text-slate-900">{rev.user_name}</span>
                          <div className="flex text-paisa-gold gap-1">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < rev.stars ? "currentColor" : "none"} />)}</div>
                        </div>
                        <p className="text-lg italic text-slate-600 font-serif">"{rev.comment}"</p>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-slate-900 p-14 rounded-[64px] text-white space-y-12">
                 <h3 className="text-4xl font-black uppercase tracking-tight">¿Pasaste por aquí?</h3>
                 <form onSubmit={handleSubmitReview} className="space-y-8">
                    <input type="text" value={newReview.name} onChange={e => setNewReview(prev => ({...prev, name: e.target.value}))} placeholder="Tu nombre" className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white outline-none focus:border-paisa-gold" />
                    <textarea value={newReview.comment} onChange={e => setNewReview(prev => ({...prev, comment: e.target.value}))} placeholder="Contanos qué tal el parche..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white outline-none focus:border-paisa-gold resize-none" />
                    <button disabled={isSubmitting} type="submit" className="w-full py-6 bg-paisa-gold text-slate-900 rounded-3xl font-black uppercase text-[11px] tracking-widest hover:brightness-110 transition-all">
                       {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
                    </button>
                 </form>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
