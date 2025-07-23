import AdminSidebar from '../components/AdminSidebar';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock Faith Mode analytics data
const mockFaithModeUsage = [
    { date: '2024-06-01', faithMode: 80, nonFaithMode: 120 },
    { date: '2024-06-02', faithMode: 85, nonFaithMode: 125 },
    { date: '2024-06-03', faithMode: 90, nonFaithMode: 130 },
    { date: '2024-06-04', faithMode: 100, nonFaithMode: 140 },
    { date: '2024-06-05', faithMode: 110, nonFaithMode: 150 },
    { date: '2024-06-06', faithMode: 120, nonFaithMode: 160 },
    { date: '2024-06-07', faithMode: 130, nonFaithMode: 170 },
];
const mockAdoption = [
    { name: 'Faith Mode', value: 130 },
    { name: 'Non-Faith Mode', value: 170 },
];
const COLORS = ['#6366f1', '#fbbf24'];

export default function FaithModeAnalytics() {
    const [usageData, setUsageData] = useState(mockFaithModeUsage);
    const [adoptionData, setAdoptionData] = useState(mockAdoption);

    // In real implementation, fetch data from backend here
    useEffect(() => {
        // fetch('/api/admin/faithmode-analytics').then(...)
    }, []);

    const total = adoptionData.reduce((sum, d) => sum + d.value, 0);
    const faithModePercent = ((adoptionData[0].value / total) * 100).toFixed(1);

    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">Faith Mode Analytics</h1>
                <p className="mb-6">Analyze Faith Mode adoption, usage, and impact.</p>
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                        <h2 className="text-xl font-semibold mb-4">Faith Mode Adoption</h2>
                        <PieChart width={250} height={250}>
                            <Pie
                                data={adoptionData}
                                cx={120}
                                cy={120}
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {adoptionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                        <div className="mt-4 text-lg font-bold text-indigo-600">{faithModePercent}% Faith Mode</div>
                    </div>
                    <div className="bg-white rounded shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Faith Mode Usage Over Time</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="faithMode" stroke="#6366f1" name="Faith Mode Users" />
                                <Line type="monotone" dataKey="nonFaithMode" stroke="#fbbf24" name="Non-Faith Mode Users" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Faith Mode Impact Metrics</h2>
                    <ul className="list-disc ml-6">
                        <li>Faith-based posts created: <span className="font-bold">320</span></li>
                        <li>Prayers sent: <span className="font-bold">150</span></li>
                        <li>Testimonies shared: <span className="font-bold">45</span></li>
                        <li>Answered prayers: <span className="font-bold">12</span></li>
                    </ul>
                </div>
            </main>
        </div>
    );
} 