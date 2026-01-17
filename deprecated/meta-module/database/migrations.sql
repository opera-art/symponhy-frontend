-- =====================================================
-- Meta Integration Database Schema
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- Tabela: meta_connected_accounts
-- Armazena as contas do Instagram conectadas
CREATE TABLE IF NOT EXISTS meta_connected_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,  -- ID do usuário no Clerk
    organization_id TEXT,   -- ID da organização (opcional)

    -- Instagram Account Info
    ig_user_id TEXT NOT NULL,
    username TEXT NOT NULL,con
    profile_picture_url TEXT,
    followers_count INTEGER,
    account_type TEXT NOT NULL CHECK (account_type IN ('BUSINESS', 'CREATOR')),

    -- Facebook Page Info
    page_id TEXT NOT NULL,
    page_name TEXT,

    -- Token (criptografado)
    access_token TEXT NOT NULL,
    token_expires_at TIMESTAMPTZ NOT NULL,

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Timestamps
    connected_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    UNIQUE(user_id, ig_user_id)
);

-- Índices para meta_connected_accounts
CREATE INDEX IF NOT EXISTS idx_connected_accounts_user_id ON meta_connected_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_org_id ON meta_connected_accounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_ig_user_id ON meta_connected_accounts(ig_user_id);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_token_expires ON meta_connected_accounts(token_expires_at);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_is_active ON meta_connected_accounts(is_active);

-- =====================================================

-- Tabela: meta_scheduled_posts
-- Armazena os posts agendados
CREATE TABLE IF NOT EXISTS meta_scheduled_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES meta_connected_accounts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,  -- ID do usuário que criou

    -- Content
    media_urls TEXT[] NOT NULL,
    caption TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('IMAGE', 'VIDEO', 'CAROUSEL', 'STORY', 'REEL')),
    thumbnail_url TEXT,

    -- Scheduling
    scheduled_for TIMESTAMPTZ NOT NULL,
    timezone TEXT DEFAULT 'America/Sao_Paulo',

    -- Publishing State
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED', 'CANCELLED')),
    container_id TEXT,
    published_media_id TEXT,
    published_at TIMESTAMPTZ,

    -- Error Handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    last_retry_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para meta_scheduled_posts
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_account_id ON meta_scheduled_posts(account_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user_id ON meta_scheduled_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON meta_scheduled_posts(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_for ON meta_scheduled_posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_due ON meta_scheduled_posts(status, scheduled_for) WHERE status = 'PENDING';

-- =====================================================

-- Tabela: meta_oauth_states
-- Armazena estados OAuth para proteção CSRF
CREATE TABLE IF NOT EXISTS meta_oauth_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    organization_id TEXT,
    redirect_url TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ
);

-- Índices para meta_oauth_states
CREATE INDEX IF NOT EXISTS idx_oauth_states_state ON meta_oauth_states(state);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expires ON meta_oauth_states(expires_at);

-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_connected_accounts_updated_at ON meta_connected_accounts;
CREATE TRIGGER update_connected_accounts_updated_at
    BEFORE UPDATE ON meta_connected_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_scheduled_posts_updated_at ON meta_scheduled_posts;
CREATE TRIGGER update_scheduled_posts_updated_at
    BEFORE UPDATE ON meta_scheduled_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================

-- RLS (Row Level Security) - Opcional mas recomendado

-- Habilitar RLS
ALTER TABLE meta_connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_oauth_states ENABLE ROW LEVEL SECURITY;

-- Políticas para meta_connected_accounts
-- Usuários podem ver apenas suas próprias contas
CREATE POLICY "Users can view own accounts"
    ON meta_connected_accounts FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own accounts"
    ON meta_connected_accounts FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own accounts"
    ON meta_connected_accounts FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own accounts"
    ON meta_connected_accounts FOR DELETE
    USING (auth.uid()::text = user_id);

-- Políticas para meta_scheduled_posts
CREATE POLICY "Users can view own posts"
    ON meta_scheduled_posts FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own posts"
    ON meta_scheduled_posts FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own posts"
    ON meta_scheduled_posts FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own posts"
    ON meta_scheduled_posts FOR DELETE
    USING (auth.uid()::text = user_id);

-- Políticas para meta_oauth_states
CREATE POLICY "Users can manage own oauth states"
    ON meta_oauth_states FOR ALL
    USING (auth.uid()::text = user_id);

-- =====================================================
-- Service Role Access (para API routes do servidor)
-- Estas políticas permitem que o service role acesse tudo

CREATE POLICY "Service role full access to accounts"
    ON meta_connected_accounts FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to posts"
    ON meta_scheduled_posts FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to oauth states"
    ON meta_oauth_states FOR ALL
    USING (auth.role() = 'service_role');

-- =====================================================
-- Comentários nas tabelas

COMMENT ON TABLE meta_connected_accounts IS 'Contas do Instagram conectadas via Meta Graph API';
COMMENT ON TABLE meta_scheduled_posts IS 'Posts agendados para publicação no Instagram';
COMMENT ON TABLE meta_oauth_states IS 'Estados OAuth para proteção CSRF durante autenticação';
