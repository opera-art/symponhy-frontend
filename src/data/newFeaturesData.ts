// ========================================
// BASE DE REFERÊNCIAS
// ========================================

export interface Reference {
  id: string;
  originalUrl: string;
  platform: 'instagram' | 'youtube' | 'tiktok';
  type: 'post' | 'reel' | 'carousel' | 'story' | 'short';
  author: string;
  avatar?: string;
  thumbnail: string;
  metrics: {
    likes: number;
    comments: number;
    views: number;
    saves?: number;
  };
  transcription?: string;
  copy: string;
  hashtags: string[];
  description: string;
  backgroundColor?: string;
  musicTrack?: string;
  duration?: number;
  tags: string[];
  createdAt: string;
  collection?: string;
}

export const referencesData: Reference[] = [
  {
    id: '1',
    originalUrl: 'https://instagram.com/p/abc123',
    platform: 'instagram',
    type: 'reel',
    author: '@marketingcombruna',
    avatar: 'https://i.pravatar.cc/150?img=10',
    thumbnail: 'https://i.pravatar.cc/400?img=10',
    metrics: { likes: 2847, comments: 234, views: 45200, saves: 892 },
    transcription:
      'Você está cometendo esses 5 erros no marketing? Erro 1: Falta de estratégia. Erro 2: Não conhecer sua audiência...',
    copy: 'Você está cometendo esses 5 erros no marketing? 🚨\n\nSalve esse post e comece a transformar sua estratégia hoje!',
    hashtags: ['#marketingdigital', '#dicasdemarketing', '#empreendedorismo', '#redessociais'],
    description: 'Reel educativo sobre erros comuns em marketing digital',
    backgroundColor: '#1F2937',
    musicTrack: 'Trending Sound 2024',
    duration: 31,
    tags: ['Marketing', 'Educação', 'Tendência'],
    createdAt: '2024-01-08',
    collection: 'Marketing Tips',
  },
  {
    id: '2',
    originalUrl: 'https://instagram.com/p/def456',
    platform: 'instagram',
    type: 'carousel',
    author: '@growthmarketing',
    avatar: 'https://i.pravatar.cc/150?img=11',
    thumbnail: 'https://i.pravatar.cc/400?img=11',
    metrics: { likes: 3124, comments: 189, views: 52300, saves: 1024 },
    transcription: '',
    copy: 'Seu engajamento está baixo? Veja essas 3 estratégias que mudaram meu jogo! 🚀',
    hashtags: ['#engajamento', '#instagram', '#dicasinstagram', '#growth'],
    description: 'Carrossel sobre estratégias de engajamento',
    backgroundColor: '#F3F4F6',
    musicTrack: '',
    duration: 0,
    tags: ['Engajamento', 'Estratégia'],
    createdAt: '2024-01-09',
  },
  {
    id: '3',
    originalUrl: 'https://youtube.com/shorts/xyz789',
    platform: 'youtube',
    type: 'short',
    author: 'Marketing Digital 360',
    avatar: 'https://i.pravatar.cc/150?img=12',
    thumbnail: 'https://i.pravatar.cc/400?img=12',
    metrics: { likes: 5234, comments: 342, views: 125600, saves: 2147 },
    transcription: 'Aprenda como criar conteúdo viral em 60 segundos...',
    copy: 'Conteúdo viral em 60 segundos? É possível! Aprenda como 👇',
    hashtags: ['#conteúdo', '#viral', '#youtubeshorts', '#criatividade'],
    description: 'YouTube Short sobre criação de conteúdo viral',
    backgroundColor: '#000000',
    musicTrack: 'Trending YouTube Audio',
    duration: 60,
    tags: ['Viral', 'YouTube', 'Criatividade'],
    createdAt: '2024-01-07',
    collection: 'Video Content',
  },
];

// ========================================
// GESTÃO DE CLIENTES
// ========================================

export interface Client {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  nicho: string;
  instagramHandle?: string;
  youtubeChannel?: string;
  platforms: ('instagram' | 'youtube' | 'tiktok')[];
  status: 'active' | 'inactive';
  tasksCount: number;
  contractStartDate: string;
  contractEndDate?: string;
  createdAt: string;
}

