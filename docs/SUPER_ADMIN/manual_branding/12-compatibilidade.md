# Capítulo 12: Compatibilidade Cross-Browser

## Objetivo

Documentar as estratégias de compatibilidade da plataforma, incluindo o polyfill de color-mix, fallbacks CSS e suporte a browsers.

---

## 12.1. Desafio: color-mix()

### O Problema

A plataforma usa extensivamente a função CSS `color-mix()` para criar cores semitransparentes baseadas em tokens:

```css
/* Exemplo de uso no código */
background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
```

Infelizmente, ** nem todos os browsers suportam** `color-mix()`:

| Browser | Suporte | Versão |
|---------|---------|--------|
| Chrome | ✅ Total | 111+ |
| Firefox | ✅ Total | 113+ |
| Safari | ✅ Total | 16.2+ |
| Edge | ✅ Total | 111+ |
| **Safari (antigo)** | ❌ Fallback | 15.x |
| **Chrome (antigo)** | ❌ Fallback | 110- |
| **Firefox (antigo)** | ❌ Fallback | 112- |

---

## 12.2. Estratégia de Detecção

### Função supportsColorMix

A plataforma detecta suporte a `color-mix()` em tempo de execução:

```typescript
// Definido em src/main.tsx
const supportsColorMix = (() => {
  try {
    return CSS.supports('color', 'color-mix(in srgb, red 50%, blue)');
  } catch {
    return false;
  }
})();
```

### Aplicação de Classe

Se não há suporte, a classe `.no-color-mix` é aplicada ao `<html>`:

```typescript
// src/main.tsx
if (!supportsColorMix) {
  document.documentElement.classList.add('no-color-mix');
}
```

---

## 12.3. Fallbacks CSS

### Classe .no-color-mix

Quando a classe é aplicada, CSS variables alternativas são usadas:

```css
/* Definido em src/index.css */
.no-color-mix {
  /* Superfície com opacidade */
  --color-surface-alpha: rgba(30, 41, 59, 0.4);

  /* Accent com opacidade */
  --color-accent-alpha: rgba(201, 166, 85, 0.1);
  --color-accent-alpha-strong: rgba(201, 166, 85, 0.15);

  /* Borda com opacidade */
  --color-border-alpha: rgba(255, 255, 255, 0.08);

  /* Background com opacidade */
  --color-bg-alpha: rgba(15, 23, 42, 0.5);

  /* Warning com opacidade */
  --color-warning-alpha: rgba(234, 179, 8, 0.1);
}
```

---

## 12.4. Polyfill JavaScript

### Mapa de Fallbacks

O polyfill mantém um mapa de CSS variables para seus valores RGBA:

```typescript
// Definido em src/main.tsx
const varFallbacks: Record<string, string> = {
  'var(--color-surface)': '#1e293b',
  'var(--color-accent)': '#c9a655',
  'var(--color-border)': '#334155',
  'var(--color-bg)': '#0f172a',
  'var(--color-warning)': '#eab308',
  'var(--color-error)': '#ef4444',
  'var(--color-success)': '#22c55e',
  'var(--color-glass-tint)': '#1e293b',
  'var(--color-header-bg)': '#0f172a',
  'var(--color-gradient-start)': '#c9a655',
  'var(--color-gradient-mid)': '#e8d48b',
  'var(--color-gradient-end)': '#a8873a',
  'var(--color-text-main)': '#f8fafc',
  'var(--env-blob1-color)': '#c9a655',
  'var(--color-input-bg)': '#1e293b',
};
```

### Função de Substituição

```typescript
// Converte HEX para RGBA
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Substitui color-mix() por RGBA
function replaceColorMix(value: string): string {
  const COLOR_MIX_RE = /color-mix\(in srgb,\s*([^,]+?)\s+(\d+)%,\s*transparent\)/g;

  return value.replace(COLOR_MIX_RE, (_match, colorExpr, pctStr) => {
    const pct = parseInt(pctStr, 10) / 100;
    const trimmed = colorExpr.trim();
    const fallbackHex = varFallbacks[trimmed];

    if (fallbackHex) {
      return hexToRgba(fallbackHex, pct);
    }

    // Se é uma cor hex direta
    if (trimmed.startsWith('#')) {
      return hexToRgba(trimmed, pct);
    }

    // Não é possível resolver - retorna escuro semi-transparente
    return `rgba(30,41,59,${pct})`;
  });
}
```

---

## 12.5. MutationObserver

### Por Que MutationObserver?

A plataforma é uma **SPA (Single Page Application)**. Elementos são adicionados e removidos dinamicamente. O polyfill precisa observar o DOM continuamente.

