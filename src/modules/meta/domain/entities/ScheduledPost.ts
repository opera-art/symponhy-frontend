import { MediaTypeValue, PostStatusValue } from '../value-objects';

export interface ScheduledPostProps {
  id: string;
  accountId: string; // FK para ConnectedAccount
  userId: string; // ID do usuário que criou

  // Content
  mediaUrls: string[];
  caption: string;
  mediaType: MediaTypeValue;
  thumbnailUrl?: string;

  // Scheduling
  scheduledFor: Date;
  timezone: string;

  // Publishing state
  status: PostStatusValue;
  containerId?: string; // ID do container no Meta
  publishedMediaId?: string; // ID da mídia publicada
  publishedAt?: Date;

  // Error handling
  errorMessage?: string;
  retryCount: number;
  lastRetryAt?: Date;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export class ScheduledPost {
  private props: ScheduledPostProps;

  constructor(props: ScheduledPostProps) {
    this.validateCaption(props.caption);
    this.props = props;
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get mediaUrls(): string[] {
    return [...this.props.mediaUrls];
  }

  get caption(): string {
    return this.props.caption;
  }

  get mediaType(): MediaTypeValue {
    return this.props.mediaType;
  }

  get thumbnailUrl(): string | undefined {
    return this.props.thumbnailUrl;
  }

  get scheduledFor(): Date {
    return this.props.scheduledFor;
  }

  get timezone(): string {
    return this.props.timezone;
  }

  get status(): PostStatusValue {
    return this.props.status;
  }

  get containerId(): string | undefined {
    return this.props.containerId;
  }

  get publishedMediaId(): string | undefined {
    return this.props.publishedMediaId;
  }

  get publishedAt(): Date | undefined {
    return this.props.publishedAt;
  }

  get errorMessage(): string | undefined {
    return this.props.errorMessage;
  }

  get retryCount(): number {
    return this.props.retryCount;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Validation
  private validateCaption(caption: string): void {
    if (caption.length > 2200) {
      throw new Error('Caption cannot exceed 2200 characters');
    }

    const hashtagCount = (caption.match(/#\w+/g) || []).length;
    if (hashtagCount > 30) {
      throw new Error('Caption cannot have more than 30 hashtags');
    }
  }

  // Domain logic
  isReadyToPublish(): boolean {
    return (
      this.props.status === 'PENDING' &&
      new Date() >= this.props.scheduledFor
    );
  }

  canRetry(): boolean {
    return (
      this.props.status === 'FAILED' &&
      this.props.retryCount < 3
    );
  }

  isDue(): boolean {
    return new Date() >= this.props.scheduledFor;
  }

  // State transitions
  markAsProcessing(containerId: string): void {
    this.props.status = 'PROCESSING';
    this.props.containerId = containerId;
    this.props.updatedAt = new Date();
  }

  markAsPublished(publishedMediaId: string): void {
    this.props.status = 'PUBLISHED';
    this.props.publishedMediaId = publishedMediaId;
    this.props.publishedAt = new Date();
    this.props.errorMessage = undefined;
    this.props.updatedAt = new Date();
  }

  markAsFailed(errorMessage: string): void {
    this.props.status = 'FAILED';
    this.props.errorMessage = errorMessage;
    this.props.retryCount += 1;
    this.props.lastRetryAt = new Date();
    this.props.updatedAt = new Date();
  }

  markAsCancelled(): void {
    this.props.status = 'CANCELLED';
    this.props.updatedAt = new Date();
  }

  resetForRetry(): void {
    if (!this.canRetry()) {
      throw new Error('Maximum retry attempts reached');
    }
    this.props.status = 'PENDING';
    this.props.containerId = undefined;
    this.props.updatedAt = new Date();
  }

  // Update methods
  updateContent(caption: string, mediaUrls?: string[]): void {
    if (this.props.status !== 'PENDING') {
      throw new Error('Cannot update content of non-pending post');
    }
    this.validateCaption(caption);
    this.props.caption = caption;
    if (mediaUrls) {
      this.props.mediaUrls = mediaUrls;
    }
    this.props.updatedAt = new Date();
  }

  reschedule(newDate: Date): void {
    if (this.props.status !== 'PENDING') {
      throw new Error('Cannot reschedule non-pending post');
    }
    this.props.scheduledFor = newDate;
    this.props.updatedAt = new Date();
  }

  // Serialization
  toJSON(): ScheduledPostProps {
    return { ...this.props };
  }

  static fromJSON(data: ScheduledPostProps): ScheduledPost {
    return new ScheduledPost({
      ...data,
      scheduledFor: new Date(data.scheduledFor),
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      lastRetryAt: data.lastRetryAt ? new Date(data.lastRetryAt) : undefined,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }
}
