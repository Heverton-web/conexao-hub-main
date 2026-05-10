# Capítulo 02: Arquitetura de Dados

## 2.1. Modelo Relacional

O sistema de badges utiliza duas tabelas principais no Supabase/PostgreSQL para gerenciar as definições e as conquistas dos usuários.

### Tabela: `badges`
Armazena as definições de cada conquista disponível.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Chave primária (gerada automaticamente). |
| `name` | TEXT | Nome público da conquista. |
| `description` | TEXT | Descrição do desafio ou da conquista. |
| `icon_name` | TEXT | Nome do ícone Lucide associado. |
| `trigger_type` | ENUM | Tipo de gatilho (ver Capítulo 03). |
| `trigger_value` | INTEGER | Valor necessário para ativar o gatilho. |
| `points_reward` | INTEGER | XP concedido ao ganhar o badge. |
| `color` | TEXT | Cor hexadecimal para a identidade visual do badge. |
| `created_at` | TIMESTAMPTZ | Data de criação da definição. |

### Tabela: `user_badges`
Registra quais usuários possuem quais badges (Tabela de Junção).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Chave primária. |
| `user_id` | UUID | Referência ao ID do usuário (`users.id`). |
| `badge_id` | UUID | Referência ao ID do badge (`badges.id`). |
| `earned_at` | TIMESTAMPTZ | Data e hora em que a conquista foi obtida. |

---

## 2.2. Migração SQL

Para implantar esta estrutura, execute o seguinte comando no console SQL do Supabase:

```sql
-- Criar tabela de badges
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT DEFAULT 'award',
  trigger_type TEXT NOT NULL,
  trigger_value INTEGER DEFAULT 1,
  points_reward INTEGER DEFAULT 0,
  color TEXT DEFAULT '#c9a655',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de junção user_badges
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id) -- Impede que o usuário ganhe o mesmo badge duas vezes
);
```

---

## 2.3. Mapeamento de Tipos (TypeScript)

No arquivo `src/types.ts`, a interface deve refletir o banco:

```typescript
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  triggerType: BadgeTriggerType;
  triggerValue: number;
  pointsReward: number;
  color: string;
  createdAt?: string;
}
```

> [!NOTE]
> Observe a conversão de `snake_case` (DB) para `camelCase` (TS) realizada pelos mappers no arquivo `mockDb.ts`.

---

## Próximo Passo

Avance para o **[Capítulo 03: Gatilhos e Conquistas](./03-gatilhos-conquistas.md)**.
