
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Image as ImageIcon, X, Link as LinkIcon, 
  Database, Trash2, AlertTriangle, Cpu, Globe, 
  Loader2, Key, Settings, CheckCircle2, RefreshCw,
  ExternalLink, Info, Camera, Layers
} from 'lucide-react';
import { 
  uploadToVercelBlob, listPaisaBlobs, getBlobToken, 
  deleteLocalBlob, saveManualToken, clearManualToken,
  normalizeForSearch
} from '../services/blobService';

interface BlobManagerProps {
  onClose: () => void;
}

export const BlobManager: React.FC<BlobManagerProps> = ({ onClose }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [status, setStatus] = useState<{msg: string, type: 'error' | 'success' | 'info'}>({msg: '', type: 'info'});
  const [urlInput, setUrlInput] = useState<string>('');
  const [fileInputName, setFileInputName] = useState<string>('');
  const [showConfig, setShowConfig] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [tokenExists, setTokenExists] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadBlobs();
    const token = getBlobToken();
    setTokenExists(!!token);
    if (token) setManualToken(token);
  }, []);

  const loadBlobs = async () => {
    setIsVerifying(true);
    const blobs = await listPaisaBlobs();
    setFiles(blobs);
    setIsVerifying(false);
  };

  const handleSaveToken = () => {
    if (manualToken.trim()) {
      saveManualToken(manualToken.trim());
      setTokenExists(true);
      setShowConfig(false);
      setStatus({ msg: 'Bodega vinculada con éxito.', type: 'success' });
      loadBlobs();
    } else {
      clearManualToken();
      setTokenExists(false);
      setStatus({ msg: 'Token removido.', type: 'info' });
    }
    setTimeout(() => setStatus({ msg: '', type: 'info' }), 3000);
  };

  const handleBatchUpload = async (fileList: FileList) => {
    const total = fileList.length;
    if (total === 0) return;

    setUploading(true);
    setProgress({ current: 0, total });

    for (let i = 0; i < total; i++) {
      const file = fileList[i];
      const name = (total === 1 && fileInputName.trim()) 
        ? fileInputName.trim() 
        : file.name.split('.')[0];
      
      setProgress({ current: i + 1, total });
      setStatus({ msg: `Subiendo "${name}" (${i + 1} de ${total})...`, type: 'info' });
      
      try {
        await uploadToVercelBlob(file, name);
      } catch (err) {
        console.error("Fallo en lote:", err);
      }
    }

    setStatus({ msg: `¡Berraquera! ${total} fotos sincronizadas.`, type: 'success' });
    setUploading(false);
    setFileInputName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    loadBlobs();
    setTimeout(() => setStatus({ msg: '', type: 'info' }), 5000);
  };

  const handleLinkUpload = async () => {
    if (!urlInput || !fileInputName) {
      setStatus({ msg: 'Escriba el nombre y pegue el link, mijo.', type: 'error' });
      return;
    }
    setUploading(true);
    setStatus({ msg: 'Indexando link...', type: 'info' });
    const res = await uploadToVercelBlob(urlInput, fileInputName);
    if (res.url) {
      setStatus({ msg: 'Link guardado en la bodega.', type: 'success' });
      setUrlInput('');
      setFileInputName('');
      loadBlobs();
    } else {
      setStatus({ msg: res.error || 'Error de link.', type: 'error' });
    }
    setUploading(false);
    setTimeout(() => setStatus({ msg: '', type: 'info' }), 5000);
  };

  const handleDelete = (file: any) => {
    if (!confirm('¿Seguro que quiere borrar esta foto?')) return;
    if (file.isLocal) {
      deleteLocalBlob(file.pathname);
      loadBlobs();
    } else {
      alert("Mijo, las fotos de la nube se gestionan desde Vercel Dashboard.");
    }
  };

  const formatFileName = (pathname: string) => {
    const fileName = pathname.split('/').pop() || "";
    // Usamos la misma lógica de normalización para mostrar un nombre limpio
    return fileName.split('.')[0]
      .replace(/^paisa-local-?/i, '')
      .replace(/-/g, ' ')
      .toUpperCase();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-slate-950/98 backdrop-blur-3xl p-4 md:p-12 overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-32">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
             <div className="p-4 bg-paisa-gold rounded-2xl text-slate-900 shadow-2xl">
                <Database size={32} />
             </div>
             <div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">Bodega de Fotos</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${tokenExists ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                      {tokenExists ? <><Globe size={10} /> Sincronizado con Vercel</> : <><AlertTriangle size={10} /> Modo Local</>}
                   </div>
                   <button onClick={() => setShowConfig(!showConfig)} className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white transition-all">
                     <Settings size={14} />
                   </button>
                </div>
             </div>
          </div>
          <button onClick={onClose} className="p-4 rounded-full bg-white/5 text-white hover:bg-white/20 transition-all border border-white/10">
            <X size={24} />
          </button>
        </div>

        {/* Panel de Configuración */}
        <AnimatePresence>
          {showConfig && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-8 rounded-[32px] bg-slate-900 border border-white/10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                      <Key className="text-paisa-gold" size={16} /> Token de Acceso
                    </h3>
                    <div className="flex gap-4">
                      <input 
                        type="password" placeholder="blob_..." value={manualToken}
                        onChange={(e) => setManualToken(e.target.value)}
                        className="flex-1 bg-slate-950 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-paisa-gold"
                      />
                      <button onClick={handleSaveToken} className="px-8 py-5 bg-paisa-gold text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">
                        Vincular
                      </button>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                    <h4 className="text-[10px] font-black text-paisa-gold uppercase tracking-widest flex items-center gap-2">
                       <Info size={14} /> Tip de Sincronización
                    </h4>
                    <p className="text-xs text-white/40 leading-relaxed italic">
                      "Si ya subiste la foto en Vercel, asegúrate de tener el Token pegado aquí y dale al botón de <span className="text-white font-bold">Refrescar</span> abajo."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status con Barra de Progreso */}
        <AnimatePresence>
          {status.msg && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className={`p-6 rounded-[32px] text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 border shadow-2xl
                ${status.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-500' : 
                  status.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500' : 
                  'bg-paisa-gold/20 border-paisa-gold/30 text-paisa-gold'}`}
              >
                 {uploading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                 {status.msg}
              </div>
              {uploading && progress.total > 1 && (
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                    className="h-full bg-paisa-gold shadow-[0_0_15px_rgba(212,165,116,0.5)]"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Panel de Acción */}
          <div className="space-y-8">
            <div className="p-10 rounded-[48px] bg-white/5 border border-white/10 space-y-10 shadow-2xl">
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white">Cargar Fotos</h3>
                    <p className="text-slate-500 text-sm font-serif italic">Subí una o varias de un solo tacazo.</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-paisa-emerald/20 text-paisa-emerald">
                     <Layers size={24} />
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Nombre (Opcional si es lote)</label>
                    <input 
                      type="text" placeholder="Ej: Guatape, Jardin..."
                      className="w-full bg-slate-900 border border-white/10 p-6 rounded-[28px] text-white outline-none focus:border-paisa-gold transition-all text-xl font-bold"
                      value={fileInputName} onChange={e => setFileInputName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                     <div className="relative group">
                        <input 
                          type="file" ref={fileInputRef} className="hidden" id="blob-file-input" 
                          accept="image/*" multiple onChange={(e) => e.target.files && handleBatchUpload(e.target.files)} 
                        />
                        <label htmlFor="blob-file-input" className="w-full py-12 rounded-[32px] border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-all cursor-pointer group hover:border-paisa-gold/30">
                           <div className="p-5 rounded-full bg-white/5 text-white group-hover:bg-paisa-gold group-hover:text-slate-950 transition-all shadow-xl">
                              <Upload size={28} />
                           </div>
                           <div className="text-center">
                              <span className="block text-[10px] font-black uppercase tracking-widest text-white/50">Seleccionar Fotos</span>
                           </div>
                        </label>
                     </div>

                     <div className="space-y-4">
                        <div className="bg-slate-900/50 p-6 rounded-[32px] border border-white/5 space-y-4">
                          <input 
                            type="text" placeholder="Link de Imagen"
                            className="w-full bg-slate-950 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-paisa-emerald text-sm"
                            value={urlInput} onChange={e => setUrlInput(e.target.value)}
                          />
                          <button 
                            onClick={handleLinkUpload}
                            disabled={uploading || !urlInput || !fileInputName}
                            className="w-full py-4 bg-paisa-emerald text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl disabled:opacity-20 flex items-center justify-center gap-2"
                          >
                            <LinkIcon size={14} /> Indexar Link
                          </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Galería / Inventario */}
          <div className="space-y-6">
             <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-3">
                   <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Inventario Bodega</h4>
                   <div className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-black text-white/30">{files.length}</div>
                </div>
                <button onClick={loadBlobs} disabled={isVerifying} className="flex items-center gap-2 text-paisa-gold text-[10px] font-black uppercase hover:underline transition-all">
                  <RefreshCw size={12} className={isVerifying ? 'animate-spin' : ''} /> Refrescar
                </button>
             </div>
             
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar pb-10">
                {files.map((file, i) => (
                  <motion.div 
                    key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="relative aspect-square rounded-[32px] overflow-hidden border border-white/10 group bg-slate-900 shadow-xl"
                  >
                    <img src={file.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Bodega" />
                    
                    <div className="absolute top-3 right-3">
                       <div className={`px-2 py-1 rounded-lg text-[7px] font-black uppercase shadow-2xl border border-white/10 ${file.isLocal ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white flex items-center gap-1'}`}>
                          {file.isLocal ? 'Local' : <><Globe size={8} /> Nube</>}
                       </div>
                    </div>

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button onClick={() => handleDelete(file)} className="p-4 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-2xl">
                         <Trash2 size={20} />
                       </button>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                       <div className="px-3 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-center">
                          <p className="text-[8px] font-black text-white uppercase truncate">
                            {formatFileName(file.pathname)}
                          </p>
                       </div>
                    </div>
                  </motion.div>
                ))}
                
                {files.length === 0 && !isVerifying && (
                  <div className="col-span-3 py-32 text-center opacity-10 border border-white/5 rounded-[64px] flex flex-col items-center justify-center gap-6">
                     <ImageIcon size={64} />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em]">Bodega sin existencias</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
