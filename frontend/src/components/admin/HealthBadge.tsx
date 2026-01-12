import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { API_BASE_URL } from '../../config/apiConfig';

const HealthBadge: React.FC = () => {
    const [status, setStatus] = useState<'Operational' | 'Issues' | 'Offline'>('Offline');

    useEffect(() => {
        const checkHealth = async () => {
            try {
                // Mocking auth is not needed for simple public health check usually, 
                // but if route is protected, this might fail unless admin is logged in.
                // Assuming we use x-demo-admin here for simplicity as this is a background component.
                const res = await fetch(`${API_BASE_URL}/admin/health`, {
                    headers: { 'x-demo-admin': 'true' }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStatus(data.database === 'Connected' ? 'Operational' : 'Issues');
                } else {
                    setStatus('Issues');
                }
            } catch (error) {
                setStatus('Offline');
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10">
            <Activity className={`w-3 h-3 ${status === 'Operational' ? 'text-green-500' : 'text-red-500'}`} />
            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400 leading-none">System Status</span>
                <span className={`text-xs font-bold leading-none ${status === 'Operational' ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                    {status}
                </span>
            </div>
        </div>
    );
};

export default HealthBadge;
