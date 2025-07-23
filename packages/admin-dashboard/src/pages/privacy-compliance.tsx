import AdminSidebar from '../components/AdminSidebar';
import { useEffect, useState } from 'react';

// Mock privacy/compliance data
const mockPrivacy = {
    optIn: 320,
    optOut: 80,
    deletionRequests: [
        { user: 'user1', date: '2024-06-01', status: 'Completed' },
        { user: 'user2', date: '2024-06-03', status: 'Pending' },
        { user: 'user3', date: '2024-06-05', status: 'Completed' },
    ],
    complianceStatus: 'Compliant',
};

export default function PrivacyCompliance() {
    const [privacy, setPrivacy] = useState(mockPrivacy);

    // In real implementation, fetch data from backend here
    useEffect(() => {
        // fetch('/api/admin/privacy-compliance').then(...)
    }, []);

    const total = privacy.optIn + privacy.optOut;
    const optInPercent = ((privacy.optIn / total) * 100).toFixed(1);
    const optOutPercent = ((privacy.optOut / total) * 100).toFixed(1);

    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">Data Privacy & Compliance</h1>
                <p className="mb-6">Track opt-in rates, deletion requests, and compliance status.</p>
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                        <div className="text-lg font-semibold">Opt-In Rate</div>
                        <div className="text-3xl font-bold text-green-600">{optInPercent}%</div>
                        <div className="text-sm text-gray-500">({privacy.optIn} users)</div>
                    </div>
                    <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                        <div className="text-lg font-semibold">Opt-Out Rate</div>
                        <div className="text-3xl font-bold text-red-600">{optOutPercent}%</div>
                        <div className="text-sm text-gray-500">({privacy.optOut} users)</div>
                    </div>
                    <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                        <div className="text-lg font-semibold">Compliance Status</div>
                        <div className={`text-3xl font-bold ${privacy.complianceStatus === 'Compliant' ? 'text-green-600' : 'text-red-600'}`}>{privacy.complianceStatus}</div>
                    </div>
                </div>
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Data Deletion Requests</h2>
                    <table className="w-full table-auto border">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {privacy.deletionRequests.map((row, idx) => (
                                <tr key={idx} className={row.status === 'Pending' ? 'bg-yellow-100' : ''}>
                                    <td>{row.user}</td>
                                    <td>{row.date}</td>
                                    <td>{row.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
} 