import { InstagramUserId, FacebookPageId, AccessToken } from '../value-objects';

export interface ConnectedAccountProps {
  id: string;
  userId: string; // ID do usuário no seu sistema (Clerk)
  organizationId?: string; // ID da organização (se aplicável)

  // Instagram account info
  igUserId: string;
  username: string;
  profilePictureUrl?: string;
  followersCount?: number;
  accountType: 'BUSINESS' | 'CREATOR';

  // Facebook page info
  pageId: string;
  pageName?: string;

  // Tokens
  accessToken: string; // Encrypted
  tokenExpiresAt: Date;

  // Metadata
  isActive: boolean;
  connectedAt: Date;
  updatedAt: Date;
}

export class ConnectedAccount {
  private props: ConnectedAccountProps;

  constructor(props: ConnectedAccountProps) {
    this.props = props;
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get organizationId(): string | undefined {
    return this.props.organizationId;
  }

  get igUserId(): InstagramUserId {
    return new InstagramUserId(this.props.igUserId);
  }

  get username(): string {
    return this.props.username;
  }

  get profilePictureUrl(): string | undefined {
    return this.props.profilePictureUrl;
  }

  get followersCount(): number | undefined {
    return this.props.followersCount;
  }

  get accountType(): 'BUSINESS' | 'CREATOR' {
    return this.props.accountType;
  }

  get pageId(): FacebookPageId {
    return new FacebookPageId(this.props.pageId);
  }

  get pageName(): string | undefined {
    return this.props.pageName;
  }

  get accessToken(): AccessToken {
    return new AccessToken(this.props.accessToken);
  }

  get tokenExpiresAt(): Date {
    return this.props.tokenExpiresAt;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get connectedAt(): Date {
    return this.props.connectedAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Domain logic
  isTokenExpired(): boolean {
    return new Date() >= this.props.tokenExpiresAt;
  }

  isTokenExpiringSoon(daysThreshold: number = 7): boolean {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    return this.props.tokenExpiresAt <= thresholdDate;
  }

  canPublish(): boolean {
    return this.props.isActive && !this.isTokenExpired();
  }

  // Update methods
  updateToken(newToken: string, expiresAt: Date): void {
    this.props.accessToken = newToken;
    this.props.tokenExpiresAt = expiresAt;
    this.props.updatedAt = new Date();
  }

  updateProfile(username: string, profilePictureUrl?: string, followersCount?: number): void {
    this.props.username = username;
    this.props.profilePictureUrl = profilePictureUrl;
    this.props.followersCount = followersCount;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  // Serialization
  toJSON(): ConnectedAccountProps {
    return { ...this.props };
  }

  static fromJSON(data: ConnectedAccountProps): ConnectedAccount {
    return new ConnectedAccount({
      ...data,
      tokenExpiresAt: new Date(data.tokenExpiresAt),
      connectedAt: new Date(data.connectedAt),
      updatedAt: new Date(data.updatedAt),
    });
  }
}
