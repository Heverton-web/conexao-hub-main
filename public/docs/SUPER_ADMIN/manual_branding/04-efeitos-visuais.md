# Capítulo 04: Efeitos Visuais

## Objetivo

Documentar todos os efeitos visuais da plataforma, incluindo liquid glass (glassmorphism), blobs animados, grain (textura de ruído) e scrollbar customizada.

---

## 4.1. Liquid Glass (Glassmorphism Premium)

O **Liquid Glass** é o efeito assinatura da marca — um glassmorphism premium com gradiente sutil e blur intenso.

### CSS Completo (com Fallback)

```css
/* ═══════════════════════════════════════════════════════════ */
/* Liquid Glass - Com fallbacks para browsers antigos         */
/* ═══════════════════════════════════════════════════════════ */

/* Fallback para browsers sem suporte a color-mix() */
.liquid-glass {
  /* Fundo semi-transparente */
  background: rgba(30, 41, 59, 0.25);

  /* Borda sutil */
  border: 1px solid rgba(255, 255, 255, 0.1);

  /* Sombra característica */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  /* Blur (backdrop-filter) */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

/* Versão com color-mix para browsers modernos */
@supports (color: color-mix(in srgb, red 50%, blue)) {
  .liquid-glass {
    /* Gradiente sutil de tint */
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-glass-tint) 25%, transparent) 0%,
      color-mix(in srgb, var(--color-glass-tint) 8%, transparent) 50%,
      color-mix(in srgb, var(--color-glass-tint) 15%, transparent) 100%
    );

    /* Blur com variável de ambiente */
    backdrop-filter: blur(var(--env-glass-blur, 20px)) saturate(180%);
    -webkit-backdrop-filter: blur(var(--env-glass-blur, 20px)) saturate(180%);

    /* Borda com color-mix */
    border: 1px solid color-mix(in srgb, var(--color-glass-tint) 20%, transparent);

    /* Sombra composta */
    box-shadow:
      0 8px 32px var(--color-shadow, rgba(0, 0, 0, 0.3)),
      inset 0 1px 0 color-mix(in srgb, var(--color-glass-tint) 30%, transparent),
      inset 0 -1px 0 color-mix(in srgb, var(--color-glass-tint) 10%, transparent);
  }
}
```

### Onde Usar

| Contexto | Exemplo |
|----------|---------|
| **Header principal** | Barra de navegação superior |
| **Cards flutuantes** | Cards de conteúdo que "flutuam" sobre o background |
| **Painéis de conteúdo** | Sidebar, modais, dropdowns |

### Classes Tailwind Equivalentes

```tsx
// Header principal
<header className="liquid-glass rounded-2xl sticky top-4 z-40">
  ...
</header>

// Card flutuante
<div className="liquid-glass rounded-xl p-6">
  ...
</div>
```

---

## 4.2. Liquid Glass Gold

Variação dourada do liquid glass para **elementos interativos ativos** e destaques de gamificação.

### CSS Completo

```css
/* ═══════════════════════════════════════════════════════════ */
/* Liquid Glass Gold - Para elementos interativos ativos       */
/* ═══════════════════════════════════════════════════════════ */

/* Fallback */
.liquid-glass-gold {
  background: rgba(201, 166, 85, 0.12);
  border: 1px solid rgba(201, 166, 85, 0.15);
  box-shadow: 0 4px 20px rgba(201, 166, 85, 0.08);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
}

/* Versão com color-mix */
@supports (color: color-mix(in srgb, red 50%, blue)) {
  .liquid-glass-gold {
    /* Gradiente com cores do gradiente metálico */
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-gradient-start) 18%, transparent) 0%,
      color-mix(in srgb, var(--color-gradient-mid) 8%, transparent) 40%,
      color-mix(in srgb, var(--color-gradient-end) 14%, transparent) 70%,
      color-mix(in srgb, var(--color-gradient-start) 10%, transparent) 100%
    );

    /* Borda dourada */
    border: 1px solid color-mix(in srgb, var(--color-gradient-start) 22%, transparent);

    /* Sombra dourada */
    box-shadow:
      0 4px 20px color-mix(in srgb, var(--color-gradient-start) 8%, transparent),
      inset 0 1px 0 color-mix(in srgb, var(--color-gradient-mid) 12%, transparent),
      inset 0 -1px 0 color-mix(in srgb, var(--color-gradient-end) 6%, transparent);
  }
}
```

