import type { LucideIcon } from 'lucide-react';
import {
  LayoutGrid,
  CalendarDays,
  ClipboardList,
  Layers,
  LineChart,
  SlidersHorizontal,
  Users,
  Zap,
  Briefcase,
  Crown,
} from 'lucide-react';
import type { TranslationKey } from '@/lib/translations';
import type { Permissions } from '@/shared/hooks/usePermissions';

export interface NavItem {
  icon: LucideIcon;
  href: string;
  labelKey: TranslationKey;
  requiredPermission?: keyof Permissions;
  badge?: string;
  agencyOnly?: boolean;
}

// Navegação principal (sidebar)
export const mainNavigation: NavItem[] = [
  {
    icon: LayoutGrid,
    href: '/dashboard',
    labelKey: 'dashboard',
  },
  {
    icon: CalendarDays,
    href: '/dashboard/calendar',
    labelKey: 'calendar',
  },
  {
    icon: ClipboardList,
    href: '/dashboard/briefing',
    labelKey: 'briefing',
  },
  {
    icon: Layers,
    href: '/dashboard/content',
    labelKey: 'contents',
  },
  {
    icon: LineChart,
    href: '/dashboard/reports',
    labelKey: 'reports',
  },
  {
    icon: SlidersHorizontal,
    href: '/dashboard/settings',
    labelKey: 'settings',
  },
];

// Navegação exclusiva para agências
export const agencyNavigation: NavItem[] = [
  {
    icon: Users,
    href: '/dashboard/team',
    labelKey: 'team',
    agencyOnly: true,
    requiredPermission: 'canManageTeam',
  },
  {
    icon: Briefcase,
    href: '/dashboard/clients',
    labelKey: 'clients',
    agencyOnly: true,
    requiredPermission: 'canViewAllProjects',
  },
  {
    icon: Zap,
    href: '/dashboard/automation',
    labelKey: 'automation',
    agencyOnly: true,
    requiredPermission: 'canAccessAI',
  },
  {
    icon: Crown,
    href: '/dashboard/whitelabel',
    labelKey: 'whitelabel',
    agencyOnly: true,
    requiredPermission: 'canCustomizeBranding',
  },
];

// Filtra navegação baseado em permissões
export const getFilteredNavigation = (
  hasPermission: (permission: keyof Permissions) => boolean,
  isAgency: boolean
): NavItem[] => {
  const baseNav = mainNavigation.filter((item) => {
    if (item.requiredPermission) {
      return hasPermission(item.requiredPermission);
    }
    return true;
  });

  if (!isAgency) {
    return baseNav;
  }

  const agencyNav = agencyNavigation.filter((item) => {
    if (item.requiredPermission) {
      return hasPermission(item.requiredPermission);
    }
    return true;
  });

  return [...baseNav, ...agencyNav];
};
