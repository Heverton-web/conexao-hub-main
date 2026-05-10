# 07. Testes

## Visão Geral

Esta seção descreve os cenários de teste para validar o funcionamento correto do sistema de gamificação.

---

## 1. Teste de Pontos por Material

### Objetivo

Validar que os pontos são distribuídos corretamente (30% + 70%).

### Pré-condições

- Usuário logado
- Material com pontos definidos (ex: 100 XP)
- Primeiro acesso ao material

### Passos

1. **Preparar Material**
   ```sql
   -- Criar material de teste com 100 XP
   INSERT INTO materials (title, points, type, active)
   VALUES ('{"pt-br": "Material Teste XP"}', 100, 'pdf', true);
   ```

2. **Acessar Dashboard**
   - Faça login como usuário de teste

3. **Abrir Material**
   - Clique no material criado
   - Verifique no banco: `SELECT points FROM profiles WHERE id = 'user-id';`
   - Esperado: **30 XP** (30% de 100)

4. **Completar Material**
   - Feche o visualizador
   - Verifique no banco novamente
   - Esperado: **100 XP** (30% + 70%)

### Validação no Banco

```sql
-- Verificar pontos atuais do usuário
SELECT id, name, points FROM profiles WHERE id = 'user-id';

-- Verificar histórico de progresso
SELECT * FROM user_progress 
WHERE user_id = 'user-id' 
ORDER BY created_at DESC;
```

### Resultado Esperado

| Etapa | Pontos Acumulados | Observação |
|-------|-------------------|------------|
| Antes de acessar | 0 | - |
| Após abrir | 30 | 30% de 100 |
| Após completar | 100 | 100% do total |

---

## 2. Teste de Pontos por Trilha

### Objetivo

Validar que os pontos de trilha são atribuídos ao completar todos materiais.

### Pré-condições

- Trilha criada com 3 materiais
- Trilha com pontos de bônus definidos (ex: 50 XP)
- Usuário não completou nenhum ainda

### Passos

1. **Preparar Trilha**
   ```sql
   -- Criar trilha com 50 XP de bônus
   INSERT INTO collections (title, points, active)
   VALUES ('{"pt-br": "Trilha Teste"}', 50, true);

   -- Adicionar 3 materiais à trilha
   INSERT INTO collection_items (collection_id, material_id, order_index)
   VALUES 
     ('trilha-uuid', 'material-1', 1),
     ('trilha-uuid', 'material-2', 2),
     ('trilha-uuid', 'material-3', 3);
   ```

2. **Completar Materiais**
   - Complete o Material 1 → +30 XP
   - Complete o Material 2 → +30 XP
   - Complete o Material 3 → +30 XP

3. **Verificar Bônus**
   - Após completar o último material, verifique:
     - Pontos do usuário (+50 XP de bônus)
     - collection_progress status = 'completed'

### Validação no Banco

```sql
-- Verificar progresso da trilha
SELECT * FROM collection_progress 
WHERE user_id = 'user-id' 
AND collection_id = 'trilha-uuid';

-- Verificar se todos materiais estão completados
SELECT * FROM user_progress 
WHERE user_id = 'user-id' 
AND collection_id = 'trilha-uuid'
AND status = 'completed';
```

### Resultado Esperado

| Etapa | Pontos Acumulados | collection_progress |
|-------|-------------------|---------------------|
| 0/3 materiais | 0 (pontos dos materiais) | null |
| 1/3 materiais | 30 | null |
| 2/3 materiais | 60 | null |
| **3/3 completos** | **110** (+50 bônus) | **completed** |

---

## 3. Teste de Progressão de Nível

### Objetivo

Validar que o nível muda corretamente conforme os pontos.

### Passos

1. **Verificar Nível Iniciante**
   - Com 0 XP → nível deve ser "Iniciante"

2. **Subir para Bronze**
   - Acumule 100 XP → nível deve ser "Bronze"
   - Verifique cor: `#cd7f32`

3. **Subir para Prata**
   - Acumule 300 XP → nível deve ser "Prata"
   - Verifique cor: `#c0c0c0`

4. **Subir para Ouro**
   - Acumule 600 XP → nível deve ser "Ouro"
   - Verifique cor: `#ffd700`

5. **Subir para Master**
   - Acumule 1000 XP → nível deve ser "Master"
   - Verifique cor: `#c9a655`

### Validação no Código

```typescript
// Executar no console do navegador
getUserLevel(0);    // "Iniciante"
getUserLevel(50);   // "Iniciante"
getUserLevel(100);  // "Bronze"
getUserLevel(250);  // "Bronze"
getUserLevel(300);  // "Prata"
getUserLevel(500);  // "Prata"
getUserLevel(600);  // "Ouro"
getUserLevel(900);  // "Ouro"
getUserLevel(1000); // "Master"
```

