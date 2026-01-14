import {
  IConnectedAccountRepository,
  IScheduledPostRepository,
} from '../../../domain/repositories';
import { ListPostsFilter, ScheduledPostDTO, ScheduledPostsListDTO } from '../../dtos';
import { ScheduledPost } from '../../../domain/entities';

/**
 * Use Case: Buscar posts agendados
 */
export class GetScheduledPostsUseCase {
  constructor(
    private scheduledPostRepository: IScheduledPostRepository,
    private connectedAccountRepository: IConnectedAccountRepository
  ) {}

  async execute(filter: ListPostsFilter): Promise<ScheduledPostsListDTO> {
    let posts: ScheduledPost[];

    // Aplicar filtros
    if (filter.accountId) {
      posts = filter.startDate && filter.endDate
        ? await this.scheduledPostRepository.findByAccountAndDateRange(
            filter.accountId,
            filter.startDate,
            filter.endDate
          )
        : await this.scheduledPostRepository.findByAccountId(filter.accountId);
    } else if (filter.userId) {
      posts = await this.scheduledPostRepository.findByUserId(filter.userId);
    } else if (filter.status) {
      posts = await this.scheduledPostRepository.findByStatus(filter.status);
    } else if (filter.startDate && filter.endDate) {
      posts = await this.scheduledPostRepository.findScheduledBetween(
        filter.startDate,
        filter.endDate
      );
    } else {
      posts = [];
    }

    // Buscar usernames das contas para exibição
    const accountIds = [...new Set(posts.map((p) => p.accountId))];
    const accounts = await Promise.all(
      accountIds.map((id) => this.connectedAccountRepository.findById(id))
    );
    const accountMap = new Map(
      accounts.filter(Boolean).map((a) => [a!.id, a!.username])
    );

    // Converter para DTOs
    const postDTOs: ScheduledPostDTO[] = posts.map((post) => ({
      id: post.id,
      accountId: post.accountId,
      accountUsername: accountMap.get(post.accountId) || 'Unknown',
      mediaUrls: post.mediaUrls,
      caption: post.caption,
      mediaType: post.mediaType,
      thumbnailUrl: post.thumbnailUrl,
      scheduledFor: post.scheduledFor.toISOString(),
      timezone: post.timezone,
      status: post.status,
      publishedMediaId: post.publishedMediaId,
      publishedAt: post.publishedAt?.toISOString(),
      errorMessage: post.errorMessage,
      createdAt: post.createdAt.toISOString(),
    }));

    // Aplicar paginação
    const page = filter.page || 1;
    const pageSize = filter.pageSize || 20;
    const startIndex = (page - 1) * pageSize;
    const paginatedPosts = postDTOs.slice(startIndex, startIndex + pageSize);

    return {
      posts: paginatedPosts,
      totalCount: postDTOs.length,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(postDTOs.length / pageSize),
      },
    };
  }
}
