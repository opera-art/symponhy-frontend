/**
 * Late API Service - Frontend client
 * Connects to symponhy-social backend
 *
 * SECURITY: Backend handles profileId lookup via Supabase
 * Frontend does NOT store or manage profileId
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
  id?: string;
  name: string;
  createdAt: string;
}

export interface LateAccount {
  _id?: string;
  id?: string;
  platform: Platform;
  username?: string;
  displayName?: string;
  profilePictureUrl?: string;
  followersCount?: number;
  accountType?: string;
  isActive: boolean;
  connectedAt?: string;
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
    const url = `${API_BASE}${endpoint}`;
    console.log(`[LateService] ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({ error: 'Failed to parse response' }));
    console.log(`[LateService] Response ${response.status}:`, data);

    if (!response.ok) {
      throw new Error(data.error || data.message || `Request failed: ${response.status}`);
    }

    return data as T;
  }

  // ==========================================
  // CURRENT USER (SECURE)
  // ==========================================

  /**
   * Get the current user's profile
   * Backend fetches from Supabase based on authenticated user
   */
  async getMyProfile(): Promise<LateProfile> {
    return this.request('/me/profile');
  }

  // ==========================================
  // ACCOUNT CONNECTIONS (No profileId needed)
  // ==========================================

  /**
   * Get OAuth URL for connecting a platform
   * Backend handles profileId lookup automatically
   */
  async getConnectUrl(platform: Platform, redirectUrl?: string): Promise<{ authUrl: string }> {
    const params = new URLSearchParams();
    if (redirectUrl) params.append('redirectUrl', redirectUrl);
    const query = params.toString();
    return this.request(`/connect/${platform}${query ? '?' + query : ''}`);
  }

  /**
   * Get connected accounts for current user
   * Backend handles profileId lookup automatically
   */
  async getAccounts(): Promise<{ accounts: LateAccount[]; hasAnalyticsAccess?: boolean }> {
    return this.request('/accounts');
  }

  async disconnectAccount(accountId: string): Promise<{ success: boolean }> {
    return this.request(`/accounts/${accountId}`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // POSTS (No profileId needed for GET)
  // ==========================================

  /**
   * Create a post
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

  /**
   * Get posts for current user
   * Backend handles profileId lookup automatically
   */
  async getPosts(options?: { status?: string; limit?: number }): Promise<{ posts: LatePost[] }> {
    const params = new URLSearchParams();
    if (options?.status) params.append('status', options.status);
    if (options?.limit) params.append('limit', options.limit.toString());
    const query = params.toString();
    return this.request(`/posts${query ? '?' + query : ''}`);
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
  // ANALYTICS (No profileId needed)
  // ==========================================

  /**
   * Get analytics for current user
   * Backend handles profileId lookup automatically
   */
  async getAnalytics(options?: {
    platform?: Platform;
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (options?.platform) params.append('platform', options.platform);
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    const query = params.toString();
    return this.request(`/analytics${query ? '?' + query : ''}`);
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
