import AdminSidebar from '../components/AdminSidebar';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock revenue data
const mockRevenueData = [
    { month: '2024-01', mrr: 1200, newSubs: 30, churn: 5 },
    { month: '2024-02', mrr: 1400, newSubs: 40, churn: 6 },
    { month: '2024-03', mrr: 1600, newSubs: 50, churn: 7 },
    { month: '2024-04', mrr: 1800, newSubs: 60, churn: 8 },
    { month: '2024-05', mrr: 2000, newSubs: 70, churn: 9 },
    { month: '2024-06', mrr: 2200, newSubs: 80, churn: 10 },
];

export default function RevenueAnalytics() {
    const [revenueData, setRevenueData] = useState(mockRevenueData);

    // In real implementation, fetch data from backend here
    useEffect(() => {
        // fetch('/api/admin/revenue-analytics').then(...)
    }, []);

    // Calculate summary stats
    const latestMRR = revenueData[revenueData.length - 1]?.mrr || 0;
    const ARR = latestMRR * 12;
    const totalNewSubs = revenueData.reduce((sum, d) => sum + d.newSubs, 0);
    const avgChurn = (revenueData.reduce((sum, d) => sum + d.churn, 0) / revenueData.length).toFixed(2);

    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">Revenue & Subscription Analytics</h1>
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded shadow p-6">
                        <div className="text-lg font-semibold">MRR (Monthly Recurring Revenue)</div>
                        <div className="text-3xl font-bold text-blue-600">${latestMRR}</div>
                    </div>
                    <div className="bg-white rounded shadow p-6">
                        <div className="text-lg font-semibold">ARR (Annual Recurring Revenue)</div>
                        <div className="text-3xl font-bold text-green-600">${ARR}</div>
                    </div>
                    <div className="bg-white rounded shadow p-6">
                        <div className="text-lg font-semibold">Avg. Monthly Churn</div>
                        <div className="text-3xl font-bold text-red-600">{avgChurn}</div>
                    </div>
                </div>
                <div className="bg-white rounded shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">MRR & New Subscriptions Over Time</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="mrr" stroke="#2563eb" name="MRR" />
                            <Line type="monotone" dataKey="newSubs" stroke="#16a34a" name="New Subs" />
                            <Line type="monotone" dataKey="churn" stroke="#dc2626" name="Churn" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">New Subs & Churn (Bar Chart)</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="newSubs" fill="#16a34a" name="New Subs" />
                            <Bar dataKey="churn" fill="#dc2626" name="Churn" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </div>
    );
} 