'use client';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { Lock } from 'lucide-react';

interface ProtectedFeatureProps {
  children: React.ReactNode;
  requiredPermission: keyof Permissions;
  fallback?: React.ReactNode;
  showLock?: boolean;
}

/**
 * Component to show/hide features based on user permissions
 *
 * @example
 * <ProtectedFeature requiredPermission="canExportReports">
 *   <button>Export PDF</button>
 * </ProtectedFeature>
 */
export const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({
  children,
  requiredPermission,
  fallback,
  showLock = false,
}) => {
  const { hasPermission } = usePermissions();

  if (hasPermission(requiredPermission)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showLock) {
    return (
      <div className="relative opacity-50 cursor-not-allowed">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Lock className="w-4 h-4 text-slate-400" />
        </div>
        {children}
      </div>
    );
  }

  return null;
};
