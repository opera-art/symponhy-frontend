import { SupabaseClient } from '@supabase/supabase-js';
import { ConnectedAccount, ConnectedAccountProps } from '../../domain/entities';
import { IConnectedAccountRepository } from '../../domain/repositories';

/**
 * Implementação do repositório de contas conectadas usando Supabase
 *
 * Tabela esperada: meta_connected_accounts
 */
export class SupabaseConnectedAccountRepository implements IConnectedAccountRepository {
  private readonly tableName = 'meta_connected_accounts';

  constructor(private supabase: SupabaseClient) {}

  async findById(id: string): Promise<ConnectedAccount | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async findByIgUserId(igUserId: string): Promise<ConnectedAccount | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('ig_user_id', igUserId)
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async findByUserId(userId: string): Promise<ConnectedAccount[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('connected_at', { ascending: false });

    if (error || !data) return [];
    return data.map((row) => this.mapToEntity(row));
  }

  async findByOrganizationId(organizationId: string): Promise<ConnectedAccount[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('connected_at', { ascending: false });

    if (error || !data) return [];
    return data.map((row) => this.mapToEntity(row));
  }

  async findByUserAndIgUserId(
    userId: string,
    igUserId: string
  ): Promise<ConnectedAccount | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('ig_user_id', igUserId)
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async findWithExpiringTokens(daysThreshold: number): Promise<ConnectedAccount[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('is_active', true)
      .lt('token_expires_at', thresholdDate.toISOString())
      .gt('token_expires_at', new Date().toISOString());

    if (error || !data) return [];
    return data.map((row) => this.mapToEntity(row));
  }

  async findActiveAccounts(): Promise<ConnectedAccount[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('is_active', true)
      .gt('token_expires_at', new Date().toISOString());

    if (error || !data) return [];
    return data.map((row) => this.mapToEntity(row));
  }

  async save(account: ConnectedAccount): Promise<void> {
    const data = this.mapToRow(account);

    const { error } = await this.supabase
      .from(this.tableName)
      .upsert(data, { onConflict: 'id' });

    if (error) {
      throw new Error(`Failed to save connected account: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete connected account: ${error.message}`);
    }
  }

  async updateToken(id: string, accessToken: string, expiresAt: Date): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({
        access_token: accessToken,
        token_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update token: ${error.message}`);
    }
  }

  // Mappers
  private mapToEntity(row: Record<string, unknown>): ConnectedAccount {
    const props: ConnectedAccountProps = {
      id: row.id as string,
      userId: row.user_id as string,
      organizationId: row.organization_id as string | undefined,
      igUserId: row.ig_user_id as string,
      username: row.username as string,
      profilePictureUrl: row.profile_picture_url as string | undefined,
      followersCount: row.followers_count as number | undefined,
      accountType: row.account_type as 'BUSINESS' | 'CREATOR',
      pageId: row.page_id as string,
      pageName: row.page_name as string | undefined,
      accessToken: row.access_token as string,
      tokenExpiresAt: new Date(row.token_expires_at as string),
      isActive: row.is_active as boolean,
      connectedAt: new Date(row.connected_at as string),
      updatedAt: new Date(row.updated_at as string),
    };

    return ConnectedAccount.fromJSON(props);
  }

  private mapToRow(account: ConnectedAccount): Record<string, unknown> {
    const json = account.toJSON();
    return {
      id: json.id,
      user_id: json.userId,
      organization_id: json.organizationId,
      ig_user_id: json.igUserId,
      username: json.username,
      profile_picture_url: json.profilePictureUrl,
      followers_count: json.followersCount,
      account_type: json.accountType,
      page_id: json.pageId,
      page_name: json.pageName,
      access_token: json.accessToken,
      token_expires_at: json.tokenExpiresAt.toISOString(),
      is_active: json.isActive,
      connected_at: json.connectedAt.toISOString(),
      updated_at: json.updatedAt.toISOString(),
    };
  }
}
