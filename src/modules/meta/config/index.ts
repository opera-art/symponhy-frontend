/**
 * Meta API Configuration
 */

export const META_CONFIG = {
  // API URLs
  graphApiUrl: 'https://graph.facebook.com/v21.0',
  instagramApiUrl: 'https://api.instagram.com',
  oauthUrl: 'https://www.facebook.com/v21.0/dialog/oauth',

  // App credentials (from environment)
  get appId() {
    const id = process.env.META_APP_ID || process.env.NEXT_PUBLIC_META_APP_ID;
    if (!id) throw new Error('META_APP_ID is not configured');
    return id;
  },

  get appSecret() {
    const secret = process.env.META_APP_SECRET;
    if (!secret) throw new Error('META_APP_SECRET is not configured');
    return secret;
  },

  get redirectUri() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/api/meta/callback`;
  },

  // Required scopes for content publishing
  scopes: [
    'instagram_basic',
    'instagram_content_publish',
    'instagram_manage_comments',
    'instagram_manage_insights',
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
    'business_management',
  ] as const,

  get scopesString() {
    return this.scopes.join(',');
  },

  // Rate limits
  rateLimits: {
    postsPerDay: 25,        // API-published posts per 24h
    totalPostsPerDay: 50,   // Total posts (feed + reels + stories)
    apiCallsPerHour: 200,   // Minimum API calls per hour
  },

  // Content limits
  contentLimits: {
    captionMaxLength: 2200,
    hashtagsMax: 30,
    mentionsMax: 30,
  },

  // Token configuration
  tokens: {
    shortLivedExpiryHours: 1,
    longLivedExpiryDays: 60,
    refreshBeforeDays: 7,
  },
} as const;

export type MetaScope = (typeof META_CONFIG.scopes)[number];
