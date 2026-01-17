import { ScheduledPost } from '../../../domain/entities';
import {
  IConnectedAccountRepository,
  IScheduledPostRepository,
} from '../../../domain/repositories';
import {
  AccountNotFoundError,
  TokenExpiredError,
  RateLimitError,
  ValidationError,
} from '../../../domain/errors';
import { CreateScheduledPostInput, CreateScheduledPostOutput } from '../../dtos';
import { META_CONFIG } from '../../../config';

/**
 * Use Case: Criar post agendado
 */
export class CreateScheduledPostUseCase {
  constructor(
    private connectedAccountRepository: IConnectedAccountRepository,
    private scheduledPostRepository: IScheduledPostRepository
  ) {}

  async execute(input: CreateScheduledPostInput): Promise<CreateScheduledPostOutput> {
    // 1. Validar conta
    const account = await this.connectedAccountRepository.findById(input.accountId);

    if (!account) {
      throw new AccountNotFoundError(input.accountId);
    }

    if (!account.canPublish()) {
      if (account.isTokenExpired()) {
        throw new TokenExpiredError();
      }
      throw new ValidationError('Account is not active');
    }

    // 2. Validar rate limit
    const postsLast24h = await this.scheduledPostRepository.countPublishedInLast24Hours(
      input.accountId
    );

    if (postsLast24h >= META_CONFIG.rateLimits.postsPerDay) {
      throw new RateLimitError();
    }

    // 3. Validar data de agendamento
    if (input.scheduledFor <= new Date()) {
      throw new ValidationError('Scheduled time must be in the future');
    }

    // 4. Validar conteúdo
    this.validateContent(input.caption, input.mediaUrls);

    // 5. Criar post agendado
    const now = new Date();
    const post = new ScheduledPost({
      id: crypto.randomUUID(),
      accountId: input.accountId,
      userId: input.userId,
      mediaUrls: input.mediaUrls,
      caption: input.caption,
      mediaType: input.mediaType,
      thumbnailUrl: input.thumbnailUrl,
      scheduledFor: input.scheduledFor,
      timezone: input.timezone || 'America/Sao_Paulo',
      status: 'PENDING',
      retryCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    await this.scheduledPostRepository.save(post);

    return {
      id: post.id,
      status: 'PENDING',
      scheduledFor: post.scheduledFor,
    };
  }

  private validateContent(caption: string, mediaUrls: string[]): void {
    // Validar caption
    if (caption.length > META_CONFIG.contentLimits.captionMaxLength) {
      throw new ValidationError(
        `Caption cannot exceed ${META_CONFIG.contentLimits.captionMaxLength} characters`
      );
    }

    // Contar hashtags
    const hashtagCount = (caption.match(/#\w+/g) || []).length;
    if (hashtagCount > META_CONFIG.contentLimits.hashtagsMax) {
      throw new ValidationError(
        `Caption cannot have more than ${META_CONFIG.contentLimits.hashtagsMax} hashtags`
      );
    }

    // Validar URLs de mídia
    if (mediaUrls.length === 0) {
      throw new ValidationError('At least one media URL is required');
    }

    for (const url of mediaUrls) {
      try {
        new URL(url);
      } catch {
        throw new ValidationError(`Invalid media URL: ${url}`);
      }
    }
  }
}