```typescript
// Patch após cada ciclo de renderização
const patchStyles = () => {
  const elements = document.querySelectorAll<HTMLElement>('[style]');
  elements.forEach(el => {
    const style = el.getAttribute('style');
    if (style && style.includes('color-mix')) {
      el.setAttribute('style', replaceColorMix(style));
    }
  });
};

// MutationObserver para pegar elementos dinâmicos
const observer = new MutationObserver((mutations) => {
  let needsPatch = false;
  for (const mutation of mutations) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      needsPatch = true;
      break;
    }
    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
      const el = mutation.target as HTMLElement;
      const style = el.getAttribute('style');
      if (style && style.includes('color-mix')) {
        el.setAttribute('style', replaceColorMix(style));
      }
    }
  }
  if (needsPatch) {
    requestAnimationFrame(patchStyles);
  }
});

// Iniciar observação após renderização inicial
requestAnimationFrame(() => {
  patchStyles();
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style'],
  });
});
```

---

## 12.6. Suporte @supports

### Fallbacks CSS com @supports

A plataforma também usa `@supports` para fallback declarativo em CSS:

```css
/* Define fallback primeiro */
.liquid-glass {
  background: rgba(30, 41, 59, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Sobrescreve se color-mix() for suportado */
@supports (color: color-mix(in srgb, red 50%, blue)) {
  .liquid-glass {
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-glass-tint) 25%, transparent) 0%,
      color-mix(in srgb, var(--color-glass-tint) 8%, transparent) 50%,
      color-mix(in srgb, var(--color-glass-tint) 15%, transparent) 100%
    );
    border: 1px solid color-mix(in srgb, var(--color-glass-tint) 20%, transparent);
  }
}
```

---

## 12.7. Tabela de Browsers Suportados

| Browser | Versão | Suporte color-mix | Fallback ativo |
|---------|--------|------------------|----------------|
| **Chrome** | 111+ | ✅ Total | Não |
| **Chrome** | 91-110 | ⚠️ Parcial | Sim |
| **Firefox** | 113+ | ✅ Total | Não |
| **Firefox** | 88-112 | ⚠️ Parcial | Sim |
| **Safari** | 16.2+ | ✅ Total | Não |
| **Safari** | 15.x | ❌ | Sim |
| **Safari** | 14.x | ❌ | Sim |
| **Edge** | 111+ | ✅ Total | Não |
| **Edge** | 88-110 | ⚠️ Parcial | Sim |
| **Opera** | 97+ | ✅ Total | Não |
| **Mobile Chrome** | 111+ | ✅ Total | Não |
| **Mobile Safari** | 16.2+ | ✅ Total | Não |

---

## 12.8. Utilitários no Código

### Funções Auxiliares

```typescript
// src/lib/utils.ts

// Verifica se o browser suporta color-mix()
export const supportsColorMix = (() => {
  try {
    return CSS.supports('color', 'color-mix(in srgb, red 50%, blue)');
  } catch {
    return false;
  }
})();

// Helper para color-mix com fallback
export function colorMix(color: string, pct: number, fallback: string): string {
  if (supportsColorMix) {
    return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
  }
  return fallback;
}

// Helper para borda com fallback
export function colorMixBorder(color: string, pct: number, fallback: string): string {
  if (supportsColorMix) {
    return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
  }
  return fallback;
}
```

---

## 12.9. Fluxo de Inicialização

### Sequência de Execução

```
┌─────────────────────────────────────────────┐
│  main.tsx executa                           │
├─────────────────────────────────────────────┤
│  1. Detecta support color-mix()            │
│  2. Se não suportado:                       │
│     - Adiciona classe .no-color-mix         │
│     - Inicia MutationObserver               │
│     - Patch estilos existentes              │
│  3. React renderiza normalmente            │
│  4. Estilos com color-mix são renderizados │
│  5. MutationObserver observa mudanças DOM  │
│  6. Novo elementos com color-mix são       │
│     automaticamente convertidos            │
└─────────────────────────────────────────────┘
```

---

## Checklist de Conclusão

- [ ] Problema color-mix() documentado
- [ ] Tabela de suporte por browser incluída
- [ ] Função supportsColorMix explicada
- [ ] Classe .no-color-mix documentada
- [ ] Polyfill JavaScript com código completo
- [ ] Mapa de varFallbacks listados
- [ ] Função replaceColorMix demonstrada
- [ ] MutationObserver explained
- [ ] Fallbacks CSS com @supports detalhados
- [ ] Tabela de browsers suportados criada
- [ ] Utilitários em utils.ts mapeados

---

## Próximo Passo

Avance para **[Capítulo 13: Stack Técnica](./13-stack-tecnica.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-BRANDING.md)*