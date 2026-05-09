# Manual do Sistema de Gamificação - Conexão Hub

**Data:** 09 de Maio de 2026  
**Versão:** 1.0

---

## Objetivo

O sistema de gamificação visa engajar usuários na plataforma através de um mecanismo de **pontos de experiência (XP)** e **níveis (patentes)**. Ao consumir conteúdos (materiais e trilhas), os usuários acumulam pontos e avançam na hierarquia de níveis, criando um ciclo de progressão que motiva o engajamento contínuo.

### Exemplo de Uso

**Cenário:** Um usuário Cliente acessa a plataforma pela primeira vez.

1. Entra no Dashboard e vê seu nível atual: **"Iniciante"** com **0 XP**
2. Abre um material "Kit Iniciante" (50 XP) → recebe **15 XP** (30% do total)
3. Completa o material → recebe **35 XP** restantes (70%)
4. Accumula 50 XP → sobe para nível **Bronze** (100 XP mínimo)
5. Completa todos os materiais da trilha "Kit Iniciante" (100 XP) → recebe bônus da trilha
6. Ao final, está com **150 XP** e nível **Bronze**

---

## Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUÁRIO ACESSA PLATAFORMA                   │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DASHBOARD (Dashboard.tsx)                     │
│   ├── Exibe nível atual e barra de progresso                       │
│   └── Calcula progressão para próximo nível                        │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  ABRIR MATERIAL  │    │ COMPLETAR        │    │ COMPLETAR        │
│  (handleView     │    │ MATERIAL         │    │ TRILHA           │
│   Material)      │    │ (handleClose     │    │ (verificação     │
│                  │    │  Viewer)         │    │  automática)     │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ addPoints(30%)   │    │ addPoints(70%)   │    │ addPoints(100%) │
│ • upsertProgress │    │ • upsertProgress │    │ • upsertCollection│
│ • mockDb.addPoints    │ • mockDb.addPoints    │ • mockDb.addPoints  │
│ • WebhookEvents  │    │ • WebhookEvents  │    │ • WebhookEvents  │
│   materialAccessed    │   materialCompleted  │   collectionCompleted│
└──────────────────┘    └──────────────────┘    └──────────────────┘
                                   │                       │
                                   ▼                       ▼
                    ┌─────────────────────────┐  ┌─────────────────────────┐
                    │  SUPABASE (Banco)       │  │  SUPABASE (Banco)       │
                    │  • user_progress        │  │  • collection_progress │
                    │  • points (users table) │  │  • points (users table) │
                    └─────────────────────────┘  └─────────────────────────┘
```

---

## Pré-requisitos

| Componente | Requisito |
|------------|-----------|
| **Supabase** | Banco de dados configurado com tabelas de progresso |
| **Admin** | Acesso ao painel Admin para configurar níveis |
| **Materiais** | terem pontos definidos (campo `points` > 0) |
| **Trilhas** | terem pontos definidos (campo `points` > 0) |

---

## 1. Atribuição de Pontos por Material

### 1.1 Pontos ao Abrir (30%)

Quando o usuário abre um material pela primeira vez:

```typescript
// Dashboard.tsx - handleViewMaterial
if (mat.points > 0) {
  const startXp = Math.floor(mat.points * 0.3);  // 30%
  await mockDb.addPoints(user.id, startXp);
  addUserPoints(startXp);
}
```

**Fluxo:**
1. Usuário clica em um material
2. Sistema verifica se é o primeiro acesso ( `userProgress` )
3. Se ainda não acessou → marca como `started` e atribui 30% dos XP
4. Dispara webhook `materialAccessed`

### 1.2 Pontos ao Completar (70%)

Quando o usuário fecha o modal do material:

```typescript
// Dashboard.tsx - handleCloseViewer
if (existing?.status !== 'completed') {
  // Atribui pontos restantes (70%)
  if (mat.points > 0) {
    const remainingXp = mat.points - Math.floor(mat.points * 0.3);
    await mockDb.addPoints(user.id, remainingXp);
    addUserPoints(remainingXp);
  }
}
```

**Fluxo:**
1. Usuário fecha o visualizador do material
2. Sistema marca como `completed` no banco
3. Atribui os 70% restantes dos XP
4. Dispara webhook `materialCompleted`

### 1.3 Exemplo Prático

| Material | Pontos Totais | Ao Abrir (30%) | Ao Completar (70%) |
|----------|---------------|----------------|-------------------|
| Kit Iniciante (PDF) | 50 | 15 XP | 35 XP |
| Marketing Dental (Vídeo) | 100 | 30 XP | 70 XP |
| Manual ExpertGuide (HTML) | 75 | 22 XP | 53 XP |

---

## 2. Atribuição de Pontos por Trilha

### 2.1 Lógica de Completamento

Quando o usuário completa o último material de uma trilha:

```typescript
// Dashboard.tsx - handleCloseViewer
if (colId) {
  const collectionMaterialIds = collectionItemMap[colId] || [];
  const allCompleted = collectionMaterialIds.every(matId => 
    userProgress.some(p => p.materialId === matId && p.collectionId === colId && p.status === 'completed') || matId === mat.id
  );
  
  if (allCompleted) {
    // Atribui pontos da trilha
    await mockDb.upsertCollectionProgress(user.id, colId, 'completed');
    await mockDb.addPoints(user.id, collection.points);
    addUserPoints(collection.points);
    
    // Dispara webhook
    WebhookEvents.collectionCompleted({...});
    
    // Mostra celebração
    setCelebration({ trailName: collection.title['pt-br'], bonusXp: collection.points });
  }
}
```

### 2.2 Critérios para Completamento

Para receber os pontos de uma trilha, **todos** os materiais devem estar com status `completed`:

```
Trilha "Kit Iniciante" (100 XP)
├── Material 1: Kit Basics (50 XP) ──✓ completado
├── Material 2: Kit Avançado (50 XP) ──✓ completado
└── Material 3: Kit Expert (50 XP) ──✓ completado

