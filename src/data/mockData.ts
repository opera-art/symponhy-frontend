// Dashboard Mock Data
export const dashboardStats = {
  totalReach: {
    value: '280k',
    change: 12.5,
    trend: 'up' as const,
  },
  engagement: {
    value: '8.2%',
    change: 5.3,
    trend: 'up' as const,
  },
  views: {
    value: '1.2M',
    change: -2.1,
    trend: 'down' as const,
  },
  scheduledPosts: {
    value: '24',
    change: 0,
    trend: 'neutral' as const,
  },
};

export const audienceData = [
  { date: '05 Fev', gained: 52, lost: -15 },
  { date: '07 Fev', gained: 22, lost: -8 },
  { date: '09 Fev', gained: 22, lost: -10 },
  { date: '11 Fev', gained: 60, lost: -20 },
  { date: '13 Fev', gained: 90, lost: -8 },
  { date: '15 Fev', gained: 15, lost: -5 },
  { date: '17 Fev', gained: 52, lost: -10 },
  { date: '19 Fev', gained: 37, lost: -18 },
  { date: '21 Fev', gained: 63, lost: -8 },
  { date: '23 Fev', gained: 22, lost: -18 },
  { date: '25 Fev', gained: 52, lost: -15 },
  { date: '27 Fev', gained: 27, lost: -8 },
];

export const pendingApprovals = [
  {
    id: '1',
    title: 'Dicas de Marketing Digital para Iniciantes',
    type: 'post' as const,
    scheduledDate: '15 Jan, 14:00',
    thumbnail: 'https://i.pravatar.cc/200?img=1',
  },
  {
    id: '2',
    title: 'Como criar conteúdo que engaja',
    type: 'carousel' as const,
    scheduledDate: '16 Jan, 10:00',
    thumbnail: 'https://i.pravatar.cc/200?img=2',
  },
  {
    id: '3',
    title: 'Tendências de redes sociais 2024',
    type: 'reel' as const,
    scheduledDate: '17 Jan, 18:00',
    thumbnail: 'https://i.pravatar.cc/200?img=3',
  },
  {
    id: '4',
    title: 'Stories: melhores práticas',
    type: 'story' as const,
    scheduledDate: '18 Jan, 09:00',
    thumbnail: 'https://i.pravatar.cc/200?img=4',
  },
];

// Briefing Mock Data
export const briefingData = {
  status: 'complete' as const,
  lastUpdate: '2024-01-10',
  profile: {
    name: 'Ana Silva',
    location: 'São Paulo, SP',
    area: 'Marketing Digital & Growth',
    instagram: '@anasilva.mkt',
  },
  objectives: [
    'Aumentar engajamento em 30%',
    'Conquistar 10k novos seguidores',
    'Posicionar como autoridade em marketing',
  ],
  identity: {
    gender: 'Feminino',
    civilStatus: 'Casada',
    spirituality: 'Não se aplica',
    values: ['Autenticidade', 'Educação', 'Inovação'],
  },
  voice: {
    tone: ['Profissional', 'Acessível', 'Inspirador'],
    favoriteExpressions: ['Vamos juntos', 'Isso muda o jogo', 'Na prática'],
    avoidTopics: ['Política', 'Religião'],
  },
};

export const referencesData = [
  {
    id: '1',
    platform: 'Instagram',
    author: '@marketingcombruna',
    type: 'Reel',
    url: 'https://instagram.com/...',
    transcript: 'Transcrição do vídeo de referência sobre estratégias de conteúdo...',
    insights: [
      'Uso de hook nos primeiros 3 segundos',
      'Linguagem direta e objetiva',
      'CTA claro ao final',
    ],
  },
  {
    id: '2',
    platform: 'YouTube',
    author: 'Marketing Digital 360',
    type: 'Vídeo',
    url: 'https://youtube.com/...',
    transcript: 'Transcrição sobre métricas de redes sociais...',
    insights: [
      'Estrutura storytelling',
      'Dados visuais (gráficos)',
      'Exemplos práticos',
    ],
  },
];