export const clientsData: Client[] = [
  {
    id: 'c1',
    name: 'Loja Boutique Fashion',
    email: 'contato@boutiquefashion.com.br',
    avatar: 'https://i.pravatar.cc/150?img=20',
    nicho: 'Moda e Estilo',
    instagramHandle: '@boutiquefashion_',
    youtubeChannel: 'Boutique Fashion',
    platforms: ['instagram', 'youtube', 'tiktok'],
    status: 'active',
    tasksCount: 12,
    contractStartDate: '2024-01-01',
    createdAt: '2024-01-01',
  },
  {
    id: 'c2',
    name: 'Coach de Saúde Integral',
    email: 'contato@coachaude.com.br',
    avatar: 'https://i.pravatar.cc/150?img=21',
    nicho: 'Saúde e Bem-estar',
    instagramHandle: '@coachaude',
    youtubeChannel: 'Coach de Saúde',
    platforms: ['instagram', 'youtube'],
    status: 'active',
    tasksCount: 8,
    contractStartDate: '2024-01-05',
    createdAt: '2024-01-05',
  },
  {
    id: 'c3',
    name: 'Tech Startup XYZ',
    email: 'marketing@techstartup.com',
    avatar: 'https://i.pravatar.cc/150?img=22',
    nicho: 'Tecnologia',
    instagramHandle: '@techstartupxyz',
    youtubeChannel: 'Tech Startup',
    platforms: ['instagram', 'youtube'],
    status: 'active',
    tasksCount: 15,
    contractStartDate: '2023-12-15',
    createdAt: '2023-12-15',
  },
];

// ========================================
// ANÁLISE DE COMENTÁRIOS
// ========================================

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  postId: string;
  postTitle?: string;
  platform: 'instagram' | 'youtube';
  date: string;
  likes: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  isReplied: boolean;
  replies: Comment[];
}

export const commentsData: Comment[] = [
  {
    id: 'cmt1',
    author: 'João Silva',
    avatar: 'https://i.pravatar.cc/150?img=30',
    text: 'Amei o conteúdo! Muito útil mesmo! 🔥',
    postId: 'post1',
    postTitle: 'Dicas de Marketing Digital para Iniciantes',
    platform: 'instagram',
    date: '2024-01-10',
    likes: 42,
    sentiment: 'positive',
    isReplied: true,
    replies: [
      {
        id: 'reply1',
        author: 'Ana Silva',
        text: 'Fico feliz que tenha ajudado! Mais conteúdo em breve 😊',
        postId: 'post1',
        platform: 'instagram',
        date: '2024-01-10',
        likes: 15,
        sentiment: 'positive',
        isReplied: false,
        replies: [],
      },
    ],
  },
  {
    id: 'cmt2',
    author: 'Maria Costa',
    avatar: 'https://i.pravatar.cc/150?img=31',
    text: 'Não concordo muito com o ponto 3. Achei superficial.',
    postId: 'post1',
    postTitle: 'Dicas de Marketing Digital para Iniciantes',
    platform: 'instagram',
    date: '2024-01-10',
    likes: 8,
    sentiment: 'negative',
    isReplied: false,
    replies: [],
  },
  {
    id: 'cmt3',
    author: 'Pedro Oliveira',
    avatar: 'https://i.pravatar.cc/150?img=32',
    text: 'Quando é o próximo vídeo sobre SEO?',
    postId: 'post2',
    postTitle: 'Como criar conteúdo que engaja',
    platform: 'youtube',
    date: '2024-01-09',
    likes: 23,
    sentiment: 'neutral',
    isReplied: false,
    replies: [],
  },
  {
    id: 'cmt4',
    author: 'Fernanda Lima',
    avatar: 'https://i.pravatar.cc/150?img=33',
    text: 'Excelente produção! Parabéns a equipe! 👏',
    postId: 'post2',
    postTitle: 'Como criar conteúdo que engaja',
    platform: 'youtube',
    date: '2024-01-09',
    likes: 67,
    sentiment: 'positive',
    isReplied: true,
    replies: [
      {
        id: 'reply2',
        author: 'Ana Silva',
        text: 'Obrigada! Significa muito para nós 🙏',
        postId: 'post2',
        platform: 'youtube',
        date: '2024-01-09',
        likes: 34,
        sentiment: 'positive',
        isReplied: false,
        replies: [],
      },
    ],
  },
];