→ Todos completados! Usuário recebe +100 XP da trilha
```

### 2.3 Registro no Banco

```sql
-- Tabela: collection_progress
INSERT INTO collection_progress (user_id, collection_id, status, completed_at)
VALUES ('user-uuid', 'collection-uuid', 'completed', NOW());
```

---

## 3. Sistema de Níveis (Patentes)

### 3.1 Níveis Padrão

O sistema vem com 5 níveis pré-definidos:

| Nível | XP Mínimo | Cor Padrão |
|-------|-----------|------------|
| **Iniciante** | 0 | `#888888` (cinza) |
| **Bronze** | 100 | `#cd7f32` |
| **Prata** | 300 | `#c0c0c0` |
| **Ouro** | 600 | `#ffd700` |
| **Master** | 1000 | `#c9a655` (dourado) |

### 3.2 Cálculo de Nível

```typescript
// types.ts - getUserLevel
export function getUserLevel(points: number): UserLevel {
  if (points >= 1000) return 'Master';
  if (points >= 600) return 'Ouro';
  if (points >= 300) return 'Prata';
  if (points >= 100) return 'Bronze';
  return 'Iniciante';
}

export function getNextLevelThreshold(points: number): number {
  if (points >= 1000) return 1000;
  if (points >= 600) return 1000;
  if (points >= 300) return 600;
  if (points >= 100) return 300;
  return 100;
}
```

### 3.3 Configuração no Admin

Acesse **Admin → Configurações → Gamificação**:

#### Criar Nova Patente

1. No campo **"Nome da patente"**, digite: ex: "Diamante"
2. No campo **"XP Mínimo"**, digite: ex: 2500
3. Clique no **seletor de cor** para escolher a cor
4. Clique em **"+" (Adicionar)**

#### Editar Patente

1. Clique no ícone **✏️** ao lado da patente
2. Altere nome, XP ou cor
3. Clique em **"Salvar"**

#### Excluir Patente

1. Clique no ícone **🗑️** ao lado da patente
2. Confirme no modal de exclusão

> ⚠️ **Atenção:** Excluir patentes não afeta usuários que já possuem pontos. Eles manterão seu XP atual, mas não poderão atingir a patente removida.

---

## 4. Webhooks

O sistema dispara webhooks para integração com sistemas externos:

### 4.1 Eventos Disponíveis

| Evento | Dados Enviados | Quando |
|--------|---------------|--------|
| `material_accessed` | userId, userRole, materialId | Usuário abre material |
| `material_completed` | userId, userRole, materialId, points | Usuário completa material |
| `collection_completed` | userId, userRole, collectionId, points | Usuário completa trilha |

### 4.2 Configuração de Webhook

No **Admin → Configurações → Integrações**, configure a URL do webhook:

```
Webhook URL: https://seu-sistema.com/webhook
```

### 4.3 Formato do Payload

```json
{
  "event": "material_completed",
  "timestamp": "2026-05-09T10:30:00Z",
  "data": {
    "userId": "user-uuid-123",
    "userRole": "cliente",
    "materialId": "material-uuid-456",
    "points": 50
  }
}
```

---

## 5. Interface no Dashboard

### 5.1 Card de Gamificação

O Dashboard exibe um card com as informações do usuário:

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

### 5.2 Indicador de XP nos Materiais

Cada material exibe seus pontos:

