# 🚀 ROADMAP DE EXPANSÃO - SYMPONHY

**Data**: 10 de Janeiro de 2026
**Status**: 📋 PLANEJAMENTO

---

## 🎯 NOVAS FUNCIONALIDADES SOLICITADAS

### PHASE 1: REORDENAÇÃO DO MENU ⭐ (15 min)
**Prioridade**: ALTA
**O que muda**:
- Dashboard (1º)
- **Calendário (2º)** ← Mover para cima
- Briefing (3º)
- Conteúdos (4º)
- Relatórios (5º)

**Ação**: Reordenar array `navItems` em `Sidebar.tsx`

---

### PHASE 2: CALENDAR KANBAN VIEW ⭐ (3h)
**Prioridade**: ALTA
**URL**: `/dashboard/calendar?view=kanban`

**Estrutura Kanban**:
```
Colunas (Drag & Drop):
├── 📝 Rascunho
├── ⏳ Agendado
├── ✅ Aprovado
├── 📤 Publicado
└── 🔄 Em Análise
```

**Componentes**:
- `KanbanBoard.tsx` - Container
- `KanbanColumn.tsx` - Coluna arrastável
- `KanbanCard.tsx` - Card arrastável
- Hook `useKanban.ts` - Lógica

**Library**: `react-beautiful-dnd`

---

### PHASE 3: YOUTUBE SHORTS ⭐ (4h)
**Prioridade**: ALTA
**Local**: `/dashboard/content` → Nova aba "YouTube Shorts"

**O que inclui**:
- Stats de YouTube (Total, Views, Engagement)
- Upload/Agendamento de Shorts
- **Sincronização com Instagram Reels** (checkbox "duplicar para YT")
- Análise de performance
- Comparativo IG Reels vs YT Shorts

**Dados**: Adicionar `youtubeStats` e `youtubeContent` ao mock

---

### PHASE 4: GESTÃO DE CLIENTES (AGÊNCIAS) ⭐ (3h)
**Prioridade**: MÉDIA
**URL**: `/dashboard/clients`

**Páginas**:
- Lista de clientes (cards grid)
- Modal criar/editar cliente
- Dashboard por cliente (seletor dropdown)

**Campos por cliente**:
- Nome, Email, Avatar
- Nicho/Segmento
- Instagram handle, YouTube channel
- Plataformas ativas
- Status (Ativo/Inativo)

**Componentes**:
- `ClientsPage.tsx`
- `ClientCard.tsx`
- `ClientModal.tsx`

---

### PHASE 5: BASE DE REFERÊNCIAS (MEGA) ⭐ (5h)
**Prioridade**: MUITO ALTA
**URL**: `/dashboard/references`

**Funcionalidade Principal**:
1. **Input**: Colar link do post/perfil
2. **Auto-análise com IA**:
   - Transcrição automática (se vídeo)
   - Extração automática de:
     * Formato (Post/Reel/Story/Short)
     * Copy/Texto
     * Hashtags
     * Música de fundo
     * Paleta de cores
     * Estilo de design
     * Métricas (likes, comments, views)

3. **Card de Referência** com:
   - Thumbnail
   - Metadados
   - Preview de copy/transcrição
   - Stats
   - Botões: Editar, Deletar, Copiar

4. **Grid/Coleções**:
   - Filtro por plataforma/tipo
   - Busca
   - Tags/Pastas

**Dados Mock**:
```typescript
interface Reference {
  id: string;
  originalUrl: string;
  platform: 'instagram' | 'youtube' | 'tiktok';
  type: 'post' | 'reel' | 'carousel' | 'story' | 'short';
  author: string;
  thumbnail: string;
  metrics: { likes, comments, views, saves };
  transcription?: string;
  copy: string;
  hashtags: string[];
  description: string;
  backgroundColor?: string;
  musicTrack?: string;
  duration?: number;
  tags: string[];
  createdAt: string;
}
```

**Componentes**:
- `ReferencesPage.tsx`
- `ReferenceForm.tsx` (paste link)
- `ReferenceCard.tsx`
- `ReferencesGrid.tsx`
- Hook `useReferenceAnalysis.ts`

---

### PHASE 6: FUNÇÃO COPIAR ⭐ (4h)
**Prioridade**: ALTA
**Integração**: Dentro de "Base de Referências"

**Fluxo**:
1. Usuário seleciona referência
2. Clica "Copiar"
3. Modal abre com:
   - Preview da referência
   - Campo "Contexto do seu nicho"
   - Toggle "Usar Harmonia AI"
   - Botão "Criar similar"

4. IA gera novo conteúdo:
   - Mesmo formato/estrutura
   - Adaptado ao nicho do cliente
   - Novo copy/roteiro
   - Hashtags relevantes
   - Design specs similares

5. Resultado:
   - Preview do novo conteúdo
   - Opção editar antes de salvar
   - Botão "Adicionar ao calendário"