export const competitorData = [
  {
    id: '1',
    name: '@competitor1',
    followers: '45.2k',
    engagement: '6.8%',
    postsPerWeek: 5,
    strengths: ['Alta frequência de posts', 'Engajamento consistente'],
    opportunities: ['Falta de Reels', 'Poucos carrosséis educativos'],
    topFormats: ['Posts simples', 'Stories'],
  },
  {
    id: '2',
    name: '@competitor2',
    followers: '32.8k',
    engagement: '9.2%',
    postsPerWeek: 3,
    strengths: ['Reels virais', 'Identidade visual forte'],
    opportunities: ['Baixa frequência', 'Pouca interação com audiência'],
    topFormats: ['Reels', 'Carrosséis'],
  },
  {
    id: '3',
    name: '@competitor3',
    followers: '28.5k',
    engagement: '5.4%',
    postsPerWeek: 7,
    strengths: ['Presença constante', 'Variedade de formatos'],
    opportunities: ['Baixo engajamento', 'Conteúdo genérico'],
    topFormats: ['Posts', 'Stories', 'Reels'],
  },
];

export const auditData = {
  period: '30 dias',
  profileMetrics: {
    postsPublished: 28,
    averageEngagement: '7.2%',
    bestPerformingType: 'Carrosséis',
    worstPerformingType: 'Stories',
    topHashtags: ['#marketingdigital', '#empreendedorismo', '#dicasdemarketing'],
  },
  reputation: {
    google: {
      rating: 4.8,
      reviews: 124,
      sentiment: 'Positivo',
    },
    reclameAqui: {
      rating: null,
      status: 'Não cadastrado',
    },
    instagram: {
      sentimentAnalysis: 'Muito Positivo',
      commonComments: ['Conteúdo útil', 'Dicas práticas', 'Obrigada pelas dicas'],
    },
  },
};

// Reports Mock Data
export const reportsData = {
  profile: '@anasilva.mkt',
  lastUpdate: '2024-01-10 15:30',
  metrics: {
    followers: { current: 68234, change: 5.2, trend: 'up' as const },
    reach: { current: 280500, change: 12.3, trend: 'up' as const },
    engagement: { current: 8.2, change: 3.1, trend: 'up' as const },
    comments: { current: 1847, change: 15.7, trend: 'up' as const },
    saves: { current: 3421, change: 22.4, trend: 'up' as const },
    shares: { current: 892, change: -4.2, trend: 'down' as const },
  },
  followersEvolution: [
    { date: '01 Jan', value: 64800 },
    { date: '05 Jan', value: 65200 },
    { date: '10 Jan', value: 66100 },
    { date: '15 Jan', value: 66800 },
    { date: '20 Jan', value: 67400 },
    { date: '25 Jan', value: 67900 },
    { date: '30 Jan', value: 68234 },
  ],
  engagementRate: [
    { date: '01 Jan', rate: 7.2 },
    { date: '05 Jan', rate: 7.5 },
    { date: '10 Jan', rate: 7.8 },
    { date: '15 Jan', rate: 8.1 },
    { date: '20 Jan', rate: 8.0 },
    { date: '25 Jan', rate: 8.3 },
    { date: '30 Jan', rate: 8.2 },
  ],
  topPosts: [
    {
      id: '1',
      thumbnail: 'https://i.pravatar.cc/400?img=10',
      type: 'Carrossel',
      date: '25 Jan',
      likes: 2847,
      comments: 234,
      saves: 892,
      shares: 156,
      reach: 45200,
    },
    {
      id: '2',
      thumbnail: 'https://i.pravatar.cc/400?img=11',
      type: 'Reel',
      date: '22 Jan',
      likes: 3124,
      comments: 189,
      saves: 1024,
      shares: 234,
      reach: 52300,
    },
    {
      id: '3',
      thumbnail: 'https://i.pravatar.cc/400?img=12',
      type: 'Post',
      date: '18 Jan',
      likes: 1892,
      comments: 142,
      saves: 456,
      shares: 89,
      reach: 28900,
    },
  ],
  postsPerformance: [
    { name: 'Post 1', impressions: 12500, reach: 8900, saves: 234 },
    { name: 'Post 2', impressions: 18200, reach: 14500, saves: 456 },
    { name: 'Post 3', impressions: 9800, reach: 7200, saves: 189 },
    { name: 'Post 4', impressions: 24500, reach: 19800, saves: 892 },
    { name: 'Post 5', impressions: 16700, reach: 12300, saves: 567 },
    { name: 'Post 6', impressions: 21300, reach: 17200, saves: 734 },
  ],
};
