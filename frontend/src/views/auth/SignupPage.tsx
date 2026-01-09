import React from 'react';
import { UserPlus } from 'lucide-react';
import { AuthView, UserProfile } from '../../models/types';

interface SignupPageProps {
    handleSignUp: (e: React.FormEvent) => void;
    signUpData: Partial<UserProfile>;
    setSignUpData: (data: Partial<UserProfile>) => void;
    setView: (view: AuthView) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({
    handleSignUp,
    signUpData,
    setSignUpData,
    setView
}) => {
    return (
        <div className="flex items-center justify-center py-20 px-6 w-full max-w-lg animate-fade-in-up">
            <div className="glass-card p-12 rounded-[3.5rem] shadow-2xl w-full border border-white/50 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500"></div>
                <div className="w-20 h-20 bg-teal-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black mb-2">Create Account</h2>
                <p className="text-slate-500 font-bold mb-8">Join the MediGuide community today</p>

                <form onSubmit={handleSignUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div className="sm:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Full Name</label>
                        <input
                            type="text"
                            placeholder="e.g. John Perera"
                            className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-teal-500"
                            value={signUpData.fullName}
                            onChange={e => setSignUpData({ ...signUpData, fullName: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Email</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-teal-500"
                            value={signUpData.email}
                            onChange={e => setSignUpData({ ...signUpData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-teal-500"
                            value={signUpData.password}
                            onChange={e => setSignUpData({ ...signUpData, password: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">NIC Number</label>
                        <input
                            type="text"
                            placeholder="123456789V"
                            className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-teal-500"
                            value={signUpData.nic}
                            onChange={e => setSignUpData({ ...signUpData, nic: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Phone Number</label>
                        <input
                            type="tel"
                            placeholder="077 123 4567"
                            className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-teal-500"
                            value={signUpData.phone}
                            onChange={e => setSignUpData({ ...signUpData, phone: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="sm:col-span-2 mt-4 py-5 bg-teal-600 text-white rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Complete Registration</button>
                </form>

                <p className="mt-8 text-sm font-bold text-slate-500">
                    Already have an account? <button onClick={() => setView('login')} className="text-teal-600 hover:underline">Sign in instead</button>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
