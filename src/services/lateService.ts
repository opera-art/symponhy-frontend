/**
 * Late API Service - Frontend client
 * Connects to symponhy-social backend
 */

// Use local proxy for auth - the proxy adds Clerk headers
const API_BASE = '/api/social';

export type Platform =
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'threads'
  | 'pinterest'
  | 'reddit'
  | 'bluesky'
  | 'telegram'
  | 'snapchat'
  | 'google-business';

export interface LateProfile {
  id: string;
  name: string;
  createdAt: string;
}

export interface LateAccount {
  id: string;
  platform: Platform;
  username?: string;
  profilePictureUrl?: string;
  followersCount?: number;
  accountType?: string;
  isActive: boolean;
  connectedAt: string;
}

export interface LatePost {
  id: string;
  content: string;
  platforms: Platform[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledAt?: string;
  publishedAt?: string;
  mediaUrls?: string[];
}

class LateService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // endpoint should start with / e.g. /profiles
    const url = `${API_BASE}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // ==========================================
  // PROFILES
  // ==========================================

  async createProfile(name: string): Promise<LateProfile> {
    return this.request('/profiles', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getProfiles(): Promise<LateProfile[]> {
    return this.request('/profiles');
  }

  async getProfile(profileId: string): Promise<LateProfile> {
    return this.request(`/profiles/${profileId}`);
  }

  // ==========================================
  // ACCOUNT CONNECTIONS
  // ==========================================

  async getConnectUrl(platform: Platform, profileId: string, redirectUrl?: string): Promise<{ authUrl: string }> {
    const params = new URLSearchParams({ profileId });
    if (redirectUrl) params.append('redirectUrl', redirectUrl);
    return this.request(`/connect/${platform}?${params}`);
  }

  async getAccounts(profileId: string): Promise<{ accounts: LateAccount[] }> {
    return this.request(`/accounts?profileId=${profileId}`);
  }

  async disconnectAccount(accountId: string): Promise<{ success: boolean }> {
    return this.request(`/accounts/${accountId}`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // POSTS
  // ==========================================

  async createPost(options: {
    profileId: string;
    platforms: Platform[];
    content: string;
    mediaUrls?: string[];
    scheduledAt?: string;
    title?: string;
    hashtags?: string[];
  }): Promise<LatePost> {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  async getPosts(profileId: string, options?: { status?: string; limit?: number }): Promise<{ posts: LatePost[] }> {
    const params = new URLSearchParams({ profileId });
    if (options?.status) params.append('status', options.status);
    if (options?.limit) params.append('limit', options.limit.toString());
    return this.request(`/posts?${params}`);
  }

  async getPost(postId: string): Promise<LatePost> {
    return this.request(`/posts/${postId}`);
  }

  async deletePost(postId: string): Promise<{ success: boolean }> {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // ANALYTICS
  // ==========================================

  async getAnalytics(profileId: string, options?: {
    platform?: Platform;
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    const params = new URLSearchParams({ profileId });
    if (options?.platform) params.append('platform', options.platform);
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    return this.request(`/analytics?${params}`);
  }

  async getPostAnalytics(postId: string): Promise<any> {
    return this.request(`/posts/${postId}/analytics`);
  }

  // ==========================================
  // PLATFORMS INFO
  // ==========================================

  async getPlatforms(): Promise<{ platforms: Platform[]; contentTypes: Record<Platform, string[]> }> {
    return this.request('/platforms');
  }
}

export const lateService = new LateService();
