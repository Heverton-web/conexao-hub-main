# Capítulo 08: Gamificação

## Objetivo

Documentar o sistema de gamificação da plataforma, incluindo níveis de usuário, experiência (XP), confetti de celebração e reflexão visual das patentes no header.

---

## 8.1. Sistema de Níveis

### Definição de Níveis

A plataforma define **5 níveis** progressivos com base na experiência (XP) acumulada:

| Nível | Pontos Mínimos | Pontos Máx. | Cor Associada |
|-------|----------------|-------------|---------------|
| **Iniciante** | 0 | 99 | Cinza (#94a3b8) |
| **Bronze** | 100 | 299 | Bronze (#cd7f32) |
| **Prata** | 300 | 599 | Prata (#c0c0c0) |
| **Ouro** | 600 | 999 | Ouro (#ffd700) |
| **Master** | 1000+ | ∞ | Dourado (#c9a655) |

### Thresholds de XP

```typescript
// Definido em src/types.ts
export const LEVEL_THRESHOLDS: Record<UserLevel, number> = {
  Iniciante: 0,
  Bronze: 100,
  Prata: 300,
  Ouro: 600,
  Master: 1000,
};

export type UserLevel = 'Iniciante' | 'Bronze' | 'Prata' | 'Ouro' | 'Master';
```

### Função de Cálculo

```typescript
// Função para determinar o nível atual
export function getUserLevel(points: number): UserLevel {
  if (points >= 1000) return 'Master';
  if (points >= 600) return 'Ouro';
  if (points >= 300) return 'Prata';
  if (points >= 100) return 'Bronze';
  return 'Iniciante';
}

// Função para próximo nível
export function getNextLevelThreshold(points: number): number {
  if (points >= 1000) return 1000;
  if (points >= 600) return 1000;
  if (points >= 300) return 600;
  if (points >= 100) return 300;
  return 100;
}
```

---

## 8.2. Cores por Nível

### Mapeamento de Cores

```typescript
const LEVEL_COLORS: Record<UserLevel, string> = {
  Iniciante: '#94a3b8',  // Cinza
  Bronze: '#cd7f32',     // Bronze
  Prata: '#c0c0c0',      // Prata
  Ouro: '#ffd700',       // Ouro
  Master: '#c9a655',     // Dourado (accent)
};
```

### Uso no Header

```tsx
const userLevel = getUserLevel(user.points);
const levelColor = LEVEL_COLORS[userLevel];

<span style={{ color: levelColor }}>
  {userLevel} · {user.points} XP
</span>
```

---

## 8.3. Reflexo da Patente no Header

O header da aplicação reflete visualmente o nível do usuário através de **cores, bordas e sombras** que se adaptam dinamicamente.

### Implementação

```tsx
const Header = ({ user }) => {
  const levelColor = LEVEL_COLORS[getUserLevel(user.points)];

  return (
    <header
      style={{
        // Borda com cor da patente (25% opacidade)
        border: `1px solid ${levelColor}40`,

        // Fundo com cor da patente (8% opacidade)
        backgroundColor: `${levelColor}14`,

        // Sombra com glow sutil
        boxShadow: `0 0 20px ${levelColor}14, inset 0 0 30px ${levelColor}0a`,
      }}
      className="sticky top-0 z-40"
    >
      {/* Conteúdo */}
    </header>
  );
};
```

### Propriedades por Nível

| Nível | Borda | Background | Sombra | Glow |
|-------|-------|------------|--------|------|
| Iniciante | 25% cinza | 8% cinza | Sutil cinza | Não |
| Bronze | 25% bronze | 8% bronze | Bronze | Leve |
| Prata | 25% prata | 8% prata | Prata | Média |
| Ouro | 25% ouro | 8% ouro | Ouro | Forte |
| Master | 25% dourado | 8% dourado | Dourado | Máximo |

---

## 8.4. Exibição de XP no Header

### Formato

```
{NÍVEL} · {PONTOS} XP
```

**Exemplo visual:**
```
MASTER · 1.250 XP
```

### Especificações Tipográficas

| Propriedade | Valor |
|-------------|-------|
| **Tamanho** | 9px (`text-[9px]`) |
| **Peso** | Semibold (600) |
| **Transform** | Uppercase |
| **Spacing** | `tracking-wider` (0.05em) |
| **Cor** | Cor da patente atual (ou dourado como padrão) |

### Ícone de Nível

```tsx
// Estrela com cor da patente
<Star
  size={8}
  fill={levelColor}
  style={{ color: levelColor }}
  className="inline-block"
/>
```

---

## 8.5. Efeitos de Celebração (Confetti)

O sistema utiliza **canvas-confetti** para criar efeitos visuais de celebração quando o usuário conquista objetivos.

### Informações Técnicas

| Propriedade | Valor |
|-------------|-------|
| **Biblioteca** | canvas-confetti |
| **Versão** | 1.9.4 |
| **Pacote NPM** | `canvas-confetti` |
| **Tipo** | Biblioteca de animação 2D |

---

### 8.5.1. Quando Usar Confetti

| Ocasião | Tipo de Confetti | Duração |
|---------|------------------|---------|
| **Conclusão de módulo** | Disparo simples | 1.5s |
| **Badge conquistado** | Múltiplos canhões | 3s |
| **Progresso significativo** | Explosão grande | 3s |
| **Meta atingida** | Celebração completa | 4s |
| **Primeiro login** | Bem-vindo especial | 2s |

---

### 8.5.2. Configurações por Ocasião

#### Conclusão de Módulo (Simples)

```typescript
import confetti from 'canvas-confetti';

const celebrateModuleCompletion = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#c9a655', '#e8d48b', '#a8873a'],
  });
};
```

#### Badge Conquistado (Múltiplos Canhões)

```typescript
const celebrateBadge = () => {
  // Canhão do lado esquerdo
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.6 },
    colors: ['#c9a655', '#e8d48b', '#ffd700'],
  });

  // Canhão do lado direito
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.6 },
    colors: ['#c9a655', '#e8d48b', '#ffd700'],
  });
};
```

#### Progresso Significativo (Explosão Grande)

```typescript
const celebrateProgress = () => {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
  };

  // Explosão central
  confetti({
    ...defaults,
    particleCount: 40,
    scalar: 1.2,
    colors: ['#c9a655', '#e8d48b', '#a8873a'],
  });

  // Explosões secundárias
  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 0.75,
    colors: ['#ffd700', '#cd7f32'],
  });
};
```

#### Celebração Completa (Meta Atingida)

```typescript
const celebrateMilestone = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 50, zIndex: 0 };

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  // Intervalo de disparos
  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 5 * (timeLeft / duration);

    // Múltiplas explosões aleatórias
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#c9a655', '#e8d48b', '#a8873a', '#ffd700', '#cd7f32'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#c9a655', '#e8d48b', '#a8873a', '#ffd700', '#cd7f32'],
    });
  }, 250);
};
```

---

### 8.5.3. Paleta de Cores do Confetti

| Cor | HEX | Uso |
|-----|-----|-----|
| Dourado principal | `#c9a655` | Cor padrão da marca |
| Dourado claro | `#e8d48b` | Brilho/destaque |
| Dourado escuro | `#a8873a` | Profundidade |
| Ouro | `#ffd700` | Conquistas de nível |
| Bronze | `#cd7f32` | Nível Bronze |

---

### 8.5.4. Localização dos Componentes

| Componente | Arquivo | Função |
|-----------|---------|--------|
| **Confetti simples** | `RegistrationProgress.tsx` | Conclusão de registro |
| **Confetti de trilha** | `TrailCompletionCelebration.tsx` | Conclusão de módulos/trilhas |

---

## 8.6. Gamificação via Banco de Dados

Os níveis são **dinâmicos** e podem ser configurados pelo administrador no banco de dados:

```sql
-- Tabela de níveis (se existir)
SELECT * FROM gamification_levels;

-- Configuração de níveis customizados
UPDATE gamification_levels
SET points_required = 150
WHERE level_name = 'Bronze';
```

---

## Checklist de Conclusão

- [ ] 5 níveis definidos (Iniciante → Master)
- [ ] Thresholds de XP documentados com código
- [ ] Cores por nível mapeadas
- [ ] Reflexo da patente no header implementado com código
- [ ] Exibição de XP no header (formato e estilo)
- [ ] Biblioteca canvas-confetti (v1.9.4) documentada
- [ ] 4 cenários de confetti com código completo
- [ ] Paleta de cores do confetti em tabela
- [ ] Componentes que usam confetti identificados
- [ ] Gamificação via banco de dados explained

---

## Próximo Passo

Avance para **[Capítulo 09: Internacionalização](./09-internacionalizacao.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-BRANDING.md)*