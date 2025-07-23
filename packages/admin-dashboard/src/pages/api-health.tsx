import AdminSidebar from '../components/AdminSidebar';
import { useEffect, useState } from 'react';

// Mock API health data
const mockApiKeys = [
    { name: 'OpenAI', status: 'Active', expiry: '2025-01-01', rateLimit: 'OK', lastChecked: '2024-06-07 10:00' },
    { name: 'Stripe', status: 'Active', expiry: '2026-03-15', rateLimit: 'OK', lastChecked: '2024-06-07 10:00' },
    { name: 'Firebase', status: 'Active', expiry: 'N/A', rateLimit: 'OK', lastChecked: '2024-06-07 10:00' },
    { name: 'Mailgun', status: 'Expired', expiry: '2024-05-01', rateLimit: 'N/A', lastChecked: '2024-06-07 10:00' },
    { name: 'Google Analytics', status: 'Active', expiry: '2025-12-31', rateLimit: 'Warning', lastChecked: '2024-06-07 10:00' },
    { name: 'Mixpanel', status: 'Active', expiry: '2025-08-20', rateLimit: 'OK', lastChecked: '2024-06-07 10:00' },
];

export default function ApiHealth() {
    const [apiKeys, setApiKeys] = useState(mockApiKeys);

    // In real implementation, fetch data from backend here
    useEffect(() => {
        // fetch('/api/admin/api-health').then(...)
    }, []);

    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">API Key & Integration Health</h1>
                <p className="mb-6">Monitor API key status, expiry, and rate limits.</p>
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">API Keys & Integrations</h2>
                    <table className="w-full table-auto border">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Expiry</th>
                                <th>Rate Limit</th>
                                <th>Last Checked</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiKeys.map((row, idx) => (
                                <tr key={idx} className={row.status === 'Expired' ? 'bg-red-100' : row.rateLimit === 'Warning' ? 'bg-yellow-100' : ''}>
                                    <td>{row.name}</td>
                                    <td>{row.status}</td>
                                    <td>{row.expiry}</td>
                                    <td>{row.rateLimit}</td>
                                    <td>{row.lastChecked}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
} 