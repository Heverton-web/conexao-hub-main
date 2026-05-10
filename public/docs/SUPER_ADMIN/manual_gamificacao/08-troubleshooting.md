# 08. Troubleshooting

## Visão Geral

Esta seção documenta problemas comuns e suas soluções.

---

## 1. Pontos não são atribuídos ao abrir material

### Sintoma

Usuário abre material, mas não recebe os 30% de XP.

### Causas Possíveis

| Causa | Verificação |
|-------|-------------|
| Material sem pontos | `SELECT points FROM materials WHERE id = 'material-id';` |
| Já acessou antes | Verificar `user_progress` com status 'started' |
| Erro no banco | Verificar console do navegador |

### Solução

1. Verificar se o material tem pontos > 0
   ```sql
   SELECT id, title->>'pt-br', points FROM materials WHERE id = 'material-id';
   ```

2. Se pontos = 0, atualizar
   ```sql
   UPDATE materials SET points = 50 WHERE id = 'material-id';
   ```

3. Verificar logs do navegador
   - Abra Developer Tools (F12)
   - Verifique erros no Console

---

## 2. Pontos não são atribuídos ao completar material

### Sintoma

Usuário fecha modal do material, mas não recebe os 70% de XP.

### Causas Possíveis

| Causa | Verificação |
|-------|-------------|
| Status já é 'completed' | Verificar `user_progress` |
| Erro na função addPoints | Verificar logs |
| Estado não atualiza | Verificar React state |

### Solução

1. Verificar status no banco
   ```sql
   SELECT * FROM user_progress 
   WHERE user_id = 'user-id' AND material_id = 'material-id';
   ```

2. Se já está 'completed', não deve receber pontos novamente (correto)

3. Se não tem registro, verificar função RPC
   ```sql
   -- Testar função diretamente
   SELECT increment_user_points('user-id', 35);
   ```

---

## 3. Pontos de trilha não são atribuídos

### Sintoma

Usuário completa todos os materiais, mas não recebe o bônus da trilha.

### Causas Possíveis

| Causa | Verificação |
|-------|-------------|
| Trilha sem pontos | `SELECT points FROM collections WHERE id = 'trilha-id';` |
| collection_progress não é chamada | Verificar logs |
| collectionItemMap não tem materiais | Verificar console |

### Solução

1. Verificar pontos da trilha
   ```sql
   SELECT id, title->>'pt-br', points FROM collections WHERE id = 'trilha-id';
   ```

2. Verificar materiais da trilha
   ```sql
   SELECT ci.*, m.title->>'pt-br' as material_title
   FROM collection_items ci
   JOIN materials m ON m.id = ci.material_id
   WHERE ci.collection_id = 'trilha-id';
   ```

3. Verificar completamento de todos
   ```sql
   SELECT p.* 
   FROM user_progress p
   JOIN collection_items ci ON ci.material_id = p.material_id
   WHERE p.user_id = 'user-id' 
   AND p.collection_id = 'trilha-id'
   AND p.status = 'completed';
   ```

---

## 4. Usuário não sobe de nível

### Sintoma

Usuário tem pontos suficientes, mas nível não atualiza.

### Causas Possíveis

| Causa | Verificação |
|-------|-------------|
| Pontos não salvos no banco | `SELECT points FROM profiles WHERE id = 'user-id';` |
| getUserLevel não funciona | Testar função no console |
| UI não atualiza | Verificar React state |

### Solução

1. Verificar pontos no banco
   ```sql
   SELECT id, name, points FROM profiles WHERE id = 'user-id';
   ```

2. Testar função no console do navegador
   ```javascript
   getUserLevel(650); // Deve retornar "Ouro"
   ```

3. Verificar se `addUserPoints` está sendo chamado
   ```typescript
   // No Dashboard.tsx
   const { user, addUserPoints } = useAuth();
   
   // Deve ser chamado após addPoints no banco
   await mockDb.addPoints(user.id, remainingXp);
   addUserPoints(remainingXp); // Este está sendo chamado?
   ```

---

## 5. Pontos duplicados

### Sintoma

Usuário recebeu pontos múltiplas vezes pelo mesmo material.

### Causas Possíveis

| Causa | Verificação |
|-------|-------------|
| Sistema não verificou acesso anterior | Verificar lógica do `handleViewMaterial` |
| Erro na verificação de existing | Verificar console |

### Solução

