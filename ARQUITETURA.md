# Arquitetura Feature-Based - Symphony

## Visão Geral

O Symphony utiliza uma **Arquitetura Baseada em Features** (Feature-Based Architecture), organizando o código por domínio de negócio ao invés de tipo técnico. Esta abordagem promove alta coesão, baixo acoplamento e facilita a escalabilidade.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SYMPHONY APP                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         src/app/ (Next.js App Router)                │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │ dashboard│ │onboarding│ │  sign-in │ │  sign-up │ │   api/   │   │    │
│  │  │  /pages  │ │  /pages  │ │  /page   │ │  /page   │ │  routes  │   │    │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │    │
│  └───────┼────────────┼────────────┼────────────┼────────────┼─────────┘    │
│          │            │            │            │            │               │
│          ▼            ▼            ▼            ▼            ▼               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      src/features/ (Feature Modules)                 │    │
│  │                                                                      │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │    │
│  │  │briefing │ │calendar │ │  chat   │ │ content │ │dashboard│       │    │
│  │  ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤       │    │
│  │  │components│ │components│ │components│ │components│ │components│       │    │
│  │  │  hooks  │ │  hooks  │ │         │ │         │ │         │       │    │
│  │  │ services│ │ services│ │         │ │         │ │         │       │    │
│  │  │  types  │ │  types  │ │         │ │         │ │         │       │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │    │
│  │                                                                      │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │    │
│  │  │ kanban  │ │onboarding│ │references│ │ reports │ │settings │       │    │
│  │  ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤       │    │
│  │  │components│ │components│ │components│ │components│ │components│       │    │
│  │  │  hooks  │ │  hooks  │ │  hooks  │ │         │ │         │       │    │
│  │  │ services│ │ services│ │ services│ │         │ │         │       │    │
│  │  │  types  │ │  types  │ │  types  │ │         │ │         │       │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │    │
│  │                                                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │                         social                               │   │    │
│  │  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐ │   │    │
│  │  │  │ components│  │   hooks   │  │  services │  │   types   │ │   │    │
│  │  │  │           │  │useLate    │  │lateService│  │ platform  │ │   │    │
│  │  │  │           │  │Profile    │  │           │  │  types    │ │   │    │
│  │  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘ │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│          │                                                                   │
│          ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                       src/shared/ (Shared Modules)                   │    │
│  │                                                                      │    │
│  │  ┌──────────────────────────────────────────────────────────────┐   │    │
│  │  │                        components/                            │   │    │
│  │  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │   │    │
│  │  │  │   ui   │ │ layout │ │  auth  │ │background│ │ charts │     │   │    │
│  │  │  │Button  │ │Sidebar │ │Protected│ │NebulaBG │ │Audience│     │   │    │
│  │  │  │Card    │ │Topbar  │ │Route   │ │Golden   │ │Chart   │     │   │    │
│  │  │  │Badge   │ │Dashboard│ │Feature │ │Oracle  │ │        │     │   │    │
│  │  │  │Input   │ │Layout  │ │        │ │        │ │        │     │   │    │
│  │  │  │Modal   │ │MobileNav│ │        │ │        │ │        │     │   │    │
│  │  │  │Tabs    │ │        │ │        │ │        │ │        │     │   │    │
│  │  │  │Skeleton│ │        │ │        │ │        │ │        │     │   │    │
│  │  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │   │    │
│  │  └──────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │    │
│  │  │ hooks  │ │  types │ │  utils │ │constants│ │contexts│            │    │
│  │  │useApi  │ │        │ │        │ │        │ │        │            │    │
│  │  │usePerms│ │        │ │        │ │        │ │        │            │    │
│  │  │useDate │ │        │ │        │ │        │ │        │            │    │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│          │                                                                   │
│          ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                       src/services/ (Global Services)                │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │    │
│  │  │      api/      │  │     auth/      │  │    storage/    │         │    │
│  │  │   apiClient    │  │                │  │                │         │    │
│  │  │   (Axios)      │  │                │  │                │         │    │
│  │  └────────────────┘  └────────────────┘  └────────────────┘         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Estrutura de Diretórios

