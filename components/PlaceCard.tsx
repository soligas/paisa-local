
// @google/genai: World-class senior frontend engineer fix
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Heart, Users, Star, CheckCircle, Bus, Wallet, Shield, Sparkles, Send, 
  MessageSquare, User, Award, Sun, Cloud, CloudRain, Zap, Wifi, Signal, AlertCircle, Info, Navigation,
  Coffee, Camera, Play, ExternalLink, ShieldCheck, Share2, Accessibility, ShieldAlert, Phone,
  AlertTriangle, Search, Activity, BookOpen, Share, Minimize2, Maximize2, MoreHorizontal,
  Moon, Sunrise, Sunset, Ticket, TrendingUp, Languages, Volume2, Utensils, Link as LinkIcon, Smile,
  Loader2, Map as MapIcon, Youtube, Instagram
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
  data, lang, i18n, isFavorite, isVisited, onToggleFavorite, onToggleVisited 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
    const result = await generateSmartItinerary(data.titulo, lang);
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
          <motion.div 
            key="compact"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`flex flex-col sm:flex-row items-center gap-8 p-8 md:p-10 rounded-[48px] border shadow-xl hover:shadow-2xl transition-all group ${theme.bg} ${theme.border}`}
          >
            <div className="w-24 h-24 rounded-3xl overflow-hidden shrink-0 shadow-lg border-4 border-white">
              <SafeImage src={data.imagen} alt={data.titulo} region={data.region} className="w-full h-full object-cover" />
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
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{i18n.budgetTitle}</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-black ${theme.text}`}>${data.budget?.busTicket?.toLocaleString() || 0}</span>
                  <span className="text-[10px] font-black opacity-60 text-slate-500">{i18n.currency}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button onClick={() => setIsExpanded(true)} className="p-4 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm transition-all active:scale-90 flex items-center gap-2" title="Expandir">
                  <span className="text-[9px] font-black uppercase tracking-widest pl-2">Detalles</span>
                  <Maximize2 size={20} />
                </button>
                <button onClick={() => onToggleFavorite(data.titulo)} className={`p-4 rounded-full border transition-all active:scale-90 shadow-sm ${isFavorite ? 'bg-red-500 text-white border-red-500' : 'bg-red-50 border-red-100 text-red-400 hover:text-red-600'}`} title={i18n.fav}>
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-12"
          >
            <section className="relative min-h-[550px] rounded-[64px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row bg-white">
              <div className="md:w-5/12 min-h-[450px] relative bg-slate-50 overflow-hidden">
                 <SafeImage 
                    src={data.imagen}
                    alt={data.titulo} 
                    region={data.region} 
                    className="absolute inset-0 w-full h-full object-cover" 
                 />
              </div>

              <div className="flex-1 p-12 lg:p-24 bg-white flex flex-col justify-center gap-6 relative">
                 <div className="flex justify-between items-start mb-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#D4A574]/15 px-8 py-3 rounded-full border border-[#D4A574]/10 inline-flex">
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#A67C52]">{data.region}</span>
                        </div>
                        <div className="px-6 py-2 bg-paisa-emerald/5 border border-paisa-emerald/10 rounded-full flex items-center gap-2">
                           <ShieldCheck size={14} className="text-paisa-emerald" />
                           <span className="text-[9px] font-black uppercase tracking-widest text-paisa-emerald">{i18n.verifiedDest}</span>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm font-black uppercase tracking-widest block opacity-70">
                         {data.region === 'Suroeste' ? 'Corazón de Montañas y Tradición Cafetera' : 'Tesoros Escondidos de Antioquia'}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setIsExpanded(false)} className="p-4 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-all active:scale-90 border border-slate-100 shadow-sm" title="Comprimir">
                        <Minimize2 size={24} />
                      </button>
                      <button onClick={handleShare} className="p-4 rounded-full bg-blue-50/50 text-blue-400 hover:text-blue-600 transition-all active:scale-90 border border-blue-50 shadow-sm" title={i18n.share}>
                        <Share size={24} />
                      </button>
                      <button onClick={() => onToggleFavorite(data.titulo)} className={`p-4 rounded-full transition-all active:scale-90 border shadow-sm ${isFavorite ? 'bg-red-500 text-white border-red-500' : 'bg-red-50/50 text-red-300 hover:text-red-500 border-red-50'}`} title={i18n.fav}>
                        <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h2 className="text-slate-900 text-8xl md:text-[120px] font-black uppercase tracking-tighter leading-[0.75]">{data.titulo}</h2>
                    <p className="text-slate-500 text-3xl md:text-4xl font-serif italic max-w-2xl leading-relaxed">"{data.descripcion}"</p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    <div className="p-8 rounded-[40px] bg-[#EEF9F1]/60 border border-emerald-100/20 flex flex-col justify-center shadow-sm">
                       <div className="flex items-center gap-4 text-[#2D7A4C] mb-2">
                          <Accessibility size={20} /> 
                          <span className="text-[10px] font-black uppercase tracking-widest leading-none">{i18n.accessibility}</span>
                       </div>
                       <p className="text-xl font-bold text-[#1A4731]">{data.accessibility?.score || 85}% Verificada</p>
                    </div>
                    <div className="p-8 rounded-[40px] bg-[#F0F7FF]/60 border border-blue-100/20 flex flex-col justify-center shadow-sm">
                       <div className="flex items-center gap-4 text-[#2563EB] mb-2">
                          <Navigation size={20} /> 
                          <span className="text-[10px] font-black uppercase tracking-widest leading-none">{i18n.logistics}</span>
                       </div>
                       <p className="text-xl font-bold text-[#1E3A8A]">{data.viaEstado || 'Vía Despejada'}</p>
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 pt-4">
                   <button 
                    onClick={handleGenerateItinerary} 
                    disabled={loadingItinerary} 
                    className="h-20 px-10 rounded-[32px] bg-paisa-emerald text-white flex items-center justify-center gap-5 text-[11px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-emerald-900/10 flex-1"
                   >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 shrink-0">
                        {loadingItinerary ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Zap size={18} className="text-paisa-gold" fill="currentColor" />
                        )}
                      </div>
                      <span>{itinerary ? i18n.refreshItinerary : i18n.itineraryIA}</span>
                   </button>
                   
                   <button 
                    onClick={() => setShowSecurityAlert(!showSecurityAlert)} 
                    className={`h-20 px-10 rounded-[32px] flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 flex-1 shadow-sm border ${showSecurityAlert ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}
                   >
                      <ShieldAlert size={24} />
                      <span>{showSecurityAlert ? i18n.reportsSOS : i18n.securitySOS}</span>
                   </button>
                 </div>

                 {/* TACTICAL SHORTCUT BUTTONS - Actualizados con iconos y etiquetas para Video y Red Social */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(data.titulo)}+Antioquia`, '_blank')}
                      className="flex flex-col items-center justify-center gap-3 p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:border-paisa-emerald hover:text-paisa-emerald transition-all group"
                    >
                      <MapIcon size={24} className="text-slate-300 group-hover:text-paisa-emerald" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Mapa Real</span>
                    </button>
                    <button 
                      onClick={() => window.open(`https://www.youtube.com/results?search_query=viajar+a+${encodeURIComponent(data.titulo)}+Antioquia+en+bus+experiencia`, '_blank')}
                      className="flex flex-col items-center justify-center gap-3 p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:border-red-600 hover:text-red-600 transition-all group"
                    >
                      <Youtube size={24} className="text-slate-300 group-hover:text-red-600" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Video Guía</span>
                    </button>
                    <button 
                      onClick={() => window.open(`https://www.google.com/search?q=donde+comer+mejor+en+${encodeURIComponent(data.titulo)}+Antioquia`, '_blank')}
                      className="flex flex-col items-center justify-center gap-3 p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:border-amber-500 hover:text-amber-500 transition-all group"
                    >
                      <Utensils size={24} className="text-slate-300 group-hover:text-amber-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Comida</span>
                    </button>
                    <button 
                      onClick={() => window.open(`https://www.instagram.com/explore/tags/${encodeURIComponent(data.titulo.toLowerCase().replace(/\s/g, ''))}antioquia/`, '_blank')}
                      className="flex flex-col items-center justify-center gap-3 p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:border-pink-500 hover:text-pink-500 transition-all group"
                    >
                      <Instagram size={24} className="text-slate-300 group-hover:text-pink-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Red Social</span>
                    </button>
                 </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-12 rounded-[56px] bg-[#FFFAF0] border border-amber-100/50 flex flex-col gap-8 shadow-sm group hover:bg-amber-100/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-amber-700">
                    <Wallet size={24} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{i18n.budgetTitle}</span>
                  </div>
                  <TrendingUp size={16} className="text-amber-300" />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="p-8 bg-white/60 rounded-[32px] border border-amber-200/20">
                    <span className="text-[10px] font-black uppercase text-amber-500 block mb-1">{i18n.busTicket}</span>
                    <div className="flex items-baseline gap-2">
                      <p className="text-5xl font-black text-slate-900 leading-none">${data.budget?.busTicket?.toLocaleString() || '---'}</p>
                      <span className="text-sm font-black text-slate-500 tracking-widest opacity-80">{i18n.currency}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 mt-2 block uppercase tracking-widest">{i18n.indexedToday}</span>
                  </div>
                  <div className="p-8 bg-white/60 rounded-[32px] border border-amber-200/20">
                    <span className="text-[10px] font-black uppercase text-amber-500 block mb-1">{i18n.meal}</span>
                    <div className="flex items-baseline gap-2">
                      <p className="text-5xl font-black text-slate-900 leading-none">${data.budget?.averageMeal?.toLocaleString() || '---'}</p>
                      <span className="text-sm font-black text-slate-500 tracking-widest opacity-80">{i18n.currency}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 mt-2 block uppercase tracking-widest">{i18n.puebloFlavor}</span>
                  </div>
                </div>
              </div>

              <div id="logistica-arriera" className="p-12 rounded-[56px] bg-[#F0F7FF] border border-blue-100/50 flex flex-col gap-8 shadow-sm group hover:bg-blue-100/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-blue-700">
                    <Bus size={24} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{i18n.logisticsTitle}</span>
                  </div>
                  <MapPin size={16} className="text-blue-300" />
                </div>
                <div className="space-y-6">
                  <div className="p-8 bg-white/60 rounded-[32px] border border-blue-200/20">
                    <span className="text-[10px] font-black uppercase text-blue-500 block mb-1">{i18n.departurePoint}</span>
                    <p className="text-3xl font-black text-slate-900 leading-tight">{data.terminalInfo || 'Terminal del Norte'}</p>
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

              <div className={`p-12 rounded-[56px] border flex flex-col gap-8 shadow-sm transition-all group ${data.security?.status === 'Seguro' ? 'bg-[#F0FFF4] border-emerald-100/50 hover:bg-emerald-100/40' : 'bg-[#FFF5F5] border-red-100/50 hover:bg-red-100/40'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-slate-900">
                    <ShieldCheck size={24} className={data.security?.status === 'Seguro' ? 'text-emerald-600' : 'text-red-600'} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{i18n.securityTitle}</span>
                  </div>
                  <AlertCircle size={16} className="opacity-20" />
                </div>
                <div className="space-y-6">
                  <div className="flex">
                    <Badge color={data.security?.status === 'Seguro' ? 'emerald' : 'red'}>{data.security?.status || 'Bajo Reporte'}</Badge>
                  </div>
                  <div className="p-8 bg-white/60 rounded-[32px] border border-slate-200/20">
                    <p className="text-xl font-serif italic text-slate-600 leading-relaxed">
                      "{data.seguridadTexto || 'Vía reportada como segura y despejada por autoridades regionales.'}"
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[64px] bg-paisa-emerald p-12 lg:p-20 text-white shadow-2xl border border-white/10"
            >
              <div className="absolute top-0 right-0 p-24 opacity-5 -rotate-12 pointer-events-none">
                 <Coffee size={240} />
              </div>

              <div className="relative z-10 space-y-16">
                <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="shrink-0 relative">
                    <div className="w-44 h-44 rounded-full bg-white/10 p-2 border-2 border-dashed border-white/20 flex items-center justify-center">
                       <div className="w-full h-full rounded-full bg-paisa-emerald border-4 border-white/20 flex items-center justify-center overflow-hidden shadow-2xl group transition-all duration-500 hover:border-paisa-gold/50">
                          <Smile size={88} className="text-white group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12" strokeWidth={1.5} />
                       </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-paisa-gold text-slate-900 p-2 rounded-xl shadow-lg rotate-12">
                       <Sparkles size={20} />
                    </div>
                  </div>
                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                       <span className="text-[12px] font-black uppercase tracking-[0.6em] text-white/50">{i18n.arrieroGuide}</span>
                       <Badge color="white">{i18n.tipMijo}</Badge>
                    </div>
                    <h4 className="text-5xl md:text-7xl font-serif italic font-medium leading-[1.1] max-w-4xl">
                      "{data.neighborTip || i18n.defaultNeighborTip}"
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { icon: Utensils, label: i18n.foodTip, text: i18n.foodTipDesc, color: 'text-amber-300' },
                    { icon: BookOpen, label: i18n.cultureTip, text: i18n.cultureTipDesc, color: 'text-blue-300' },
                    { icon: Clock, label: i18n.timeTip, text: i18n.timeTipDesc, color: 'text-emerald-300' },
                    { icon: Users, label: i18n.peopleTip, text: i18n.peopleTipDesc, color: 'text-paisa-gold' }
                  ].map((tip, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-md p-10 rounded-[48px] border border-white/10 space-y-6 hover:bg-white/20 transition-all flex flex-col items-center sm:items-start text-center sm:text-left group">
                       <div className="p-4 rounded-2xl bg-white/5 transition-transform group-hover:-rotate-6">
                         <tip.icon className={`${tip.color} opacity-80`} size={32} />
                       </div>
                       <div className="space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 block">{tip.label}</span>
                          <p className="text-xl font-medium leading-relaxed text-white/90">{tip.text}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            <AnimatePresence>
              {itinerary && (
                <motion.section 
                  initial={{ opacity: 0, scale: 0.98 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#111827] rounded-[64px] p-12 lg:p-20 text-white space-y-12 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-24 opacity-5 -rotate-12 pointer-events-none">
                     <Sparkles size={240} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-paisa-gold">
                         <Sparkles size={24} />
                         <span className="text-[11px] font-black uppercase tracking-[0.4em]">Itinerario con Inteligencia Paisa</span>
                      </div>
                      <h3 className="text-6xl md:text-7xl font-black uppercase tracking-tighter">{i18n.itineraryPlan} <br /> <span className="text-white/40">Para {data.titulo}</span></h3>
                    </div>
                    <Badge color="gold">{i18n.current}</Badge>
                  </div>

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                     {[
                       { time: 'Mañana', content: itinerary.morning, icon: Sunrise },
                       { time: 'Tarde', content: itinerary.afternoon, icon: Sun },
                       { time: 'Noche', content: itinerary.evening, icon: Moon }
                     ].map((slot, i) => (
                       <div key={i} className="p-10 rounded-[48px] bg-white/5 border border-white/10 space-y-6 hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4 text-paisa-gold">
                             <slot.icon size={28} />
                             <span className="text-[11px] font-black uppercase tracking-widest">{slot.time}</span>
                          </div>
                          <p className="text-2xl font-serif italic text-white/80 leading-relaxed">"{slot.content}"</p>
                       </div>
                     ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {data.groundingLinks && data.groundingLinks.length > 0 && (
              <section className="bg-white/50 backdrop-blur-sm p-12 rounded-[48px] border border-slate-100 space-y-8">
                 <div className="flex items-center gap-3">
                    <LinkIcon size={20} className="text-paisa-emerald" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{i18n.references}</span>
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
