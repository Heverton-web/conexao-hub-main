# 03. Níveis e Patentes

## Visão Geral

O sistema de níveis (patentes) transforma os pontos acumulados em uma hierarquia visual de progressão. Cada nível possui um nome, uma cor e um limiar mínimo de XP.

---

## 1. Níveis Padrão

O sistema vem pré-configurado com 5 níveis:

| Nível | XP Mínimo | Cor Padrão | Badge |
|-------|-----------|------------|-------|
| **Iniciante** | 0 | `#888888` (cinza) | 🌱 |
| **Bronze** | 100 | `#cd7f32` (bronze) | 🥉 |
| **Prata** | 300 | `#c0c0c0` (prata) | 🥈 |
| **Ouro** | 600 | `#ffd700` (dourado) | 🥇 |
| **Master** | 1000 | `#c9a655` (dourado especial) | 👑 |

### Representação Visual

```
NÍVEL INICIANTE (0-99 XP)
🌱 Iniciante ─────────────── 0 XP

NÍVEL BRONZE (100-299 XP)
🥉 Bronze ───────────────── 100 XP

NÍVEL PRATA (300-599 XP)
🥈 Prata ────────────────── 300 XP

NÍVEL OURO (600-999 XP)
🥇 Ouro ────────────────── 600 XP

NÍVEL MASTER (1000+ XP)
👑 Master ─────────────── 1000 XP
```

---

## 2. Funções de Cálculo

### Determinar Nível Atual

```typescript
// types.ts
export function getUserLevel(points: number): UserLevel {
  if (points >= 1000) return 'Master';
  if (points >= 600) return 'Ouro';
  if (points >= 300) return 'Prata';
  if (points >= 100) return 'Bronze';
  return 'Iniciante';
}
```

### Calcular Limiar do Próximo Nível

```typescript
export function getNextLevelThreshold(points: number): number {
  if (points >= 1000) return 1000;      // Já é Master
  if (points >= 600) return 1000;      // Próximo: Master
  if (points >= 300) return 600;       // Próximo: Ouro
  if (points >= 100) return 300;       // Próximo: Prata
  return 100;                           // Próximo: Bronze
}
```

### Calcular Porcentagem de Progresso

```typescript
// Dashboard.tsx
const currentLevelXP = pointsAcumulados;
const nextThreshold = getNextLevelThreshold(pointsAcumulados);
const prevThreshold = /* limiar do nível atual */;

const levelProgress = nextThreshold > 0 
  ? Math.min(100, Math.round(((pointsAcumulados - prevThreshold) / (nextThreshold - prevThreshold)) * 100))
  : 100;
```

---

## 3. Tipos e Constantes

```typescript
// types.ts

export type UserLevel = 'Iniciante' | 'Bronze' | 'Prata' | 'Ouro' | 'Master';

export const LEVEL_THRESHOLDS: Record<UserLevel, number> = {
  Iniciante: 0,
  Bronze: 100,
  Prata: 300,
  Ouro: 600,
  Master: 1000,
};

export const LEVEL_COLORS: Record<UserLevel, string> = {
  Iniciante: '#888888',
  Bronze: '#cd7f32',
  Prata: '#c0c0c0',
  Ouro: '#ffd700',
  Master: '#c9a655',
};
```

---

## 4. Configuração no Admin

### Acessar Configurações

1. Faça login como **Super Admin**
2. Acesse **Admin** → **Configurações** → **Gamificação**

### Interface

