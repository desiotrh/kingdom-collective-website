import { useEffect } from 'react';
import { logUserInteraction } from '@/utils/logUserInteraction';

export function useFeatureTracker(featureName: string) {
    useEffect(() => {
        logUserInteraction({
            type: 'FEATURE_USAGE',
            data: { featureName },
        });
    }, [featureName]);
} 