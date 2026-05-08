# Plano: Cards de Login Mock na Tela de Autenticação

## Objetivo

Adicionar cards clicáveis na tela de login para acesso rápido às contas demo (mock), com opção de visibility configurável via painel de admin.

---

## Contexto Atual

### Sistema de Autenticação

- **AuthPage.tsx**: Página de login
- **AuthContext.tsx**: Já possui `loginMock(role)` implementado (linha 105-119)
- **mockDb.ts**: contém 5 usuários mock (lines 28-32)

### Usuários Mock Disponíveis

| ID | Email | Role |
|----|-------|------|
| mock-admin | admin@demo.com | super_admin |
| mock-client | client@demo.com | client |
| mock-distrib | distributor@demo.com | distributor |
| mock-consult | consultant@demo.com | consultant |
| mock-manager | manager@demo.com | manager |

---

## Alterações Propostas

### 1. AuthPage.tsx — Adicionar Cards de Login Mock

**Local:** Após o formulário de login, antes do link de recuperação de senha

**Estrutura:**
```tsx
{showMockCards && (
  <div className="space-y-3">
    <p className="text-sm text-muted-foreground">Acesso Rápido (Demo)</p>
    <div className="grid grid-cols-2 gap-2">
      {mockRoles.map(role => (
        <button
          key={role}
          onClick={() => loginMock(role)}
          className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
        >
          <span className="text-sm font-medium">{roleLabels[role]}</span>
        </button>
      ))}
    </div>
  </div>
)}
```

### 2. AuthContext.tsx — Expor Configuração

**Adicionar ao provider:**
```typescript
showMockCards: boolean
```

**Origem:** Consultar `system_config` (新增 campo `show_mock_login_cards`)

### 3. Admin.tsx — Toggle de Configuração

**Local:** Seção "Configurações do App"

**Opção:**
- Toggle: "Mostrar Cards de Login Demo"
- Salvar em `system_config`

---

## Armazenamento

A configuração será salva na tabela `system_config` existente:

```sql
ALTER TABLE system_config ADD COLUMN IF NOT EXISTS show_mock_login_cards boolean DEFAULT true;
```

---

## Estratégia de Segurança

### Backup Prévio

Antes de modificar qualquer arquivo, verificar que o código atual está no git.

### Rollback

```bash
# Se algo der errado:
git checkout -- src/pages/AuthPage.tsx
git checkout -- src/contexts/AuthContext.tsx
git checkout -- src/pages/Admin.tsx
```

### Ponto de Recuperação

Se a migration falhar, não executar — apenas modificar o frontend para fallback:

```typescript
// Se system_config não tiver a chave, usar true por padrão
const showMockCards = config?.show_mock_login_cards ?? true;
```

---

## Ordem de Implementação

1. **Backup**: Verificar estado do git
2. **AuthContext.tsx**: Expor `showMockCards` via context
3. **AuthPage.tsx**: Adicionar cards com condição
4. **Admin.tsx**: Adicionar toggle de configuração
5. **Teste local**: Verificar funcionamento
6. **Commit**: Criar commit com todas as alterações

---

## Arquivos a Modificar

| Arquivo | Mudança | Risco |
|---------|---------|-------|
| `src/pages/AuthPage.tsx` | Adicionar cards condicionais | Baixo |
| `src/contexts/AuthContext.tsx` | Expor flag de config | Baixo |
| `src/pages/Admin.tsx` | Adicionar toggle | Baixo |

---

## Estimativa de Tempo

- Implementação: 30-45 min
- Teste: 10 min
- Total: ~1 hora

---

## Rollback (Reversão)

Para reverter todas as alterações realizadas, execute:

```bash
# Reverter arquivos modificados
git checkout -- src/pages/AuthPage.tsx
git checkout -- src/pages/Admin.tsx
git checkout -- src/lib/mockDb.ts
git checkout -- src/types.ts

# Remover novo componente criado
rm src/components/hub/MockLoginCards.tsx
```

### Arquivos afetados pelo rollback:
- `src/pages/AuthPage.tsx` - cards de login removidos
- `src/pages/Admin.tsx` - toggle de configuração removido
- `src/lib/mockDb.ts` - suporte a showMockLoginCards removido
- `src/types.ts` - propriedade showMockLoginCards removida do SystemConfig
- `src/components/hub/MockLoginCards.tsx` - componente excluído

### Após rollback, execute:
```bash
npm run build
```
Para verificar que a aplicação continua funcionando corretamente.