**Componentes**:
- `CopyReferenceModal.tsx`
- `GenerateAIPreview.tsx`

---

### PHASE 7: DASHBOARD - ÚLTIMOS E PRÓXIMOS POSTS ⭐ (2h)
**Prioridade**: ALTA
**Local**: Adicionar seções ao `/dashboard` page

**Novas seções**:

**ÚLTIMOS POSTS**
- Grid 4 cols com últimos 4 posts publicados
- Cada card mostra:
  * Thumbnail
  * Data publicação
  * Platform icon
  * Métricas (likes/comments/views)
  * Performance bar comparada ao melhor
- Link "Ver todos" → `/dashboard/reports`

**PRÓXIMOS POSTS**
- Timeline horizontal (próximos 7 dias)
- Cards com:
  * Data/hora agendada
  * Thumbnail
  * Platform icon
  * Status (Agendado/Aprovação)
  * Botão "Editar"
- Link "Ver calendário" → `/dashboard/calendar`

**Componentes**:
- `RecentPosts.tsx`
- `UpcomingPosts.tsx`
- `PostCard.tsx` (reutilizável)

---

### PHASE 8: ANÁLISE DE COMENTÁRIOS ⭐ (5h)
**Prioridade**: MÉDIA-ALTA
**URL**: `/dashboard/comments`

**Estrutura**:

**Tabs**:
1. **Comentários em posts**
   - Timeline de posts com comentários
   - Badges de sentimento (Positivo/Neutro/Negativo)
   - Botões: Responder, Fixar, Deletar, Marcar spam

2. **Análise de sentimento**
   - Gráfico pizza (Positivo/Neutro/Negativo)
   - Palavras-chave frequentes
   - Mentions de concorrentes
   - Links compartilhados
   - Trends ao longo do tempo

3. **Responder em massa**
   - Filtrar comentários
   - Templates de resposta rápida
   - Preview
   - Agendar envio
   - Histórico de respostas

4. **Top comentaristas**
   - Usuários mais ativos
   - Engagement score
   - Histórico de interações
   - CTA "Seguir"

**Stats (4 cards)**:
- Total comentários (período)
- Taxa de resposta (%)
- Sentimento geral
- Top comentarista

**Dados Mock**:
```typescript
interface Comment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  postId: string;
  platform: 'instagram' | 'youtube';
  date: string;
  likes: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  isReplied: boolean;
  replies: Comment[];
}
```

**Componentes**:
- `CommentsPage.tsx`
- `CommentCard.tsx`
- `SentimentAnalysis.tsx`
- `BulkReplyModal.tsx`
- `TopCommenters.tsx`

---

## 📊 CRONOGRAMA

| Phase | Item | Tempo | Dependências |
|-------|------|-------|--------------|
| 1 | Reordenar Sidebar | 15 min | - |
| 2 | Kanban Calendar | 3h | react-beautiful-dnd |
| 3 | YouTube Shorts | 4h | YouTube API |
| 4 | Gestão de Clientes | 3h | - |
| 5 | Base de Referências | 5h | IA Transcription |
| 6 | Função Copiar | 4h | OpenAI API |
| 7 | Dashboard Recent/Upcoming | 2h | - |
| 8 | Análise de Comentários | 5h | Sentiment Analysis |

**Total Frontend**: ~27h

---

## 📦 BIBLIOTECAS A ADICIONAR

```bash
npm install react-beautiful-dnd react-dnd react-dnd-html5-backend axios qs sentiment
```

---

## 📁 NOVA ESTRUTURA DE PASTAS

```
src/components/
├── kanban/
│   ├── KanbanBoard.tsx
│   ├── KanbanColumn.tsx
│   ├── KanbanCard.tsx
│   └── hooks/useKanban.ts
├── references/
│   ├── ReferencesPage.tsx
│   ├── ReferenceForm.tsx
│   ├── ReferenceCard.tsx
│   └── CopyReferenceModal.tsx
├── clients/
│   ├── ClientsPage.tsx
│   ├── ClientCard.tsx
│   └── ClientModal.tsx
├── comments/
│   ├── CommentsPage.tsx
│   ├── CommentCard.tsx
│   ├── SentimentAnalysis.tsx
│   └── BulkReplyModal.tsx
└── dashboard/
    ├── RecentPosts.tsx
    └── UpcomingPosts.tsx

src/data/
├── referencesData.ts
├── clientsData.ts
├── commentsData.ts
└── youtubeData.ts

src/hooks/
├── useReferenceAnalysis.ts
├── useKanban.ts
└── useSentimentAnalysis.ts
```

---

## ✨ DESIGN CONSIDERATIONS

- Manter paleta gold #FFC024
- Animações 300ms
- Responsividade completa
- Acessibilidade WCAG AA
- Loading + Empty states
- Dark mode ready

---

**Começar por**: PHASE 1 (Reordenar Sidebar - 15 min)

