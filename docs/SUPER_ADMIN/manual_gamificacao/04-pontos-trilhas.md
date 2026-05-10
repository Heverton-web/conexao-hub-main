# 04. Pontos por Trilha

## Visão Geral

Além dos pontos individuais por material, o sistema oferece **pontos de bônus** ao completar uma trilha inteira. Este mecanismo recompensa usuários que se dedicam a consumir todos os conteúdos de uma coleção organizada.

---

## 1. Como Funciona

### Definição de Pontos de Trilha

Cada trilha (collection) pode ter um valor de pontos de bônus configurado no Admin:

```
┌─────────────────────────────────────────────┐
│ 📖 Kit Iniciante                      ⭐ 100 │
│ 5 materiais • 2 concluídos                   │
│ 💰 100 XP ao concluir                       │
└─────────────────────────────────────────────┘
        │
        └── Bônus dado ao completar todos
```

### Critérios para Receber Bônus

Para receber os pontos de uma trilha, **todos** os materiais devem estar com status `completed`:

```
Trilha "Kit Iniciante" (100 XP de bônus)
│
├── Material 1: Kit Basics (50 XP) ──✓ completado
├── Material 2: Kit Avançado (50 XP) ──✓ completado
├── Material 3: Kit Expert (50 XP) ──✓ completado
│
└── CONDIÇÃO: Todos 3 completados? SIM!
   → Usuário recebe +100 XP de bônus
   → collection_progress marcada como 'completed'
   → Celebração exibida
```

---

## 2. Lógica de Implementação

### Código em Dashboard.tsx

```typescript
// Verifica se a trilha foi completada ao fechar um material
if (colId) {
  const collectionMaterialIds = collectionItemMap[colId] || [];
  
  if (collectionMaterialIds.length > 0) {
    // Verifica se TODOS os materiais estão completados
    const allCompleted = collectionMaterialIds.every(matId => 
      // Ou já estava completo antes, ou é o material que acabou de ser fechado
      userProgress.some(p => 
        p.materialId === matId && 
        p.collectionId === colId && 
        p.status === 'completed'
      ) || matId === mat.id
    );
    
    if (allCompleted) {
      const collection = collections.find(c => c.id === colId);
      
      if (collection && collection.points > 0) {
        // Registra progresso da trilha
        await mockDb.upsertCollectionProgress(user.id, colId, 'completed');
        
        // Atribui pontos de bônus
        await mockDb.addPoints(user.id, collection.points);
        addUserPoints(collection.points);
        
        // Dispara webhook
        WebhookEvents.collectionCompleted({
          userId: user.id,
          userRole: user.role,
          collectionId: colId,
          points: collection.points,
        });
        
        // Exibe celebração
        setCelebration({ 
          trailName: collection.title['pt-br'] || collection.title['en'] || 'Trilha', 
          bonusXp: collection.points 
        });
        
        // Remove celebração após 5 segundos
        setTimeout(() => setCelebration(null), 5000);
      }
    }
  }
}
```

### Fluxo

```
USUÁRIO COMPLETA ÚLTIMO MATERIAL
         │
         ▼
┌─────────────────────────┐
│ collectionItemMap[     │
│ colId] = [ids...]      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ every(matId =>         │
│  status === 'completed')│
└────────┬────────────────┘
         │
    SIM (todos) │ NÃO
       │        │
       ▼        ▼
┌──────────────────┐   ┌──────────────────┐
│upsertCollection │   │ Não faz nada    │
│_progress        │   │ (não completou)  │
└────────┬─────────┘   └──────────────────┘
         │
         ▼
┌─────────────────────────┐
│ mockDb.addPoints(bônus) │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ WebhookEvents.         │
│ collectionCompleted() │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ setCelebration()       │
│ Exibe popup            │
└─────────────────────────┘
```

---

## 3. Tabela de Exemplos

| Trilha | Materiais | XP Material | XP Bônus | XP Total se Completar |
|--------|-----------|-------------|----------|----------------------|
| Kit Iniciante | 3 | 50 cada (150) | 100 | **250 XP** |
| Marketing Dental | 5 | 100 cada (500) | 150 | **650 XP** |
| Protocolos Expert | 8 | 75 cada (600) | 200 | **800 XP** |