### Onde Usar

| Contexto | Exemplo |
|----------|---------|
| **Elementos interativos ativos** | Item de menu selecionado |
| **Destaques de gamificação** | Badge recentemente conquistado |
| **Cards premium** | Cards de conteúdo "destaque" |
| **Botões de destaque** | CTAs especiais |

### Exemplo de Uso

```tsx
// Item de navegação ativo
<nav className="liquid-glass-gold rounded-lg p-3">
  <span className="text-amber-400">Dashboard</span>
</nav>

// Badge recente
<div className="liquid-glass-gold rounded-full px-3 py-1">
  <Star className="w-4 h-4 text-amber-400" />
  <span className="text-sm text-amber-400">Novo!</span>
</div>
```

---

## 4.3. Blobs Animados (Background Decorativo)

Os **blobs** são esferas decorativas com blur intenso que flutuam no fundo da aplicação, criando profundidade e movimento.

### Keyframes de Animação

```css
/* ═══════════════════════════════════════════════════════════ */
/* Blob Animation - Movimento orgânico de esferas              */
/* ═══════════════════════════════════════════════════════════ */

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

/* Aplicação no Tailwind (tailwind.config.ts) */
animation: {
  blob: 'blob 7s infinite',
}
```

### Configuração de Estilo

| Propriedade | Valor | Descrição |
|-------------|-------|-----------|
| **Tamanho** | 18-24rem | Variável por ambiente |
| **Blur** | 64-100px | Intensidade do desfoque |
| **Opacidade** | 15-20% | Transparência |
| **Posição** | Absoluta | Espalhados pelo background |
| **Animação** | 7s | Duração de um ciclo |

### Cores por Ambiente

| Ambiente | blob1 | blob2 | blob3 | Tamanho | Blur | Opacidade |
|----------|-------|-------|-------|---------|------|-----------|
| **Global** | #c9a655 | #e8d48b | #a8873a | 18rem | 64px | 20% |
| **Auth** | #c9a655 | #c9a655 | #c9a655 | 24rem | 100px | 15% |
| **Client** | #c9a655 | #e8d48b | #a8873a | 18rem | 64px | 20% |
| **Manager** | #c9a655 | #d4b366 | #b8953e | 20rem | 80px | 15% |
| **Admin** | #c9a655 | #e8d48b | #a8873a | 18rem | 64px | 18% |

### Implementação no Componente

```tsx
// GlobalEffects.tsx - Renderização dos blobs
const GlobalEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Blob 1 */}
      <div
        className="absolute top-1/4 left-1/4 w-[var(--env-blob-size,18rem)] h-[var(--env-blob-size,18rem)] rounded-full blur-[var(--env-blob-blur,64px)] animate-blob"
        style={{ backgroundColor: 'var(--env-blob1-color)', opacity: 'var(--env-blob-opacity,0.2)' }}
      />

      {/* Blob 2 */}
      <div
        className="absolute bottom-1/4 right-1/4 w-[var(--env-blob-size,18rem)] h-[var(--env-blob-size,18rem)] rounded-full blur-[var(--env-blob-blur,64px)] animate-blob animation-delay-2000"
        style={{ backgroundColor: 'var(--env-blob2-color)', opacity: 'var(--env-blob-opacity,0.2)' }}
      />

      {/* Blob 3 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[var(--env-blob-size,18rem)] h-[var(--env-blob-size,18rem)] rounded-full blur-[var(--env-blob-blur,64px)] animate-blob animation-delay-4000"
        style={{ backgroundColor: 'var(--env-blob3-color)', opacity: 'var(--env-blob-opacity,0.2)' }}
      />
    </div>
  );
};
```

