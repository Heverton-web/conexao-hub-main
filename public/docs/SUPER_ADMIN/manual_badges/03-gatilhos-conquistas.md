# Capítulo 03: Gatilhos e Conquistas

## 3.1. Tipos de Gatilho (Trigger Types)

O sistema de badges é reativo. Ele aguarda por eventos específicos para validar se o usuário atingiu os critérios de uma conquista.

Os tipos de gatilho suportados são:

| Tipo | Descrição | Exemplo de Uso |
|------|-----------|----------------|
| `material_completed` | Número total de materiais individuais completados. | "Completou 50 PDFs/Vídeos" |
| `collection_completed` | Número de trilhas (coleções) totalmente finalizadas. | "Mestre da Trilha Iniciante" |
| `points_reached` | Quando o usuário atinge uma marca total de XP. | "Alcançou 5.000 XP" |
| `streak_days` | Dias consecutivos acessando a plataforma. | "7 dias de fogo (Streak)" |
| `ranking_position` | Posição atingida no ranking global. | "Top 3 do Mês" |
| `login_count` | Quantidade total de vezes que o usuário logou. | "Pioneiro (Primeiro Login)" |

---

## 3.2. A Função `checkAndAwardBadges`

Esta é a "inteligência" do sistema. Ela deve ser chamada sempre que um evento de progresso ocorre.

### Lógica de Execução:
1.  **Busca**: Carrega todos os badges que o usuário **ainda não possui**.
2.  **Verificação**: Compara o progresso atual do usuário com o `trigger_value` do badge.
3.  **Concessão**: Se `progresso >= trigger_value`, chama `awardBadge`.
4.  **Recompensa**: Adiciona `points_reward` ao saldo de XP do usuário.

### Exemplo de Fluxo (Pseudocódigo):
```typescript
async function checkAndAwardBadges(userId, stats) {
  const availableBadges = await getUnearnedBadges(userId);
  
  for (const badge of availableBadges) {
    if (stats[badge.triggerType] >= badge.triggerValue) {
      await awardBadge(userId, badge.id);
      await addPoints(userId, badge.pointsReward);
      toast.success(`Parabéns! Você ganhou o badge: ${badge.name}`);
    }
  }
}
```

---

## 3.3. Configuração de Gatilhos Múltiplos

Um mesmo evento (ex: completar um material) pode disparar múltiplos badges:
- Um badge por completar 1 material.
- Um badge por completar 10 materiais.
- Um badge por completar 100 materiais.

O sistema é projetado para lidar com isso de forma cumulativa, disparando cada um no momento exato em que o critério é atingido.

---

## Próximo Passo

Avance para o **[Capítulo 04: Gestão Administrativa](./04-gestao-admin.md)**.
