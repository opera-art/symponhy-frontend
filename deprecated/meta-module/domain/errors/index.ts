/**
 * Meta Integration Domain Errors
 */

export class MetaError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'MetaError';
  }
}

// Authentication Errors
export class OAuthError extends MetaError {
  constructor(message: string, code: string = 'OAUTH_ERROR') {
    super(message, code, 401);
    this.name = 'OAuthError';
  }
}

export class InvalidStateError extends OAuthError {
  constructor() {
    super('Invalid or expired OAuth state', 'INVALID_STATE');
    this.name = 'InvalidStateError';
  }
}

export class TokenExpiredError extends OAuthError {
  constructor() {
    super('Access token has expired', 'TOKEN_EXPIRED');
    this.name = 'TokenExpiredError';
  }
}

export class TokenRefreshError extends OAuthError {
  constructor(message: string = 'Failed to refresh access token') {
    super(message, 'TOKEN_REFRESH_FAILED');
    this.name = 'TokenRefreshError';
  }
}

// Account Errors
export class AccountError extends MetaError {
  constructor(message: string, code: string = 'ACCOUNT_ERROR') {
    super(message, code, 400);
    this.name = 'AccountError';
  }
}

export class AccountNotFoundError extends AccountError {
  constructor(accountId: string) {
    super(`Account not found: ${accountId}`, 'ACCOUNT_NOT_FOUND');
    this.name = 'AccountNotFoundError';
  }
}

export class AccountNotConnectedError extends AccountError {
  constructor() {
    super('No Instagram account connected', 'ACCOUNT_NOT_CONNECTED');
    this.name = 'AccountNotConnectedError';
  }
}

export class NoInstagramAccountError extends AccountError {
  constructor() {
    super(
      'No Instagram Business or Creator account found. Please ensure your Instagram account is connected to a Facebook Page.',
      'NO_INSTAGRAM_ACCOUNT'
    );
    this.name = 'NoInstagramAccountError';
  }
}

// Publishing Errors
export class PublishingError extends MetaError {
  constructor(message: string, code: string = 'PUBLISHING_ERROR') {
    super(message, code, 400);
    this.name = 'PublishingError';
  }
}

export class ContainerCreationError extends PublishingError {
  constructor(message: string) {
    super(`Failed to create media container: ${message}`, 'CONTAINER_CREATION_FAILED');
    this.name = 'ContainerCreationError';
  }
}

export class ContainerNotReadyError extends PublishingError {
  constructor(containerId: string) {
    super(`Media container not ready: ${containerId}`, 'CONTAINER_NOT_READY');
    this.name = 'ContainerNotReadyError';
  }
}

export class MediaPublishError extends PublishingError {
  constructor(message: string) {
    super(`Failed to publish media: ${message}`, 'MEDIA_PUBLISH_FAILED');
    this.name = 'MediaPublishError';
  }
}

export class RateLimitError extends PublishingError {
  constructor() {
    super(
      'Rate limit exceeded. Maximum 25 API-published posts per 24 hours.',
      'RATE_LIMIT_EXCEEDED'
    );
    this.name = 'RateLimitError';
  }
}

// Validation Errors
export class ValidationError extends MetaError {
  constructor(message: string, code: string = 'VALIDATION_ERROR') {
    super(message, code, 400);
    this.name = 'ValidationError';
  }
}

export class CaptionTooLongError extends ValidationError {
  constructor() {
    super('Caption cannot exceed 2200 characters', 'CAPTION_TOO_LONG');
    this.name = 'CaptionTooLongError';
  }
}

export class TooManyHashtagsError extends ValidationError {
  constructor() {
    super('Caption cannot have more than 30 hashtags', 'TOO_MANY_HASHTAGS');
    this.name = 'TooManyHashtagsError';
  }
}

export class InvalidMediaUrlError extends ValidationError {
  constructor(url: string) {
    super(`Invalid media URL: ${url}`, 'INVALID_MEDIA_URL');
    this.name = 'InvalidMediaUrlError';
  }
}

// API Errors
export class MetaApiError extends MetaError {
  constructor(
    message: string,
    public readonly metaErrorCode?: number,
    public readonly metaErrorSubcode?: number,
    public readonly fbTraceId?: string
  ) {
    super(message, 'META_API_ERROR', 502);
    this.name = 'MetaApiError';
  }

  static fromApiResponse(error: {
    message: string;
    code?: number;
    error_subcode?: number;
    fbtrace_id?: string;
  }): MetaApiError {
    return new MetaApiError(
      error.message,
      error.code,
      error.error_subcode,
      error.fbtrace_id
    );
  }
}
