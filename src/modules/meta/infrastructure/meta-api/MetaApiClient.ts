import { META_CONFIG } from '../../config';
import { MetaApiError } from '../../domain/errors';
import { IMetaApiClient } from './IMetaApiClient';
import {
  MetaTokenResponse,
  LongLivedTokenResponse,
  FacebookPage,
  FacebookPagesResponse,
  InstagramAccountResponse,
  InstagramAccountDetails,
  ContainerStatusResponse,
  PublishMediaResponse,
  MediaDetailsResponse,
  MetaErrorResponse,
  CreateContainerResponse,
} from './types';

/**
 * Cliente para Meta Graph API
 */
export class MetaApiClient implements IMetaApiClient {
  private readonly baseUrl = META_CONFIG.graphApiUrl;

  // ========== Helper Methods ==========

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const error = data as MetaErrorResponse;
      throw MetaApiError.fromApiResponse({
        message: error.error?.message || 'Unknown Meta API error',
        code: error.error?.code,
        error_subcode: error.error?.error_subcode,
        fbtrace_id: error.error?.fbtrace_id,
      });
    }

    return data as T;
  }

  private buildUrl(endpoint: string, params: Record<string, string>): string {
    const searchParams = new URLSearchParams(params);
    return `${endpoint}?${searchParams.toString()}`;
  }

  // ========== OAuth ==========

  async exchangeCodeForToken(code: string): Promise<MetaTokenResponse> {
    const params = new URLSearchParams({
      client_id: META_CONFIG.appId,
      client_secret: META_CONFIG.appSecret,
      redirect_uri: META_CONFIG.redirectUri,
      code,
    });

    return this.request<MetaTokenResponse>(
      `/oauth/access_token?${params.toString()}`
    );
  }

  async exchangeForLongLivedToken(shortLivedToken: string): Promise<LongLivedTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: META_CONFIG.appId,
      client_secret: META_CONFIG.appSecret,
      fb_exchange_token: shortLivedToken,
    });

    return this.request<LongLivedTokenResponse>(
      `/oauth/access_token?${params.toString()}`
    );
  }

  async refreshLongLivedToken(currentToken: string): Promise<LongLivedTokenResponse> {
    // Para tokens de página, podemos usar o mesmo endpoint de exchange
    return this.exchangeForLongLivedToken(currentToken);
  }

  // ========== Account Discovery ==========

  async getFacebookPages(accessToken: string): Promise<FacebookPage[]> {
    const response = await this.request<FacebookPagesResponse>(
      this.buildUrl('/me/accounts', { access_token: accessToken })
    );

    return response.data || [];
  }

  async getInstagramAccount(
    pageId: string,
    accessToken: string
  ): Promise<{ id: string } | null> {
    const response = await this.request<InstagramAccountResponse>(
      this.buildUrl(`/${pageId}`, {
        fields: 'instagram_business_account',
        access_token: accessToken,
      })
    );

    return response.instagram_business_account || null;
  }

  async getInstagramAccountDetails(
    igUserId: string,
    accessToken: string
  ): Promise<InstagramAccountDetails> {
    return this.request<InstagramAccountDetails>(
      this.buildUrl(`/${igUserId}`, {
        fields: 'id,username,profile_picture_url,followers_count,account_type,media_count,biography',
        access_token: accessToken,
      })
    );
  }

  // ========== Content Publishing ==========

  async createImageContainer(
    igUserId: string,
    imageUrl: string,
    caption: string,
    accessToken: string
  ): Promise<string> {
    const params = new URLSearchParams({
      image_url: imageUrl,
      caption,
      access_token: accessToken,
    });

    const response = await this.request<CreateContainerResponse>(
      `/${igUserId}/media?${params.toString()}`,
      { method: 'POST' }
    );

    return response.id;
  }

  async createVideoContainer(
    igUserId: string,
    videoUrl: string,
    caption: string,
    accessToken: string,
    isReel: boolean = false
  ): Promise<string> {
    const params: Record<string, string> = {
      video_url: videoUrl,
      caption,
      access_token: accessToken,
      media_type: 'VIDEO',
    };

    if (isReel) {
      params.media_type = 'REELS';
    }

    const searchParams = new URLSearchParams(params);

    const response = await this.request<CreateContainerResponse>(
      `/${igUserId}/media?${searchParams.toString()}`,
      { method: 'POST' }
    );

    return response.id;
  }

  async createCarouselItemContainer(
    igUserId: string,
    mediaUrl: string,
    accessToken: string
  ): Promise<string> {
    // Detectar se é imagem ou vídeo pela extensão
    const isVideo = /\.(mp4|mov|avi|wmv)$/i.test(mediaUrl);

    const params: Record<string, string> = {
      is_carousel_item: 'true',
      access_token: accessToken,
    };

    if (isVideo) {
      params.video_url = mediaUrl;
      params.media_type = 'VIDEO';
    } else {
      params.image_url = mediaUrl;
    }

    const searchParams = new URLSearchParams(params);

    const response = await this.request<CreateContainerResponse>(
      `/${igUserId}/media?${searchParams.toString()}`,
      { method: 'POST' }
    );

    return response.id;
  }

  async createCarouselContainer(
    igUserId: string,
    childrenIds: string[],
    caption: string,
    accessToken: string
  ): Promise<string> {
    const params = new URLSearchParams({
      media_type: 'CAROUSEL',
      children: childrenIds.join(','),
      caption,
      access_token: accessToken,
    });

    const response = await this.request<CreateContainerResponse>(
      `/${igUserId}/media?${params.toString()}`,
      { method: 'POST' }
    );

    return response.id;
  }

  async createStoryContainer(
    igUserId: string,
    mediaUrl: string,
    accessToken: string
  ): Promise<string> {
    // Detectar se é imagem ou vídeo
    const isVideo = /\.(mp4|mov|avi|wmv)$/i.test(mediaUrl);

    const params: Record<string, string> = {
      media_type: 'STORIES',
      access_token: accessToken,
    };

    if (isVideo) {
      params.video_url = mediaUrl;
    } else {
      params.image_url = mediaUrl;
    }

    const searchParams = new URLSearchParams(params);

    const response = await this.request<CreateContainerResponse>(
      `/${igUserId}/media?${searchParams.toString()}`,
      { method: 'POST' }
    );

    return response.id;
  }

  async getContainerStatus(
    containerId: string,
    accessToken: string
  ): Promise<ContainerStatusResponse> {
    return this.request<ContainerStatusResponse>(
      this.buildUrl(`/${containerId}`, {
        fields: 'id,status_code,status',
        access_token: accessToken,
      })
    );
  }

  async publishMedia(
    igUserId: string,
    containerId: string,
    accessToken: string
  ): Promise<PublishMediaResponse> {
    const params = new URLSearchParams({
      creation_id: containerId,
      access_token: accessToken,
    });

    return this.request<PublishMediaResponse>(
      `/${igUserId}/media_publish?${params.toString()}`,
      { method: 'POST' }
    );
  }

  // ========== Media Management ==========

  async getMediaDetails(
    mediaId: string,
    accessToken: string
  ): Promise<MediaDetailsResponse> {
    return this.request<MediaDetailsResponse>(
      this.buildUrl(`/${mediaId}`, {
        fields: 'id,media_type,media_url,permalink,timestamp,caption,like_count,comments_count',
        access_token: accessToken,
      })
    );
  }
}
