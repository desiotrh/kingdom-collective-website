import AdminSidebar from '../components/AdminSidebar';
import { useEffect, useState } from 'react';

// Mock notifications data
const mockNotifications = [
    { type: 'System', message: 'API key for Mailgun expired', severity: 'High', timestamp: '2024-06-07 10:10' },
    { type: 'Feedback', message: 'New user feedback: "Love the Faith Mode!"', severity: 'Info', timestamp: '2024-06-07 09:55' },
    { type: 'System', message: 'Stripe integration healthy', severity: 'Info', timestamp: '2024-06-07 09:30' },
    { type: 'Alert', message: 'Churn rate increased by 5% this month', severity: 'Medium', timestamp: '2024-06-06 18:00' },
    { type: 'Feedback', message: 'User flagged AI output as inappropriate', severity: 'High', timestamp: '2024-06-06 15:20' },
    { type: 'System', message: 'All systems operational', severity: 'Info', timestamp: '2024-06-05 21:00' },
];

export default function Notifications() {
    const [notifications, setNotifications] = useState(mockNotifications);

    // In real implementation, fetch data from backend here
    useEffect(() => {
        // fetch('/api/admin/notifications').then(...)
    }, []);

    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">Notifications & Alerts</h1>
                <p className="mb-6">View system alerts, feedback, and important notifications.</p>
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
                    <table className="w-full table-auto border">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Message</th>
                                <th>Severity</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.map((row, idx) => (
                                <tr key={idx} className={row.severity === 'High' ? 'bg-red-100' : row.severity === 'Medium' ? 'bg-yellow-100' : ''}>
                                    <td>{row.type}</td>
                                    <td>{row.message}</td>
                                    <td>{row.severity}</td>
                                    <td>{row.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
} 