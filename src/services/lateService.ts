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
  _id: string;
  id?: string; // alias for _id
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

export interface PlatformTarget {
  platform: Platform;
  accountId: string;
}

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export interface LatePost {
  _id: string;
  id?: string;
  content: string;
  platforms: {
    platform: Platform;
    accountId: string;
    platformPostUrl?: string;
  }[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledFor?: string;
  publishedAt?: string;
  mediaItems?: MediaItem[];
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
    const response = await this.request<{ profile: LateProfile }>('/profiles', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    return response.profile;
  }

  async getProfiles(): Promise<LateProfile[]> {
    const response = await this.request<{ profiles: LateProfile[] }>('/profiles');
    return response.profiles || [];
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

  /**
   * Create a post - Late API compliant
   * @param options.content - Post text (required)
   * @param options.platforms - Array of { platform, accountId } (required)
   * @param options.publishNow - Publish immediately (default: true)
   * @param options.scheduledFor - ISO 8601 date for scheduling
   * @param options.mediaItems - Array of { type: 'image'|'video', url }
   */
  async createPost(options: {
    content: string;
    platforms: PlatformTarget[];
    publishNow?: boolean;
    scheduledFor?: string;
    isDraft?: boolean;
    mediaItems?: MediaItem[];
    timezone?: string;
  }): Promise<{ message: string; post: LatePost }> {
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
