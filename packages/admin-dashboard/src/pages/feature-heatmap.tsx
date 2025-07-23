import AdminSidebar from '../components/AdminSidebar';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock feature usage data
const mockFeatureUsage = [
    { feature: 'Content Generator', Free: 120, Pro: 80, Enterprise: 30 },
    { feature: 'AI Refinement', Free: 60, Pro: 90, Enterprise: 40 },
    { feature: 'Analytics', Free: 30, Pro: 70, Enterprise: 50 },
    { feature: 'Faith Mode', Free: 100, Pro: 60, Enterprise: 20 },
    { feature: 'Scheduler', Free: 40, Pro: 60, Enterprise: 25 },
    { feature: 'Storefront', Free: 10, Pro: 30, Enterprise: 15 },
    { feature: 'Community', Free: 80, Pro: 50, Enterprise: 10 },
];

export default function FeatureHeatmap() {
    const [featureData, setFeatureData] = useState(mockFeatureUsage);

    // In real implementation, fetch data from backend here
    useEffect(() => {
        // fetch('/api/admin/feature-usage').then(...)
    }, []);

    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">Feature Usage Heatmap</h1>
                <p className="mb-6">Visualize most and least used features, by tier.</p>
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Feature Usage by Tier</h2>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                            data={featureData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            layout="vertical"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="feature" type="category" width={150} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Free" stackId="a" fill="#60a5fa" name="Free" />
                            <Bar dataKey="Pro" stackId="a" fill="#34d399" name="Pro" />
                            <Bar dataKey="Enterprise" stackId="a" fill="#fbbf24" name="Enterprise" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </div>
    );
} 