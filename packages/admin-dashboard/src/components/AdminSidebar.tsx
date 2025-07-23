import Link from 'next/link';

export default function AdminSidebar() {
    return (
        <aside className="w-64 bg-gray-900 text-white h-full p-6">
            <nav className="flex flex-col gap-4">
                <Link href="/dashboard">Dashboard Home</Link>
                <Link href="/dashboard/user-analytics">User Analytics & Growth</Link>
                <Link href="/dashboard/feature-heatmap">Feature Usage Heatmap</Link>
                <Link href="/dashboard/faithmode-analytics">Faith Mode Analytics</Link>
                <Link href="/dashboard/ai-feedback">AI Model Feedback & Quality</Link>
                <Link href="/dashboard/revenue-analytics">Revenue & Subscription Analytics</Link>
                <Link href="/dashboard/api-health">API Key & Integration Health</Link>
                <Link href="/dashboard/privacy-compliance">Data Privacy & Compliance</Link>
                <Link href="/dashboard/activity-logs">User Activity & Audit Logs</Link>
                <Link href="/dashboard/custom-reports">Custom Reports & Export</Link>
                <Link href="/dashboard/notifications">Notifications & Alerts</Link>
                <Link href="/dashboard/abtest">A/B Test & Experiment Tracking</Link>
                <Link href="/dashboard/community-support">Community & Support</Link>
                <Link href="/dashboard/kingdom-impact">Kingdom Impact Metrics</Link>
                <Link href="/dashboard/ai-training-logs">AI Training Data</Link>
            </nav>
        </aside>
    );
} 