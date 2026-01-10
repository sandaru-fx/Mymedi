import React from 'react';
import {
    Sparkles,
    ArrowRight,
    ShieldCheck,
    Zap,
    HeartPulse
} from 'lucide-react';
import { AuthView } from '../../models/types';

import { SignUpButton, SignInButton } from '@clerk/clerk-react';

interface LandingPageProps {
    setView: (view: AuthView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setView }) => {
    return (
        <div className="w-full max-w-6xl mt-20 animate-fade-in-up space-y-16 px-6 text-center">
            <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 font-black text-xs uppercase tracking-[0.3em]">
                    <Sparkles className="w-4 h-4" /> Next-Gen Medical AI
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
                    Expert Health <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">at Your Fingertips</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">
                    Experience the future of healthcare with MediGuide AI. Get instant pharmaceutical intelligence, symptom analysis, and emergency guidance.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                <button
                    onClick={() => setView('signup')}
                    className="w-full sm:w-auto px-12 py-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xl font-black rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                >
                    Get Started <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>

                <button
                    onClick={() => setView('login')}
                    className="w-full sm:w-auto px-12 py-6 glass-card text-xl font-black rounded-[2rem] shadow-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all"
                >
                    Sign In
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
                {[
                    { icon: ShieldCheck, title: "Verified Hub", desc: "Compliant with NMRA standards and global health protocols." },
                    { icon: Zap, title: "Instant Analysis", desc: "Real-time drug interactions and symptom checking powered by Gemini." },
                    { icon: HeartPulse, title: "Life-Saving SOS", desc: "Quick access to emergency protocols and Suwa Seriya 1990." }
                ].map((feature, i) => (
                    <div key={i} className="glass-card p-10 rounded-[3rem] text-left border border-white/40 dark:border-slate-800/50 hover:border-teal-500/50 transition-all group">
                        <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:rotate-12 transition-transform">
                            <feature.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