// ========================================
// YOUTUBE SHORTS
// ========================================

export interface YouTubeShort {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate?: string;
  publishedDate?: string;
  duration: number;
  metrics?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  transcript?: string;
  tags: string[];
  category: string;
  createdAt: string;
}

export const youtubeData: YouTubeShort[] = [
  {
    id: 'yt1',
    title: 'Top 5 Marketing Hacks 2024',
    description:
      'Descubra os 5 melhores hacks de marketing que estão funcionando em 2024. Aplicável para qualquer nicho!',
    thumbnail: 'https://i.pravatar.cc/400?img=40',
    status: 'published',
    publishedDate: '2024-01-08',
    duration: 59,
    metrics: { views: 12400, likes: 1240, comments: 89, shares: 34 },
    transcript: 'Hack 1: Video marketing é rei... Hack 2: Personalization matters...',
    tags: ['#marketing', '#2024', '#hacks', '#dicas'],
    category: 'Marketing',
    createdAt: '2024-01-08',
  },
  {
    id: 'yt2',
    title: 'Como ganhar 1000 seguidores em 30 dias',
    description: 'Estratégia passo a passo para crescer sua conta em 30 dias. Testado e aprovado!',
    thumbnail: 'https://i.pravatar.cc/400?img=41',
    status: 'scheduled',
    scheduledDate: '2024-01-15 14:00',
    duration: 45,
    tags: ['#crescimento', '#instagram', '#estratégia'],
    category: 'Growth',
    createdAt: '2024-01-09',
  },
  {
    id: 'yt3',
    title: 'Criando conteúdo viral: A ciência por trás',
    description: 'Entenda os elementos que fazem um vídeo viralizar. Ciência + Prática!',
    thumbnail: 'https://i.pravatar.cc/400?img=42',
    status: 'draft',
    duration: 0,
    tags: ['#viral', '#conteúdo', '#ciência'],
    category: 'Content Strategy',
    createdAt: '2024-01-10',
  },
];

// ========================================
// POSTS RECENTES (para Dashboard)
// ========================================

export interface RecentPost {
  id: string;
  title: string;
  platform: 'instagram' | 'youtube' | 'tiktok';
  type: 'post' | 'reel' | 'carousel' | 'story' | 'short';
  thumbnail: string;
  publishedDate: string;
  metrics: {
    likes: number;
    comments: number;
    views: number;
    saves?: number;
  };
  performanceScore: number; // 0-100
}

export const recentPostsData: RecentPost[] = [
  {
    id: 'rp1',
    title: '5 Dicas de Marketing Digital',
    platform: 'instagram',
    type: 'reel',
    thumbnail: 'https://i.pravatar.cc/400?img=50',
    publishedDate: '2024-01-09',
    metrics: { likes: 2847, comments: 234, views: 45200, saves: 892 },
    performanceScore: 92,
  },
  {
    id: 'rp2',
    title: 'Como crescer organicamente',
    platform: 'youtube',
    type: 'short',
    thumbnail: 'https://i.pravatar.cc/400?img=51',
    publishedDate: '2024-01-08',
    metrics: { likes: 5234, comments: 342, views: 125600, saves: 2147 },
    performanceScore: 88,
  },
  {
    id: 'rp3',
    title: 'Trends de moda 2024',
    platform: 'instagram',
    type: 'carousel',
    thumbnail: 'https://i.pravatar.cc/400?img=52',
    publishedDate: '2024-01-07',
    metrics: { likes: 1892, comments: 142, views: 28900, saves: 456 },
    performanceScore: 76,
  },
  {
    id: 'rp4',
    title: 'Story dia a dia',
    platform: 'instagram',
    type: 'story',
    thumbnail: 'https://i.pravatar.cc/400?img=53',
    publishedDate: '2024-01-10',
    metrics: { likes: 342, comments: 28, views: 1240, saves: 0 },
    performanceScore: 65,
  },
];

// ========================================
// PRÓXIMOS POSTS (para Dashboard)
// ========================================

export interface UpcomingPost {
  id: string;
  title: string;
  platform: 'instagram' | 'youtube' | 'tiktok';
  type: 'post' | 'reel' | 'carousel' | 'story' | 'short';
  thumbnail: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'draft' | 'pending' | 'scheduled';
}

