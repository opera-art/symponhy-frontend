/**
 * Value Object para Access Token
 * Encapsula o token de acesso criptografado
 */
export class AccessToken {
  private readonly encryptedValue: string;

  constructor(encryptedValue: string) {
    if (!encryptedValue || encryptedValue.trim() === '') {
      throw new Error('Access Token cannot be empty');
    }
    this.encryptedValue = encryptedValue;
  }

  /**
   * Retorna o valor criptografado (para salvar no banco)
   */
  getEncrypted(): string {
    return this.encryptedValue;
  }

  /**
   * Verifica se dois tokens são iguais
   */
  equals(other: AccessToken): boolean {
    return this.encryptedValue === other.encryptedValue;
  }
}
