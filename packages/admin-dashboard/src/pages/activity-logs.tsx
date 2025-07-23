import AdminSidebar from '../components/AdminSidebar';
import { useEffect, useState } from 'react';

// Mock activity log data
const mockLogs = [
    { user: 'admin1', action: 'User Ban', details: 'Banned user user5 for spam', timestamp: '2024-06-07 10:30' },
    { user: 'admin2', action: 'Feature Toggle', details: 'Enabled Faith Mode for all users', timestamp: '2024-06-07 09:45' },
    { user: 'user3', action: 'Content Post', details: 'Posted in Community', timestamp: '2024-06-06 20:10' },
    { user: 'admin1', action: 'Data Deletion', details: 'Processed deletion for user2', timestamp: '2024-06-06 18:00' },
    { user: 'user4', action: 'Subscription Upgrade', details: 'Upgraded to Pro', timestamp: '2024-06-05 22:15' },
    { user: 'admin2', action: 'Support Reply', details: 'Replied to ticket #123', timestamp: '2024-06-05 17:40' },
];

export default function ActivityLogs() {
    const [logs, setLogs] = useState(mockLogs);

    // In real implementation, fetch data from backend here
    useEffect(() => {
        // fetch('/api/admin/activity-logs').then(...)
    }, []);

    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">User Activity & Audit Logs</h1>
                <p className="mb-6">View recent admin actions and user activity.</p>
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <table className="w-full table-auto border">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Action</th>
                                <th>Details</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row.user}</td>
                                    <td>{row.action}</td>
                                    <td>{row.details}</td>
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