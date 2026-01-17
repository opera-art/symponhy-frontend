import { createClient } from '@supabase/supabase-js';

// Repositories
import {
  SupabaseConnectedAccountRepository,
  SupabaseScheduledPostRepository,
  SupabaseOAuthStateRepository,
} from '../../infrastructure/repositories';

// Meta API Client
import { MetaApiClient } from '../../infrastructure/meta-api';

// Services
import { EncryptionService } from '../../application/services';

// Use Cases
import {
  InitiateOAuthUseCase,
  HandleOAuthCallbackUseCase,
  GetUserAccountsUseCase,
  DisconnectAccountUseCase,
  RefreshAccountTokenUseCase,
  CreateScheduledPostUseCase,
  PublishPostUseCase,
  CancelScheduledPostUseCase,
  GetScheduledPostsUseCase,
  ProcessDuePostsUseCase,
} from '../../application/use-cases';

/**
 * Factory para criar instâncias dos use cases com suas dependências
 */
export function createMetaUseCases(supabaseUrl?: string, supabaseKey?: string) {
  // Criar cliente Supabase
  const url = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(url, key);

  // Criar repositórios
  const connectedAccountRepository = new SupabaseConnectedAccountRepository(supabase);
  const scheduledPostRepository = new SupabaseScheduledPostRepository(supabase);
  const oauthStateRepository = new SupabaseOAuthStateRepository(supabase);

  // Criar serviços
  const metaApiClient = new MetaApiClient();
  const encryptionService = new EncryptionService();

  // Criar use cases
  const initiateOAuth = new InitiateOAuthUseCase(oauthStateRepository);

  const handleOAuthCallback = new HandleOAuthCallbackUseCase(
    oauthStateRepository,
    connectedAccountRepository,
    metaApiClient,
    encryptionService
  );

  const getUserAccounts = new GetUserAccountsUseCase(connectedAccountRepository);

  const disconnectAccount = new DisconnectAccountUseCase(connectedAccountRepository);

  const refreshAccountToken = new RefreshAccountTokenUseCase(
    connectedAccountRepository,
    metaApiClient,
    encryptionService
  );

  const createScheduledPost = new CreateScheduledPostUseCase(
    connectedAccountRepository,
    scheduledPostRepository
  );

  const publishPost = new PublishPostUseCase(
    connectedAccountRepository,
    scheduledPostRepository,
    metaApiClient,
    encryptionService
  );

  const cancelScheduledPost = new CancelScheduledPostUseCase(scheduledPostRepository);

  const getScheduledPosts = new GetScheduledPostsUseCase(
    scheduledPostRepository,
    connectedAccountRepository
  );

  const processDuePosts = new ProcessDuePostsUseCase(
    scheduledPostRepository,
    publishPost
  );

  return {
    // OAuth
    initiateOAuth,
    handleOAuthCallback,

    // Account
    getUserAccounts,
    disconnectAccount,
    refreshAccountToken,

    // Posts
    createScheduledPost,
    publishPost,
    cancelScheduledPost,
    getScheduledPosts,
    processDuePosts,

    // Repositories (para casos especiais)
    repositories: {
      connectedAccount: connectedAccountRepository,
      scheduledPost: scheduledPostRepository,
      oauthState: oauthStateRepository,
    },
  };
}

// Singleton para uso nas API routes
let useCasesInstance: ReturnType<typeof createMetaUseCases> | null = null;

export function getMetaUseCases() {
  if (!useCasesInstance) {
    useCasesInstance = createMetaUseCases();
  }
  return useCasesInstance;
}
