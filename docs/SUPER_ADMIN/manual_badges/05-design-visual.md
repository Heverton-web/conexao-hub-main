# Capítulo 05: Design e Branding

## 5.1. Estética Premium

Seguindo o design system da plataforma, os badges utilizam efeitos de **Liquid Glass** e **Glow Dinâmico**.

### Elementos Visuais do Badge:
- **Círculo de Fundo**: Gradiente circular com 40% a 80% de opacidade da cor escolhida.
- **Ícone**: Cor sólida com sombra projetada.
- **Glow Externo**: Filtro `blur` que cria uma aura colorida ao redor do badge.

---

## 5.2. Componente `BadgeFormModal`

Este componente é a peça central da interface administrativa. Suas especificações incluem:

| Elemento | Estilo Design System |
|----------|----------------------|
| **Overlay** | `var(--color-overlay)` com backdrop-blur. |
| **Painel** | `var(--color-surface)` com borda sutil. |
| **Borda Superior** | Gradiente Metálico Dourado (Assinatura). |
| **Botão Salvar** | `.btn-primary` com gradiente metálico e texto navy (#0f172a). |
| **Inputs** | Estilo `input-field` com focus em `var(--color-accent)`. |

---

## 5.3. Sistema de Cores e Contraste

O sistema garante acessibilidade mesmo em designs personalizados:
- O texto do botão de ação é fixado em **Navy Escuro (#0f172a)** para garantir contraste WCAG AAA sobre o gradiente dourado.
- Os ícones de preview utilizam `color-mix` para garantir que fiquem visíveis sobre qualquer cor de fundo.

---

## 5.4. Ícones Suportados

O sistema utiliza a biblioteca `Lucide React`. Os ícones recomendados para badges são:
- `Star`, `Award`, `Trophy`, `Target`, `Flame`, `Shield`, `Zap`, `Rocket`.

---

## Próximo Passo

Avance para o **[Capítulo 06: Mock vs Produção](./06-integracao-mock-supabase.md)**.
