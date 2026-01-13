# Contexto: Melhorias de Design e Gamificação no Onboarding

## Objetivo
Melhorar a experiência do usuário nas páginas de onboarding (essential e complete) com design padronizado e elementos de gamificação.

## Arquivos Principais
- `src/app/onboarding/essential/page.tsx` - Briefing Essential
- `src/app/onboarding/complete/page.tsx` - Briefing Complete
- `src/components/chat/FloatingOracle.tsx` - Componente da esfera 3D (Three.js)

## O que precisa ser feito

### Fase 1 - Ajustes Rápidos
1. **Aumentar a esfera** - Atualmente 200px, aumentar para ~300px
2. **Enter para avançar** - Adicionar listener de teclado para avançar pergunta
3. **Padronizar páginas** - Essential e Complete devem ter mesmo layout

### Fase 2 - Gamificação Completa
1. **Confetti** - Animação ao completar seções
2. **Barra de XP** - Sistema de progresso visual com níveis
3. **Esfera dinâmica** - Muda cor/tamanho conforme progresso
4. **Mensagens motivacionais** - Feedback positivo durante preenchimento
5. **Checkpoints visuais** - Marcadores de seções completadas

## Estrutura Atual do FloatingOracle
```tsx
interface FloatingOracleProps {
  size?: number;      // default: 64
  className?: string;
  color?: string;     // default: '#D4AF37' (dourado)
  showOrbits?: boolean; // default: true
}
```

## Sugestão de Implementação

### Criar componente compartilhado
```tsx
// src/components/onboarding/OnboardingLayout.tsx
interface OnboardingLayoutProps {
  type: 'essential' | 'complete';
  currentSection: number;
  currentQuestion: number;
  totalSections: number;
  totalQuestions: number;
  sectionTitle: string;
  questionText: string;
  children: React.ReactNode; // input field
  onNext: () => void;
  onBack: () => void;
  saving?: boolean;
  error?: string | null;
}
```

### Cores da esfera por progresso
```typescript
const getOracleColor = (progressPercent: number) => {
  if (progressPercent < 25) return '#D4AF37';      // Dourado inicial
  if (progressPercent < 50) return '#FFB347';      // Laranja
  if (progressPercent < 75) return '#87CEEB';      // Azul claro
  if (progressPercent < 100) return '#98FB98';     // Verde claro
  return '#50C878';                                 // Verde final
};
```

### Mensagens motivacionais
```typescript
const motivationalMessages = [
  'Ótimo começo! 🚀',
  'Você está indo muito bem!',
  'Continue assim!',
  'Já passou da metade!',
  'Quase lá!',
  'Última seção!',
];
```

## Dependências a considerar
- `canvas-confetti` ou `react-confetti` para animações de confetti
- Já tem Three.js instalado para a esfera

## Notas
- O onboarding Essential tem 10 seções, ~80 perguntas
- O onboarding Complete tem 11 seções, ~150+ perguntas
- Ambos salvam automaticamente (autoSave) no backend
- Backend já está funcionando corretamente após fixes anteriores
