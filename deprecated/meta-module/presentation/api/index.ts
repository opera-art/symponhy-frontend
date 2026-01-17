/**
 * Meta API Routes Handlers
 *
 * Estes handlers podem ser usados nas API routes do Next.js
 */

export { handleInitiateOAuth, handleOAuthCallback } from './oauth-handlers';
export { handleGetAccounts, handleDisconnectAccount, handleRefreshToken } from './account-handlers';
export { handleCreatePost, handleGetPosts, handleCancelPost } from './post-handlers';

// Factory para criar instâncias dos use cases
export { createMetaUseCases } from './factory';
