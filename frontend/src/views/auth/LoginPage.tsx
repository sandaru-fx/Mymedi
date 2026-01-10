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
                        rootBox: "mx-auto w-full max-w-[450px]",
                    }
                }}
                routing="hash"
            />
        </div>
    );
};

export default LoginPage;
