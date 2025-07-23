import UserInteractionLog from './UserInteractionLog';

type LogType =
    | 'CONTENT_GENERATION'
    | 'FEATURE_USAGE'
    | 'SEARCH_QUERY'
    | 'FAQ_QUESTION'
    | 'FAITH_MODE_EVENT'
    | 'UPLOAD_METADATA';

export async function logUserInteraction({
    userId,
    type,
    data,
}: {
    userId: string;
    type: LogType;
    data: Record<string, any>;
}) {
    try {
        await UserInteractionLog.create({ userId, type, data });
    } catch (error) {
        console.error('Error logging interaction:', error);
    }
} 