### Tabela de Teste

| Pontos | Nível | Cor |
|--------|-------|-----|
| 0 | Iniciante | #888888 |
| 50 | Iniciante | #888888 |
| 99 | Iniciante | #888888 |
| 100 | Bronze | #cd7f32 |
| 200 | Bronze | #cd7f32 |
| 299 | Bronze | #cd7f32 |
| 300 | Prata | #c0c0c0 |
| 500 | Prata | #c0c0c0 |
| 599 | Prata | #c0c0c0 |
| 600 | Ouro | #ffd700 |
| 900 | Ouro | #ffd700 |
| 1000+ | Master | #c9a655 |

---

## 4. Teste de Configuração de Níveis

### Objetivo

Validar que Admin consegue criar/editar/excluir patentes.

### Passos

1. **Acessar Admin**
   - Faça login como Super Admin
   - Navegue para **Configurações → Gamificação**

2. **Criar Nova Patente**
   - Nome: "Diamante"
   - XP Mínimo: 2000
   - Cor: selectione `#3b82f6` (azul)
   - Clique em "+"

3. **Editar Patente**
   - Clique no ícone ✏️
   - Altere XP para 2500
   - Clique em "Salvar"

4. **Excluir Patente**
   - Clique no ícone 🗑️
   - Confirme no modal

### Validação no Banco

```sql
-- Ver patentes existentes
SELECT * FROM gamification_levels ORDER BY order_index;

-- Após criar Diamante (2000 XP):
-- | name     | min_points | color   | order_index |
-- |----------|-------------|---------|-------------|
-- | Iniciante| 0           | #888888 | 0           |
-- | Bronze   | 100         | #cd7f32 | 1           |
-- | Prata    | 300         | #c0c0c0 | 2           |
-- | Ouro     | 600         | #ffd700 | 3           |
-- | Master   | 1000        | #c9a655 | 4           |
-- | Diamante | 2000        | #3b82f6 | 5           |
```

---

## 5. Teste de Webhook

### Objetivo

Validar que webhooks são disparados corretamente.

### Passos

1. **Configurar Webhook**
   - No Admin → Integrações, configure uma URL de teste
   - Use um serviço como https://webhook.site/

2. **Disparar Eventos**
   - Abra um material → verifique webhook `material_accessed`
   - Complete o material → verifique webhook `material_completed`
   - Complete uma trilha → verifique webhook `collection_completed`

### Verificar Payload

```json
// material_accessed
{
  "event": "material_accessed",
  "timestamp": "2026-05-09T10:30:00Z",
  "data": { "userId": "...", "userRole": "...", "materialId": "..." }
}

// material_completed
{
  "event": "material_completed",
  "timestamp": "2026-05-09T10:35:00Z",
  "data": { "userId": "...", "userRole": "...", "materialId": "...", "points": 50 }
}

// collection_completed
{
  "event": "collection_completed",
  "timestamp": "2026-05-09T11:00:00Z",
  "data": { "userId": "...", "userRole": "...", "collectionId": "...", "points": 100 }
}
```

---

## 6. Teste de Celebration

### Objetivo

Validar que a celebração aparece ao completar uma trilha.

### Passos

1. Complete todos os materiais de uma trilha
2. Aguarde o modal de celebração
3. Verifique se mostra o nome da trilha e XP gained
4. Clique em "OK" ou aguarde 5 segundos

### Critérios de Sucesso

- [ ] Modal aparece com animação
- [ ] Nome da trilha está correto
- [ ] Pontos de bônus estão corretos
- [ ] Botão "OK" funciona
- [ ] Auto-close após 5 segundos

---

## 7. Checklist de Testes

| # | Teste | Status |
|---|-------|--------|
| 1 | Pontos 30% ao abrir material | ⬜ |
| 2 | Pontos 70% ao completar material | ⬜ |
| 3 | Pontos totais corretos (30+70=100%) | ⬜ |
| 4 | Pontos de trilha ao completar todos materiais | ⬜ |
| 5 | Progressão de nível correta | ⬜ |
| 6 | Criar patente no Admin | ⬜ |
| 7 | Editar patente no Admin | ⬜ |
| 8 | Excluir patente no Admin | ⬜ |
| 9 | Webhook material_accessed | ⬜ |
| 10 | Webhook material_completed | ⬜ |
| 11 | Webhook collection_completed | ⬜ |
| 12 | Celebration aparece | ⬜ |
| 13 | Celebration fecha automaticamente | ⬜ |

---

*Próximo: [08-troubleshooting.md](./08-troubleshooting.md) - Troubleshooting*