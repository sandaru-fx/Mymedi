import React from 'react';
import { SignUp } from '@clerk/clerk-react';

interface SignupPageProps {
    setView: (view: any) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ setView }) => {
    return (
        <div className="flex items-center justify-center py-20 px-6 w-full animate-fade-in-up">
            <SignUp
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

export default SignupPage;
