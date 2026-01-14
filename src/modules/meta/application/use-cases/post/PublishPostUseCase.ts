import {
  IConnectedAccountRepository,
  IScheduledPostRepository,
} from '../../../domain/repositories';
import {
  AccountNotFoundError,
  TokenExpiredError,
  ContainerCreationError,
  MediaPublishError,
} from '../../../domain/errors';
import { PublishNowInput, PublishOutput } from '../../dtos';
import { IMetaApiClient } from '../../../infrastructure/meta-api/IMetaApiClient';
import { IEncryptionService } from '../../services/IEncryptionService';

/**
 * Use Case: Publicar post imediatamente ou processar post agendado
 */
export class PublishPostUseCase {
  constructor(
    private connectedAccountRepository: IConnectedAccountRepository,
    private scheduledPostRepository: IScheduledPostRepository,
    private metaApiClient: IMetaApiClient,
    private encryptionService: IEncryptionService
  ) {}

  /**
   * Publicar conteúdo imediatamente
   */
  async execute(input: PublishNowInput): Promise<PublishOutput> {
    // 1. Buscar conta
    const account = await this.connectedAccountRepository.findById(input.accountId);

    if (!account) {
      throw new AccountNotFoundError(input.accountId);
    }

    if (account.isTokenExpired()) {
      throw new TokenExpiredError();
    }

    // 2. Descriptografar token
    const accessToken = this.encryptionService.decrypt(
      account.accessToken.getEncrypted()
    );

    try {
      // 3. Criar container de mídia
      const containerId = await this.createMediaContainer(
        account.igUserId.toString(),
        accessToken,
        input
      );

      // 4. Aguardar processamento do container
      await this.waitForContainerReady(containerId, accessToken);

      // 5. Publicar
      const result = await this.metaApiClient.publishMedia(
        account.igUserId.toString(),
        containerId,
        accessToken
      );

      // 6. Buscar permalink
      const mediaDetails = await this.metaApiClient.getMediaDetails(
        result.id,
        accessToken
      );

      return {
        success: true,
        mediaId: result.id,
        permalink: mediaDetails.permalink,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Publicar um post agendado específico
   */
  async publishScheduledPost(postId: string): Promise<PublishOutput> {
    const post = await this.scheduledPostRepository.findById(postId);

    if (!post) {
      return { success: false, error: 'Post not found' };
    }

    const account = await this.connectedAccountRepository.findById(post.accountId);

    if (!account) {
      post.markAsFailed('Account not found');
      await this.scheduledPostRepository.save(post);
      return { success: false, error: 'Account not found' };
    }

    if (account.isTokenExpired()) {
      post.markAsFailed('Token expired');
      await this.scheduledPostRepository.save(post);
      return { success: false, error: 'Token expired' };
    }

    const accessToken = this.encryptionService.decrypt(
      account.accessToken.getEncrypted()
    );

    try {
      // Criar container
      const containerId = await this.createMediaContainer(
        account.igUserId.toString(),
        accessToken,
        {
          mediaUrls: post.mediaUrls,
          caption: post.caption,
          mediaType: post.mediaType,
          thumbnailUrl: post.thumbnailUrl,
        }
      );

      // Marcar como processando
      post.markAsProcessing(containerId);
      await this.scheduledPostRepository.save(post);

      // Aguardar container
      await this.waitForContainerReady(containerId, accessToken);

      // Publicar
      const result = await this.metaApiClient.publishMedia(
        account.igUserId.toString(),
        containerId,
        accessToken
      );

      // Marcar como publicado
      post.markAsPublished(result.id);
      await this.scheduledPostRepository.save(post);

      return {
        success: true,
        mediaId: result.id,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      post.markAsFailed(errorMessage);
      await this.scheduledPostRepository.save(post);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  private async createMediaContainer(
    igUserId: string,
    accessToken: string,
    input: {
      mediaUrls: string[];
      caption: string;
      mediaType: string;
      thumbnailUrl?: string;
    }
  ): Promise<string> {
    const mediaType = input.mediaType;
    const mediaUrl = input.mediaUrls[0];

    let containerId: string;

    switch (mediaType) {
      case 'IMAGE':
        containerId = await this.metaApiClient.createImageContainer(
          igUserId,
          mediaUrl,
          input.caption,
          accessToken
        );
        break;

      case 'VIDEO':
      case 'REEL':
        containerId = await this.metaApiClient.createVideoContainer(
          igUserId,
          mediaUrl,
          input.caption,
          accessToken,
          mediaType === 'REEL'
        );
        break;

      case 'CAROUSEL':
        // Para carousel, primeiro criar containers filhos
        const childIds = await Promise.all(
          input.mediaUrls.map((url) =>
            this.metaApiClient.createCarouselItemContainer(igUserId, url, accessToken)
          )
        );
        containerId = await this.metaApiClient.createCarouselContainer(
          igUserId,
          childIds,
          input.caption,
          accessToken
        );
        break;

      case 'STORY':
        containerId = await this.metaApiClient.createStoryContainer(
          igUserId,
          mediaUrl,
          accessToken
        );
        break;

      default:
        throw new ContainerCreationError(`Unsupported media type: ${mediaType}`);
    }

    return containerId;
  }

  private async waitForContainerReady(
    containerId: string,
    accessToken: string,
    maxAttempts: number = 30,
    intervalMs: number = 2000
  ): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.metaApiClient.getContainerStatus(containerId, accessToken);

      if (status.status_code === 'FINISHED') {
        return;
      }

      if (status.status_code === 'ERROR') {
        throw new MediaPublishError(status.status || 'Container processing failed');
      }

      // Aguardar antes de verificar novamente
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new MediaPublishError('Container processing timeout');
  }
}
