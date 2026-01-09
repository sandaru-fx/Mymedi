import React from 'react';
import {
    Home,
    Search,
    AlertTriangle,
    FileText,
    Stethoscope,
    Sun,
    Moon,
    User,
    LogOut
} from 'lucide-react';
import { Tab, AuthView, Language, UserRole } from '../models/types';

interface HeaderProps {
    view: AuthView;
    role: UserRole;
    isSinhala: boolean;
    isDarkMode: boolean;
    activeTab: Tab;
    setView: (view: AuthView) => void;
    setActiveTab: (tab: Tab) => void;
    setLanguage: (lang: Language) => void;
    setIsDarkMode: (val: boolean) => void;
    handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
    view,
    role,
    isSinhala,
    isDarkMode,
    activeTab,
    setView,
    setActiveTab,
    setLanguage,
    setIsDarkMode,
    handleLogout
}) => {
    return (
        <header className="sticky top-0 w-full z-[100] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="glass-card rounded-[2rem] px-8 py-4 flex justify-between items-center shadow-2xl border-white/40 dark:border-slate-800/50">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setView('landing'); setActiveTab('home'); }}>
                            <div className="bg-slate-950 dark:bg-white p-2.5 rounded-[1.2rem] shadow-xl group-hover:scale-110 transition-transform">
                                <Stethoscope className="w-6 h-6 text-teal-400 dark:text-teal-600" />
                            </div>
                            <h1 className="text-2xl font-black text-slate-950 dark:text-white tracking-tighter hidden sm:block">
                                MediGuide<span className="text-teal-600">AI</span>
                            </h1>
                        </div>

                        {view === 'app' && role === 'USER' && (
                            <nav className="hidden md:flex items-center gap-1">
                                {[
                                    { id: 'home', icon: Home, label: isSinhala ? 'මුල් පිටුව' : 'Home' },
                                    { id: 'search', icon: Search, label: isSinhala ? 'සෙවුම' : 'Search' },
                                    { id: 'sos', icon: AlertTriangle, label: 'SOS', color: 'text-red-600' },
                                    { id: 'reports', icon: FileText, label: isSinhala ? 'වාර්තා' : 'Reports' },
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setActiveTab(t.id as Tab)}
                                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === t.id ? (t.id === 'sos' ? 'bg-red-500/10 text-red-600' : 'bg-teal-500/10 text-teal-600') : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    >
                                        <t.icon className="w-4 h-4" />
                                        <span>{t.label}</span>
                                    </button>
                                ))}
                            </nav>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 mr-2">
                            <button
                                onClick={() => setLanguage(isSinhala ? Language.English : Language.Sinhala)}
                                className="px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            >
                                {isSinhala ? 'EN' : 'සිං'}
                            </button>
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>

                        {view === 'landing' ? (
                            <div className="flex items-center gap-3">
                                <button onClick={() => setView('login')} className="hidden xs:block px-6 py-2.5 font-bold text-sm hover:text-teal-600 transition-all">Sign In</button>
                                <button onClick={() => setView('signup')} className="px-6 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-sm rounded-xl shadow-lg hover:scale-105 transition-all">Join Free</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button onClick={() => setActiveTab('profile')} className={`p-2.5 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-teal-500/10 text-teal-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                    <User className="w-5 h-5" />
                                </button>
                                <button onClick={handleLogout} className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
