'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOrganization } from '@clerk/nextjs';
import api from '@/lib/api';

interface UseSetupCheckResult {
  needsSetup: boolean;
  isLoading: boolean;
  checkSetup: () => Promise<void>;
  completeSetup: () => void;
}

/**
 * Hook to check if user needs to complete company setup
 * Returns true if user doesn't have an organization
 */
export function useSetupCheck(): UseSetupCheckResult {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const [needsSetup, setNeedsSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  const checkSetup = useCallback(async () => {
    if (!orgLoaded) return;

    // If user already has an organization in Clerk, no setup needed
    if (organization) {
      setNeedsSetup(false);
      setIsLoading(false);
      setHasChecked(true);
      return;
    }

    // Check with backend if user needs setup
    try {
      const response = await api.get('/users/me');
      setNeedsSetup(response.data.needsSetup);
    } catch (error) {
      // If error, assume needs setup (new user)
      console.error('Error checking setup status:', error);
      setNeedsSetup(true);
    } finally {
      setIsLoading(false);
      setHasChecked(true);
    }
  }, [organization, orgLoaded]);

  useEffect(() => {
    if (orgLoaded && !hasChecked) {
      checkSetup();
    }
  }, [orgLoaded, hasChecked, checkSetup]);

  const completeSetup = useCallback(() => {
    setNeedsSetup(false);
  }, []);

  return {
    needsSetup,
    isLoading: isLoading || !orgLoaded,
    checkSetup,
    completeSetup,
  };
}
