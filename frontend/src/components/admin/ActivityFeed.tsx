import React from 'react';
import { Bell, FileText, MessageSquare, UserPlus } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: 'REPO' | 'MSG' | 'USER';
    title: string;
    subtitle: string;
    timestamp: string;
    status?: string;
}

interface ActivityFeedProps {
    activities: ActivityItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm h-full max-h-[600px] overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-500" />
                Recent Activity
            </h3>

            <div className="space-y-6">
                {activities.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No recent activity</p>
                ) : (
                    activities.map((item, index) => (
                        <div key={item.id} className="relative pl-6 border-l-2 border-slate-200 dark:border-white/10 last:border-0 pb-6 last:pb-0">
                            {/* Dot */}
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-slate-50 dark:border-gray-900 
                                ${item.type === 'REPO' ? 'bg-orange-500' :
                                    item.type === 'MSG' ? 'bg-blue-500' : 'bg-green-500'}`}>
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-sm text-slate-800 dark:text-gray-200">{item.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{item.subtitle}</p>
                                </div>
                                <span className="text-[10px] font-mono text-gray-400 whitespace-nowrap">
                                    {new Date(item.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            {item.status && (
                                <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] rounded font-bold uppercase
                                    ${item.status === 'Resolved' ? 'bg-green-500/10 text-green-500' :
                                        item.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                            'bg-slate-500/10 text-slate-500'}`}>
                                    {item.status}
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
