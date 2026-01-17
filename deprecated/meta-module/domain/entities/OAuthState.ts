/**
 * OAuth State Entity
 * Usado para proteção CSRF durante o fluxo OAuth
 */
export interface OAuthStateProps {
  id: string;
  state: string; // Random string para CSRF
  userId: string;
  organizationId?: string;
  redirectUrl?: string; // URL para redirecionar após sucesso
  expiresAt: Date;
  createdAt: Date;
  usedAt?: Date;
}

export class OAuthState {
  private props: OAuthStateProps;

  constructor(props: OAuthStateProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get state(): string {
    return this.props.state;
  }

  get userId(): string {
    return this.props.userId;
  }

  get organizationId(): string | undefined {
    return this.props.organizationId;
  }

  get redirectUrl(): string | undefined {
    return this.props.redirectUrl;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get isExpired(): boolean {
    return new Date() >= this.props.expiresAt;
  }

  get isUsed(): boolean {
    return !!this.props.usedAt;
  }

  get isValid(): boolean {
    return !this.isExpired && !this.isUsed;
  }

  markAsUsed(): void {
    if (this.isUsed) {
      throw new Error('OAuth state already used');
    }
    if (this.isExpired) {
      throw new Error('OAuth state expired');
    }
    this.props.usedAt = new Date();
  }

  toJSON(): OAuthStateProps {
    return { ...this.props };
  }

  static fromJSON(data: OAuthStateProps): OAuthState {
    return new OAuthState({
      ...data,
      expiresAt: new Date(data.expiresAt),
      createdAt: new Date(data.createdAt),
      usedAt: data.usedAt ? new Date(data.usedAt) : undefined,
    });
  }

  static create(userId: string, organizationId?: string, redirectUrl?: string): OAuthState {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

    return new OAuthState({
      id: crypto.randomUUID(),
      state: crypto.randomUUID(),
      userId,
      organizationId,
      redirectUrl,
      expiresAt,
      createdAt: now,
    });
  }
}
