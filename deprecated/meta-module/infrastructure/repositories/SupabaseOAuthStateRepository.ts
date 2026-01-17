import { SupabaseClient } from '@supabase/supabase-js';
import { OAuthState, OAuthStateProps } from '../../domain/entities';
import { IOAuthStateRepository } from '../../domain/repositories';

/**
 * Implementação do repositório de OAuth State usando Supabase
 *
 * Tabela esperada: meta_oauth_states
 */
export class SupabaseOAuthStateRepository implements IOAuthStateRepository {
  private readonly tableName = 'meta_oauth_states';

  constructor(private supabase: SupabaseClient) {}

  async findByState(state: string): Promise<OAuthState | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('state', state)
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async findById(id: string): Promise<OAuthState | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async save(oauthState: OAuthState): Promise<void> {
    const data = this.mapToRow(oauthState);

    const { error } = await this.supabase
      .from(this.tableName)
      .upsert(data, { onConflict: 'id' });

    if (error) {
      throw new Error(`Failed to save OAuth state: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete OAuth state: ${error.message}`);
    }
  }

  async deleteExpired(): Promise<number> {
    const now = new Date().toISOString();

    const { data, error } = await this.supabase
      .from(this.tableName)
      .delete()
      .lt('expires_at', now)
      .select('id');

    if (error) {
      throw new Error(`Failed to delete expired OAuth states: ${error.message}`);
    }

    return data?.length || 0;
  }

  async markAsUsed(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ used_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to mark OAuth state as used: ${error.message}`);
    }
  }

  // Mappers
  private mapToEntity(row: Record<string, unknown>): OAuthState {
    const props: OAuthStateProps = {
      id: row.id as string,
      state: row.state as string,
      userId: row.user_id as string,
      organizationId: row.organization_id as string | undefined,
      redirectUrl: row.redirect_url as string | undefined,
      expiresAt: new Date(row.expires_at as string),
      createdAt: new Date(row.created_at as string),
      usedAt: row.used_at ? new Date(row.used_at as string) : undefined,
    };

    return OAuthState.fromJSON(props);
  }

  private mapToRow(oauthState: OAuthState): Record<string, unknown> {
    const json = oauthState.toJSON();
    return {
      id: json.id,
      state: json.state,
      user_id: json.userId,
      organization_id: json.organizationId,
      redirect_url: json.redirectUrl,
      expires_at: json.expiresAt.toISOString(),
      created_at: json.createdAt.toISOString(),
      used_at: json.usedAt?.toISOString(),
    };
  }
}
