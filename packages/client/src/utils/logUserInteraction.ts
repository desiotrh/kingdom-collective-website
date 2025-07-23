import { getUserSettings } from '@/hooks/useUser';

export async function logUserInteraction({
    type,
    data,
}: {
    type: string;
    data: Record<string, any>;
}) {
    try {
        const settings = getUserSettings ? getUserSettings() : { allowAiTraining: true };
        if (settings && settings.allowAiTraining === false) return;
        await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, data }),
        });
    } catch (err) {
        console.error('Tracking failed', err);
    }
} 