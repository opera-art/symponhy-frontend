/**
 * Hook for managing Late profiles and connected accounts
 * SECURITY: Profile is fetched from backend (Supabase), not stored in localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { lateService, LateProfile, LateAccount, Platform } from '../services/lateService';

export function useLateProfile() {
  const { user } = useUser();
  const [profile, setProfile] = useState<LateProfile | null>(null);
  const [accounts, setAccounts] = useState<LateAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get profile for current user from backend (secure)
  const initProfile = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch profile from backend - it uses Supabase to get the correct profile
      const userProfile = await lateService.getMyProfile();
      setProfile(userProfile);
      return userProfile;
    } catch (err) {
      console.error('Error initializing profile:', err);
      setError('Falha ao inicializar perfil');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load connected accounts
  const loadAccounts = useCallback(async () => {
    try {
      // Backend fetches accounts using the authenticated user's profile
      const { accounts: loadedAccounts } = await lateService.getAccounts();
      setAccounts(loadedAccounts);
    } catch (err) {
      console.error('Error loading accounts:', err);
    }
  }, []);

  // Connect a platform
  const connectPlatform = useCallback(
    async (platform: Platform) => {
      try {
        setError(null);
        const redirectUrl = `${window.location.origin}/dashboard/settings?connected=${platform}`;
        // Backend handles profileId lookup automatically
        const { authUrl } = await lateService.getConnectUrl(platform, redirectUrl);
        window.location.href = authUrl;
      } catch (err) {
        console.error('Error connecting platform:', err);
        setError('Erro ao conectar plataforma. Tente novamente.');
      }
    },
    []
  );

  // Disconnect an account
  const disconnectAccount = useCallback(
    async (accountId: string) => {
      await lateService.disconnectAccount(accountId);
      setAccounts((prev) => prev.filter((a) => a.id !== accountId && a._id !== accountId));
    },
    []
  );

  // Initialize on mount
  useEffect(() => {
    if (user) {
      initProfile().then((p) => {
        if (p) loadAccounts();
      });
    }
  }, [user, initProfile, loadAccounts]);

  // Load accounts when profile changes
  useEffect(() => {
    if (profile) {
      loadAccounts();
    }
  }, [profile, loadAccounts]);

  // Check URL params for connection result
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get('connected');

    if (connected) {
      // Reload accounts after successful connection
      loadAccounts();
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [loadAccounts]);

  return {
    profile,
    accounts,
    isLoading,
    error,
    connectPlatform,
    disconnectAccount,
    refreshAccounts: loadAccounts,
  };
}
