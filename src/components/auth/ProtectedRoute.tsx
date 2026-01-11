'use client';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: keyof Permissions;
  fallbackPath?: string;
  showMessage?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  fallbackPath = '/dashboard',
  showMessage = true,
}) => {
  const { hasPermission } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (requiredPermission && !hasPermission(requiredPermission)) {
      if (showMessage) {
        console.warn('Access denied: Missing required permission');
      }
      router.push(fallbackPath);
    }
  }, [requiredPermission, hasPermission, router, fallbackPath, showMessage]);

  // If no permission required, or has permission, show children
  if (!requiredPermission || hasPermission(requiredPermission)) {
    return <>{children}</>;
  }

  // Otherwise show nothing (will redirect)
  return null;
};