```
┌─────────────────────────────────────────────┐
│ 📄 Kit Iniciante                       ⭐ 50 │
│ PDF • Português                            │
└─────────────────────────────────────────────┘
```

### 5.3 Indicador de XP nas Trilhas

Cada trilha exibe os pontos de bônus ao completar:

```
┌─────────────────────────────────────────────┐
│ 📖 Kit Iniciante                      ⭐ 100 │
│ 5 materiais • 2 concluídos                   │
│ 💰 100 XP ao concluir                       │
└─────────────────────────────────────────────┘
```

### 5.4 Componente de Celebração

Ao completar uma trilha, uma celebração é exibida:

```
╔══════════════════════════════════════════╗
║          🎉 TRILHA COMPLETADA! 🎉         ║
║                                          ║
║   Kit Iniciante                           ║
║   +100 XP                                  ║
║                                          ║   ← Some após 5s
╚══════════════════════════════════════════╝
```

---

## 6. Testes

### 6.1 Teste de Pontos por Material

**Objetivo:** Validar que os pontos são distribuídos corretamente (30% + 70%)

**Passos:**
1. Crie um material com **100 XP**
2. Faça login como usuário de teste
3. Abra o material → verifique se recebeu **30 XP**
4. Feche o visualizador → verifique se recebeu **70 XP**
5. Total deve ser **100 XP**

**Validação no banco:**
```sql
SELECT points FROM users WHERE id = 'user-id';
-- Esperado: 100
```

### 6.2 Teste de Pontos por Trilha

**Objetivo:** Validar que os pontos de trilha são atribuídos ao completar todos materiais

**Passos:**
1. Crie uma trilha com **3 materiais** e **50 XP** de bônus
2. Complete os 3 materiais
4. Verifique se recebeu os **50 XP** de bônus

**Validação no banco:**
```sql
SELECT * FROM collection_progress 
WHERE user_id = 'user-id' AND status = 'completed';
-- Deve ter registro da trilha completada
```

### 6.3 Teste de Progressão de Nível

**Objetivo:** Validar que o nível muda conforme os pontos

**Passos:**
1. Com **0 XP** → nível deve ser "Iniciante"
2. Acumule **100 XP** → nível deve ser "Bronze"
3. Acumule **300 XP** → nível deve ser "Prata"
4. Acumule **600 XP** → nível deve ser "Ouro"
5. Acumule **1000 XP** → nível deve ser "Master"

### 6.4 Teste de Configuração de Níveis

**Objetivo:** Validar que Admin consegue criar/editar/excluir patentes

**Passos:**
1. Acesse **Admin → Configurações → Gamificação**
2. Crie uma patente "Diamante" com 2000 XP
3. Edite para 2500 XP
4. Exclua a patente
5. Verifique alterações no banco

---

## 7. Resolução de Problemas

| Problema | Causa Provável | Solução |
|----------|----------------|---------|
| Usuário não recebe pontos ao abrir material | material.points = 0 | Configure pontos no Admin para o material |
| Usuário não sobe de nível | Pontos não estão sendo salvos no banco | Verificar mockDb.addPoints e função addUserPoints |
| Pontos duplicados | Usuário abriu material múltiplas vezes | Sistema já verifica se já foi acessado antes |
| Celebração não aparece | setCelebration não foi acionado | Verificar logs do console e condição de completamento |
| Webhook não é disparado | URL não configurada | Configure webhook em Admin → Integrações |

---

## 8. Estrutura de Arquivos

```
src/
├── pages/
│   ├── Dashboard.tsx           # Lógica de atribuição de pontos
│   └── Admin.tsx              # Configuração de níveis (seção Gamificação)
├── lib/
│   └── mockDb.ts              # Funções de banco: addPoints, upsertProgress, upsertCollectionProgress
├── lib/
│   └── webhookDispatcher.ts   # WebhookEvents.materialAccessed/completed/collectionCompleted
├── components/hub/
│   └── TrailCompletionCelebration.tsx  # Componente de celebração
├── types.ts                    # getUserLevel, getNextLevelThreshold, LEVEL_THRESHOLDS
└── contexts/
    └── AuthContext.tsx         # addUserPoints no estado global

supabase/
└── migrations/
    └── [migration de progress]  # Tabelas user_progress, collection_progress

docs/
└── manual_gamificacao.md       # Este documento
```

---

## 9. Próximas Melhorias

- [ ] Badges colecionáveis por conquistas específicas
- [ ] Ranking de usuários por XP
- [ ] Recompensas semanais/mensais
- [ ] Sistema de streak (dias consecutivos de acesso)
- [ ] Gamificação por equipes/departamentos
- [ ] Integração com gamificação externa (Points, Rewards)

---

*Documento gerado automaticamente em 2026-05-09*