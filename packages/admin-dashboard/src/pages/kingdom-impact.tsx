import AdminSidebar from '../components/AdminSidebar';
import { useEffect, useState } from 'react';

// Mock kingdom impact data
const mockImpact = {
    answeredPrayers: 12,
    faithPosts: 320,
    testimonies: 45,
    impactStories: 18,
    recentStories: [
        { user: 'user1', title: 'Breakthrough in Business', date: '2024-06-07', summary: 'God opened new doors for my business after prayer.' },
        { user: 'user2', title: 'Healing Testimony', date: '2024-06-06', summary: 'Received healing after community prayed.' },
        { user: 'user3', title: 'Family Restoration', date: '2024-06-05', summary: 'Family relationships restored through faith.' },
        { user: 'user4', title: 'Provision Miracle', date: '2024-06-04', summary: 'Unexpected financial provision after tithing.' },
    ],
};

export default function KingdomImpact() {
    const [impact, setImpact] = useState(mockImpact);

    // In real implementation, fetch data from backend here
    useEffect(() => {
        // fetch('/api/admin/kingdom-impact').then(...)
    }, []);

    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">Kingdom Impact Metrics</h1>
                <p className="mb-6">Track answered prayers, faith-based posts, and impact stories.</p>
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                        <div className="text-lg font-semibold">Answered Prayers</div>
                        <div className="text-3xl font-bold text-green-600">{impact.answeredPrayers}</div>
                    </div>
                    <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                        <div className="text-lg font-semibold">Faith-Based Posts</div>
                        <div className="text-3xl font-bold text-blue-600">{impact.faithPosts}</div>
                    </div>
                    <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                        <div className="text-lg font-semibold">Testimonies</div>
                        <div className="text-3xl font-bold text-indigo-600">{impact.testimonies}</div>
                    </div>
                    <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                        <div className="text-lg font-semibold">Impact Stories</div>
                        <div className="text-3xl font-bold text-pink-600">{impact.impactStories}</div>
                    </div>
                </div>
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Impact Stories & Testimonies</h2>
                    <table className="w-full table-auto border">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Summary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {impact.recentStories.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row.user}</td>
                                    <td>{row.title}</td>
                                    <td>{row.date}</td>
                                    <td>{row.summary}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
} 