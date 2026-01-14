export interface CalendarPost {
  id: string;
  date: string;
  title: string;
  type: 'post' | 'carousel' | 'reel' | 'story';
  status: 'approved' | 'pending' | 'draft';
  scheduledTime: string;
  thumbnail?: string;
  caption?: string;
  platform?: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'linkedin' | 'twitter';
}

// Calendar posts will come from database - empty by default
export const calendarPosts: CalendarPost[] = [];

export interface Content {
  id: string;
  title: string;
  type: 'post' | 'carousel' | 'reel' | 'story';
  status: 'approved' | 'pending' | 'draft' | 'rejected';
  thumbnail: string;
  caption?: string;
  scheduledDate?: string;
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
  rejectionReason?: string;
}

export const contents: Content[] = [
  {
    id: '1',
    title: 'Dicas de Marketing Digital para Iniciantes',
    type: 'post',
    status: 'approved',
    thumbnail: 'https://i.pravatar.cc/400?img=30',
    caption: 'Confira 5 dicas essenciais...',
    scheduledDate: '2024-01-15 14:00',
    metrics: { likes: 1240, comments: 89, shares: 34, saves: 156 },
  },
  {
    id: '2',
    title: 'Como criar conteúdo que engaja',
    type: 'carousel',
    status: 'pending',
    thumbnail: 'https://i.pravatar.cc/400?img=31',
    caption: 'Aprenda os segredos do engajamento...',
    scheduledDate: '2024-01-16 10:00',
  },
  {
    id: '3',
    title: 'Tendências de redes sociais 2024',
    type: 'reel',
    status: 'pending',
    thumbnail: 'https://i.pravatar.cc/400?img=32',
    caption: 'As principais tendências...',
    scheduledDate: '2024-01-17 18:00',
  },
  {
    id: '4',
    title: 'Stories: melhores práticas',
    type: 'story',
    status: 'draft',
    thumbnail: 'https://i.pravatar.cc/400?img=33',
  },
  {
    id: '5',
    title: 'Métricas que importam',
    type: 'post',
    status: 'approved',
    thumbnail: 'https://i.pravatar.cc/400?img=34',
    caption: 'Entenda quais métricas realmente fazem diferença...',
    scheduledDate: '2024-01-12 15:00',
    metrics: { likes: 2180, comments: 142, shares: 67, saves: 342 },
  },
  {
    id: '6',
    title: 'Estratégias de crescimento orgânico',
    type: 'carousel',
    status: 'rejected',
    thumbnail: 'https://i.pravatar.cc/400?img=35',
    caption: 'Descubra como crescer sem investir em anúncios...',
    rejectionReason: 'O conteúdo precisa de mais dados práticos e exemplos reais.',
  },
];

export interface Script {
  id: string;
  title: string;
  type: 'post' | 'carousel' | 'reel' | 'story';
  script: string;
  description: string;
  copy: string;
  hashtags: string[];
  linkedContentId?: string;
  status: 'approved' | 'pending' | 'draft';
  createdAt: string;
}

export const scripts: Script[] = [
  {
    id: '1',
    title: 'Roteiro: 5 Dicas de Marketing',
    type: 'reel',
    script: '1. Hook: "Você está cometendo esses erros no marketing?"\n2. Apresentação rápida\n3. Dica 1: Conheça sua audiência\n4. Dica 2: Seja consistente\n5. Dica 3: Analise dados\n6. Dica 4: Teste sempre\n7. Dica 5: Autenticidade\n8. CTA: "Salve esse post"',
    description: 'Reel educativo sobre erros comuns em marketing digital',
    copy: 'Você está cometendo esses 5 erros no marketing? 🚨\n\nSalve esse post e comece a transformar sua estratégia hoje!',
    hashtags: ['#marketingdigital', '#dicasdemarketing', '#empreendedorismo', '#redessociais'],
    status: 'approved',
    linkedContentId: '3',
    createdAt: '2024-01-08',
  },
  {
    id: '2',
    title: 'Roteiro: Carrossel Engajamento',
    type: 'carousel',
    script: 'Slide 1: Título - "Como aumentar seu engajamento"\nSlide 2: Problema\nSlide 3: Solução 1\nSlide 4: Solução 2\nSlide 5: Solução 3\nSlide 6: Resultado esperado\nSlide 7: CTA',
    description: 'Carrossel educativo sobre estratégias de engajamento',
    copy: 'Seu engajamento está baixo? Veja essas 3 estratégias que mudaram meu jogo! 🚀',
    hashtags: ['#engajamento', '#instagram', '#dicasinstagram', '#marketingdigital'],
    status: 'pending',
    createdAt: '2024-01-09',
  },
  {
    id: '3',
    title: 'Roteiro: Post Inspiracional',
    type: 'post',
    script: 'Imagem inspiracional com frase motivacional sobre persistência no empreendedorismo',
    description: 'Post simples e inspiracional para conexão emocional',
    copy: '"O sucesso não é sobre não cair, é sobre levantar todas as vezes." 💪\n\nCompartilhe se você concorda!',
    hashtags: ['#empreendedorismo', '#motivacao', '#sucessoempreendedor'],
    status: 'draft',
    createdAt: '2024-01-10',
  },
];
