import AdminSidebar from '../components/AdminSidebar';
import { useEffect, useState } from 'react';

// Mock AI feedback data
const mockFeedback = [
    { user: 'user1', type: 'Content Generation', feedback: 'Great results, very helpful!', flagged: false, timestamp: '2024-06-07 10:15' },
    { user: 'user2', type: 'FAQ_QUESTION', feedback: 'AI answer was off-topic', flagged: true, timestamp: '2024-06-07 09:50' },
    { user: 'user3', type: 'Feature Usage', feedback: 'Loved the encouragement mode!', flagged: false, timestamp: '2024-06-06 18:22' },
    { user: 'user4', type: 'Content Generation', feedback: 'Inappropriate suggestion', flagged: true, timestamp: '2024-06-06 15:10' },
    { user: 'user5', type: 'Faith Mode', feedback: 'Very inspiring!', flagged: false, timestamp: '2024-06-05 21:05' },
];

export default function AiFeedback() {
    const [feedback, setFeedback] = useState(mockFeedback);

    // In real implementation, fetch data from backend here
    useEffect(() => {
        // fetch('/api/admin/ai-feedback').then(...)
    }, []);

    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">AI Model Feedback & Quality</h1>
                <p className="mb-6">Review user feedback and flagged AI content.</p>
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">User Feedback & Flagged Content</h2>
                    <table className="w-full table-auto border">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Type</th>
                                <th>Feedback</th>
                                <th>Flagged</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedback.map((row, idx) => (
                                <tr key={idx} className={row.flagged ? 'bg-red-100' : ''}>
                                    <td>{row.user}</td>
                                    <td>{row.type}</td>
                                    <td>{row.feedback}</td>
                                    <td>{row.flagged ? '🚩' : ''}</td>
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