---

## 4. Banco de Dados

### Tabela: collection_progress

```sql
CREATE TABLE collection_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  collection_id UUID REFERENCES collections(id),
  status VARCHAR(20) CHECK (status IN ('started', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, collection_id)
);
```

### Função de Registro

```typescript
// mockDb.ts
upsertCollectionProgress: async (
  userId: string, 
  collectionId: string, 
  status: 'started' | 'completed'
): Promise<void> => {
  const payload: any = { 
    user_id: userId, 
    collection_id: collectionId, 
    status 
  };
  
  if (status === 'completed') {
    payload.completed_at = new Date().toISOString();
  }
  
  const { error } = await supabase
    .from('collection_progress')
    .upsert(payload, { onConflict: 'user_id,collection_id' });
    
  if (error) console.error('Error upserting collection progress:', error);
}
```

---

## 5. Verificação de Status

### Query: Verificar progresso de trilhas

```sql
SELECT 
  c.id,
  c.title->>'pt-br' as collection_name,
  COUNT(ci.material_id) as total_materials,
  COUNT(cp.material_id) as completed_materials,
  ROUND(
    COUNT(cp.material_id)::numeric / NULLIF(COUNT(ci.material_id), 0) * 100
  ) as progress_pct,
  cp.status as collection_status,
  c.points as bonus_points
FROM collections c
LEFT JOIN collection_items ci ON ci.collection_id = c.id
LEFT JOIN user_progress cp ON cp.collection_id = c.id AND cp.status = 'completed'
WHERE c.active = true
GROUP BY c.id, c.title, cp.status, c.points
ORDER BY c.title->>'pt-br';
```

### Response

```
┌──────────────┬─────────────────┬───────────┬────────────┬──────────┬───────────┐
│ id           │ collection_name │ total_mat │ completed  │ progress │ bonus_pts │
├──────────────┼─────────────────┼───────────┼────────────┼──────────┼───────────┤
│ uuid-1       │ Kit Iniciante   │ 3         │ 3          │ 100%     │ 100       │
│ uuid-2       │ Marketing      │ 5         │ 2          │ 40%      │ 150       │
│ uuid-3       │ Protocolos     │ 8         │ 0          │ 0%       │ 200       │
└──────────────┴─────────────────┴───────────┴────────────┴──────────┴───────────┘
```

---

## 6. Interface no Dashboard

### Card de Trilha com Pontos

```
┌─────────────────────────────────────────────┐
│ 📖 Kit Iniciante                      ⭐ 100 │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │████████████░░░░░░░░░ 40% (2/5)        │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 💰 Complete e ganhe +100 XP!               │
└─────────────────────────────────────────────┘
```

### Código de Renderização

```tsx
// Dashboard.tsx
{selectedCollection.points > 0 && (
  <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm" 
       style={{ backgroundColor: colorMix('var(--color-accent)', 15, 'rgba(201,166,85,0.15)'), color: 'var(--color-accent)' }}>
    <Star size={16} style={{ fill: 'var(--color-warning)', color: 'var(--color-warning)' }} />
    {selectedCollection.points} XP ao concluir
  </div>
)}
```

---

## 7. Celebration ao Completar

### Componente

```tsx
// TrailCompletionCelebration.tsx
<TrailCompletionCelebration
  isOpen={!!celebration}
  trailName={celebration?.trailName || ''}
  bonusXp={celebration?.bonusXp || 0}
  onClose={() => setCelebration(null)}
/>
```

### Visual

```
╔══════════════════════════════════════════╗
║          🎉 TRILHA COMPLETADA! 🎉        ║
║                                          ║
║   Kit Iniciante                           ║
║   +100 XP                                  ║
║                                          ║
║   ────────────── OK ───────────────       ║
╚══════════════════════════════════════════╝
```

---

*Próximo: [05-webhooks.md](./05-webhooks.md) - Webhooks*