```
src/
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API Routes (BFF)
│   │   ├── meta/                 # Meta/Facebook API
│   │   ├── proxy/                # Proxy para backend
│   │   └── social/               # Social media API
│   ├── dashboard/                # Páginas do dashboard
│   │   ├── briefing/
│   │   ├── calendar/
│   │   ├── clients/
│   │   ├── comments/
│   │   ├── content/
│   │   ├── debug/
│   │   ├── referencias/
│   │   ├── reports/
│   │   └── settings/
│   ├── onboarding/               # Fluxo de onboarding
│   ├── sign-in/                  # Autenticação (Clerk)
│   ├── sign-up/
│   └── login/
│
├── features/                     # 🎯 MÓDULOS DE FEATURES
│   ├── briefing/                 # Briefing e análises
│   │   ├── components/
│   │   └── index.ts
│   ├── calendar/                 # Calendário de conteúdo
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── chat/                     # Chat e Oracle AI
│   │   ├── components/
│   │   └── index.ts
│   ├── content/                  # Criação de conteúdo
│   │   ├── components/
│   │   └── index.ts
│   ├── dashboard/                # Widgets do dashboard
│   │   ├── components/
│   │   └── index.ts
│   ├── kanban/                   # Quadro Kanban
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── onboarding/               # Fluxo de onboarding
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── constants/
│   │   └── index.ts
│   ├── references/               # Referências de conteúdo
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── reports/                  # Relatórios e analytics
│   │   ├── components/
│   │   └── index.ts
│   ├── settings/                 # Configurações
│   │   ├── components/
│   │   └── index.ts
│   ├── social/                   # Integração redes sociais
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── constants/
│   │   └── index.ts
│   └── index.ts
│
├── shared/                       # 🔧 MÓDULOS COMPARTILHADOS
│   ├── components/
│   │   ├── ui/                   # Componentes base (Button, Card, etc)
│   │   ├── layout/               # Layout (Sidebar, Topbar, etc)
│   │   ├── auth/                 # Componentes de autenticação
│   │   ├── background/           # Backgrounds animados
│   │   ├── charts/               # Gráficos reutilizáveis
│   │   ├── lazy/                 # Componentes lazy-loaded
│   │   └── index.ts
│   ├── hooks/                    # Hooks compartilhados
│   ├── types/                    # Tipos globais
│   ├── utils/                    # Utilitários
│   ├── constants/                # Constantes globais
│   ├── contexts/                 # Contexts compartilhados
│   ├── config/                   # Configurações
│   ├── lib/                      # Bibliotecas internas
│   └── index.ts
│
├── services/                     # 🌐 SERVIÇOS GLOBAIS
│   ├── api/                      # Cliente HTTP (Axios)
│   ├── auth/                     # Serviços de autenticação
│   ├── storage/                  # Serviços de storage
│   └── index.ts
│
├── context/                      # React Contexts
│   ├── LanguageContext.tsx       # i18n
│   ├── ClientContext.tsx         # Dados do cliente
│   ├── ChatContentContext.tsx    # Estado do chat
│   └── MobileNavContext.tsx      # Navegação mobile
│
├── config/                       # Configurações da app
│   └── navigation.ts             # Estrutura de navegação
│
├── lib/                          # Utilitários e clients
│   ├── api.ts
│   ├── date.ts
│   ├── translations.ts
│   ├── utils.ts
│   └── supabase/
│
├── data/                         # Dados mock/estáticos
│
├── components/                   # ⚠️ LEGACY (re-exports)
│   └── [category]/index.ts       # Redirecionam para features/shared
│
└── types/                        # ⚠️ LEGACY (re-exports)
```

---

## Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@features/*": ["./src/features/*"],
      "@services/*": ["./src/services/*"],
      "@shared/*": ["./src/shared/*"]
    }
  }
}
```

---

## Padrões de Import

### ✅ Imports Corretos

```typescript
// Componentes de UI (shared)
import { Button, Card, Badge, Modal } from '@shared/components/ui';
import { Sidebar, Topbar, DashboardLayout } from '@shared/components/layout';

// Componentes de Feature
import { Calendar, CalendarViewContainer } from '@features/calendar/components';
import { KanbanBoard, KanbanColumn } from '@features/kanban/components';
import { BriefingSummary, ProfileAudit } from '@features/briefing/components';

// Hooks de Feature
import { useLateProfile } from '@features/social/hooks';
import { useOnboarding } from '@features/onboarding/hooks';
import { useCalendarEvents } from '@features/calendar/hooks';

// Services de Feature
import { lateService } from '@features/social/services';

