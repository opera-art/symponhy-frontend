import { IConnectedAccountRepository } from '../../../domain/repositories';
import { ConnectedAccountDTO, UserAccountsDTO } from '../../dtos';

/**
 * Use Case: Buscar contas conectadas de um usuário
 */
export class GetUserAccountsUseCase {
  constructor(private connectedAccountRepository: IConnectedAccountRepository) {}

  async execute(userId: string): Promise<UserAccountsDTO> {
    const accounts = await this.connectedAccountRepository.findByUserId(userId);

    const accountDTOs: ConnectedAccountDTO[] = accounts.map((account) => {
      let tokenStatus: ConnectedAccountDTO['tokenStatus'] = 'VALID';

      if (account.isTokenExpired()) {
        tokenStatus = 'EXPIRED';
      } else if (account.isTokenExpiringSoon(7)) {
        tokenStatus = 'EXPIRING_SOON';
      }

      return {
        id: account.id,
        igUserId: account.igUserId.toString(),
        username: account.username,
        profilePictureUrl: account.profilePictureUrl,
        followersCount: account.followersCount,
        accountType: account.accountType,
        pageName: account.pageName,
        isActive: account.isActive,
        tokenStatus,
        connectedAt: account.connectedAt.toISOString(),
      };
    });

    return {
      accounts: accountDTOs,
      totalCount: accountDTOs.length,
    };
  }
}
