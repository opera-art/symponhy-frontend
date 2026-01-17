import { NextRequest, NextResponse } from 'next/server';
import { getMetaUseCases } from './factory';
import { CreateScheduledPostInput } from '../../application/dtos';
import {
  AccountNotFoundError,
  TokenExpiredError,
  RateLimitError,
  ValidationError,
} from '../../domain/errors';

/**
 * Handler para criar post agendado
 * POST /api/meta/posts
 */
export async function handleCreatePost(
  request: NextRequest,
  userId: string
): Promise<NextResponse> {
  try {
    const body = await request.json();

    const input: CreateScheduledPostInput = {
      accountId: body.accountId,
      userId,
      mediaUrls: body.mediaUrls,
      caption: body.caption,
      mediaType: body.mediaType,
      scheduledFor: new Date(body.scheduledFor),
      timezone: body.timezone,
      thumbnailUrl: body.thumbnailUrl,
    };

    const { createScheduledPost } = getMetaUseCases();

    const result = await createScheduledPost.execute(input);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Failed to create scheduled post:', error);

    if (error instanceof AccountNotFoundError) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    if (error instanceof TokenExpiredError) {
      return NextResponse.json(
        { error: 'Token expired. Please reconnect your account.' },
        { status: 401 }
      );
    }

    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { error: error.message },
        { status: 429 }
      );
    }

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create scheduled post' },
      { status: 500 }
    );
  }
}

/**
 * Handler para listar posts agendados
 * GET /api/meta/posts
 */
export async function handleGetPosts(
  request: NextRequest,
  userId: string
): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filter = {
      userId,
      accountId: searchParams.get('accountId') || undefined,
      status: searchParams.get('status') as any || undefined,
      startDate: searchParams.get('startDate')
        ? new Date(searchParams.get('startDate')!)
        : undefined,
      endDate: searchParams.get('endDate')
        ? new Date(searchParams.get('endDate')!)
        : undefined,
      page: searchParams.get('page')
        ? parseInt(searchParams.get('page')!)
        : 1,
      pageSize: searchParams.get('pageSize')
        ? parseInt(searchParams.get('pageSize')!)
        : 20,
    };

    const { getScheduledPosts } = getMetaUseCases();

    const result = await getScheduledPosts.execute(filter);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to get scheduled posts:', error);

    return NextResponse.json(
      { error: 'Failed to get scheduled posts' },
      { status: 500 }
    );
  }
}

/**
 * Handler para cancelar post agendado
 * DELETE /api/meta/posts/[postId]
 */
export async function handleCancelPost(
  request: NextRequest,
  userId: string,
  postId: string
): Promise<NextResponse> {
  try {
    const { cancelScheduledPost } = getMetaUseCases();

    const result = await cancelScheduledPost.execute({
      postId,
      userId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to cancel post:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to cancel post' },
      { status: 500 }
    );
  }
}
