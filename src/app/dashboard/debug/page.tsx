'use client';

import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const { user, token } = useAuth();
  const { role, permissions, isAgency } = usePermissions();
  const [localStorageData, setLocalStorageData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authUser = localStorage.getItem('auth_user');
      const authToken = localStorage.getItem('auth_token');
      setLocalStorageData({
        auth_user: authUser ? JSON.parse(authUser) : null,
        auth_token: authToken ? authToken.substring(0, 50) + '...' : null,
      });
    }
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🔍 Debug - Auth & Permissions</h1>

      <div className="space-y-6">
        {/* User from Context */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">👤 User (from useAuth)</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        {/* Token */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🔑 Token</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
            {token ? token.substring(0, 100) + '...' : 'null'}
          </pre>
        </div>

        {/* Permissions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🔒 Permissions</h2>
          <div className="space-y-2">
            <p>
              <strong>Role:</strong> {role}
            </p>
            <p>
              <strong>Is Agency:</strong> {isAgency ? '✅ YES' : '❌ NO'}
            </p>
            <p>
              <strong>Can View All Projects:</strong>{' '}
              {permissions.canViewAllProjects ? '✅ YES' : '❌ NO'}
            </p>
            <p>
              <strong>Can Manage Team:</strong> {permissions.canManageTeam ? '✅ YES' : '❌ NO'}
            </p>
          </div>
        </div>

        {/* LocalStorage */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">💾 LocalStorage</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(localStorageData, null, 2)}
          </pre>
        </div>

        {/* Access Type Check */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🎯 Access Type Check</h2>
          <div className="space-y-2">
            <p>
              <strong>user.accessType:</strong> {user?.accessType || 'undefined'}
            </p>
            <p>
              <strong>Type of accessType:</strong> {typeof user?.accessType}
            </p>
            <p>
              <strong>Lowercased:</strong> {user?.accessType?.toLowerCase() || 'undefined'}
            </p>
          </div>
        </div>

        {/* Clear LocalStorage Button */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🗑️ Actions</h2>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear LocalStorage & Reload
          </button>
        </div>
      </div>
    </div>
  );
}
