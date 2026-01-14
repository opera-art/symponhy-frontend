import { MediaType } from '../value-objects';

export type ContainerStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'EXPIRED'
  | 'ERROR';

export interface MediaContainerProps {
  id: string;
  igContainerId: string; // ID retornado pelo Meta
  accountId: string;
  postId: string; // FK para ScheduledPost

  mediaType: MediaType;
  mediaUrl: string;
  status: ContainerStatus;

  statusCheckCount: number;
  lastStatusCheck?: Date;
  errorCode?: string;
  errorMessage?: string;

  createdAt: Date;
  expiresAt: Date; // Containers expiram após 24h
}

export class MediaContainer {
  private props: MediaContainerProps;

  constructor(props: MediaContainerProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get igContainerId(): string {
    return this.props.igContainerId;
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get postId(): string {
    return this.props.postId;
  }

  get mediaType(): MediaType {
    return this.props.mediaType;
  }

  get status(): ContainerStatus {
    return this.props.status;
  }

  get isReady(): boolean {
    return this.props.status === 'FINISHED';
  }

  get isExpired(): boolean {
    return new Date() >= this.props.expiresAt || this.props.status === 'EXPIRED';
  }

  get hasError(): boolean {
    return this.props.status === 'ERROR';
  }

  get errorMessage(): string | undefined {
    return this.props.errorMessage;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  // State updates
  updateStatus(status: ContainerStatus, errorCode?: string, errorMessage?: string): void {
    this.props.status = status;
    this.props.statusCheckCount += 1;
    this.props.lastStatusCheck = new Date();

    if (errorCode) {
      this.props.errorCode = errorCode;
      this.props.errorMessage = errorMessage;
    }
  }

  markAsExpired(): void {
    this.props.status = 'EXPIRED';
  }

  toJSON(): MediaContainerProps {
    return { ...this.props };
  }

  static fromJSON(data: MediaContainerProps): MediaContainer {
    return new MediaContainer({
      ...data,
      lastStatusCheck: data.lastStatusCheck ? new Date(data.lastStatusCheck) : undefined,
      createdAt: new Date(data.createdAt),
      expiresAt: new Date(data.expiresAt),
    });
  }
}
