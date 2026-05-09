# Capítulo 08: Testes e Troubleshooting

## 8.1. Roteiro de Testes Recomendado

Para garantir que o sistema está funcionando conforme o esperado, execute os seguintes cenários:

1.  **Criação**: Crie um badge de "Primeiro Login" com `trigger_value = 1` no Admin.
2.  **Gatilhamento**: Logue com um novo usuário e verifique se o badge é concedido.
3.  **Duplicidade**: Tente forçar o ganho do mesmo badge novamente (não deve ocorrer devido à constraint `UNIQUE` no banco).
4.  **XP**: Verifique se o saldo de XP do usuário aumentou pelo valor definido no `points_reward`.
5.  **Edição**: Altere a cor de um badge existente e veja se a mudança reflete imediatamente no álbum do usuário.

---

## 8.2. Problemas Comuns e Soluções

### O badge não aparece para o usuário após ele completar a tarefa.
- **Causa**: O gatilho pode estar configurado com um valor maior que o progresso real.
- **Solução**: Verifique no Admin o `trigger_value`. Certifique-se de que a função `checkAndAwardBadges` está sendo chamada no final do evento de "completar material".

### Erro "Badge já conquistado" no console.
- **Causa**: O sistema tentou inserir em `user_badges` um par `user_id/badge_id` que já existe.
- **Solução**: Isso é normal se a lógica de verificação frontal falhar, mas o banco de dados está protegendo a integridade. Adicione uma verificação `if (!alreadyHasBadge)` antes da inserção.

### O ícone do badge aparece como um quadrado ou erro.
- **Causa**: O nome do ícone salvo no banco não existe na biblioteca Lucide.
- **Solução**: Verifique se o nome está em minúsculas (ex: `star`, não `Star`) e se é um nome válido de ícone Lucide.

---

## 8.3. Logs de Depuração

Em modo desenvolvimento, você pode monitorar os disparos através do console do navegador filtrando por `[Badges]`. O sistema loga cada verificação de gatilho e concessão realizada.

---

## Checklist de Conclusão

- [x] Tabelas criadas no Supabase.
- [x] Badges semente (seeds) configurados no MockStore.
- [x] BadgeFormModal seguindo o Design System.
- [x] Sistema de Toasts ativo.
- [x] Álbum de conquistas renderizando no Dashboard.

---

*Manual concluído em 2026-05-09*
*Retornar para [Índice do Manual](./MANUAL-BADGES.md)*
