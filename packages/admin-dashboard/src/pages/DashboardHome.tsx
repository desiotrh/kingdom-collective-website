import AdminSidebar from '../components/AdminSidebar';

export default function DashboardHome() {
    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
                <p className="mb-6">Select a panel from the sidebar to view analytics, manage features, and monitor Kingdom impact.</p>
                {/* Optionally add dashboard summary widgets here */}
            </main>
        </div>
    );
} 