import React from 'react';
import { ShieldAlert, Clock } from 'lucide-react';

interface AuditLog {
    _id: string;
    action: string;
    adminEmail: string;
    details: string;
    timestamp: string;
    ipAddress?: string;
    createdAt: string;
}

interface AuditLogViewerProps {
    logs: AuditLog[];
}

const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs }) => {
    return (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Security Audit Logs</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-gray-400 font-bold uppercase">
                        <tr>
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Admin</th>
                            <th className="p-4">Details</th>
                            <th className="p-4">IP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {logs.length === 0 ? (
                            <tr><td colSpan={5} className="p-6 text-center text-gray-500">No logs found</td></tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 whitespace-nowrap text-gray-500 dark:text-gray-400 font-mono">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold border ${log.action.includes('BAN') ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                log.action.includes('RESOLVE') ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-slate-700 dark:text-gray-300">
                                        {log.adminEmail}
                                    </td>
                                    <td className="p-4 text-slate-600 dark:text-gray-300 max-w-md truncate" title={log.details}>
                                        {log.details}
                                    </td>
                                    <td className="p-4 text-gray-400 font-mono text-xs">
                                        {log.ipAddress || '::1'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogViewer;
