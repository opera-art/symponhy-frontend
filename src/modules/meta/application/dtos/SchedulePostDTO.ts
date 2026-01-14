import { MediaTypeValue } from '../../domain/value-objects';

/**
 * DTOs para agendamento de posts
 */

// Input para criar post agendado
export interface CreateScheduledPostInput {
  accountId: string;
  userId: string;
  mediaUrls: string[];
  caption: string;
  mediaType: MediaTypeValue;
  scheduledFor: Date;
  timezone?: string;
  thumbnailUrl?: string; // Para vídeos/reels
}

// Output da criação de post
export interface CreateScheduledPostOutput {
  id: string;
  status: 'PENDING';
  scheduledFor: Date;
}

// Input para atualizar post
export interface UpdateScheduledPostInput {
  postId: string;
  caption?: string;
  mediaUrls?: string[];
  scheduledFor?: Date;
}

// Input para publicar imediatamente
export interface PublishNowInput {
  accountId: string;
  userId: string;
  mediaUrls: string[];
  caption: string;
  mediaType: MediaTypeValue;
  thumbnailUrl?: string;
}

// Output da publicação
export interface PublishOutput {
  success: boolean;
  mediaId?: string;
  permalink?: string;
  error?: string;
}

// Input para cancelar post
export interface CancelPostInput {
  postId: string;
  userId: string; // Para verificar permissão
}
