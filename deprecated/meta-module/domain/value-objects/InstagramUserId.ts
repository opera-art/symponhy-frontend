/**
 * Value Object para Instagram User ID
 */
export class InstagramUserId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Instagram User ID cannot be empty');
    }
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: InstagramUserId): boolean {
    return this.value === other.value;
  }
}
