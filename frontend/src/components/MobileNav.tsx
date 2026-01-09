import React from 'react';
import { Home, Search, AlertTriangle, FileText, User } from 'lucide-react';
import { Tab } from '../models/types';

interface MobileNavProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg glass-card border-white/40 dark:border-slate-800 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] rounded-[2.5rem] px-6 py-3 flex justify-between items-center animate-fade-in-up">
            {[
                { id: 'home', icon: Home, label: 'Home' },
                { id: 'search', icon: Search, label: 'Search' },
                { id: 'sos', icon: AlertTriangle, label: 'SOS', color: 'text-red-600' },
                { id: 'reports', icon: FileText, label: 'Report' },
                { id: 'profile', icon: User, label: 'User' }
            ].map(t => (
                <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as Tab)}
                    className={`flex flex-col items-center p-2 rounded-2xl transition-all ${activeTab === t.id ? (t.color || 'bg-teal-500/10 text-teal-600 scale-110') : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    <t.icon className={`w-6 h-6 ${activeTab === t.id ? 'fill-current opacity-20' : ''}`} />
                </button>
            ))}
        </nav>
    );
};

export default MobileNav;
