import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone,
    AlertTriangle,
    MapPin,
    LifeBuoy,
    X,
    ShieldAlert,
    Zap,
    HeartPulse,
    Navigation,
    PhoneCall
} from 'lucide-react';

interface SOSModalProps {
    isOpen: boolean;
    onClose: () => void;
    isSinhala: boolean;
}

const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose, isSinhala }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.3)] relative z-10 border border-white/20 dark:border-slate-800"
                    >
                        {/* Urgent Header */}
                        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-8 text-white relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <ShieldAlert size={120} />
                            </div>
                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                                        <AlertTriangle size={12} className="animate-pulse" />
                                        {isSinhala ? 'හදිසි ආධාර' : 'Immediate Assistance'}
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tighter leading-none">
                                        {isSinhala ? 'හදිසි අවස්ථාවක්ද?' : 'Medical Emergency?'}
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="bg-white/10 hover:bg-white/20 p-2 rounded-2xl transition-all hover:rotate-90"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Quick Call Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a
                                    href="tel:1990"
                                    className="flex flex-col items-center p-6 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-500/20 rounded-[2rem] hover:scale-105 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <HeartPulse size={40} />
                                    </div>
                                    <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-red-600/20 group-hover:animate-bounce">
                                        <Phone size={28} />
                                    </div>
                                    <span className="font-black text-red-600 dark:text-red-400 text-3xl tracking-tighter leading-none mb-1">1990</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400 text-center">
                                        {isSinhala ? 'සුව සැරිය' : 'Suwa Seriya'}
                                    </span>
                                </a>

                                <a
                                    href="tel:0112686143"
                                    className="flex flex-col items-center p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-500/20 rounded-[2rem] hover:scale-105 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Zap size={40} />
                                    </div>
                                    <div className="w-14 h-14 bg-amber-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-amber-600/20 group-hover:animate-pulse">
                                        <LifeBuoy size={28} />
                                    </div>
                                    <span className="font-black text-amber-600 dark:text-amber-400 text-2xl tracking-tighter leading-none mb-1 text-center">
                                        {isSinhala ? 'විෂ තොරතුරු' : 'Poison Info'}
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 text-center">
                                        {isSinhala ? 'ජාතික රෝහල' : 'National Hospital'}
                                    </span>
                                </a>
                            </div>

                            {/* Action List */}
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all group border border-transparent hover:border-blue-500/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                            <Navigation size={20} />
                                        </div>
                                        <span className="font-black text-slate-700 dark:text-slate-200">
                                            {isSinhala ? 'ආසන්නතම පැය 24 ෆාමසිය' : 'Find Nearest 24h Pharmacy'}
                                        </span>
                                    </div>
                                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                                        {isSinhala ? 'ආසන්නයේ' : 'Near You'}
                                    </span>
                                </button>

                                <button className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all group border border-transparent hover:border-emerald-500/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <PhoneCall size={20} />
                                        </div>
                                        <span className="font-black text-slate-700 dark:text-slate-200">
                                            {isSinhala ? 'වැඩි මිල වාර්තා කිරීම (1977)' : 'Report Price Violation (1977)'}
                                        </span>
                                    </div>
                                </button>
                            </div>

                            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                {isSinhala
                                    ? '*බරපතල වෛද්‍ය හදිසි අවස්ථාවකදී, සැමවිටම වහාම ළඟම ඇති රජයේ රෝහල වෙත යන්න.'
                                    : '*In case of a severe medical emergency, always visit the nearest government hospital immediately.'}
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SOSModal;
