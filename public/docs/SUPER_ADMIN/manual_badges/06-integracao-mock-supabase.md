# Capítulo 06: Integração Mock vs Produção

## 6.1. O papel do `mockStore`

Durante o desenvolvimento e testes, o sistema utiliza um **Store em Memória (Singleton)** para simular o banco de dados. Isso permite iterar rapidamente sem depender de latência de rede ou custos de DB.

### Arquivo: `src/lib/mockStore.ts`
Contém as tabelas `badges` e `user_badges` inicializadas com dados semente (seeds).

---

## 6.2. Mapeamento de Campos (Snake vs Camel)

Uma das funções críticas do `mockDb.ts` é a tradução de nomenclatura:

| Contexto | Estilo | Exemplo |
|----------|--------|---------|
| **Banco de Dados (SQL/MockStore)** | `snake_case` | `trigger_type`, `icon_name` |
| **Aplicação (TypeScript/UI)** | `camelCase` | `triggerType`, `iconName` |

### Exemplo de Mapper no `mockDb.ts`:
```typescript
const mapBadge = (b: any): Badge => ({
  ...b,
  triggerType: b.trigger_type,
  triggerValue: b.trigger_value,
  iconName: b.icon_name,
  pointsReward: b.points_reward
});
```

---

## 6.3. Transição para Produção

Para desativar o modo mock e usar o Supabase real:
1.  Certifique-se de que as migrações do **Capítulo 02** foram executadas.
2.  No arquivo `src/lib/mockDb.ts`, a flag `useMock` deve ser alterada ou as chamadas redirecionadas para o `supabaseClient`.
3.  As queries SQL devem substituir as chamadas ao `mockStore`.

> [!IMPORTANT]
> Sempre valide se as chaves estrangeiras (`user_id`, `badge_id`) existem no banco real antes de realizar inserções em `user_badges`.

---

## Próximo Passo

Avance para o **[Capítulo 07: Interface do Usuário](./07-notificacoes-exibicao.md)**.
