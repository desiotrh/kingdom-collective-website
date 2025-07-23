import { useEffect, useState } from 'react';

export default function TrainingDataTable() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetch('/api/admin/training-logs')
            .then((res) => res.json())
            .then((data) => setLogs(data));
    }, []);

    return (
        <table className="w-full table-auto border">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Type</th>
                    <th>Data</th>
                    <th>Faith Mode</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {logs.map((log) => (
                    <tr key={log._id}>
                        <td>{log.userId}</td>
                        <td>{log.type}</td>
                        <td>{JSON.stringify(log.data)}</td>
                        <td>{log.data.faithMode ? '✅' : '❌'}</td>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
} 