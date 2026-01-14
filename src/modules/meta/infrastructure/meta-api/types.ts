/**
 * Tipos de resposta da Meta Graph API
 */

// Token response
export interface MetaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Long-lived token response
export interface LongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Facebook Pages response
export interface FacebookPagesResponse {
  data: FacebookPage[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
  };
}

export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category?: string;
  tasks?: string[];
}

// Instagram Account response
export interface InstagramAccountResponse {
  instagram_business_account?: {
    id: string;
  };
}

export interface InstagramAccountDetails {
  id: string;
  username: string;
  profile_picture_url?: string;
  followers_count?: number;
  account_type?: 'BUSINESS' | 'CREATOR';
  media_count?: number;
  biography?: string;
}

// Media Container response
export interface CreateContainerResponse {
  id: string;
}

export interface ContainerStatusResponse {
  id: string;
  status_code: 'EXPIRED' | 'ERROR' | 'FINISHED' | 'IN_PROGRESS' | 'PUBLISHED';
  status?: string;
}

// Publish response
export interface PublishMediaResponse {
  id: string;
}

// Media details response
export interface MediaDetailsResponse {
  id: string;
  media_type: string;
  media_url?: string;
  permalink?: string;
  timestamp?: string;
  caption?: string;
  like_count?: number;
  comments_count?: number;
}

// Error response
export interface MetaErrorResponse {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
}