---

## 4.4. Grain (Textura de Ruído)

O **grain** é uma textura de ruído sutil aplicada sobre o background para adicionar granularidade e profundidade visual.

### Implementação via SVG

```css
/* ═══════════════════════════════════════════════════════════ */
/* Grain Overlay - Textura de ruído sutil                       */
/* ═══════════════════════════════════════════════════════════ */

/* Container do grain */
.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}

/* SVG inline do noise */
.grain-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 128px 128px;
  opacity: var(--env-grain-opacity, 0.2);
  mix-blend-mode: var(--env-grain-blend, multiply);
}

/* Contrast overlay para melhor visibilidade */
.grain-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: contrast(var(--env-grain-contrast, 150%));
  opacity: 0.05;
}
```

### Configuração por Ambiente

| Ambiente | Opacidade | Blend Mode | Contraste |
|----------|-----------|------------|-----------|
| **Global** | 0.20 | multiply | 150% |
| **Auth** | 0.10 | multiply | 150% |
| **Client** | 0.20 | multiply | 150% |
| **Manager** | 0.20 | multiply | 150% |
| **Admin** | 0.20 | multiply | 150% |

### Implementação no Componente

```tsx
// GlobalEffects.tsx
const GrainOverlay = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        opacity: 'var(--env-grain-opacity, 0.2)',
        mixBlendMode: 'var(--env-grain-blend, multiply)',
      }}
    >
      {/* SVG noise gerado inline via background-image */}
    </div>
  );
};
```

---

## 4.5. Scrollbar Customizada

A scrollbar usa a cor de accent (dourado) para manter consistência visual com a marca.

### CSS Completo

```css
/* ═══════════════════════════════════════════════════════════ */
/* Scrollbar Customizada - Accent (dourado)                     */
/* ═══════════════════════════════════════════════════════════ */

/* Largura da scrollbar */
*::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/* Trilha (track) - transparente */
*::-webkit-scrollbar-track {
  background: transparent;
}

/* Polegar (thumb) - cor do accent */
*::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: 999px;
}

/* Polegar no hover - levemente mais escuro */
*::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--color-accent) 80%, black);
}

/* Scrollbar para Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-accent) transparent;
}
```

### Propriedades

| Elemento | Propriedade | Valor |
|----------|-------------|-------|
| Largura | width | 5px |
| Altura | height | 5px |
| Track | background | transparent |
| Thumb | background | var(--color-accent) |
| Border-radius | border-radius | 999px (circular) |
| Firefox | scrollbar-width | thin |

---

## 4.6. Efeitos de Hover

### Transições Globais

| Propriedade | Duração | Easing | Uso |
|-------------|---------|--------|-----|
| `colors` | 300ms | ease | Hover em botões, links |
| `all` | 300ms | ease | Icon boxes, cards |
| `transform` | 500ms | ease | Rotação de ícones e hover |

### Exemplo de Hover em Cards

```css
.card-interactive {
  transition: all 300ms ease;
}

.card-interactive:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-hover-border);
  transform: scale(1.02);
  box-shadow: 0 4px 20px var(--color-hover-shadow);
}
```

---

## Checklist de Conclusão

- [ ] Liquid Glass com código CSS completo incluído
- [ ] Fallback para browsers sem color-mix documentado
- [ ] Liquid Glass Gold com código completo
- [ ] Onde usar cada efeito especificado
- [ ] Blobs animados documentados com keyframes
- [ ] Cores/tamanho/blur por ambiente em tabela
- [ ] Grain (textura de ruído) implementado
- [ ] Scrollbar customizada com código completo
- [ ] Transições de hover documentadas
- [ ] Classes Tailwind equivalentes mostradas

---

## Próximo Passo

Avance para **[Capítulo 05: Animações](./05-animacoes.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-BRANDING.md)*