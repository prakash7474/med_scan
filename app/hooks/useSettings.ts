import { useState, useEffect, useCallback } from 'react';
import { usePuterStore } from '~/lib/puter';
import * as settingsService from '~/services/settingsService';
import type { AppSettings } from '~/types';
import { DEFAULT_SETTINGS } from '~/types';

/**
 * Hook for managing app settings.
 */
export function useSettings() {
    const { puterReady } = usePuterStore();
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        if (!puterReady) return;
        setLoading(true);
        try {
            const data = await settingsService.loadSettings();
            setSettings(data);
            settingsService.applyDarkMode(data.darkMode);
        } catch (err) {
            console.error('Failed to load settings:', err);
        } finally {
            setLoading(false);
        }
    }, [puterReady]);

    useEffect(() => {
        load();
    }, [load]);

    const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
        setSaving(true);
        try {
            const newSettings = { ...settings, ...updates };
            await settingsService.saveSettings(newSettings);
            setSettings(newSettings);
            settingsService.applyDarkMode(newSettings.darkMode);
        } catch (err) {
            console.error('Failed to save settings:', err);
        } finally {
            setSaving(false);
        }
    }, [settings]);

    const toggleSetting = useCallback(async (key: keyof AppSettings) => {
        if (typeof settings[key] === 'boolean') {
            await updateSettings({ [key]: !settings[key] } as Partial<AppSettings>);
        }
    }, [settings, updateSettings]);

    return {
        settings,
        loading,
        saving,
        updateSettings,
        toggleSetting,
        refresh: load,
    };
}
