import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { API_BASE_URL } from '../config/apiConfig';
import { MedicineInfo, Language } from '../models/types';
import {
   Info, ClipboardList, ShieldCheck, Volume2, StopCircle, Copy, Check,
   Pill, Activity, Zap, AlertTriangle, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MedicineCardProps {
   info: MedicineInfo;
   language: Language;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ info, language }) => {
   const [isExpanded, setIsExpanded] = useState(false);
   const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'safety'>('overview');
   const [isSpeaking, setIsSpeaking] = useState(false);
   const [copied, setCopied] = useState(false);
   const isSinhala = language === Language.Sinhala;

   const { getToken } = useAuth();
   const [isSaved, setIsSaved] = useState(false);
   const [isSaving, setIsSaving] = useState(false);

   // Check if saved on mount
   useEffect(() => {
      const checkSavedStatus = async () => {
         if (!info._id) return;
         try {
            const token = await getToken();
            if (!token) return;
            const res = await fetch(`${API_BASE_URL}/users/saved`, {
               headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
               const savedList = await res.json();
               // savedList is array of objects if populated, or strings if not.
               // My controller returns populated. So we check _id.
               const isInList = savedList.some((m: any) => m._id === info._id || m === info._id);
               setIsSaved(isInList);
            }
         } catch (e) { console.error(e); }
      };
      checkSavedStatus();
   }, [info._id, getToken]);

   const handleToggleSave = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!info._id) return;
      setIsSaving(true);
      try {
         const token = await getToken();
         if (!token) {
            alert("Please sign in to save medicines.");
            return;
         }
         const res = await fetch(`${API_BASE_URL}/users/saved`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ medicineId: info._id })
         });

         if (res.ok) {
            const data = await res.json();
            setIsSaved(data.isSaved);
         }
      } catch (error) {
         console.error("Failed to toggle save", error);
      } finally {
         setIsSaving(false);
      }
   };


   const handleSpeak = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isSpeaking) {
         window.speechSynthesis.cancel();
         setIsSpeaking(false);
         return;
      }
      const textToSpeak = `${info.medicineName}. ${info.description}. ${info.uses}. ${info.howToUse}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = isSinhala ? 'si-LK' : 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
   };

   const copyInstructions = (e: React.MouseEvent) => {
      e.stopPropagation();
      const text = `${info.medicineName}\n\n${info.description}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   const tabs = [
      { id: 'overview', label: isSinhala ? 'විස්තරය' : 'Overview', icon: Info },
      { id: 'usage', label: isSinhala ? 'භාවිතය' : 'Usage', icon: ClipboardList },
      { id: 'safety', label: isSinhala ? 'ආරක්ෂාව' : 'Safety', icon: ShieldCheck },
   ] as const;

   return (
      <motion.div
         layout
         className={`w-full max-w-5xl mx-auto rounded-[1.5rem] overflow-hidden shadow-xl transition-all border ${isExpanded ? 'bg-white border-teal-500/20 ring-4 ring-teal-500/5' : 'bg-white hover:bg-slate-50 border-slate-200'}`}
      >
         {/* COMPACT HORIZONTAL HEADER - CLICK TO EXPAND */}
         <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative p-8 cursor-pointer group"
         >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">

               {/* LEFT: INFO */}
               <div className="flex flex-col gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-3">
                     <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-3 h-3" />
                        AI Verified
                     </span>
                     <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Pill className="w-3 h-3" />
                        {isSinhala ? 'බෙහෙත්' : 'Medicine'}
                     </span>
                  </div>

                  <div className="space-y-1">
                     <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none group-hover:text-teal-600 transition-colors">
                        {info.medicineName}
                     </h2>
                     <p className="text-slate-500 font-medium text-base line-clamp-1 group-hover:text-slate-600">
                        {info.description}
                     </p>
                  </div>
               </div>

               {/* RIGHT: PRICE & ACTIONS */}
               <div className="flex items-center justify-between w-full md:w-auto gap-8">
                  <div className="text-right">
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Estimated Market Price</p>
                     <div className="text-3xl font-black text-slate-900 tracking-tight">
                        {info.priceRange}
                     </div>
                  </div>

                  <div className="flex items-center gap-2 pl-6 md:border-l md:border-slate-100">
                     {/* Action Buttons */}
                     {/* Save Button */}
                     {info._id && (
                        <button
                           onClick={handleToggleSave}
                           disabled={isSaving}
                           className={`p-2.5 rounded-lg transition-all border ${isSaved ? 'bg-rose-50 text-rose-500 border-rose-200' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-rose-500'}`}
                           title={isSaved ? "Unsave" : "Save"}
                        >
                           <Heart size={18} fill={isSaved ? "currentColor" : "none"} className={isSaving ? "animate-pulse" : ""} />
                        </button>
                     )}

                     <button
                        onClick={handleSpeak}
                        className={`p-2.5 rounded-lg transition-all border ${isSpeaking ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600'}`}
                        title="Listen"
                     >
                        {isSpeaking ? <StopCircle size={18} className="animate-pulse" /> : <Volume2 size={18} />}
                     </button>
                     <button
                        onClick={copyInstructions}
                        className="p-2.5 rounded-lg bg-white text-slate-400 border border-slate-200 hover:border-slate-300 hover:text-teal-600 transition-all"
                        title="Copy"
                     >
                        {copied ? <Check size={18} className="text-teal-600" /> : <Copy size={18} />}
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* EXPANDED CONTENT with TABS */}
         <AnimatePresence>
            {isExpanded && (
               <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="bg-slate-50/50 border-t border-slate-200"
               >
                  {/* TAB NAVIGATION */}
                  <div className="flex items-center gap-1 p-1 bg-slate-200/50 mx-6 mt-6 rounded-xl w-fit">
                     {tabs.map((tab) => (
                        <button
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id as any)}
                           className={`relative px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id
                              ? 'text-slate-900 bg-white shadow-sm'
                              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                              }`}
                        >
                           <tab.icon size={16} className={activeTab === tab.id ? 'text-teal-600' : 'opacity-50'} />
                           {tab.label}
                        </button>
                     ))}
                  </div>

                  {/* CONTENT AREA */}
                  <div className="p-8 pt-6 min-h-[300px]">
                     <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                           <motion.div
                              key="overview"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              className="grid md:grid-cols-2 gap-8"
                           >
                              <div className="space-y-4">
                                 <h3 className="text-lg font-bold text-slate-900">About this medicine</h3>

                                 {/* Description List Rendering Logic */}
                                 {info.description.includes('\n') ? (
                                    <ul className="space-y-3">
                                       {info.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                          <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-lg leading-relaxed">
                                             <div className="pt-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-500" /></div>
                                             {line.replace(/^[-•]\s*/, '').trim()}
                                          </li>
                                       ))}
                                    </ul>
                                 ) : (
                                    <p className="text-slate-600 leading-relaxed font-medium text-lg">
                                       {info.description}
                                    </p>
                                 )}
                              </div>
                              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Primary Uses</h3>
                                 <ul className="space-y-3">
                                    {info.uses.split(',').map((use, i) => (
                                       <li key={i} className="flex items-start gap-3 text-slate-700 font-bold">
                                          <div className="pt-1.5"><div className="w-1.5 h-1.5 rounded-full bg-teal-500" /></div>
                                          {use.trim()}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           </motion.div>
                        )}

                        {activeTab === 'usage' && (
                           <motion.div
                              key="usage"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-6"
                           >
                              <div className="bg-white border border-blue-100 p-6 rounded-2xl shadow-sm">
                                 <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-6">
                                    <Zap size={20} className="text-blue-500" /> Usage Guide
                                 </h3>
                                 <div className="space-y-4">
                                    {info.howToUse.split('.').filter(t => t.trim()).map((step, i) => (
                                       <div key={i} className="flex gap-4">
                                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                                             {i + 1}
                                          </div>
                                          <p className="text-slate-600 font-medium pt-1">{step.trim()}</p>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </motion.div>
                        )}

                        {activeTab === 'safety' && (
                           <motion.div
                              key="safety"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              className="grid md:grid-cols-2 gap-6"
                           >
                              <div className="bg-white border border-rose-100 p-6 rounded-2xl shadow-sm">
                                 <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                                    <AlertTriangle size={20} className="text-rose-500" /> Side Effects
                                 </h3>
                                 <div className="flex flex-wrap gap-2">
                                    {info.sideEffects.map((effect, i) => (
                                       <div key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-md text-sm font-bold border border-rose-100">
                                          {effect}
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              <div className="bg-white border border-amber-100 p-6 rounded-2xl shadow-sm">
                                 <h3 className="text-lg font-bold text-slate-900 mb-4">Food Interactions</h3>
                                 <p className="text-slate-600 font-medium">{info.foodInteractions}</p>
                              </div>

                              <div className="md:col-span-2 bg-slate-100 p-4 rounded-xl text-center">
                                 <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Medical Disclaimer</p>
                                 <p className="text-xs text-slate-500 italic">{info.disclaimer}</p>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </motion.div>
   );
};

export default MedicineCard;
