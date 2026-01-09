import React from 'react';
import { SignIn } from '@clerk/clerk-react';

interface LoginPageProps {
    setView: (view: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setView }) => {
    return (
        <div className="flex items-center justify-center py-20 px-6 w-full animate-fade-in-up">
            <SignIn
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "glass-card shadow-2xl rounded-[2.5rem] border-white/50",
                    }
                }}
                routing="hash"
            />
        </div>
    );
};

export default LoginPage;
