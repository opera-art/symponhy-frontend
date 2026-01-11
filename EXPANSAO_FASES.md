# 🚀 EXPANSÃO SYMPONHY - FASES DE IMPLEMENTAÇÃO

## ✅ PHASE 1 CONCLUÍDA

### O que foi feito:
- ✅ Sidebar reordenado: **Calendário agora é o 2º item**
- ✅ 5 arquivos de mock data criados
- ✅ Build validado (sem erros)

**Sidebar novo ordem:**
```
1. 📊 Dashboard
2. 📅 Calendário       ← MOVIDO PARA AQUI
3. 📋 Briefing
4. ✨ Conteúdos
5. 📈 Relatórios
```

---

## 📅 PRÓXIMAS FASES (Sequência Recomendada)

### PHASE 2: KANBAN CALENDAR (3h) ⭐ ALTA PRIORIDADE

**O que é:**
- Nova visualização de calendário em estilo Kanban
- Colunas: Rascunho → Agendado → Aprovado → Publicado → Em Análise
- Drag & drop de tarefas entre colunas

**Onde implementar:**
```
/dashboard/calendar (novo parâmetro: ?view=kanban)
```

**Arquivos a criar:**
```
src/components/kanban/
├── KanbanBoard.tsx
├── KanbanColumn.tsx
├── KanbanCard.tsx
└── hooks/useKanban.ts
```

**Biblioteca**: `npm install react-beautiful-dnd`

---

### PHASE 3: DASHBOARD RECENTES & PRÓXIMOS (2h) ⭐ ALTA PRIORIDADE

**O que é:**
- Nova seção "Últimos Posts" no dashboard
- Nova seção "Próximos Posts" no dashboard
- Timeline visual dos próximos 7 dias

**Onde implementar:**
```
/dashboard (adicionar seções abaixo do gráfico)
```

**Componentes a criar:**
```
src/components/dashboard/
├── RecentPosts.tsx
├── UpcomingPosts.tsx
└── PostCard.tsx
```

**Mock data**: Já existe em `newFeaturesData.ts`

---

### PHASE 4: YOUTUBE SHORTS (4h) ⭐ MÉDIA PRIORIDADE

**O que é:**
- Nova aba "YouTube Shorts" na página de conteúdos
- Stats específicos do YouTube
- Opção "Duplicar para YouTube" nos Reels do Instagram

**Onde implementar:**
```
/dashboard/content (nova aba)
```

**Componentes a criar:**
```
src/components/content/
├── YouTubeShortsTab.tsx
├── YouTubeStats.tsx
└── YouTubeUpload.tsx
```

**Mock data**: Já existe (`youtubeData`)

---

### PHASE 5: GESTÃO DE CLIENTES (3h) ⭐ MÉDIA PRIORIDADE

**O que é:**
- Página de gestão de clientes para agências
- CRUD completo (Create, Read, Update, Delete)
- Seletor de cliente no dashboard

**Onde implementar:**
```
/dashboard/clients (nova página)
```

**Componentes:**
```
src/components/clients/
├── ClientsPage.tsx
├── ClientCard.tsx
├── ClientModal.tsx
└── ClientsGrid.tsx
```

**Mock data**: Já existe (`clientsData`)

---

### PHASE 6: BASE DE REFERÊNCIAS (5h) ⭐ MUITO ALTA PRIORIDADE

**O que é:**
- Página de base de referências (inspirações)
- Input para colar link (Instagram, YouTube, TikTok)
- Auto-análise com IA (extração de dados)
- Coleções/Pastas para organizar

**Onde implementar:**
```
/dashboard/references (nova página)
```

**Componentes:**
```
src/components/references/
├── ReferencesPage.tsx
├── ReferenceForm.tsx
├── ReferenceCard.tsx
├── ReferencesGrid.tsx
└── CopyReferenceModal.tsx
```

**Funcionalidades IA:**
- Transcrição automática (se vídeo)
- Extração: copy, hashtags, música, cores, métricas
- Análise de sentimento
- Recomendações de melhorias

**Mock data**: Já existe (`referencesData`)

---

### PHASE 7: FUNÇÃO COPIAR (4h) ⭐ MUITO ALTA PRIORIDADE

**O que é:**
- Botão "Copiar" em cada referência
- Abre modal para replicar conteúdo
- IA adapta ao nicho do cliente
- Gera novo copy, roteiro, hashtags

**Onde implementar:**
```
Dentro de /dashboard/references
```

**Componentes:**
```
src/components/references/
├── CopyReferenceModal.tsx
└── GenerateAIPreview.tsx
```

**Fluxo:**
```
1. User clica "Copiar" em referência
2. Modal abre com preview
3. User insere "contexto do seu nicho"
4. Clica "Gerar com IA"
5. IA cria novo conteúdo similar adaptado
6. User pode editar ou salvar direto ao calendário
```

---

### PHASE 8: ANÁLISE DE COMENTÁRIOS (5h) ⭐ MÉDIA PRIORIDADE

**O que é:**
- Nova página de análise de comentários
- Tabs: Comentários, Sentimento, Responder em massa, Top comentaristas
- Análise de sentimento (Positivo/Neutro/Negativo)
- Filtros por plataforma e período

**Onde implementar:**
```
/dashboard/comments (nova página)
```

**Componentes:**
```
src/components/comments/
├── CommentsPage.tsx
├── CommentCard.tsx
├── SentimentAnalysis.tsx
├── BulkReplyModal.tsx
└── TopCommenters.tsx
```

**Stats:**
- Total comentários
- Taxa de resposta (%)
- Sentimento geral
- Top comentarista

**Mock data**: Já existe (`commentsData`)

---

## 📊 CRONOGRAMA TOTAL

| # | Phase | Tempo | Status |
|---|-------|-------|--------|
| 1 | Reordenar Sidebar | 15 min | ✅ FEITO |
| 2 | Kanban Calendar | 3h | ⏳ PRÓXIMO |
| 3 | Dashboard Recent/Upcoming | 2h | ⏳ |
| 4 | YouTube Shorts | 4h | ⏳ |
| 5 | Gestão de Clientes | 3h | ⏳ |
| 6 | Base de Referências | 5h | ⏳ |
| 7 | Função Copiar | 4h | ⏳ |
| 8 | Análise Comentários | 5h | ⏳ |

**Total Frontend**: ~31h
**Para agora**: Começar com PHASE 2 (Kanban)

---

## 📦 DADOS MOCK JÁ CRIADOS

Todos os dados estão em: `src/data/newFeaturesData.ts`

```typescript
// Disponível:
✅ referencesData (3 referências)
✅ clientsData (3 clientes)
✅ commentsData (4 comentários com replies)
✅ youtubeData (3 YouTube Shorts)
✅ recentPostsData (4 posts recentes)
✅ upcomingPostsData (4 posts próximos)
✅ kanbanTasksData (5 tarefas no kanban)
```

---

## 🎨 DESIGN GUIDELINES

Manter em todas as fases:
- ✅ Paleta gold #FFC024
- ✅ Minimalismo premium
- ✅ Animações 300ms
- ✅ Responsividade completa
- ✅ Acessibilidade WCAG AA
- ✅ Loading + Empty states

---

## 🔧 BIBLIOTECAS A INSTALAR

```bash
npm install react-beautiful-dnd react-dnd react-dnd-html5-backend axios qs
```

---

## ✨ PRÓXIMO PASSO

**Iniciar PHASE 2: Kanban Calendar**

Quer que eu comece a implementar a visualização Kanban agora?

