/**
 * Interface for Meta API Client
 * Handles communication with Facebook/Instagram Graph API
 */
export interface IMetaApiClient {
  /**
   * Exchange authorization code for access token
   */
  exchangeCodeForToken(code: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in?: number;
  }>;

  /**
   * Get Facebook pages the user manages
   */
  getFacebookPages(accessToken: string): Promise<{
    id: string;
    name: string;
    access_token: string;
  }[]>;

  /**
   * Get Instagram business account connected to a Facebook page
   */
  getInstagramAccount(pageId: string, accessToken: string): Promise<{
    id: string;
  } | null>;

  /**
   * Get Instagram account details
   */
  getInstagramAccountDetails(instagramUserId: string, accessToken: string): Promise<{
    id: string;
    username: string;
    profile_picture_url?: string;
    followers_count?: number;
    media_count?: number;
    account_type?: 'BUSINESS' | 'CREATOR';
  }>;

  /**
   * Refreshes a long-lived access token
   */
  refreshLongLivedToken(currentToken: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }>;

  /**
   * Exchange short-lived token for long-lived token
   */
  exchangeForLongLivedToken(shortLivedToken: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }>;

  /**
   * Publish a media container
   */
  publishMedia(igUserId: string, containerId: string, accessToken: string): Promise<{
    id: string;
  }>;

  /**
   * Get media details
   */
  getMediaDetails(mediaId: string, accessToken: string): Promise<{
    id: string;
    permalink?: string;
    timestamp?: string;
    media_type?: string;
  }>;

  /**
   * Create an image container
   */
  createImageContainer(
    igUserId: string,
    imageUrl: string,
    caption: string,
    accessToken: string
  ): Promise<string>;

  /**
   * Create a video container
   */
  createVideoContainer(
    igUserId: string,
    videoUrl: string,
    caption: string,
    accessToken: string,
    isReel?: boolean
  ): Promise<string>;

  /**
   * Create a carousel item container
   */
  createCarouselItemContainer(
    igUserId: string,
    mediaUrl: string,
    accessToken: string
  ): Promise<string>;

  /**
   * Create a carousel container
   */
  createCarouselContainer(
    igUserId: string,
    childIds: string[],
    caption: string,
    accessToken: string
  ): Promise<string>;

  /**
   * Create a story container
   */
  createStoryContainer(
    igUserId: string,
    mediaUrl: string,
    accessToken: string
  ): Promise<string>;

  /**
   * Get container status
   */
  getContainerStatus(containerId: string, accessToken: string): Promise<{
    id: string;
    status_code: 'EXPIRED' | 'ERROR' | 'FINISHED' | 'IN_PROGRESS' | 'PUBLISHED';
    status?: string;
  }>;
}
