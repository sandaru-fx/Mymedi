import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import { ClerkProvider } from '@clerk/clerk-react';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: '#14b8a6',
          colorText: '#1e293b',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        },
        elements: {
          card: "glass-card shadow-2xl rounded-[2.5rem] border-white/50 p-8",
          headerTitle: "text-3xl font-extrabold tracking-tight text-slate-900 mb-2",
          headerSubtitle: "text-lg text-slate-500 font-medium mb-6",
          formButtonPrimary: "bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 text-lg rounded-2xl transition-all duration-300 shadow-lg shadow-teal-500/20 active:scale-[0.98]",
          formFieldInput: "bg-white/50 border-slate-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all",
          formFieldLabel: "text-slate-700 font-semibold mb-2 ml-1 text-sm uppercase tracking-wider",
          footerActionText: "text-slate-600 font-medium",
          footerActionLink: "text-teal-600 hover:text-teal-700 font-bold decoration-2 underline-offset-4",
          dividerLine: "bg-slate-200",
          dividerText: "text-slate-400 font-medium uppercase text-xs tracking-widest",
          socialButtonsBlockButton: "border-slate-200 hover:bg-slate-50 rounded-xl py-3 transition-all",
          socialButtonsBlockButtonText: "font-semibold text-slate-700",
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);