// Hooks Compartilhados
import { useApi, usePermissions, useDate } from '@shared/hooks';

// Services Globais
import { apiClient } from '@services/api';

// Contexts
import { useLanguage } from '@/context/LanguageContext';
import { useClient } from '@/context/ClientContext';
```

### ❌ Imports Legados (Evitar)

```typescript
// Não usar - paths antigos
import { Button } from '@/components/ui';        // Use @shared/components/ui
import { Calendar } from '@/components/calendar'; // Use @features/calendar/components
import api from '@/lib/api';                      // Use @services/api
```

---

## Estrutura de uma Feature

Cada feature segue este template padrão:

```
feature-name/
├── components/           # Componentes React da feature
│   ├── index.ts         # Barrel export
│   ├── ComponentA.tsx
│   └── ComponentB.tsx
│
├── hooks/               # Hooks específicos da feature
│   ├── index.ts         # Barrel export
│   └── useFeatureName.ts
│
├── services/            # Serviços/API da feature
│   ├── index.ts         # Barrel export
│   └── featureService.ts
│
├── types/               # TypeScript types da feature
│   ├── index.ts         # Barrel export
│   └── feature.ts
│
├── constants/           # Constantes da feature
│   └── index.ts
│
└── index.ts             # Barrel export principal
```

### Exemplo: Feature Social

```typescript
// src/features/social/index.ts
export * from './components';
export * from './hooks';
export * from './services';
export * from './types';
export * from './constants';

// src/features/social/hooks/index.ts
export { useLateProfile } from './useLateProfile';

// src/features/social/services/index.ts
export { lateService, LateService } from './lateService';
```

---

## Features do Sistema

### 1. **Briefing** (`@features/briefing`)
Análise e relatórios de briefing de contas.

**Componentes:**
- `BriefingSummary` - Resumo do briefing
- `ReferencesAnalysis` - Análise de referências
- `CompetitorAnalysis` - Análise de competidores
- `ProfileAudit` - Auditoria de perfil

### 2. **Calendar** (`@features/calendar`)
Calendário de conteúdo e agendamento.

**Componentes:**
- `Calendar` - Calendário principal
- `CalendarViewContainer` - Container de visualização
- `CreateEventModal` - Modal de criação de evento
- `AddContentModal` - Modal de adicionar conteúdo

**Hooks:**
- `useCalendarEvents` - Gerenciamento de eventos

### 3. **Chat** (`@features/chat`)
Interface de chat e Oracle AI.

**Componentes:**
- `MiniOracle` - Oracle compacto
- `FloatingChat` - Chat flutuante
- `FloatingOracle` - Oracle flutuante

### 4. **Content** (`@features/content`)
Criação e gestão de conteúdo.

**Componentes:**
- `HarmoniaChat` - Chat com Harmonia AI
- `YouTubeShortsTab` - Tab de YouTube Shorts
- `TikTokTab` - Tab de TikTok
- `ContentInteractionOrb` - Orb de interação
- `ContentInteractionModal` - Modal de interação

### 5. **Dashboard** (`@features/dashboard`)
Widgets e componentes do dashboard.

**Componentes:**
- `ReferencesShowcase` - Showcase de referências
- `RecentPostsShowcase` - Posts recentes
- `UpcomingPostsShowcase` - Próximos posts
- `CopyStrategyModal` - Modal de estratégia de copy
- `PendingApprovals` - Aprovações pendentes

### 6. **Kanban** (`@features/kanban`)
Quadro Kanban para gestão de conteúdo.

**Componentes:**
- `KanbanBoard` - Quadro principal
- `KanbanColumn` - Coluna do kanban
- `KanbanCard` - Card de item

**Hooks:**
- `useKanban` - Gerenciamento do kanban

### 7. **Onboarding** (`@features/onboarding`)
Fluxo de onboarding de usuários.

**Componentes:**
- `OnboardingLayout` - Layout do onboarding
- `BriefingPreview` - Preview do briefing
- `FieldComments` - Comentários de campos

**Hooks:**
- `useOnboarding` - Estado do onboarding
- `useVoiceInput` - Input por voz

### 8. **References** (`@features/references`)
Gestão de referências de conteúdo.

**Estrutura:** Preparada para expansão

### 9. **Reports** (`@features/reports`)
Relatórios e analytics.

**Componentes:**
- `FollowersChart` - Gráfico de seguidores
- `EngagementChart` - Gráfico de engajamento
- `TopPostsRanking` - Ranking de posts
- `PostsPerformanceChart` - Performance de posts

### 10. **Settings** (`@features/settings`)
Configurações do usuário.

**Componentes:**
- `GeneralSettings` - Configurações gerais
- `LanguageSelector` - Seletor de idioma
- `PreferencesSettings` - Preferências
- `PlatformIntegrations` - Integrações de plataforma

### 11. **Social** (`@features/social`)
Integração com redes sociais (Late API).

**Hooks:**
- `useLateProfile` - Gerenciamento de perfil Late

**Services:**
- `lateService` - Cliente da Late API

**Plataformas Suportadas:**
- Instagram, TikTok, YouTube, Facebook
- LinkedIn, Twitter/X, Threads, Pinterest
- Reddit, Bluesky, Telegram, Snapchat
- Google Business

---

## Shared Modules

### Components (`@shared/components`)

| Módulo | Componentes |
|--------|-------------|
| **ui** | Button, Badge, Card, Input, Modal, Tabs, Skeleton, EmptyState, StatsCard, HolographicSphere |
| **layout** | Sidebar, Topbar, DashboardLayout, MobileNav |
| **auth** | ProtectedFeature, ProtectedRoute |
| **background** | NebulaBG, GoldenOracle |
| **charts** | AudienceChart |
| **lazy** | Componentes lazy-loaded |

### Hooks (`@shared/hooks`)

| Hook | Descrição |
|------|-----------|
| `useApi` | Chamadas HTTP com loading/error states |
| `usePermissions` | Verificação de permissões |
| `useDate` | Utilitários de data |
| `useFileUpload` | Upload de arquivos |

---

## Services Globais

### API Client (`@services/api`)

```typescript
import { apiClient } from '@services/api';

