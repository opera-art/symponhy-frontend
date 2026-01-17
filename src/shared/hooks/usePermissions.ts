import { useUser } from '@clerk/nextjs';

export type UserRole = 'client' | 'agency' | 'admin';

export interface Permissions {
  // Analytics & Reports
  canViewAnalytics: boolean;
  canExportReports: boolean;
  canViewDetailedMetrics: boolean;

  // Content Management
  canManageContent: boolean;
  canApproveContent: boolean;
  canSchedulePosts: boolean;

  // Team & Users
  canManageTeam: boolean;
  canInviteUsers: boolean;
  canViewAllProjects: boolean;

  // Advanced Features
  canAccessAI: boolean;
  canUseBulkActions: boolean;
  canCustomizeBranding: boolean;
  canIntegrateAPIs: boolean;

  // Billing
  canViewBilling: boolean;
  canManageSubscription: boolean;
}

const rolePermissions: Record<UserRole, Permissions> = {
  client: {
    // Analytics & Reports
    canViewAnalytics: true,
    canExportReports: false,
    canViewDetailedMetrics: false,

    // Content Management
    canManageContent: true,
    canApproveContent: false,
    canSchedulePosts: true,

    // Team & Users
    canManageTeam: false,
    canInviteUsers: false,
    canViewAllProjects: false,

    // Advanced Features
    canAccessAI: false,
    canUseBulkActions: false,
    canCustomizeBranding: false,
    canIntegrateAPIs: false,

    // Billing
    canViewBilling: true,
    canManageSubscription: false,
  },
  agency: {
    // Analytics & Reports
    canViewAnalytics: true,
    canExportReports: true,
    canViewDetailedMetrics: true,

    // Content Management
    canManageContent: true,
    canApproveContent: true,
    canSchedulePosts: true,

    // Team & Users
    canManageTeam: true,
    canInviteUsers: true,
    canViewAllProjects: true,

    // Advanced Features
    canAccessAI: true,
    canUseBulkActions: true,
    canCustomizeBranding: true,
    canIntegrateAPIs: true,

    // Billing
    canViewBilling: true,
    canManageSubscription: true,
  },
  admin: {
    // Analytics & Reports
    canViewAnalytics: true,
    canExportReports: true,
    canViewDetailedMetrics: true,

    // Content Management
    canManageContent: true,
    canApproveContent: true,
    canSchedulePosts: true,

    // Team & Users
    canManageTeam: true,
    canInviteUsers: true,
    canViewAllProjects: true,

    // Advanced Features
    canAccessAI: true,
    canUseBulkActions: true,
    canCustomizeBranding: true,
    canIntegrateAPIs: true,

    // Billing
    canViewBilling: true,
    canManageSubscription: true,
  },
};

export const usePermissions = () => {
  const { user } = useUser();

  const getUserRole = (): UserRole => {
    if (!user) return 'client';

    // Map Clerk publicMetadata accessType to frontend role
    const accessType = (user.publicMetadata?.accessType as string)?.toLowerCase() || 'client';

    if (accessType === 'admin') return 'admin';
    if (accessType === 'agency') return 'agency';
    return 'client';
  };

  const role = getUserRole();
  const permissions = rolePermissions[role];

  const hasPermission = (permission: keyof Permissions): boolean => {
    return permissions[permission];
  };

  const isClient = role === 'client';
  const isAgency = role === 'agency' || role === 'admin';
  const isAdmin = role === 'admin';

  return {
    role,
    permissions,
    hasPermission,
    isClient,
    isAgency,
    isAdmin,
  };
};
