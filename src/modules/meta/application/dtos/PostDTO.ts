import { MediaTypeValue, PostStatusValue } from '../../domain/value-objects';

/**
 * DTOs para operações de post
 */

// Post agendado (para exibição)
export interface ScheduledPostDTO {
  id: string;
  accountId: string;
  accountUsername: string;
  mediaUrls: string[];
  caption: string;
  mediaType: MediaTypeValue;
  thumbnailUrl?: string;
  scheduledFor: string;
  timezone: string;
  status: PostStatusValue;
  publishedMediaId?: string;
  publishedAt?: string;
  errorMessage?: string;
  createdAt: string;
}

// Lista de posts agendados
export interface ScheduledPostsListDTO {
  posts: ScheduledPostDTO[];
  totalCount: number;
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Filtros para listar posts
export interface ListPostsFilter {
  accountId?: string;
  userId?: string;
  status?: PostStatusValue;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

// Post publicado (resposta do Meta)
export interface PublishedPostDTO {
  id: string;
  igMediaId: string;
  permalink: string;
  mediaType: MediaTypeValue;
  caption: string;
  timestamp: string;
  likeCount?: number;
  commentsCount?: number;
}

// Estatísticas de publicação
export interface PublishingStatsDTO {
  accountId: string;
  postsLast24h: number;
  postsRemaining: number;
  nextAvailableSlot?: string;
}