```
┌─────────────────────────────────────────────────────────────┐
│                    🏆 GAMIFICAÇÃO                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Patentes criadas:                                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 🌱 Iniciante    │ 0 XP   │ #888888 │ ⬆ ⬇ 🗑️     │    │
│  │ 🥉 Bronze       │ 100 XP │ #cd7f32 │ ⬆ ⬇ 🗑️     │    │
│  │ 🥈 Prata        │ 300 XP │ #c0c0c0 │ ⬆ ⬇ 🗑️     │    │
│  │ 🥇 Ouro         │ 600 XP │ #ffd700 │ ⬆ ⬇ 🗑️     │    │
│  │ 👑 Master       │ 1000 XP│ #c9a655 │ ⬆ ⬇ 🗑️     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Adicionar nova patente:                                   │
│  ┌───────────────────────────────────────────────┐          │
│  │ Nome: [____________] XP: [___] Cor: [■]     │          │
│  │                              [+ Adicionar]    │          │
│  └───────────────────────────────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Criar Nova Patente

1. No campo **"Nome da patente"**, digite: ex: "Diamante"
2. No campo **"XP Mínimo"**, digite: ex: 2000
3. Clique no **seletor de cor** para escolher a cor
4. Clique em **"+" (Adicionar)**

### Editar Patente

1. Clique no ícone **✏️** ao lado da patente
2. Altere nome, XP ou cor
3. Clique em **"Salvar"**

### Excluir Patente

1. Clique no ícone **🗑️** ao lado da patente
2. Confirme no modal de exclusão

> ⚠️ **Atenção:** Excluir patentes não afeta usuários que já possuem pontos. Eles manterão seu XP atual, mas não poderão atingir a patente removida.

---

## 5. Representação no Dashboard

### Card de Gamificação

```
┌──────────────────────────────────────────────┐
│  🏆 SEU PROGRESSO                            │
│                                              │
│  NÍVEL OURO        ────────────  650 XP      │
│  ═══════════════════════════════ 85%         │
│                                              │
│  Próximo nível: Master (1000 XP)             │
└──────────────────────────────────────────────┘
```

### Código do Componente

```tsx
// Dashboard.tsx
const userLevel = getUserLevel(user?.points || 0);
const nextThreshold = getNextLevelThreshold(user?.points || 0);
const levelProgress = nextThreshold > 0 
  ? Math.min(100, Math.round(((user?.points || 0) / nextThreshold) * 100)) 
  : 100;

return (
  <div className="gamification-card">
    <span className="text-xs font-bold uppercase" style={{ color: 'var(--color-text-muted)' }}>
      Nível {userLevel}
    </span>
    <span className="ml-auto text-xs font-bold" style={{ color: 'var(--color-accent)' }}>
      {user.points} XP
    </span>
    <Progress value={levelProgress} className="h-1.5" />
  </div>
);
```

---

## 6. Banco de Dados

### Tabela: gamification_levels

```sql
CREATE TABLE gamification_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  min_points INTEGER NOT NULL,
  color VARCHAR(20) DEFAULT '#c9a655',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Dados Iniciais

```sql
INSERT INTO gamification_levels (name, min_points, color, order_index) VALUES
('Iniciante', 0, '#888888', 0),
('Bronze', 100, '#cd7f32', 1),
('Prata', 300, '#c0c0c0', 2),
('Ouro', 600, '#ffd700', 3),
('Master', 1000, '#c9a655', 4);
```

### Função para Listar Níveis

```sql
SELECT * FROM gamification_levels ORDER BY order_index ASC;
```

---

## 7. Ordenação Automática

As patentes são ordenadas automaticamente pelo campo `order_index`. A ordem determina a hierarquia dos níveis.

### Mover Patente para Cima

```typescript
// Admin.tsx
const moveUp = async (index: number) => {
  if (index === 0) return; // Já está no topo
  const prev = gamificationLevels[index - 1];
  const current = gamificationLevels[index];
  
  await mockDb.updateGamificationLevel(
    current.id, current.name, current.minPoints, prev.orderIndex, current.color
  );
  await mockDb.updateGamificationLevel(
    prev.id, prev.name, prev.minPoints, current.orderIndex, prev.color
  );
  loadGamificationLevels();
};
```

### Mover Patente para Baixo

```typescript
const moveDown = async (index: number) => {
  if (index === gamificationLevels.length - 1) return; // Já está embaixo
  // ... lógica similar, mas para baixo
};
```

---

*Próximo: [04-pontos-trilhas.md](./04-pontos-trilhas.md) - Pontos por Trilha*