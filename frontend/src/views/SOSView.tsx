import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    ShieldAlert,
    Zap,
    Flame,
    Ban,
    Activity,
    PhoneCall,
    CheckCircle,
    Sparkles,
    AlertCircle,
    ArrowRight,
    Info,
    ChevronDown,
    XCircle
} from 'lucide-react';
import Loader from '../components/Loader';
import { getSosCuratedContent } from '../models/staticData';
import { EmergencyInfo } from '../models/types';

interface SOSViewProps {
    isSinhala: boolean;
    handleSOSRequest: (situation: string) => void;
    isLoading: boolean;
    emergencyData: EmergencyInfo | null;
    setEmergencyData: (data: EmergencyInfo | null) => void;
}

const SOSView: React.FC<SOSViewProps> = ({
    isSinhala,
    handleSOSRequest,
    isLoading,
    emergencyData,
    setEmergencyData
}) => {
    const sosCuratedContent = getSosCuratedContent(isSinhala);

    return (
        <div className="w-full max-w-6xl mt-12 animate-fade-in-up space-y-16 pb-32 px-4">
            {/* Hero Section */}
            <div className="text-center space-y-6 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-white shadow-[0_20px_50px_rgba(220,38,38,0.3)]"
                >
                    <AlertTriangle className="w-12 h-12" />
                </motion.div>
                <h2 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                    {isSinhala ? 'හදිසි' : 'Emergency'}<br />
                    <span className="text-red-600">{isSinhala ? 'සහාය' : 'Assistance'}</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold max-w-xl mx-auto text-lg">
                    {isSinhala ? 'තත්පරයක් වටිනා මොහොතක, නිවැරදි තීරණය ඔබව බේරා ගනී. වහාම උපකාර ලබා ගන්න.' : 'In critical moments every second counts. Follow the steps below or call 1990 immediately.'}
                </p>
            </div>

            {/* Quick Situations Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[
                    { situation: isSinhala ? 'Snake Bite' : 'Snake Bite', label: isSinhala ? 'සර්ප දෂ්ඨනය' : 'Snake Bite', icon: AlertCircle, color: 'from-amber-500 to-orange-600' },
                    { situation: isSinhala ? 'Dog Bite' : 'Dog Bite', label: isSinhala ? 'බල්ලා දෂ්ඨ කිරීම' : 'Dog Bite', icon: ShieldAlert, color: 'from-blue-500 to-indigo-600' },
                    { situation: isSinhala ? 'Choking' : 'Choking', label: isSinhala ? 'හුස්ම හිරවීම' : 'Choking', icon: Zap, color: 'from-sky-500 to-cyan-600' },
                    { situation: isSinhala ? 'Severe Bleeding' : 'Severe Bleeding', label: isSinhala ? 'දැඩි රුධිර වහනය' : 'Severe Bleeding', icon: Flame, color: 'from-red-500 to-rose-600' },
                    { situation: isSinhala ? 'Poisoning' : 'Poisoning', label: isSinhala ? 'විෂ වීම්' : 'Poisoning', icon: Ban, color: 'from-purple-500 to-fuchsia-600' },
                    { situation: isSinhala ? 'Heart Attack' : 'Heart Attack', label: isSinhala ? 'හෘදයාබාධ' : 'Heart Attack', icon: Activity, color: 'from-emerald-500 to-teal-600' }
                ].map((item, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSOSRequest(item.situation)}
                        className="group relative bg-white dark:bg-slate-900/50 p-10 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl`}></div>
                        <div className={`p-6 bg-gradient-to-br ${item.color} text-white rounded-3xl mb-6 shadow-lg transform group-hover:rotate-6 transition-transform duration-500 inline-block`}>
                            <item.icon className="w-10 h-10" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{item.label}</h4>
                        <div className="flex items-center gap-2 text-slate-400 group-hover:text-red-500 transition-colors font-bold text-sm">
                            {isSinhala ? 'උපදෙස් බලන්න' : 'View Protocol'} <ArrowRight className="w-4 h-4" />
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Suwa Seriya CTA */}
            <motion.a
                href="tel:1990"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full p-10 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-[3.5rem] shadow-[0_30px_60px_rgba(220,38,38,0.25)] flex flex-col md:flex-row items-center justify-between gap-10 hover:brightness-110 transition-all group relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="flex items-center gap-8 relative z-10">
                    <div className="p-7 bg-white/20 rounded-full group-hover:animate-bounce shadow-inner backdrop-blur-md">
                        <PhoneCall className="w-12 h-12" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-black uppercase tracking-[0.3em] opacity-80 mb-1">Emergency Service Sri Lanka</p>
                        <p className="text-6xl font-black tracking-tighter">1990</p>
                    </div>
                </div>
                <div className="flex flex-col items-center md:items-end gap-2 relative z-10 text-center md:text-right">
                    <div className="px-6 py-2 bg-white/20 rounded-full text-sm font-black uppercase tracking-widest backdrop-blur-md">
                        Suwa Seriya
                    </div>
                    <p className="font-bold opacity-80 max-w-[200px]">{isSinhala ? 'වහාම ගිලන් රථයක් ගෙන්වා ගන්න' : 'Call for immediate medical dispatch'}</p>
                </div>
            </motion.a>

            {/* Detailed Content Display */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-20 flex justify-center"
                    >
                        <Loader />
                    </motion.div>
                ) : emergencyData && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="glass-card p-0 rounded-[4rem] border-2 border-white/50 dark:border-slate-800 shadow-2xl overflow-hidden relative"
                    >
                        {(() => {
                            const situationLower = emergencyData.situation.toLowerCase();
                            const contentKey = Object.keys(sosCuratedContent).find(k => k.toLowerCase() === situationLower) as keyof typeof sosCuratedContent;
                            const curatedDetails = contentKey ? sosCuratedContent[contentKey] : null;

                            return (
                                <>
                                    {/* Detailed Card Header */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full min-h-[500px]">
                                        <div className="relative overflow-hidden bg-slate-950 group h-[400px] lg:h-auto">
                                            <motion.img
                                                initial={{ scale: 1.1 }}
                                                animate={{ scale: 1 }}
                                                src={curatedDetails?.image || '/src/assets/heart_attack.png'}
                                                alt={emergencyData.situation}
                                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2000ms]"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent"></div>
                                            <div className="absolute top-10 left-10 z-20">
                                                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest shadow-xl">
                                                    <ShieldAlert className="w-5 h-5" /> {isSinhala ? 'ප්‍රමුඛතාවය 1' : 'Priority Alpha'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-10 md:p-16 space-y-12 bg-white dark:bg-slate-900 flex flex-col justify-center">
                                            <div className="space-y-4">
                                                <h3 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
                                                    {emergencyData.situation}
                                                </h3>
                                                <div className="flex items-center gap-3 text-slate-400 font-bold uppercase tracking-widest text-sm">
                                                    <Info className="w-5 h-5 text-red-500" />
                                                    {isSinhala ? 'වෛද්‍ය මාර්ගෝපදේශය' : 'Verified Medical Protocol'}
                                                </div>
                                            </div>

                                            <div className="p-8 bg-slate-950 rounded-[2.5rem] relative overflow-hidden group border border-slate-800">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                                <div className="relative z-10 space-y-3">
                                                    <div className="flex items-center gap-2 text-teal-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                                        <Sparkles className="w-4 h-4" /> Professional Tip
                                                    </div>
                                                    <p className="text-xl font-bold text-slate-200 italic leading-relaxed">
                                                        "{curatedDetails?.tip || emergencyData.professionalAdvice}"
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <a href="tel:1990" className="flex-1 bg-red-600 text-white p-6 rounded-3xl font-black text-center text-lg shadow-xl shadow-red-600/20 flex items-center justify-center gap-3">
                                                    <PhoneCall className="w-6 h-6" /> 1990 Call
                                                </a>
                                                <button
                                                    onClick={() => setEmergencyData(null)}
                                                    className="p-6 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-3xl"
                                                >
                                                    <ChevronDown className="w-8 h-8 rotate-180" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action List Section */}
                                    <div className="p-10 md:p-16 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-800">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                            {/* Success Steps */}
                                            <div className="space-y-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="p-4 bg-emerald-500 text-white rounded-[1.5rem] shadow-lg shadow-emerald-500/20">
                                                        <CheckCircle className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{isSinhala ? 'වහාම අනුගමනය කළ යුතු පියවර' : 'Critical Response Steps'}</h4>
                                                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Life-saving actions</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    {(curatedDetails?.actions || emergencyData.immediateActions).map((action: string, i: number) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ x: -20, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="flex items-start gap-6 p-7 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                                                        >
                                                            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black shrink-0 text-xl shadow-lg ring-4 ring-emerald-500/10">{i + 1}</span>
                                                            <p className="font-bold text-slate-700 dark:text-slate-200 text-xl leading-relaxed">{action}</p>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Things to Avoid */}
                                            <div className="space-y-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="p-4 bg-rose-500 text-white rounded-[1.5rem] shadow-lg shadow-rose-500/20">
                                                        <XCircle className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{isSinhala ? 'නොකළ යුතු දෑ' : 'Never Do These'}</h4>
                                                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Hazardous mistakes</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {(curatedDetails?.avoid || emergencyData.thingsToAvoid).map((thing: string, i: number) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ x: 20, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="flex items-center gap-6 p-7 bg-rose-50 dark:bg-rose-950/20 rounded-[2.5rem] border border-rose-200 dark:border-rose-900/30 group"
                                                        >
                                                            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black shrink-0 text-lg">X</div>
                                                            <p className="font-bold text-rose-900/90 dark:text-rose-100/90 text-xl leading-snug">{thing}</p>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                {/* Footer Helpline */}
                                                <div className="mt-12 p-10 bg-gradient-to-br from-slate-900 to-slate-950 rounded-[3rem] border border-slate-800 relative overflow-hidden">
                                                    <div className="flex flex-col items-center text-center gap-6 relative z-10">
                                                        <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Need Professional Advice?</p>
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                                                <PhoneCall className="w-8 h-8" />
                                                            </div>
                                                            <div>
                                                                <p className="text-4xl font-black text-white tracking-tighter">011-2686143</p>
                                                                <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Poison Information Centre</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Safe Guard */}
            <div className="pt-20 text-center">
                <div className="inline-flex items-center gap-3 px-8 py-4 rounded-[2rem] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 font-bold text-sm">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    {isSinhala ? 'මෙම උපදෙස් ප්‍රථමාධාර සඳහා පමණි. වහාම වෛද්‍ය උපදෙස් ලබා ගන්න.' : 'These instructions are for first aid only. Seek immediate professional medical help.'}
                </div>
            </div>
        </div>
    );
};

export default SOSView;
