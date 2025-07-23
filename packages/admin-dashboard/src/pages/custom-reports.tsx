import AdminSidebar from '../components/AdminSidebar';
import { useEffect, useState } from 'react';

// Mock reports data
const mockReports = [
    { name: 'User Growth', description: 'Daily/weekly/monthly active users', exportable: true },
    { name: 'Feature Usage', description: 'Usage stats for all features', exportable: true },
    { name: 'Revenue', description: 'MRR, ARR, and conversions', exportable: true },
    { name: 'Faith Mode Adoption', description: 'Faith Mode usage and impact', exportable: true },
    { name: 'Churn Analysis', description: 'Subscription churn and retention', exportable: true },
    { name: 'Custom Query', description: 'Build your own report', exportable: false },
];

export default function CustomReports() {
    const [reports, setReports] = useState(mockReports);

    // In real implementation, fetch data from backend here
    useEffect(() => {
        // fetch('/api/admin/custom-reports').then(...)
    }, []);

    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">Custom Reports & Export</h1>
                <p className="mb-6">Download CSV/Excel, run custom queries, and generate reports.</p>
                <div className="bg-white rounded shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Available Reports</h2>
                    <table className="w-full table-auto border mb-4">
                        <thead>
                            <tr>
                                <th>Report</th>
                                <th>Description</th>
                                <th>Export</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row.name}</td>
                                    <td>{row.description}</td>
                                    <td>
                                        {row.exportable ? (
                                            <>
                                                <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">CSV</button>
                                                <button className="bg-green-500 text-white px-3 py-1 rounded">Excel</button>
                                            </>
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Custom Query Builder (Coming Soon)</h3>
                        <div className="bg-gray-100 p-4 rounded text-gray-500">Build and run custom queries on your data. (UI coming soon!)</div>
                    </div>
                </div>
            </main>
        </div>
    );
} 