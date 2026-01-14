/**
 * Hook for managing Late profiles and connected accounts
 */

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { lateService, LateProfile, LateAccount, Platform } from '@/services/lateService';

const PROFILE_STORAGE_KEY = 'late_profile_id';
// TEMP: Fixed profile ID for testing Late API
const FIXED_PROFILE_ID = '6967eae047f68a52114b8bb3';

export function useLateProfile() {
  const { user } = useUser();
  const [profile, setProfile] = useState<LateProfile | null>(null);
  const [accounts, setAccounts] = useState<LateAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get or create profile for current user
  const initProfile = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Check if we have a saved profile ID
      const savedProfileId = localStorage.getItem(PROFILE_STORAGE_KEY);

      if (savedProfileId) {
        // Try to fetch the existing profile
        try {
          const existingProfile = await lateService.getProfile(savedProfileId);
          setProfile(existingProfile);
          return existingProfile;
        } catch {
          // Profile might not exist anymore, create new one
          localStorage.removeItem(PROFILE_STORAGE_KEY);
        }
      }

      // Get all profiles - Late uses one account per API key
      // We use the default profile or first available
      const profiles = await lateService.getProfiles();

      // Find default profile or use first one
      let userProfile = profiles.find((p) => p.name === 'Default Profile') || profiles[0];

      if (!userProfile && profiles.length === 0) {
        // Only create if no profiles exist at all
        userProfile = await lateService.createProfile('Default Profile');
      }

      if (!userProfile) {
        throw new Error('No profile available');
      }

      // Save profile ID (Late uses _id)
      const profileId = userProfile._id || userProfile.id;
      localStorage.setItem(PROFILE_STORAGE_KEY, profileId!);
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
    if (!profile) return;

    try {
      const profileId = profile._id || profile.id;
      const { accounts: loadedAccounts } = await lateService.getAccounts(profileId!);
      setAccounts(loadedAccounts);
    } catch (err) {
      console.error('Error loading accounts:', err);
    }
  }, [profile]);

  // Connect a platform
  const connectPlatform = useCallback(
    async (platform: Platform) => {
      if (!profile) {
        throw new Error('Profile not initialized');
      }

      const profileId = profile._id || profile.id;
      const redirectUrl = `${window.location.origin}/dashboard/settings?connected=${platform}`;
      const { authUrl } = await lateService.getConnectUrl(platform, profileId!, redirectUrl);

      // Redirect to OAuth
      window.location.href = authUrl;
    },
    [profile]
  );

  // Disconnect an account
  const disconnectAccount = useCallback(
    async (accountId: string) => {
      await lateService.disconnectAccount(accountId);
      setAccounts((prev) => prev.filter((a) => a.id !== accountId));
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
  }, [user, initProfile]);

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
