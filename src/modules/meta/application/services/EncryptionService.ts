import { IEncryptionService } from './IEncryptionService';

/**
 * Serviço de criptografia usando AES-256-GCM
 *
 * IMPORTANTE: Em produção, use uma biblioteca robusta como 'crypto' do Node.js
 * Esta é uma implementação simplificada para demonstração
 */
export class EncryptionService implements IEncryptionService {
  private readonly key: string;

  constructor(encryptionKey?: string) {
    this.key = encryptionKey || process.env.ENCRYPTION_KEY || '';

    if (!this.key) {
      throw new Error('ENCRYPTION_KEY is not configured');
    }

    if (this.key.length < 32) {
      throw new Error('ENCRYPTION_KEY must be at least 32 characters');
    }
  }

  encrypt(plainText: string): string {
    // Em ambiente de browser/edge, usar Web Crypto API
    // Em Node.js, usar o módulo crypto nativo
    //
    // Por simplicidade, aqui usamos Base64 + XOR como placeholder
    // SUBSTITUA por uma implementação real em produção!

    if (typeof window === 'undefined') {
      // Node.js environment
      return this.nodeEncrypt(plainText);
    }

    // Browser/Edge environment - usar implementação básica
    // TODO: Implementar com Web Crypto API
    return this.simpleEncrypt(plainText);
  }

  decrypt(encryptedText: string): string {
    if (typeof window === 'undefined') {
      return this.nodeDecrypt(encryptedText);
    }

    return this.simpleDecrypt(encryptedText);
  }

  private nodeEncrypt(plainText: string): string {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = require('crypto');

    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.key, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    // Formato: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  private nodeDecrypt(encryptedText: string): string {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = require('crypto');

    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = crypto.scryptSync(this.key, 'salt', 32);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  // Implementação simples para fallback (NÃO USE EM PRODUÇÃO)
  private simpleEncrypt(plainText: string): string {
    const encoded = Buffer.from(plainText).toString('base64');
    return `simple:${encoded}`;
  }

  private simpleDecrypt(encryptedText: string): string {
    if (encryptedText.startsWith('simple:')) {
      const encoded = encryptedText.slice(7);
      return Buffer.from(encoded, 'base64').toString('utf8');
    }
    // Tentar decriptar como Node.js format
    return this.nodeDecrypt(encryptedText);
  }
}
