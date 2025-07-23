import { useState } from 'react';
import { Toggle } from '@/components/Toggle';
import { useUser } from '@/hooks/useUser';
import { updateUserSettings } from '@/services/userService';

const AppSettings = () => {
    const { user, loading, error, refetchUser } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateSettings = async (settings: any) => {
        setIsLoading(true);
        try {
            await updateUserSettings(settings);
            refetchUser();
        } catch (err) {
            console.error('Error updating settings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return <div>Loading settings...</div>;
    }

    if (error) {
        return <div>Error loading settings: {error.message}</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div>
            <h1>App Settings</h1>
            <Toggle
                label="Allow my anonymized data to improve AI models"
                checked={user?.settings?.allowAiTraining ?? true}
                onChange={(value) => handleUpdateSettings({ allowAiTraining: value })}
            />
            {/* Add other settings here */}
        </div>
    );
};

export default AppSettings; 