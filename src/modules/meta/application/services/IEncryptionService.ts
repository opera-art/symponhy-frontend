/**
 * Interface for Encryption Service
 * Handles encryption and decryption of sensitive data
 */
export interface IEncryptionService {
  /**
   * Encrypt a string value
   */
  encrypt(value: string): string;

  /**
   * Decrypt an encrypted string value
   */
  decrypt(encryptedValue: string): string;
}
