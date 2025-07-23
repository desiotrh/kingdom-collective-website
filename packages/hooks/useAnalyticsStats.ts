import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAnalyticsStats() {
    const [stats, setStats] = useState({
        productPlans: 0,
        launchContent: 0,
        aiGenerations: 0,
        checkoutLinks: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        try {
            const plansRaw = await AsyncStorage.getItem('kingdom_launchpad_product_plans');
            const contentRaw = await AsyncStorage.getItem('kingdom_launchpad_saved_content');
            // For AI generations, count all content generations (could be same as launchContent for now)
            // For checkout links, count mock links created (optional, can be tracked in a separate key)
            const plans = plansRaw ? JSON.parse(plansRaw) : [];
            const content = contentRaw ? JSON.parse(contentRaw) : [];
            const aiGenerations = content.length; // For now, treat as same as launch content
            const checkoutLinksRaw = await AsyncStorage.getItem('kingdom_launchpad_checkout_links');
            const checkoutLinks = checkoutLinksRaw ? JSON.parse(checkoutLinksRaw).length : 0;
            setStats({
                productPlans: plans.length,
                launchContent: content.length,
                aiGenerations,
                checkoutLinks,
            });
        } catch {
            setStats({ productPlans: 0, launchContent: 0, aiGenerations: 0, checkoutLinks: 0 });
        } finally {
            setLoading(false);
        }
    };

    return { stats, loading, reload: loadStats };
} 