// Uso
const response = await apiClient.get('/endpoint');
const data = await apiClient.post('/endpoint', payload);
```

**Características:**
- Base URL: `/api/proxy` (BFF pattern)
- Interceptors para token (Clerk)
- Tratamento automático de erros

---

## Fluxo de Dados

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Page       │────▶│   Feature    │────▶│   Shared     │
│ (app router) │     │ (components, │     │ (ui, hooks,  │
│              │     │  hooks,      │     │  utils)      │
│              │     │  services)   │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       │                    ▼                    │
       │            ┌──────────────┐             │
       │            │   Services   │             │
       │            │ (apiClient,  │             │
       │            │  auth,       │             │
       │            │  storage)    │             │
       │            └──────────────┘             │
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────┐
│                    External APIs                     │
│         (Late API, Meta API, Supabase)              │
└─────────────────────────────────────────────────────┘
```

---

## Tecnologias

| Categoria | Tecnologia |
|-----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Linguagem** | TypeScript |
| **Styling** | TailwindCSS |
| **Auth** | Clerk |
| **Database** | Supabase |
| **HTTP Client** | Axios |
| **i18n** | Custom (LanguageContext) |

---

## Re-exports para Backward Compatibility

Os arquivos em `src/components/[category]/index.ts` fazem re-export das novas localizações para manter compatibilidade com imports antigos:

```typescript
// src/components/briefing/index.ts
export * from '@/features/briefing/components';

// src/components/ui/index.ts
export * from '@/shared/components/ui';
```

**Nota:** Estes re-exports serão removidos gradualmente conforme os imports forem atualizados.

---

## Criando uma Nova Feature

1. **Criar estrutura de diretórios:**
```bash
mkdir -p src/features/nova-feature/{components,hooks,services,types,constants}
```

2. **Criar barrel exports:**
```typescript
// src/features/nova-feature/components/index.ts
export { MeuComponente } from './MeuComponente';

// src/features/nova-feature/index.ts
export * from './components';
export * from './hooks';
export * from './services';
export * from './types';
export * from './constants';
```

3. **Atualizar feature index (opcional):**
```typescript
// src/features/index.ts
export * from './nova-feature';
```

---

## Build Status

✅ **Build: PASSING**
- 23 páginas compiladas
- 0 erros de TypeScript
- 0 warnings de lint

---

*Documentação gerada em: Janeiro 2025*
*Versão da Arquitetura: 2.0 (Feature-Based)*
