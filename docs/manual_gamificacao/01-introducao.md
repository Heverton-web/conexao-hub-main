# 01. Introdução - Sistema de Gamificação

## Objetivo

O sistema de gamificação do Conexão Hub tem como objetivo principal **engajar os usuários** na plataforma através de um mecanismo de progressão visível e recompensador. Ao consumir conteúdos educacionais, os usuários não apenas aprendem, mas também são reconhecidos por seu progresso através de pontos de experiência (XP) e níveis hierárquicos (patentes).

### Problema que Resolve

- Usuários não têm motivação para continuar consumindo conteúdos
- Não há visibilidade do progresso individual
- Falta de reconhecimento pelo esforço dedicado ao aprendizado
- Dificuldade em mensurar o engajamento da plataforma

### Solução Proposta

Um sistema de progressão onde cada material e trilha conced pontos, permitindo que os usuários visualizem seu avanço através de níveis e patentes personalizáveis.

---

## Exemplo de Uso

**Cenário:** Um usuário Cliente acessa a plataforma pela primeira vez.

```
┌─────────────────────────────────────────────────────────────┐
│                     DASHBOARD DO USUÁRIO                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🏆 SEU PROGRESSO                                    │    │
│  │                                                     │    │
│  │  NÍVEL INICIANTE         ────────────  0 XP        │    │
│  │  ═══════════════════════════════════════ 0%        │    │
│  │                                                     │    │
│  │  Próximo nível: Bronze (100 XP)                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐        │
│  │ 📄 Kit Iniciante     │  │ 📖 Kit Iniciante    │        │
│  │ ⭐ 50 XP             │  │ 💰 100 XP ao concluír│       │
│  └─────────────────────┘  └─────────────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Sequência de Eventos:**

1. **Acesso inicial** → Usuário vê nível "Iniciante" com 0 XP
2. **Abre material "Kit Iniciante" (50 XP)** → Recebe 15 XP automaticamente
3. **Fecha o material (completa)** → Recebe 35 XP restantes
4. **Accumula 50 XP** → Sistema atualiza para nível "Bronze" (100 XP mínimo)
5. **Completa trilha completa** → Recebe bônus de 100 XP da trilha
6. **Resultado final** → 150 XP, nível "Bronze", celebration exibida

---

## Pré-requisitos

| Componente | Requisito | Verificação |
|------------|-----------|-------------|
| **Supabase** | Banco de dados configurado | Verificar se tabelas `user_progress` e `collection_progress` existem |
| **Admin** | Acesso ao painel Admin | Acessar Configurações → Gamificação |
| **Materiais** | Campo `points` > 0 | Verificar se materiais têm pontos definidos |
| **Trilhas** | Campo `points` > 0 | Verificar se trilhas têm pontos de bônus |

### Verificação de Pré-requisitos

```sql
-- Verificar se tabelas de progresso existem
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_progress', 'collection_progress');
```

```sql
-- Verificar materiais com pontos
SELECT id, title->>'pt-br' as title, points 
FROM materials 
WHERE points > 0 
ORDER BY points DESC;
```

```sql
-- Verificar trilhas com pontos
SELECT id, title->>'pt-br' as title, points 
FROM collections 
WHERE points > 0 
ORDER BY points DESC;
```

---

## Vocabulário

| Termo | Definição |
|-------|-----------|
| **XP (Experience Points)** | Pontos de experiência ganhos ao consumir conteúdos |
| **Nível/Patente** | Hierarquia baseada na quantidade de XP acumulado |
| **Material** | Conteúdo individual (PDF, vídeo, etc) |
| **Trilha/Collection** | Conjunto de materiais organizados |
| **Progresso** | Registro de materiais iniciados/completados |
| **Webhook** | Notificação enviada a sistemas externos |

---

## Estrutura de Arquivos

```
src/
├── pages/
│   ├── Dashboard.tsx           # Lógica de atribuição de pontos
│   └── Admin.tsx              # Configuração de níveis (seção Gamificação)
├── lib/
│   └── mockDb.ts              # Funções: addPoints, upsertProgress, upsertCollectionProgress
├── lib/
│   └── webhookDispatcher.ts   # WebhookEvents.materialAccessed/completed/collectionCompleted
├── components/hub/
│   └── TrailCompletionCelebration.tsx  # Componente de celebração
└── types.ts                    # getUserLevel, getNextLevelThreshold, LEVEL_THRESHOLDS
```

---

*Próximo: [02-sistema-xp.md](./02-sistema-xp.md) - Sistema de Pontos*