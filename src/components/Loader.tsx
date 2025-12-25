import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-700">
      <div className="relative w-32 h-32">
        {/* Layered Pulsing Rings */}
        <div className="absolute inset-0 rounded-full bg-teal-500/10 dark:bg-teal-400/10 animate-ping"></div>
        <div className="absolute inset-2 rounded-full border-[1px] border-teal-200/50 dark:border-teal-800/50 animate-pulse"></div>
        
        {/* Main Spinning Orbitals */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-500 dark:border-t-teal-400 border-l-teal-500 dark:border-l-teal-400 animate-[spin_1.5s_linear_infinite]"></div>
        <div className="absolute inset-4 rounded-full border-2 border-transparent border-b-emerald-400 dark:border-b-emerald-300 border-r-emerald-400 dark:border-r-emerald-300 animate-[spin_2s_linear_infinite_reverse]"></div>
        
        {/* Center Pulsing Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-gradient-to-tr from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-400 rounded-full shadow-lg shadow-teal-500/40 animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-12 text-center space-y-3 max-w-xs mx-auto">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Consulting AI Database
        </h3>
        <div className="flex gap-1 justify-center">
          <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce"></span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
          Verifying pharmaceutical records and calculating current market estimates...
        </p>
      </div>
    </div>
  );
};

export default Loader;