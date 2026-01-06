
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Star, AlertCircle, Info, Utensils, Camera } from 'lucide-react';
import { SupportedLang } from '../../types';

declare const L: any;

export interface MapPlace {
  id: string;
  titulo: string;
  tag: string;
  category: 'pueblo' | 'medellin' | 'transporte' | 'naturaleza';
  img: string;
  price?: string;
  coords: { lat: number; lng: number };
  info?: string;
  clima?: string;
}

interface InteractiveMapProps {
  places: MapPlace[];
  onSelectPlace: (title: string) => void;
  language: SupportedLang;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ places, onSelectPlace, language }) => {
  const mapRef = useRef<any>(null);
  const containerId = "paisa-interactive-explorer-map";

  useEffect(() => {
    if (typeof L === 'undefined') return;

    const antioquiaCenter: [number, number] = [6.5, -75.5];
    
    if (!mapRef.current) {
      try {
        mapRef.current = L.map(containerId, {
          center: antioquiaCenter,
          zoom: 8,
          zoomControl: false,
          scrollWheelZoom: true
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(mapRef.current);

        L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
      } catch (e) {
        console.error("QA Map Error:", e);
      }
    }

    const markers = L.featureGroup();

    places.forEach(place => {
      const getIconColor = () => {
        switch(place.category) {
          case 'medellin': return '#D4A574';
          case 'naturaleza': return '#3d9c63';
          default: return '#2D7A4C';
        }
      };

      const customIcon = L.divIcon({
        className: 'paisa-marker-container',
        html: `
          <div class="relative group cursor-pointer">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-xl bg-white text-emerald-700" style="background: ${getIconColor()}; color: white;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([place.coords.lat, place.coords.lng], { icon: customIcon });
      
      const popupContent = `
        <div class="paisa-map-popup-card w-[240px] rounded-[24px] bg-white overflow-hidden shadow-2xl">
          <div class="h-24 relative">
             <img src="${place.img}" class="w-full h-full object-cover" />
             <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
             <span class="absolute bottom-2 left-3 text-[8px] font-black uppercase text-white tracking-widest">${place.titulo}</span>
          </div>
          <div class="p-4 space-y-2">
            <p class="text-[9px] text-slate-500 italic leading-tight">${place.info || 'Explora este destino.'}</p>
            <button id="btn-map-${place.id}" class="w-full py-2 bg-emerald-700 text-white rounded-xl text-[8px] font-black uppercase tracking-widest cursor-pointer border-none">VER GUÍA</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { className: 'paisa-custom-popup', maxWidth: 260, closeButton: false });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-map-${place.id}`);
        if (btn) btn.onclick = () => {
          onSelectPlace(place.titulo);
          mapRef.current.closePopup();
        };
      });

      marker.addTo(markers);
    });

    if (mapRef.current && places.length > 0) {
      markers.addTo(mapRef.current);
      mapRef.current.fitBounds(markers.getBounds(), { padding: [50, 50] });
    }

    return () => { markers.clearLayers(); };
  }, [places, onSelectPlace]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full h-[500px] rounded-[48px] overflow-hidden shadow-2xl border border-slate-100 bg-slate-50">
      <style>{`.paisa-custom-popup .leaflet-popup-content-wrapper { background: transparent; box-shadow: none; padding: 0; } .paisa-custom-popup .leaflet-popup-content { margin: 0; }`}</style>
      <div id={containerId} className="w-full h-full z-0"></div>
    </motion.div>
  );
};
