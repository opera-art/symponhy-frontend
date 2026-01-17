'use client';

import { useUser } from '@clerk/nextjs';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { notFound } from 'next/navigation';

/**
 * Debug Page - DEVELOPMENT ONLY
 * SECURITY: This page is only accessible in development environment
 */
export default function DebugPage() {
  // SECURITY: Block access in production
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const { user, isLoaded } = useUser();
  const { role, permissions, isAgency } = usePermissions();

  if (!isLoaded) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
        <p className="font-bold text-yellow-700">DEVELOPMENT ONLY</p>
        <p className="text-yellow-600">This page is not accessible in production.</p>
      </div>

      <h1 className="text-3xl font-bold mb-8">Debug - Auth & Permissions (Clerk)</h1>

      <div className="space-y-6">
        {/* User from Clerk */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User (from Clerk)</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}</p>
            <p><strong>Name:</strong> {user?.fullName}</p>
          </div>
        </div>

        {/* Public Metadata */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Public Metadata</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(user?.publicMetadata, null, 2)}
          </pre>
        </div>

        {/* Permissions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Permissions</h2>
          <div className="space-y-2">
            <p><strong>Role:</strong> {role}</p>
            <p><strong>Is Agency:</strong> {isAgency ? 'YES' : 'NO'}</p>
            <p><strong>Can View All Projects:</strong> {permissions.canViewAllProjects ? 'YES' : 'NO'}</p>
            <p><strong>Can Manage Team:</strong> {permissions.canManageTeam ? 'YES' : 'NO'}</p>
          </div>
        </div>

        {/* All Permissions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">All Permissions</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(permissions, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
