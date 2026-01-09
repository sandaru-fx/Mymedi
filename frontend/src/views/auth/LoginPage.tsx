import React from 'react';
import { Lock } from 'lucide-react';
import { AuthView } from '../../models/types';

interface LoginPageProps {
    handleLogin: (e: React.FormEvent) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    setView: (view: AuthView) => void;
    handleGoogleSignIn: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
    handleLogin,
    email,
    setEmail,
    password,
    setPassword,
    setView,
    handleGoogleSignIn
}) => {
    return (
        <div className="flex items-center justify-center py-20 px-6 w-full max-w-md animate-fade-in-up">
            <div className="glass-card p-12 rounded-[3.5rem] shadow-2xl w-full border border-white/50 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500"></div>
                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <Lock className="w-8 h-8 text-teal-400" />
                </div>
                <h2 className="text-3xl font-black mb-2">Welcome Back</h2>
                <p className="text-slate-500 font-bold mb-8">Sign in to your medical dashboard</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-teal-500 transition-all"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-teal-500 transition-all"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <div className="text-right pb-2">
                        <button type="button" className="text-xs font-black text-teal-600 uppercase tracking-widest hover:underline">Forgot Password?</button>
                    </div>
                    <button type="submit" className="w-full py-5 bg-teal-600 text-white rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Sign In</button>
                </form>

                <div className="my-8 flex items-center gap-4">
                    <div className="h-[1px] flex-grow bg-slate-200 dark:bg-slate-800"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">or</span>
                    <div className="h-[1px] flex-grow bg-slate-200 dark:bg-slate-800"></div>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-black shadow-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-4"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5.04c1.94 0 3.1 1.05 3.1 1.05l2.31-2.31C15.89 2.45 14.12 1.5 12 1.5c-4.12 0-7.61 2.5-9.04 6.06l2.7 2.09c.67-1.94 2.48-3.32 4.67-3.32z" />
                        <path fill="#FBBC05" d="M22.06 12.01c0-.79-.07-1.54-.19-2.27H12v4.3h5.64c-.24 1.25-.96 2.31-2.02 3.03l3.24 2.51c1.9-1.75 3.24-4.57 3.24-7.57z" />
                        <path fill="#4285F4" d="M3.96 8.56C3.67 9.4 3.5 10.3 3.5 11.25s.17 1.85.46 2.69l-2.7 2.09C.45 14.21 0 12.78 0 11.25s.45-2.96 1.25-4.78l2.71 2.09z" />
                        <path fill="#34A853" d="M12 22.5c2.97 0 5.46-.98 7.28-2.66l-3.24-2.51c-1.12.75-2.54 1.19-4.04 1.19-3.11 0-5.74-2.1-6.68-4.94l-2.7 2.09C4.39 20 7.88 22.5 12 22.5z" />
                    </svg>
                    Continue with Google
                </button>

                <p className="mt-8 text-sm font-bold text-slate-500">
                    Don't have an account? <button onClick={() => setView('signup')} className="text-teal-600 hover:underline">Sign up for free</button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