export const upcomingPostsData: UpcomingPost[] = [
  {
    id: 'up1',
    title: 'Marketing para iniciantes',
    platform: 'instagram',
    type: 'reel',
    thumbnail: 'https://i.pravatar.cc/400?img=60',
    scheduledDate: '2024-01-12',
    scheduledTime: '14:00',
    status: 'scheduled',
  },
  {
    id: 'up2',
    title: 'Live com especialista em Growth',
    platform: 'youtube',
    type: 'short',
    thumbnail: 'https://i.pravatar.cc/400?img=61',
    scheduledDate: '2024-01-13',
    scheduledTime: '18:00',
    status: 'pending',
  },
  {
    id: 'up3',
    title: 'Dança com trending sound',
    platform: 'instagram',
    type: 'reel',
    thumbnail: 'https://i.pravatar.cc/400?img=62',
    scheduledDate: '2024-01-14',
    scheduledTime: '10:00',
    status: 'draft',
  },
  {
    id: 'up4',
    title: 'Carrossel educativo',
    platform: 'instagram',
    type: 'carousel',
    thumbnail: 'https://i.pravatar.cc/400?img=63',
    scheduledDate: '2024-01-15',
    scheduledTime: '15:30',
    status: 'scheduled',
  },
];

// ========================================
// KANBAN TASKS (para Calendar Kanban)
// ========================================

export interface KanbanTask {
  id: string;
  title: string;
  type: 'post' | 'reel' | 'carousel' | 'story' | 'short';
  description?: string;
  thumbnail?: string;
  status: 'draft' | 'pending' | 'approved' | 'published' | 'review';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee?: string;
  assigneeAvatar?: string;
  tags?: string[];
  progress?: number; // 0-100
  createdAt: string;
}

export const kanbanTasksData: KanbanTask[] = [
  {
    id: 'kt1',
    title: 'Post: 5 Tendências de Marketing',
    type: 'post',
    description: 'Carousel com 5 tendências principais para 2024',
    thumbnail: 'https://i.pravatar.cc/400?img=70',
    status: 'draft',
    priority: 'high',
    dueDate: '2024-01-12',
    assignee: 'Ana Silva',
    assigneeAvatar: 'https://i.pravatar.cc/150?img=1',
    tags: ['Marketing', 'Trends'],
    progress: 45,
    createdAt: '2024-01-09',
  },
  {
    id: 'kt2',
    title: 'Reel: Como crescer organicamente',
    type: 'reel',
    description: 'Vídeo curto (30s) sobre estratégias de crescimento',
    thumbnail: 'https://i.pravatar.cc/400?img=71',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-01-11',
    assignee: 'João Santos',
    assigneeAvatar: 'https://i.pravatar.cc/150?img=2',
    tags: ['Growth', 'Video'],
    progress: 80,
    createdAt: '2024-01-08',
  },
  {
    id: 'kt3',
    title: 'Story: Behind the scenes',
    type: 'story',
    description: 'Stories mostrando processo de criação',
    thumbnail: 'https://i.pravatar.cc/400?img=72',
    status: 'approved',
    priority: 'low',
    dueDate: '2024-01-13',
    assignee: 'Maria Costa',
    assigneeAvatar: 'https://i.pravatar.cc/150?img=3',
    tags: ['BTS', 'Authentic'],
    progress: 100,
    createdAt: '2024-01-10',
  },
  {
    id: 'kt4',
    title: 'YouTube Short: Quick tips',
    type: 'short',
    description: '5 tips rápidos para YouTube',
    thumbnail: 'https://i.pravatar.cc/400?img=73',
    status: 'review',
    priority: 'high',
    dueDate: '2024-01-10',
    tags: ['YouTube', 'Educational'],
    progress: 95,
    createdAt: '2024-01-10',
  },
  {
    id: 'kt5',
    title: 'Carrossel: Guia completo',
    type: 'carousel',
    description: '10 slides com guia educativo',
    thumbnail: 'https://i.pravatar.cc/400?img=74',
    status: 'published',
    priority: 'medium',
    dueDate: '2024-01-08',
    assignee: 'Pedro Lima',
    assigneeAvatar: 'https://i.pravatar.cc/150?img=4',
    tags: ['Educational', 'Guide'],
    progress: 100,
    createdAt: '2024-01-05',
  },
];
