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
                        rootBox: "mx-auto w-full max-w-[450px]",
                    }
                }}
                routing="hash"
            />
        </div>
    );
};

export default SignupPage;
