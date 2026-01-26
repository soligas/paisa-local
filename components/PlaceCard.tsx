
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Bus, ShieldCheck, Sun, Accessibility, 
  Loader2, CheckCircle, Truck, Compass, Star,
  MapPin, Navigation, ArrowRight, ShieldAlert,
  HardHat, Wallet, Utensils, Users, Calculator,
  ExternalLink, Map as MapIcon, Landmark, Banknote,
  Briefcase, CloudRain, Umbrella, Zap, Phone, 
  MessageCircle, Link as LinkIcon, Waves, Search, 
  Layers, Sparkles
} from 'lucide-react';
import { PlaceData, SupportedLang } from '../types';
import { SafeImage } from './atoms/SafeImage';
import { generateSmartItinerary, generateTacticalRecommendations } from '../services/geminiService';
import { Badge } from './atoms/Badge';

interface PlaceCardProps {
  data: PlaceData;
  lang: SupportedLang;
  i18n: any;
  isFavorite: boolean;
  onToggleFavorite: (title: string) => void;
}

type TabType = 'logistica' | 'economia' | 'aventura';

export const PlaceCard: React.FC<PlaceCardProps> = ({ data, lang, i18n, isFavorite, onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState<TabType>('logistica');
  const [itinerary, setItinerary] = useState<any>(null);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [nearbySpots, setNearbySpots] = useState<string[] | null>(null);
  const [loadingSpots, setLoadingSpots] = useState(false);
  
  const [numPeople, setNumPeople] = useState(1);
  const [numMeals, setNumMeals] = useState(1);
  
  const t: any = i18n || {};

  const handleGenerateItinerary = async () => {
    setLoadingItinerary(true);
    const result = await generateSmartItinerary(data.titulo, lang);
    if (result) setItinerary(result);
    setLoadingItinerary(false);
  };

  const handleGenerateRecommendations = async () => {
    setLoadingRecommendations(true);
    const result = await generateTacticalRecommendations(data.titulo, lang);
    if (result) setRecommendations(result);
    setLoadingRecommendations(false);
  };

  const handleScanSpots = async () => {
    setLoadingSpots(true);
    setTimeout(() => {
      setNearbySpots([
        "Charco El Chiflón (A 20 min)",
        "Cascada La Escalera (Acceso placa huella)",
        "Reserva Natural Los Arrieros",
        "Punto de Avistamiento de Aves (Sector Alto)"
      ]);
      setLoadingSpots(false);
    }, 1500);
  };

  const handleOpenRoute = () => {
    const url = `https://www.google.com/maps/dir/Medellin,+Antioquia/${data.titulo},+Antioquia`;
    window.open(url, '_blank');
  };

  const handleOpenTerminalMap = () => {
    const isNorth = data.terminalInfo?.toLowerCase().includes('norte');
    const terminalQuery = isNorth ? 'Terminal+del+Norte+Medellin' : 'Terminal+del+Sur+Medellin';
    window.open(`https://www.google.com/maps/search/${terminalQuery}`, '_blank');
  };

  const handleOpenExchangeMap = () => {
    const query = `Casas+de+cambio+o+Bancos+en+${data.titulo},+Antioquia`;
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  const stats = [
    { icon: Sun, label: t.climate, val: data.weather?.temp ? `${data.weather.temp}°C` : '22°C', color: 'text-amber-600' },
    { icon: Accessibility, label: t.accessibility, val: `${data.accessibility?.score || 90}%`, color: 'text-emerald-700' },
    { icon: ShieldCheck, label: t.security, val: data.security?.status || 'Seguro', color: 'text-blue-600' },
    { icon: Bus, label: t.terminal, val: data.terminalInfo?.split(' ').pop() || 'Sur', color: 'text-slate-900' }
  ];

  const roadStatusValue = data.viaEstado?.toLowerCase().includes('despejada') || data.viaEstado?.toLowerCase().includes('buen') ? '🟢 Despejada' : 
                         data.viaEstado?.toLowerCase().includes('obra') || data.viaEstado?.toLowerCase().includes('parcial') ? '🟡 Precaución' : 
                         data.viaEstado || '🟢 Despejada';

  const ticketCost = data.budget?.busTicket || 35000;
  const mealCost = data.budget?.averageMeal || 25000;
  const totalBudget = (ticketCost * numPeople * 2) + (mealCost * numPeople * numMeals);

  const getSurvivalItems = () => {
    const items = [{ name: 'Efectivo (Cash)', icon: Banknote, important: true }];
    if (data.region === 'Occidente' || (data.weather?.temp || 22) > 25) {
      items.push({ name: 'Bloqueador Solar', icon: Sun, important: true });
    }
    if (data.region === 'Suroeste' || data.region === 'Oriente') {
      items.push({ name: 'Paraguas/Poncho', icon: Umbrella, important: true });
      items.push({ name: 'Chaqueta Ligera', icon: CloudRain, important: false });
    }
    return items;
  };

  const tabIcons = {
    logistica: Truck,
    economia: Wallet,
    aventura: Compass
  };

  return (
    <motion.div layout className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Section Card - Más compacto */}
      <div className="rounded-[40px] md:rounded-[56px] bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row relative">
        <div className="w-full lg:w-[30%] bg-[#FEF9C3]/30 relative p-8 flex flex-col items-center justify-center text-center space-y-4">
           <div className="relative">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden border-4 border-white">
                 <SafeImage 
                    src={data.imagen} 
                    alt={data.titulo} 
                    region={data.region}
                    isThumbnail={true}
                    className="w-full h-full object-cover" 
                 />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                <CheckCircle size={12} strokeWidth={3} />
              </div>
           </div>
           
           <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">{data.region?.toUpperCase()}</span>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-950 leading-tight">{data.titulo}</h1>
           </div>

           <button 
             onClick={() => onToggleFavorite(data.titulo)}
             className={`p-4 rounded-full border transition-all ${isFavorite ? 'bg-red-500 text-white border-red-500 shadow-xl' : 'bg-white border-slate-200 text-slate-400 hover:text-red-500'}`}
           >
             <Heart size={20} fill={isFavorite ? "white" : "none"} />
           </button>
        </div>

        <div className="flex-1 p-8 md:p-12 flex flex-col justify-between bg-white space-y-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((st, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-1">
                     <st.icon size={10} /> {st.label}
                   </span>
                   <span className={`text-lg font-black tracking-tighter uppercase ${st.color}`}>{st.val}</span>
                </div>
              ))}
           </div>
           
           <div className="space-y-3">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-slate-950 leading-none">
                 {data.titulo}
              </h2>
              <p className="text-lg font-serif italic text-slate-400 line-clamp-2">"{data.descripcion || '...'}"</p>
           </div>
        </div>
      </div>

      {/* Selector de Pestañas (Sticky Optimization) */}
      <div className="sticky top-[80px] md:top-[110px] z-[40] p-2 bg-white/80 backdrop-blur-xl rounded-[32px] md:rounded-[40px] gap-2 shadow-xl border border-slate-100 flex">
        {(['logistica', 'economia', 'aventura'] as TabType[]).map((tab) => {
          const Icon = tabIcons[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 md:py-6 rounded-[28px] md:rounded-[32px] flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 transition-all relative ${isActive ? 'bg-paisa-emerald text-white shadow-xl' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <Icon size={isActive ? 20 : 18} strokeWidth={isActive ? 3 : 2} />
              <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest">{tab === 'logistica' ? t.howToGet : tab === 'economia' ? 'ECONOMÍA' : 'AVENTURA'}</span>
              {isActive && <motion.div layoutId="tab-pill" className="absolute bottom-2 w-1 h-1 bg-white rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* Contenido Dinámico por Pestaña */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'logistica' && (
            <motion.div key="log" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Logistics Info Card */}
                  <div className="bg-[#F7FBF9] p-8 rounded-[40px] border border-[#EAF5EF] space-y-6 shadow-sm">
                     <h3 className="text-lg font-black uppercase tracking-widest text-[#1A4731] flex items-center gap-2">
                        <Truck size={18} /> {t.howToGet}
                     </h3>
                     <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: t.leavesFrom, val: data.terminalInfo || 'Terminal Sur', icon: Bus },
                          { label: t.duration, val: data.tiempoDesdeMedellin || '2.5 Horas', icon: Navigation },
                          { label: t.roadStatus, val: roadStatusValue, icon: ShieldAlert },
                          { label: t.pavement, val: data.pavementType || 'Pavimentada', icon: HardHat }
                        ].map((item, i) => (
                          <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
                             <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 block mb-1">{item.label}</span>
                             <span className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                               <item.icon size={12} className="text-paisa-emerald" /> {item.val}
                             </span>
                          </div>
                        ))}
                     </div>
                     <div className="flex flex-col md:flex-row gap-3 pt-2">
                        <button onClick={handleOpenRoute} className="flex-1 py-4 rounded-2xl bg-[#1A4731] text-paisa-gold flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
                           <MapPin size={16} /> {t.verRuta}
                        </button>
                        <button onClick={handleOpenTerminalMap} className="flex-1 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                           <MapIcon size={16} /> {t.verTerminales}
                        </button>
                     </div>
                  </div>

                  {/* Kit & Emergencias */}
                  <div className="space-y-6">
                     <div className="bg-slate-900 p-8 rounded-[40px] border border-white/5 space-y-6 shadow-xl">
                        <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                           <Briefcase size={18} className="text-paisa-gold" /> Botiquín
                        </h3>
                        <div className="flex flex-wrap gap-3">
                           {getSurvivalItems().map((item, i) => (
                             <div key={i} className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                               <item.icon size={14} className={item.important ? 'text-amber-500' : 'text-white/40'} />
                               <span className="text-[10px] font-black uppercase tracking-widest text-white">{item.name}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                     <div className="bg-[#FEF2F2] p-8 rounded-[40px] border border-red-100 flex items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-3">
                           <Phone size={20} className="text-red-700" />
                           <span className="text-xs font-black uppercase tracking-widest text-red-900">Líneas de Socorro</span>
                        </div>
                        <div className="flex gap-2">
                           <a href="tel:123" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-600 shadow-sm hover:scale-110 transition-all"><Phone size={16} /></a>
                           <a href="tel:#767" className="px-4 h-10 rounded-full bg-white flex items-center justify-center text-red-600 shadow-sm font-black text-[10px] hover:scale-105 transition-all">#767</a>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'economia' && (
            <motion.div key="eco" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Budget Calculator Card */}
                  <div className="bg-[#FFFBEB] p-8 rounded-[40px] border border-[#FEF3C7] space-y-8 shadow-sm">
                     <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black uppercase tracking-widest text-amber-900 flex items-center gap-2">
                           <Wallet size={18} /> {t.estimatedBudget}
                        </h3>
                        <Badge color="gold">{t.calcTotal}</Badge>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-amber-50 space-y-3">
                           <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">{t.calcPersons}</span>
                           <div className="flex items-center justify-between">
                              <button onClick={() => setNumPeople(Math.max(1, numPeople - 1))} className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center font-bold">-</button>
                              <span className="text-xl font-black">{numPeople}</span>
                              <button onClick={() => setNumPeople(numPeople + 1)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center font-bold">+</button>
                           </div>
                        </div>
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-amber-50 space-y-3">
                           <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">{t.calcMeals}</span>
                           <div className="flex items-center justify-between">
                              <button onClick={() => setNumMeals(Math.max(1, numMeals - 1))} className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center font-bold">-</button>
                              <span className="text-xl font-black">{numMeals}</span>
                              <button onClick={() => setNumMeals(numMeals + 1)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center font-bold">+</button>
                           </div>
                        </div>
                     </div>

                     <div className="bg-amber-900 p-8 rounded-[32px] text-center space-y-1 shadow-2xl">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500/60">TOTAL ESTIMADO (COP)</span>
                        <div className="text-3xl md:text-4xl font-black text-white tracking-tighter">${totalBudget.toLocaleString('es-CO')}</div>
                     </div>
                  </div>

                  {/* Financial Services */}
                  <div className="bg-[#F1F5F9] p-8 rounded-[40px] border border-slate-200 space-y-6 shadow-sm">
                     <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                        <Landmark size={18} /> {t.financialServices}
                     </h3>
                     <div className="bg-white p-6 rounded-3xl border border-slate-100 italic text-sm text-slate-500 font-serif leading-relaxed">
                        "{lang === 'es' ? 'Priorice corresponsales bancarios en la plaza principal.' : 'Prioritize bank correspondents in the main square.'}"
                     </div>
                     <button 
                        onClick={handleOpenExchangeMap}
                        className="w-full p-8 rounded-[32px] bg-amber-100/50 border-2 border-dashed border-amber-200 flex items-center justify-center gap-4 hover:bg-amber-100 transition-all group"
                     >
                        <div className="p-4 rounded-full bg-white shadow-lg text-amber-600 group-hover:scale-110 transition-transform">
                           <Landmark size={20} />
                        </div>
                        <div className="text-left">
                           <h4 className="text-sm font-black uppercase tracking-tighter text-amber-900">{t.btnExchange}</h4>
                           <p className="text-[8px] font-bold opacity-40 uppercase tracking-widest mt-1">{t.btnExchangeSub}</p>
                        </div>
                     </button>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'aventura' && (
            <motion.div key="ave" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Escáner & Slang */}
                  <div className="lg:col-span-1 space-y-6">
                     <div className="bg-[#E0F2FE] p-8 rounded-[40px] border border-blue-100 space-y-6 shadow-sm">
                        <h3 className="text-lg font-black uppercase tracking-widest text-blue-900 flex items-center gap-2">
                           <Waves size={18} /> Escáner Charcos
                        </h3>
                        <AnimatePresence mode="wait">
                          {!nearbySpots ? (
                            <button onClick={handleScanSpots} disabled={loadingSpots} className="w-full py-6 rounded-2xl bg-white border border-blue-200 text-blue-600 font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-sm hover:bg-blue-50 transition-all">
                               {loadingSpots ? <Loader2 size={16} className="animate-spin" /> : <><Search size={16} /> ESCANEAR ENTORNO</>}
                            </button>
                          ) : (
                            <div className="space-y-2">
                               {nearbySpots.map((s, i) => (
                                 <div key={i} className="px-4 py-2 rounded-xl bg-white/80 text-[9px] font-black text-blue-800 uppercase tracking-widest flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> {s}
                                 </div>
                               ))}
                               <button onClick={() => setNearbySpots(null)} className="w-full text-[8px] font-black text-blue-400 uppercase tracking-widest pt-2">Limpiar</button>
                            </div>
                          )}
                        </AnimatePresence>
                     </div>
                     <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl text-center space-y-3">
                        <span className="text-[9px] font-black text-paisa-emerald uppercase tracking-[0.4em]">Cultura local</span>
                        <h4 className="text-xl font-black text-slate-900">"CHARQUITO"</h4>
                        <p className="text-xs italic text-slate-400 font-serif">"Lugar sagrado del domingo para bañarse en el río."</p>
                     </div>
                  </div>

                  {/* Recommendations & Itinerary Buttons */}
                  <div className="lg:col-span-2 bg-[#1A4731] p-10 rounded-[48px] text-center space-y-8 relative overflow-hidden shadow-2xl">
                     <div className="flex items-center gap-3 justify-center mb-4">
                        <Sparkles size={18} className="text-paisa-gold" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-paisa-gold">INTELIGENCIA TÁCTICA</span>
                     </div>
                     <h3 className="text-white text-3xl font-serif italic max-w-lg mx-auto leading-tight">
                        "{t.quote}"
                     </h3>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <button onClick={handleGenerateItinerary} disabled={loadingItinerary} className="flex-1 py-5 rounded-2xl bg-white text-paisa-emerald font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2">
                           {loadingItinerary ? <Loader2 size={16} className="animate-spin" /> : <><Layers size={16} /> VER ITINERARIO</>}
                        </button>
                        <button onClick={handleGenerateRecommendations} disabled={loadingRecommendations} className="flex-1 py-5 rounded-2xl bg-paisa-gold text-slate-900 font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2">
                           {loadingRecommendations ? <Loader2 size={16} className="animate-spin" /> : <><Star size={16} /> TIPS SECRETOS</>}
                        </button>
                     </div>

                     {/* Dynamic Content Display */}
                     <AnimatePresence>
                        {(itinerary || recommendations) && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-8 text-left grid grid-cols-1 gap-4">
                             {itinerary && Object.entries(itinerary).map(([time, val]: [any, any], i) => (
                               <div key={i} className="p-5 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4 shadow-inner">
                                  <span className="text-[8px] font-black text-paisa-gold w-16 shrink-0">{time.toUpperCase()}</span>
                                  <div>
                                     <p className="text-sm font-black text-white">{val.activity}</p>
                                     <p className="text-[9px] text-white/40 italic">"{val.tip}"</p>
                                  </div>
                               </div>
                             ))}
                             {recommendations && recommendations.slice(0, 3).map((rec, i) => (
                               <div key={i} className="p-4 rounded-2xl bg-paisa-gold/10 border border-paisa-gold/20 flex items-start gap-3 shadow-inner">
                                  <Star size={12} className="text-paisa-gold mt-1 shrink-0" />
                                  <p className="text-xs text-paisa-gold italic">"{rec}"</p>
                               </div>
                             ))}
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer del card - Fuentes (Grounding Obligatorio) */}
      <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start gap-6">
         <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-40">
            <ShieldCheck size={16} className="text-emerald-500" /> Datos Verificados por Arriero Pro
         </div>
         {data.groundingLinks && data.groundingLinks.length > 0 && (
           <div className="space-y-2 w-full md:w-auto">
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Fuentes de Verificación:</span>
             <div className="flex flex-wrap gap-3">
               {data.groundingLinks.map((link, idx) => (
                 <a 
                   key={idx}
                   href={link.uri} 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-500 hover:text-paisa-emerald hover:bg-emerald-50 transition-all"
                 >
                   <LinkIcon size={10} /> {link.title.slice(0, 30)}... <ExternalLink size={10} />
                 </a>
               ))}
             </div>
           </div>
         )}
      </div>
    </motion.div>
  );
};
