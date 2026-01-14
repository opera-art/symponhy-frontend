import { IConnectedAccountRepository } from '../../../domain/repositories';
import { AccountNotFoundError } from '../../../domain/errors';
import { DisconnectAccountInput, DisconnectAccountOutput } from '../../dtos';

/**
 * Use Case: Desconectar conta do Instagram
 */
export class DisconnectAccountUseCase {
  constructor(private connectedAccountRepository: IConnectedAccountRepository) {}

  async execute(input: DisconnectAccountInput): Promise<DisconnectAccountOutput> {
    // Buscar conta
    const account = await this.connectedAccountRepository.findById(input.accountId);

    if (!account) {
      throw new AccountNotFoundError(input.accountId);
    }

    // Verificar se o usuário é dono da conta
    if (account.userId !== input.userId) {
      throw new AccountNotFoundError(input.accountId); // Não revelar que existe
    }

    // Desativar a conta (soft delete - mantém histórico)
    account.deactivate();
    await this.connectedAccountRepository.save(account);

    // Ou deletar completamente se preferir:
    // await this.connectedAccountRepository.delete(input.accountId);

    return {
      success: true,
      message: `Account @${account.username} disconnected successfully`,
    };
  }
}
