import AdminSidebar from '../components/AdminSidebar';
import { useEffect, useState } from 'react';

// Mock support tickets
const mockTickets = [
    { id: 101, user: 'user1', subject: 'Billing issue', status: 'Open', created: '2024-06-07' },
    { id: 102, user: 'user2', subject: 'Feature request: More analytics', status: 'Closed', created: '2024-06-06' },
    { id: 103, user: 'user3', subject: 'Bug: Faith Mode not saving', status: 'Open', created: '2024-06-05' },
    { id: 104, user: 'user4', subject: 'Account deletion', status: 'Closed', created: '2024-06-04' },
];

// Mock community engagement summary
const mockCommunity = {
    posts: 320,
    comments: 950,
    likes: 2100,
};

export default function CommunitySupport() {
    const [tickets, setTickets] = useState(mockTickets);
    const [community, setCommunity] = useState(mockCommunity);

    // In real implementation, fetch data from backend here
    useEffect(() => {
        // fetch('/api/admin/community-support').then(...)
    }, []);

    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">Community & Support</h1>
                <p className="mb-6">Monitor support tickets, community engagement, and user feedback.</p>
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                        <div className="text-lg font-semibold">Community Posts</div>
                        <div className="text-3xl font-bold text-blue-600">{community.posts}</div>
                    </div>
                    <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                        <div className="text-lg font-semibold">Comments</div>
                        <div className="text-3xl font-bold text-green-600">{community.comments}</div>
                    </div>
                    <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                        <div className="text-lg font-semibold">Likes</div>
                        <div className="text-3xl font-bold text-pink-600">{community.likes}</div>
                    </div>
                </div>
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Support Tickets</h2>
                    <table className="w-full table-auto border">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((row, idx) => (
                                <tr key={idx} className={row.status === 'Open' ? 'bg-yellow-100' : ''}>
                                    <td>{row.id}</td>
                                    <td>{row.user}</td>
                                    <td>{row.subject}</td>
                                    <td>{row.status}</td>
                                    <td>{row.created}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
} 