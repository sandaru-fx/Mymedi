import React from 'react';
import {
    AlertTriangle,
    ShieldAlert,
    Zap,
    Flame,
    Ban,
    Activity,
    PhoneCall,
    CheckCircle,
    Sparkles
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
        <div className="w-full max-w-4xl mt-12 animate-fade-in-up space-y-10 pb-24 px-4">
            <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-red-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-red-600 animate-pulse">
                    <AlertTriangle className="w-10 h-10" />
                </div>
                <h2 className="text-5xl font-black text-red-600 tracking-tighter uppercase">{isSinhala ? 'හදිසි අවස්ථා' : 'Emergency Aid'}</h2>
                <p className="text-slate-500 font-bold max-w-lg mx-auto">{isSinhala ? 'පහත අවස්ථාවන්ගෙන් එකක් තෝරන්න නැතහොත් වහාම 1990 අමතන්න.' : 'Select a situation for first aid steps or call 1990 immediately.'}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                    { situation: isSinhala ? 'සර්ප දෂ්ඨනය' : 'Snake Bite', icon: AlertCircle },
                    { situation: isSinhala ? 'බල්ලා දෂ්ඨ කිරීම' : 'Dog Bite', icon: ShieldAlert },
                    { situation: isSinhala ? 'හුස්ම හිරවීම' : 'Choking', icon: Zap },
                    { situation: isSinhala ? 'දැඩි රුධිර වහනය' : 'Severe Bleeding', icon: Flame },
                    { situation: isSinhala ? 'විෂ වීම්' : 'Poisoning', icon: Ban },
                    { situation: isSinhala ? 'හෘදයාබාධ ලක්ෂණ' : 'Heart Attack', icon: Activity }
                ].map((item, i) => (
                    <button key={i} onClick={() => handleSOSRequest(item.situation)} className="glass-card p-8 rounded-[2.5rem] border-2 border-transparent hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all flex flex-col items-center gap-4 group shadow-xl">
                        <div className="p-4 bg-red-100 text-red-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <item.icon className="w-8 h-8" />
                        </div>
                        <span className="font-black text-sm uppercase tracking-widest">{item.situation}</span>
                    </button>
                ))}
            </div>

            <a href="tel:1990" className="w-full p-8 bg-red-600 text-white rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-8 hover:scale-[1.02] transition-all group">
                <div className="p-5 bg-white/20 rounded-full group-hover:animate-bounce shadow-inner">
                    <PhoneCall className="w-10 h-10" />
                </div>
                <div className="text-left">
                    <p className="text-sm font-black uppercase tracking-[0.2em] opacity-80">Suwa Seriya Sri Lanka</p>
                    <p className="text-5xl font-black tracking-tighter">1990</p>
                </div>
            </a>

            {isLoading ? <Loader /> : emergencyData && (
                <div className="glass-card p-0 rounded-[3.5rem] border border-white/40 dark:border-slate-800 animate-fade-in-up overflow-hidden shadow-2xl">
                    <div className="relative h-80 w-full overflow-hidden bg-slate-900 group">
                        <img
                            src={sosCuratedContent[emergencyData.situation as keyof typeof sosCuratedContent]?.image || '/src/assets/heart_attack.png'}
                            alt={emergencyData.situation}
                            className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                        <div className="absolute bottom-10 left-10 text-white">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/50 text-red-500 font-black text-[10px] uppercase tracking-widest mb-4">
                                <ShieldAlert className="w-4 h-4" /> Priority Level 1
                            </div>
                            <h3 className="text-5xl font-black tracking-tighter uppercase">{emergencyData.situation}</h3>
                        </div>
                    </div>

                    <div className="p-12 space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-emerald-500">
                                    <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-2xl font-black tracking-tight">{isSinhala ? 'වහාම කළ යුතු දෑ' : 'Step-by-Step Response'}</h4>
                                </div>
                                <div className="space-y-4">
                                    {(sosCuratedContent[emergencyData.situation as keyof typeof sosCuratedContent]?.actions || emergencyData.immediateActions).map((action: string, i: number) => (
                                        <div key={i} className="flex items-start gap-5 p-6 bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] border border-slate-200 dark:border-slate-800 group hover:border-emerald-500/30 transition-all">
                                            <span className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-emerald-500/20">{i + 1}</span>
                                            <p className="font-bold text-slate-700 dark:text-slate-200 text-lg leading-relaxed">{action}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-rose-500">
                                    <div className="p-3 bg-rose-500/10 rounded-2xl">
                                        <Ban className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-2xl font-black tracking-tight">{isSinhala ? 'නොකළ යුතු දෑ' : 'Critical Mistakes to Avoid'}</h4>
                                </div>
                                <div className="space-y-3">
                                    {(sosCuratedContent[emergencyData.situation as keyof typeof sosCuratedContent]?.avoid || emergencyData.thingsToAvoid).map((thing: string, i: number) => (
                                        <div key={i} className="flex items-center gap-5 p-5 bg-rose-500/5 dark:bg-rose-500/10 rounded-2xl border border-rose-500/10 group hover:border-rose-500/30 transition-all">
                                            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center font-black shrink-0">X</div>
                                            <p className="font-bold text-rose-900/80 dark:text-rose-100/80 text-base">{thing}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-8 bg-slate-950 rounded-[2.5rem] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="relative z-10 flex flex-col gap-4">
                                        <div className="flex items-center gap-2 text-teal-500 text-[10px] font-black uppercase tracking-widest">
                                            <Sparkles className="w-4 h-4" /> Pro Tip
                                        </div>
                                        <p className="text-lg font-bold text-slate-300 italic leading-relaxed">
                                            {sosCuratedContent[emergencyData.situation as keyof typeof sosCuratedContent]?.tip || emergencyData.professionalAdvice}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-600/20">
                                    <PhoneCall className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Emergency Dispatch</p>
                                    <p className="text-3xl font-black text-red-600">1990</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEmergencyData(null)}
                                className="px-8 py-4 bg-slate-200 dark:bg-slate-800 font-black text-sm rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                            >
                                Close Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SOSView;
