import React, { useMemo } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line
} from 'recharts';

interface Report {
    _id: string;
    medicineName: string;
    status: string;
    date: string;
    pharmacyName: string;
}

interface DashboardChartsProps {
    reports: Report[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardCharts: React.FC<DashboardChartsProps> = ({ reports }) => {

    // 1. Pie Chart Data: Report Status
    const statusData = useMemo(() => {
        const stats: Record<string, number> = {};
        reports.forEach(r => {
            const status = r.status || 'Pending';
            stats[status] = (stats[status] || 0) + 1;
        });
        return Object.keys(stats).map(key => ({ name: key, value: stats[key] }));
    }, [reports]);

    // 2. Bar Chart Data: Top 5 Medicines Reported
    const topMedicinesData = useMemo(() => {
        const counts: Record<string, number> = {};
        reports.forEach(r => {
            const med = r.medicineName || 'Unknown';
            counts[med] = (counts[med] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1]) // Descending
            .slice(0, 5) // Top 5
            .map(([name, count]) => ({ name, count }));
    }, [reports]);

    // 3. Line Chart Data: Last 7 Days Trend
    const trendData = useMemo(() => {
        const days: Record<string, number> = {};
        const today = new Date();
        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            days[d.toISOString().slice(0, 10)] = 0;
        }

        reports.forEach(r => {
            const dateStr = new Date(r.date).toISOString().slice(0, 10);
            if (days[dateStr] !== undefined) {
                days[dateStr]++;
            }
        });

        return Object.keys(days).map(date => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            reports: days[date]
        }));
    }, [reports]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pie Chart */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Report Status Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Top Reported Medicines</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topMedicinesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} interval={0} />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            />
                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Line Chart (Full Width) */}
            <div className="col-span-1 lg:col-span-2 bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Weekly Reporting Trend</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="date" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="reports" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4, fill: '#14b8a6' }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
