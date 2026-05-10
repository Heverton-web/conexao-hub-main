# Capítulo 07: Notificações e Exibição

## 7.1. O Momento da Conquista

Quando o sistema detecta que um usuário ganhou um badge, ele dispara uma notificação imediata.

### Sistema de Toast (Sonner)
Utilizamos a biblioteca `Sonner` para exibir alertas flutuantes:
- **Estilo**: `liquid-glass` com borda na cor do badge.
- **Conteúdo**: Nome do badge e a recompensa em XP.
- **Interação**: Clicar na notificação pode levar o usuário diretamente ao seu Álbum de Conquistas.

---

## 7.2. Álbum de Conquistas (Badge Album)

Localizado no Dashboard ou Perfil do Usuário, o álbum é onde todas as conquistas são exibidas de forma permanente.

### Estados de Exibição:
1.  **Conquistado**: Badge colorido, com glow ativo e detalhes visíveis.
2.  **Bloqueado (Opcional)**: Badge em tons de cinza ou silhueta, indicando que ainda há algo a ser alcançado.

---

## 7.3. Componente `BadgeDisplay`

Este componente reutilizável é responsável por renderizar o ícone do badge em diferentes tamanhos.

| Variante | Tamanho | Uso |
|----------|---------|-----|
| `sm` | 32px | Listas e tabelas. |
| `md` | 56px | Notificações e cards. |
| `lg` | 80px | Destaque no perfil. |

---

## 7.4. Celebração de Conquista

Para badges de alto nível (ex: "Mestre da Plataforma"), o sistema pode disparar um efeito de confete (`canvas-confetti`) para aumentar a dopamina e o senso de celebração.

---

## Próximo Passo

Avance para o **[Capítulo 08: Testes e Troubleshooting](./08-testes-troubleshooting.md)**.
