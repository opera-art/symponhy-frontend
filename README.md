# Symponhy - Social Media Dashboard

SaaS premium para gestão profissional de redes sociais com IA integrada.

## 🎨 Design System

### Paleta de Cores
- **Primary (Gold)**: `#FFC024` - Accent de luxo e elegância
- **Background**: `#F4F6F8` - Fundo suave e minimalista
- **Text**: Slate scale (`#1E293B`, `#64748B`, `#94A3B8`)
- **Status**: Success (`#34D399`), Warning (`#F5C564`), Error (`#E84A5F`)

### Tipografia
- **Font Family**: Inter
- **Pesos**: 300 (Light), 400 (Normal), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Hierarquia**: 0.6875rem (xs) até 3rem (4xl)

### Componentes
- Cards com `rounded-2xl`, sombras suaves, hover com lift
- Botões com variantes: primary (gold), secondary, outline, ghost
- Badges com cores semânticas
- Inputs com focus ring gold
- Modais com backdrop blur
- Tabs com transições suaves
- Gráficos com Recharts (linhas, áreas, barras)

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone <repo-url>
cd symponhy
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:3000
```

## 📂 Estrutura do Projeto

```
symponhy/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Páginas do dashboard
│   │   │   ├── page.tsx        # Dashboard principal
│   │   │   ├── briefing/       # Briefing com abas
│   │   │   ├── calendar/       # Calendário editorial
│   │   │   ├── content/        # Conteúdos + Chat AI
│   │   │   └── reports/        # Relatórios executivos
│   │   └── layout.tsx          # Layout raiz
│   ├── components/
│   │   ├── ui/                 # Componentes base
│   │   ├── layout/             # Sidebar, Topbar
│   │   ├── charts/             # Gráficos (Recharts)
│   │   ├── dashboard/          # Componentes específicos
│   │   ├── briefing/           # Abas do briefing
│   │   ├── calendar/           # Calendário
│   │   ├── content/            # Conteúdos + Harmonia AI
│   │   └── reports/            # Gráficos de relatórios
│   ├── data/                   # Dados mockados
│   ├── lib/                    # Utilitários
│   └── styles/                 # CSS global
├── tailwind.config.js          # Configuração Tailwind
├── tsconfig.json               # Configuração TypeScript
└── package.json
```

## 🎯 Funcionalidades

### 1. Dashboard (`/dashboard`)
- Saudação personalizada
- 4 Stats Cards: Alcance, Engajamento, Visualizações, Posts Agendados
- Gráfico de evolução de audiência
- Lista de aprovações pendentes

### 2. Briefing (`/dashboard/briefing`)
- **Status Card**: Briefing completo com botão "Editar" e "Exportar PDF"
- **4 Abas visíveis**:
  - **Resumo**: Perfil, objetivos, identidade, comunicação
  - **Referências**: Análise de vídeos/posts com transcrições e insights
  - **Concorrentes**: Análise comparativa (3+ concorrentes)
  - **Auditoria**: Métricas 30/90 dias + reputação (Google, Reclame Aqui, Instagram)

### 3. Calendário (`/dashboard/calendar`)
- Navegação mês a mês
- Grid calendário (7x6)
- Posts com status: Aprovado (verde), Pendente (amarelo), Rascunho (cinza)
- Modal de detalhe com aprovação/reprovação

### 4. Conteúdos (`/dashboard/content`)
- **3 Abas**:
  - **Todos**: Grid/Lista, busca, filtros por tipo
  - **Pendentes**: Aprovação rápida com botões Aprovar/Reprovar
  - **Roteiros**: Scripts com copy, hashtags, vínculo com conteúdo
- **Chat Assistente (Harmonia AI)**: Botão flutuante, painel expansível, ações rápidas

### 5. Relatórios (`/dashboard/reports`) - **PRIORIDADE MÁXIMA**
- Header com perfil Instagram, última atualização
- Seletor de período (7, 30, 90 dias)
- **Resumo Executivo** (card escuro): 6 métricas principais
- **4 Gráficos premium**:
  - Evolução de Seguidores (área)
  - Taxa de Engajamento (linha)
  - Top Posts Ranking (cards com ranking visual)
  - Performance Detalhada (barras agrupadas)

## 🧩 Componentes UI

### Base
- `Button` - 5 variantes, loading state, ícones
- `Card` - Padding configurável, hover
- `Badge` - Variantes semânticas, tamanhos
- `Input` - Ícones left/right, erro, label
- `Modal` - Backdrop blur, animações
- `Tabs` - Controlado/não-controlado
- `Skeleton` - Loading states
- `EmptyState` - Estados vazios
- `StatsCard` - Métricas com trending

### Charts (Recharts)
- `AudienceChart` - Linha dupla (ganhos/perdas)
- `FollowersChart` - Área com gradiente
- `EngagementChart` - Linha simples
- `TopPostsRanking` - Ranking visual executivo
- `PostsPerformanceChart` - Barras agrupadas

## 🎨 Design Principles

### Minimalismo Premium
- Poucos elementos, muito respiro
- Hierarquia clara com tipografia forte
- Foco em leitura executiva

### Futurismo Discreto
- Blur/glass somente onde necessário (modais)
- Transições suaves (300ms cubic-bezier)
- Micro-interações (hover lift, shadows)

### Uso do Gold (#FFC024)
- **SIM**: Bordas, ícones de destaque, CTA primário, indicadores, highlights em gráficos
- **NÃO**: Grandes áreas preenchidas, backgrounds extensos

### Acessibilidade
- Contraste mínimo WCAG AA
- Focus rings visíveis (gold)
- Navegação por teclado
- Aria labels em ícones

### Performance
- Lazy load em componentes pesados
- Memoização em listas
- Skeleton states em carregamentos
- Evitar rerenders desnecessários

## 🛠 Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilo**: Tailwind CSS + CVA (Class Variance Authority)
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Utilitários**: clsx, tailwind-merge, date-fns

## 📱 Responsividade

- **Mobile**: Sidebar escondida, topbar com menu
- **Tablet (md)**: Sidebar visível, grid 2 colunas
- **Desktop (lg)**: Layout completo, grid 3-4 colunas
- **Large (xl)**: 4 colunas, expansão de gráficos

## 🔮 Próximos Passos (Backend)

1. Integração com Instagram Graph API
2. Autenticação (NextAuth.js)
3. Banco de dados (Prisma + PostgreSQL)
4. Upload de imagens (Cloudinary)
5. Integração OpenAI (Harmonia AI)
6. Geração de PDF (jsPDF)
7. Webhooks Instagram

## 📄 Licença

Projeto privado - Todos os direitos reservados.

---

**Desenvolvido com atenção aos detalhes e foco em UX premium** ✨
