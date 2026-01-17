/**
 * Value Object para Facebook Page ID
 */
export class FacebookPageId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Facebook Page ID cannot be empty');
    }
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: FacebookPageId): boolean {
    return this.value === other.value;
  }
}
