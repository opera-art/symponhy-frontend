import { SupabaseClient } from '@supabase/supabase-js';
import { ScheduledPost, ScheduledPostProps } from '../../domain/entities';
import { IScheduledPostRepository } from '../../domain/repositories';
import { PostStatusValue, MediaTypeValue } from '../../domain/value-objects';

/**
 * Implementação do repositório de posts agendados usando Supabase
 *
 * Tabela esperada: meta_scheduled_posts
 */
export class SupabaseScheduledPostRepository implements IScheduledPostRepository {
  private readonly tableName = 'meta_scheduled_posts';

  constructor(private supabase: SupabaseClient) {}

  async findById(id: string): Promise<ScheduledPost | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async findByAccountId(accountId: string): Promise<ScheduledPost[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('account_id', accountId)
      .order('scheduled_for', { ascending: true });

    if (error || !data) return [];
    return data.map((row) => this.mapToEntity(row));
  }

  async findByUserId(userId: string): Promise<ScheduledPost[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_for', { ascending: true });

    if (error || !data) return [];
    return data.map((row) => this.mapToEntity(row));
  }

  async findByStatus(status: PostStatusValue): Promise<ScheduledPost[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('status', status)
      .order('scheduled_for', { ascending: true });

    if (error || !data) return [];
    return data.map((row) => this.mapToEntity(row));
  }

  async findDuePosts(): Promise<ScheduledPost[]> {
    const now = new Date().toISOString();

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('status', 'PENDING')
      .lte('scheduled_for', now)
      .order('scheduled_for', { ascending: true });

    if (error || !data) return [];
    return data.map((row) => this.mapToEntity(row));
  }

  async findScheduledBetween(startDate: Date, endDate: Date): Promise<ScheduledPost[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .gte('scheduled_for', startDate.toISOString())
      .lte('scheduled_for', endDate.toISOString())
      .order('scheduled_for', { ascending: true });

    if (error || !data) return [];
    return data.map((row) => this.mapToEntity(row));
  }

  async findByAccountAndDateRange(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ScheduledPost[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('account_id', accountId)
      .gte('scheduled_for', startDate.toISOString())
      .lte('scheduled_for', endDate.toISOString())
      .order('scheduled_for', { ascending: true });

    if (error || !data) return [];
    return data.map((row) => this.mapToEntity(row));
  }

  async countPublishedInLast24Hours(accountId: string): Promise<number> {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('account_id', accountId)
      .eq('status', 'PUBLISHED')
      .gte('published_at', twentyFourHoursAgo.toISOString());

    if (error) return 0;
    return count || 0;
  }

  async save(post: ScheduledPost): Promise<void> {
    const data = this.mapToRow(post);

    const { error } = await this.supabase
      .from(this.tableName)
      .upsert(data, { onConflict: 'id' });

    if (error) {
      throw new Error(`Failed to save scheduled post: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete scheduled post: ${error.message}`);
    }
  }

  async updateStatus(
    id: string,
    status: PostStatusValue,
    publishedMediaId?: string,
    errorMessage?: string
  ): Promise<void> {
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (publishedMediaId) {
      updateData.published_media_id = publishedMediaId;
      updateData.published_at = new Date().toISOString();
    }

    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    const { error } = await this.supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update post status: ${error.message}`);
    }
  }

  // Mappers
  private mapToEntity(row: Record<string, unknown>): ScheduledPost {
    const props: ScheduledPostProps = {
      id: row.id as string,
      accountId: row.account_id as string,
      userId: row.user_id as string,
      mediaUrls: row.media_urls as string[],
      caption: row.caption as string,
      mediaType: row.media_type as MediaTypeValue,
      thumbnailUrl: row.thumbnail_url as string | undefined,
      scheduledFor: new Date(row.scheduled_for as string),
      timezone: row.timezone as string,
      status: row.status as PostStatusValue,
      containerId: row.container_id as string | undefined,
      publishedMediaId: row.published_media_id as string | undefined,
      publishedAt: row.published_at
        ? new Date(row.published_at as string)
        : undefined,
      errorMessage: row.error_message as string | undefined,
      retryCount: row.retry_count as number,
      lastRetryAt: row.last_retry_at
        ? new Date(row.last_retry_at as string)
        : undefined,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };

    return ScheduledPost.fromJSON(props);
  }

  private mapToRow(post: ScheduledPost): Record<string, unknown> {
    const json = post.toJSON();
    return {
      id: json.id,
      account_id: json.accountId,
      user_id: json.userId,
      media_urls: json.mediaUrls,
      caption: json.caption,
      media_type: json.mediaType,
      thumbnail_url: json.thumbnailUrl,
      scheduled_for: json.scheduledFor.toISOString(),
      timezone: json.timezone,
      status: json.status,
      container_id: json.containerId,
      published_media_id: json.publishedMediaId,
      published_at: json.publishedAt?.toISOString(),
      error_message: json.errorMessage,
      retry_count: json.retryCount,
      last_retry_at: json.lastRetryAt?.toISOString(),
      created_at: json.createdAt.toISOString(),
      updated_at: json.updatedAt.toISOString(),
    };
  }
}
