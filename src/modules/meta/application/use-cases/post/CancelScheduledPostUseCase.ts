import { IScheduledPostRepository } from '../../../domain/repositories';
import { ValidationError } from '../../../domain/errors';
import { CancelPostInput } from '../../dtos';

/**
 * Use Case: Cancelar post agendado
 */
export class CancelScheduledPostUseCase {
  constructor(private scheduledPostRepository: IScheduledPostRepository) {}

  async execute(input: CancelPostInput): Promise<{ success: boolean; message: string }> {
    const post = await this.scheduledPostRepository.findById(input.postId);

    if (!post) {
      throw new ValidationError('Post not found');
    }

    // Verificar permissão
    if (post.userId !== input.userId) {
      throw new ValidationError('You do not have permission to cancel this post');
    }

    // Verificar se pode ser cancelado
    if (post.status === 'PUBLISHED') {
      throw new ValidationError('Cannot cancel a published post');
    }

    if (post.status === 'CANCELLED') {
      throw new ValidationError('Post is already cancelled');
    }

    if (post.status === 'PROCESSING') {
      throw new ValidationError('Cannot cancel a post that is being processed');
    }

    // Cancelar
    post.markAsCancelled();
    await this.scheduledPostRepository.save(post);

    return {
      success: true,
      message: 'Post cancelled successfully',
    };
  }
}
