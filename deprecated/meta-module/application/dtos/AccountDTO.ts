/**
 * DTOs para operações de conta
 */

// Conta conectada (para exibição)
export interface ConnectedAccountDTO {
  id: string;
  igUserId: string;
  username: string;
  profilePictureUrl?: string;
  followersCount?: number;
  accountType: 'BUSINESS' | 'CREATOR';
  pageName?: string;
  isActive: boolean;
  tokenStatus: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  connectedAt: string;
}

// Lista de contas do usuário
export interface UserAccountsDTO {
  accounts: ConnectedAccountDTO[];
  totalCount: number;
}

// Input para desconectar conta
export interface DisconnectAccountInput {
  accountId: string;
  userId: string;
}

// Output da desconexão
export interface DisconnectAccountOutput {
  success: boolean;
  message: string;
}

// Input para refresh de token
export interface RefreshTokenInput {
  accountId: string;
}

// Output do refresh
export interface RefreshTokenOutput {
  success: boolean;
  newExpiresAt?: Date;
  error?: string;
}
