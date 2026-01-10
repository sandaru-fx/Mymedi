import React from 'react';
import { SignIn } from '@clerk/clerk-react';

interface LoginPageProps {
    setView: (view: any) => void;
}

const LoginPage: React.FC<LoginPageProps & { onDemoLogin: () => void }> = ({ setView, onDemoLogin }) => {
    return (
        <div className="flex flex-col items-center justify-center py-10 px-6 w-full animate-fade-in-up overflow-y-auto">

            {/* 🚀 DEMO ADMIN ACCESS - NOW AT THE TOP */}
            <div className="w-full max-w-[450px] mb-8">
                <div className="bg-gray-900/90 backdrop-blur-md border border-teal-500/30 p-6 rounded-2xl shadow-2xl text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500"></div>

                    <h3 className="text-white font-bold text-lg mb-2">👨‍💻 Developer / Admin Access</h3>
                    <p className="text-gray-400 text-sm mb-4">Skip login and access the full Admin Dashboard instantly.</p>

                    <button
                        onClick={onDemoLogin}
                        className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-teal-500/25 active:scale-95"
                    >
                        Enter Admin Dashboard 🚀
                    </button>
                </div>
            </div>

            {/* Standard User Login */}
            <SignIn
                appearance={{
                    elements: {
                        rootBox: "mx-auto w-full max-w-[450px]",
                        card: "bg-white shadow-xl rounded-xl border-none",
                    }
                }}
                routing="hash"
            />
        </div>
    );
};

export default LoginPage;
