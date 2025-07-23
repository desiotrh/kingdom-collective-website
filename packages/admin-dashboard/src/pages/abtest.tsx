import AdminSidebar from '../components/AdminSidebar';
import { useEffect, useState } from 'react';

// Mock A/B test data
const mockExperiments = [
    { name: 'Signup Button Color', variants: 'Blue vs Green', status: 'Running', metric: 'Conversion Rate', result: 'Blue +5%', started: '2024-06-01' },
    { name: 'Faith Mode Prompt', variants: 'Short vs Long', status: 'Completed', metric: 'Engagement', result: 'Long +8%', started: '2024-05-15' },
    { name: 'Pricing Page Layout', variants: 'A vs B', status: 'Completed', metric: 'Upgrade Rate', result: 'B +3%', started: '2024-05-01' },
    { name: 'AI Suggestion Style', variants: 'Formal vs Casual', status: 'Running', metric: 'User Satisfaction', result: 'N/A', started: '2024-06-05' },
];

export default function AbTest() {
    const [experiments, setExperiments] = useState(mockExperiments);

    // In real implementation, fetch data from backend here
    useEffect(() => {
        // fetch('/api/admin/abtest').then(...)
    }, []);

    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">A/B Test & Experiment Tracking</h1>
                <p className="mb-6">Track experiments, A/B tests, and feature rollouts.</p>
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Experiments</h2>
                    <table className="w-full table-auto border">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Variants</th>
                                <th>Status</th>
                                <th>Metric</th>
                                <th>Result</th>
                                <th>Started</th>
                            </tr>
                        </thead>
                        <tbody>
                            {experiments.map((row, idx) => (
                                <tr key={idx} className={row.status === 'Running' ? 'bg-blue-100' : ''}>
                                    <td>{row.name}</td>
                                    <td>{row.variants}</td>
                                    <td>{row.status}</td>
                                    <td>{row.metric}</td>
                                    <td>{row.result}</td>
                                    <td>{row.started}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
} 