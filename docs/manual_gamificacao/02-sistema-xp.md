# 02. Sistema de Pontos (XP)

## Visão Geral

O sistema de XP do Conexão Hub distribui pontos em duas etapas:
1. **30%** ao abrir o material pela primeira vez
2. **70%** ao completar o material (fechar o visualizador)

Esta divisão garante que o usuário seja reconhecido tanto pelo início quanto pela conclusão do aprendizado.

---

## 1. Pontos ao Abrir Material (30%)

### Trigger

Ocorre quando o usuário clica em um material e o visualizador abre pela primeira vez.

### Lógica de Código

```typescript
// Dashboard.tsx - handleViewMaterial
const handleViewMaterial = async (mat: Material, lang: Language) => {
  const currentCollectionId = activeView === 'collection-detail' ? selectedCollection?.id : undefined;
  
  if (user) {
    // Verifica se é o primeiro acesso
    const existing = userProgress.find(p => 
      p.materialId === mat.id && p.collectionId === currentCollectionId
    );
    
    if (!existing) {
      await mockDb.upsertProgress(user.id, mat.id, 'started', currentCollectionId);
      
      // Atribui 30% dos pontos
      if (mat.points > 0) {
        const startXp = Math.floor(mat.points * 0.3);
        await mockDb.addPoints(user.id, startXp);
        addUserPoints(startXp);
      }
      
      setUserProgress(prev => [
        ...prev, 
        { id: '', userId: user.id, materialId: mat.id, collectionId: currentCollectionId, status: 'started', createdAt: new Date().toISOString() }
      ]);
    }
  }
};
```

### Fluxo

```
USUÁRIO CLICA EM MATERIAL
         │
         ▼
┌─────────────────────────┐
│ Verifica userProgress  │
│ (já foi acessado?)     │
└────────┬────────────────┘
         │
    NÃO │ SIM
    │   │
    ▼   ▼
┌────────────┐      ┌──────────────────┐
│upsertProgress    │      │ Não faz nada  │
│ (status: started) │      │ (já tem pts)  │
└────────┬─────────┘      └──────────────────┘
         │
         ▼
┌─────────────────────────┐
│ mockDb.addPoints(30%)  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ addUserPoints(state)    │
│ Atualiza UI             │
└─────────────────────────┘
```

### Exceptions

- Se `mat.points = 0`: nenhum ponto é atribuído
- Se já foi acessado anteriormente: não duplica pontos

---

## 2. Pontos ao Completar Material (70%)

### Trigger

Ocorre quando o usuário fecha o modal do visualizador de material.

### Lógica de Código

```typescript
// Dashboard.tsx - handleCloseViewer
const handleCloseViewer = async () => {
  // Primeiro fecha o modal SEMPRE
  setViewingMaterial(null);
  
  // Depois tenta marcar como completo
  try {
    if (viewingMaterial && user) {
      const mat = viewingMaterial.mat;
      const colId = viewingMaterial.collectionId;
      const existing = userProgress.find(p => 
        p.materialId === mat.id && p.collectionId === colId
      );

      if (existing?.status !== 'completed') {
        // Marca como completo no banco
        await mockDb.upsertProgress(user.id, mat.id, 'completed', colId);

        // Dispara webhook de material completo
        const totalPoints = mat.points;
        WebhookEvents.materialCompleted({
          userId: user.id,
          userRole: user.role,
          materialId: mat.id,
          points: totalPoints,
        });

        // Atribui os 70% restantes
        if (mat.points > 0) {
          const remainingXp = mat.points - Math.floor(mat.points * 0.3);
          await mockDb.addPoints(user.id, remainingXp);
          addUserPoints(remainingXp);
        }

        // Atualiza estado local
        setUserProgress(prev => {
          const filtered = prev.filter(p => 
            !(p.materialId === mat.id && p.collectionId === colId)
          );
          return [...filtered, { 
            id: crypto.randomUUID(), 
            userId: user.id, 
            materialId: mat.id, 
            collectionId: colId, 
            status: 'completed', 
            completedAt: new Date().toISOString(), 
            createdAt: new Date().toISOString() 
          }];
        });
      }
    }
  } catch (error) {
    console.error('Erro ao marcar material como completo:', error);
  }
};
```

### Fluxo

```
USUÁRIO FECHA MODAL
         │
         ▼
┌─────────────────────────┐
│ setViewingMaterial(null)│ ← Modal fecha primeiro
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Verifica status atual   │
│ (já completo?)          │
└────────┬────────────────┘
         │
    NÃO │ SIM
    │   │
    ▼   ▼
┌────────────┐      ┌──────────────────┐
│upsertProgress    │      │ Não faz nada  │
│ (status: completed)    │      │ (já completo)│
└────────┬─────────┘      └──────────────────┘
         │
         ▼
┌─────────────────────────┐
│ WebhookEvents.          │
│ materialCompleted()    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ mockDb.addPoints(70%)   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ addUserPoints(state)    │
│ Atualiza UI             │
└─────────────────────────┘
```

---

## 3. Tabela de Pontos por Material

| Material | Pontos Totais | Ao Abrir (30%) | Ao Completar (70%) | Diferença |
|----------|---------------|----------------|-------------------|-----------|
| Kit Iniciante (PDF) | 50 | 15 XP | 35 XP | +20 XP |
| Marketing Dental (Vídeo) | 100 | 30 XP | 70 XP | +40 XP |
| Manual ExpertGuide (HTML) | 75 | 22 XP | 53 XP | +31 XP |
| Webinar Implantes (Vídeo) | 150 | 45 XP | 105 XP | +60 XP |
| Apostila Protocolos (PDF) | 200 | 60 XP | 140 XP | +80 XP |

### Cálculo

```typescript
const startXp = Math.floor(mat.points * 0.3);  // Arredonda para baixo
const remainingXp = mat.points - startXp;       // Garante total = mat.points
```

---

## 4. Registro no Banco de Dados

### Tabela: user_progress

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  material_id UUID REFERENCES materials(id),
  collection_id UUID REFERENCES collections(id),
  status VARCHAR(20) CHECK (status IN ('started', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, material_id, collection_id)
);
```

### Inserção de Progresso

```sql
-- Primeiro acesso (started)
INSERT INTO user_progress (user_id, material_id, collection_id, status)
VALUES ('user-uuid', 'material-uuid', 'collection-uuid', 'started');

-- Completar material (completed)
UPDATE user_progress 
SET status = 'completed', completed_at = NOW()
WHERE user_id = 'user-uuid' AND material_id = 'material-uuid';
```

---

## 5. Atualização de Pontos do Usuário

```typescript
// mockDb.ts - addPoints
addPoints: async (userId: string, points: number): Promise<void> => {
  const { error } = await supabase.rpc('increment_user_points', {
    p_user_id: userId,
    p_points: points
  });
  if (error) console.error('Error adding points:', error);
}
```

### Função RPC (PostgreSQL)

```sql
CREATE OR REPLACE FUNCTION increment_user_points(
  p_user_id UUID,
  p_points INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET points = points + p_points
  WHERE id = p_user_id;
END;
$$;
```

---

*Próximo: [03-niveis-patentes.md](./03-niveis-patentes.md) - Níveis e Patentes*