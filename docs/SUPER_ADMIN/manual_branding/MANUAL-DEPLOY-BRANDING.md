# Manual de Branding — Hub Conexão Digital Implant

## Visão Geral

Este manual documenta o design system completo da plataforma Hub Conexão, incluindo identidade visual, sistema de cores, tipografia, efeitos visuais, animações, componentes de UI, gamificação e compatibilidade técnica.

**Duração de leitura estimada**: 30-45 minutos
**Público-alvo**: Designers, desenvolvedores, gestores de produto

---

## Arquitetura do Design System

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Design System — Hub Conexão                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │  Identidade      │    │  Sistema de      │    │  Tipografia      │  │
│  │  Marca           │    │  Cores           │    │                  │  │
│  │  - Nome          │    │  - ColorScheme  │    │  - Fontes        │  │
│  │  - Logo          │    │  - Gradientes    │    │  - Pesos         │  │
│  │  - Config DB     │    │  - Feedback      │    │  - Shimmer       │  │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘  │
│                                                                          │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │  Efeitos         │    │  Animações       │    │  Componentes    │  │
│  │  Visuais         │    │                  │    │  UI              │  │
│  │  - Glassmorphism │    │  - Keyframes     │    │  - Buttons       │  │
│  │  - Blobs         │    │  - Classes       │    │  - Inputs        │  │
│  │  - Grain         │    │  - Timing        │    │  - Cards         │  │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘  │
│                                                                          │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │  Ícones          │    │  Gamificação    │    │  i18n            │  │
│  │                  │    │                  │    │                  │  │
│  │  - Lucide React  │    │  - Níveis       │    │  - pt-br         │  │
│  │  - Por contexto  │    │  - XP            │    │  - en-us         │  │
│  │                  │    │  - Confetti      │    │  - es-es         │  │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘  │
│                                                                          │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │  Layout          │    │  Ambientes       │    │  Compatibilidade │  │
│  │                  │    │                  │    │                  │  │
│  │  - Container     │    │  - Environment   │    │  - Polyfill      │  │
│  │  - Breakpoints   │    │    Effects       │    │  - Fallbacks    │  │
│  │  - Border-radius │    │  - Por ambiente │    │  - Browsers     │  │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Stack Técnica                                                    │  │
│  │  - Tailwind CSS 3.x  - shadcn/ui  - Lucide React  - Recharts   │  │
│  │  - canvas-confetti  - tailwindcss-animate                        │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Estrutura do Manual

| Capítulo | Arquivo | Descrição |
|----------|---------|-----------|
| 00 | [MANUAL-DEPLOY-BRANDING.md](./MANUAL-DEPLOY-BRANDING.md) | Índice principal (este arquivo) |
| 01 | [01-identidade-marca.md](./01-identidade-marca.md) | Nome da marca, logo dinâmico, configuração via banco |
| 02 | [02-sistema-cores.md](./02-sistema-cores.md) | ColorScheme (42 tokens), gradientes, cores de feedback |
| 03 | [03-tipografia.md](./03-tipografia.md) | Fontes do sistema, pesos, tamanhos, texto shimmer |
| 04 | [04-efeitos-visuais.md](./04-efeitos-visuais.md) | Liquid glass, blobs animados, grain/textura |
| 05 | [05-animacoes.md](./05-animacoes.md) | Keyframes, classes Tailwind, timing |
| 06 | [06-componentes-ui.md](./06-componentes-ui.md) | Botões, inputs, cards, header, icon-box |
| 07 | [07-icones.md](./07-icones.md) | Biblioteca Lucide React, uso por contexto |
| 08 | [08-gamificacao.md](./08-gamificacao.md) | Sistema de níveis, XP, confetti |
| 09 | [09-internacionalizacao.md](./09-internacionalizacao.md) | Idiomas suportados, seletor |
| 10 | [10-layout-espacamento.md](./10-layout-espacamento.md) | Container, breakpoints, border-radius |
| 11 | [11-ambientes.md](./11-ambientes.md) | EnvironmentEffects (13 tokens por ambiente) |
| 12 | [12-compatibilidade.md](./12-compatibilidade.md) | Polyfill color-mix, fallbacks CSS, browsers |
| 13 | [13-stack-tecnica.md](./13-stack-tecnica.md) | Libraries e frameworks utilizados |

---

## Princípios do Design System

### ✅ Princípios Fundamentais

1. **Dark Mode Único**: A plataforma opera exclusivamente em modo escuro. Não existe toggle para tema claro.

2. **Dourado como Accent**: O dourado (#c9a655) é a única cor de destaque permitida. Todas as demais interações visuais derivam dele.

3. **Glassmorphism como Identidade**: O efeito liquid glass é o elemento distintivo da marca, usado em headers, cards e elementos flutuantes.

4. **CSS Variables para Flexibilidade**: Todas as cores são configuráveis em tempo real via `system_config.theme_dark`, permitindo white-labeling.

5. **Performance First**: Fontes do sistema (system-ui) são usadas para evitar downloads, mantendo a aplicação leve.

### ❌ Regras de Restrição

- **Não usar roxo**: Foi completamente removido da marca.
- **Não usar fontes externas**: Manter system fonts para performance.
- **Não hardcodar cores**: Usar sempre CSS variables (`--color-*`).
- **Não múltiplos accents**: Um único accent (dourado) por vez.
- **Não remover glass effects**: O blur é parte da identidade.

---

## Paleta de Cores — Resumo

| Categoria | Cor Principal | HEX |
|-----------|---------------|-----|
| **Background** | Azul Marinho Profundo | #0f172a |
| **Surface** | Slate Escuro | #1e293b |
| **Text Main** | Branco Gelo | #f8fafc |
| **Text Muted** | Cinza Azulado | #94a3b8 |
| **Accent** | Dourado | #c9a655 |
| **Success** | Verde | #22c55e |
| **Warning** | Amarelo | #eab308 |
| **Error** | Vermelho | #ef4444 |

---

## Tokens Principais

| Tipo | Quantidade |
|------|------------|
| ColorScheme (cores) | 42 tokens |
| EnvironmentEffects | 13 tokens |
| Animações | 6 keyframes |
| Border-radius | 7 variantes |
| Breakpoints | 6 |

---

## Arquivos Técnicos de Referência

| Arquivo | Propósito |
|---------|-----------|
| `src/types.ts` | Interfaces `ColorScheme`, `EnvironmentEffects` |
| `src/lib/themeDefaults.ts` | Valores padrão, funções de merge |
| `src/contexts/BrandContext.tsx` | Injeção de CSS variables |
| `src/index.css` | Tokens HSL shadcn, efeitos CSS |
| `tailwind.config.ts` | Keyframes, animações, cores |
| `src/main.tsx` | Polyfill color-mix, detecção browser |

---

## Próximo Passo

Inicie pelo **[Capítulo 01: Identidade da Marca](./01-identidade-marca.md)**

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **ColorScheme** | Objeto com 42 tokens de cores, configurável em tempo real |
| **EnvironmentEffects** | Configurações visuais por ambiente (auth, client, manager, admin) |
| **Liquid Glass** | Effecto glassmorphism com gradiente e blur |
| **Shimmer** | Animação de brilho percorrendo o gradiente do texto |
| **Confetti** | Efeito de celebração via canvas-confetti |

---

*Manual de Branding — Hub Conexão Digital Implant*
*Versão 1.0 — 2026*