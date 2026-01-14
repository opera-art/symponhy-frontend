import { IScheduledPostRepository } from '../../../domain/repositories';
import { PublishPostUseCase } from './PublishPostUseCase';

interface ProcessResult {
  postId: string;
  success: boolean;
  mediaId?: string;
  error?: string;
}

/**
 * Use Case: Processar posts que estão no horário de publicação
 *
 * Este use case deve ser executado por um cron job/worker
 */
export class ProcessDuePostsUseCase {
  constructor(
    private scheduledPostRepository: IScheduledPostRepository,
    private publishPostUseCase: PublishPostUseCase
  ) {}

  async execute(): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
    results: ProcessResult[];
  }> {
    // Buscar posts pendentes que estão no horário
    const duePosts = await this.scheduledPostRepository.findDuePosts();

    const results: ProcessResult[] = [];
    let succeeded = 0;
    let failed = 0;

    for (const post of duePosts) {
      try {
        const result = await this.publishPostUseCase.publishScheduledPost(post.id);

        if (result.success) {
          succeeded++;
          results.push({
            postId: post.id,
            success: true,
            mediaId: result.mediaId,
          });
        } else {
          failed++;
          results.push({
            postId: post.id,
            success: false,
            error: result.error,
          });
        }
      } catch (error) {
        failed++;
        results.push({
          postId: post.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      // Pequeno delay entre publicações para evitar rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return {
      processed: duePosts.length,
      succeeded,
      failed,
      results,
    };
  }
}