1. Verificar registros duplicados
   ```sql
   SELECT user_id, material_id, collection_id, COUNT(*)
   FROM user_progress
   GROUP BY user_id, material_id, collection_id
   HAVING COUNT(*) > 1;
   ```

2. O sistema já deve verificar se já existe registro antes de criar

3. Se aconteceu, limpar dados duplicados
   ```sql
   DELETE FROM user_progress
   WHERE id IN (
     SELECT id FROM user_progress
     WHERE user_id = 'user-id' AND material_id = 'material-id'
     ORDER BY created_at DESC
     OFFSET 1
   );
   ```

---

## 6. Celebração não aparece

### Sintoma

Usuário completou trilha, mas modal de celebração não é exibido.

### Causas Possíveis

| Causa | Verificação |
|-------|-------------|
| setCelebration não é chamado | Verificar console |
| collectionItemMap vazio | Verificar dados |
| collection.points = 0 | Verificar trilha |

### Solução

1. Verificar no console do navegador
   ```javascript
   // Deve aparecer quando completa última trilha
   console.log('Celebration triggered:', { trailName, bonusXp });
   ```

2. Verificar se a condição de completamento está sendo atingida
   ```typescript
   const allCompleted = collectionMaterialIds.every(matId => 
     userProgress.some(p => ...) || matId === mat.id
   );
   // Este allCompleted está sendo true?
   ```

3. Verificar pontos da trilha
   ```sql
   SELECT points FROM collections WHERE id = 'trilha-id';
   -- Se 0, não vai mostrar celebration
   ```

---

## 7. Webhook não é disparado

### Sintoma

Webhook não chega ao sistema externo.

### Causas Possíveis

| Causa | Verificação |
|-------|-------------|
| URL não configurada | Verificar `app_config` |
| Erro de rede | Verificar console |
| CORS bloquando | Verificar resposta |

### Solução

1. Verificar se URL está configurada
   ```sql
   SELECT value FROM app_config WHERE key = 'webhook_url';
   ```

2. Se não existe, configurar no Admin → Integrações

3. Verificar erros no console
   ```javascript
   console.log('🔗 Webhook disparado:', event);
   console.error('❌ Webhook falhou:', error);
   ```

4. Testar manualmente com curl
   ```bash
   curl -X POST sua-url-webhook -d '{}'
   ```

---

## 8. Erro de permissão (RLS)

### Sintoma

Erro "row-level security" ao tentar inserir/atualizar progresso.

### Solução

1. Verificar políticas RLS
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'user_progress';
   ```

2. Se não houver políticas, criar
   ```sql
   CREATE POLICY "Users can manage own progress"
   ON user_progress FOR ALL
   USING (auth.uid() = user_id)
   WITH CHECK (auth.uid() = user_id);
   ```

---

## 9. Tabela de Erros Comuns

| Código | Mensagem | Causa | Solução |
|--------|-----------|-------|---------|
| E001 | "Points is not a function" | `addPoints` mal importado | Verificar import |
| E002 | "Cannot read property 'points' of undefined" | Material sem points | Adicionar points no Admin |
| E003 | "upsertCollectionProgress is not defined" | Função não existe | Verificar mockDb.ts |
| E004 | "Webhook URL not configured" | URL vazia | Configurar no Admin |
| E005 | "User not found" | Usuário não existe no banco | Verificar autenticação |

---

## 10. Debugging

### Habilitar Logs

Adicione aos componentes para debug:

```typescript
// Em handleViewMaterial
console.log('🎯 Material acessado:', { 
  materialId: mat.id, 
  hasPoints: mat.points > 0,
  startXp: mat.points > 0 ? Math.floor(mat.points * 0.3) : 0 
});

// Em handleCloseViewer  
console.log('✅ Material completo:', { 
  materialId: mat.id,
  existingStatus: existing?.status,
  remainingXp: mat.points > 0 ? mat.points - Math.floor(mat.points * 0.3) : 0
});
```

### Verificar Estado

```typescript
// No React DevTools
userProgress: [
  { materialId: '...', status: 'started', ... },
  { materialId: '...', status: 'completed', ... }
]

user: {
  points: 650,
  role: 'cliente'
}
```

---

## 11. Recursos de Ajuda

| Recurso | Link |
|---------|------|
| Supabase Docs | https://supabase.com/docs |
| PostgreSQL RLS | https://www.postgresql.org/docs/current/ddl-rowsecurity.html |
| React Hooks | https://react.dev/reference/react |

---

*Fim do Manual de Gamificação*