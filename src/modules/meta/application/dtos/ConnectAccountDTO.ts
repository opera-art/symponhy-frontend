/**
 * DTOs para conexão de conta
 */

// Input para iniciar OAuth
export interface InitiateOAuthInput {
  userId: string;
  organizationId?: string;
  redirectUrl?: string; // URL após sucesso
}

// Output da iniciação OAuth
export interface InitiateOAuthOutput {
  authorizationUrl: string;
  state: string;
}

// Input do callback OAuth
export interface OAuthCallbackInput {
  code: string;
  state: string;
}

// Output do callback OAuth
export interface OAuthCallbackOutput {
  success: boolean;
  accountsConnected: number;
  accounts: {
    igUserId: string;
    username: string;
    profilePictureUrl?: string;
  }[];
  redirectUrl?: string;
}

// Dados da página do Facebook
export interface FacebookPageData {
  id: string;
  name: string;
  access_token: string; // Page access token
}

// Dados da conta Instagram
export interface InstagramAccountData {
  id: string;
  username: string;
  profile_picture_url?: string;
  followers_count?: number;
  account_type: 'BUSINESS' | 'CREATOR';
}
