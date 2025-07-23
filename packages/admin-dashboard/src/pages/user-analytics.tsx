import AdminSidebar from '../components/AdminSidebar';
import { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

// Mock analytics data
const mockUserData = [
    { date: '2024-06-01', active: 120, signups: 15, churn: 2 },
    { date: '2024-06-02', active: 130, signups: 18, churn: 1 },
    { date: '2024-06-03', active: 140, signups: 20, churn: 3 },
    { date: '2024-06-04', active: 150, signups: 22, churn: 2 },
    { date: '2024-06-05', active: 160, signups: 25, churn: 4 },
    { date: '2024-06-06', active: 170, signups: 30, churn: 2 },
    { date: '2024-06-07', active: 180, signups: 28, churn: 3 },
];

export default function UserAnalytics() {
    const [userData, setUserData] = useState(mockUserData);

    // In real implementation, fetch data from backend here
    useEffect(() => {
        // fetch('/api/admin/user-analytics').then(...)
    }, []);

    // Calculate summary stats
    const totalActive = userData[userData.length - 1]?.active || 0;
    const totalSignups = userData.reduce((sum, d) => sum + d.signups, 0);
    const avgChurn = (userData.reduce((sum, d) => sum + d.churn, 0) / userData.length).toFixed(2);

    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">User Analytics & Growth</h1>
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded shadow p-6">
                        <div className="text-lg font-semibold">Active Users (Today)</div>
                        <div className="text-3xl font-bold text-blue-600">{totalActive}</div>
                    </div>
                    <div className="bg-white rounded shadow p-6">
                        <div className="text-lg font-semibold">New Signups (7d)</div>
                        <div className="text-3xl font-bold text-green-600">{totalSignups}</div>
                    </div>
                    <div className="bg-white rounded shadow p-6">
                        <div className="text-lg font-semibold">Avg. Daily Churn</div>
                        <div className="text-3xl font-bold text-red-600">{avgChurn}</div>
                    </div>
                </div>
                <div className="bg-white rounded shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Active Users Over Time</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={userData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="active" stroke="#2563eb" name="Active Users" />
                            <Line type="monotone" dataKey="signups" stroke="#16a34a" name="New Signups" />
                            <Line type="monotone" dataKey="churn" stroke="#dc2626" name="Churn" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Signups & Churn (Bar Chart)</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={userData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="signups" fill="#16a34a" name="New Signups" />
                            <Bar dataKey="churn" fill="#dc2626" name="Churn" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </div>
    );
} 