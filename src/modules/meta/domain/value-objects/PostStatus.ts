/**
 * Value Object para Post Status
 */
export type PostStatusValue =
  | 'PENDING'      // Aguardando publicação
  | 'PROCESSING'   // Container criado, aguardando processamento
  | 'PUBLISHED'    // Publicado com sucesso
  | 'FAILED'       // Falhou na publicação
  | 'CANCELLED';   // Cancelado pelo usuário

const VALID_STATUSES: PostStatusValue[] = [
  'PENDING',
  'PROCESSING',
  'PUBLISHED',
  'FAILED',
  'CANCELLED',
];

export class PostStatus {
  private readonly value: PostStatusValue;

  constructor(value: PostStatusValue) {
    if (!VALID_STATUSES.includes(value)) {
      throw new Error(`Invalid post status: ${value}`);
    }
    this.value = value;
  }

  toString(): PostStatusValue {
    return this.value;
  }

  isPending(): boolean {
    return this.value === 'PENDING';
  }

  isProcessing(): boolean {
    return this.value === 'PROCESSING';
  }

  isPublished(): boolean {
    return this.value === 'PUBLISHED';
  }

  isFailed(): boolean {
    return this.value === 'FAILED';
  }

  isCancelled(): boolean {
    return this.value === 'CANCELLED';
  }

  /**
   * Verifica se o post está em um estado final (não pode mais mudar)
   */
  isFinal(): boolean {
    return this.value === 'PUBLISHED' || this.value === 'CANCELLED';
  }

  /**
   * Verifica se o post pode ser editado
   */
  canEdit(): boolean {
    return this.value === 'PENDING';
  }

  /**
   * Verifica se o post pode ser cancelado
   */
  canCancel(): boolean {
    return this.value === 'PENDING' || this.value === 'FAILED';
  }

  equals(other: PostStatus): boolean {
    return this.value === other.value;
  }
}
