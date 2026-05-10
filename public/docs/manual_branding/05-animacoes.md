# Capítulo 05: Animações

## Objetivo

Documentar todas as animações da plataforma, incluindo keyframes, classes Tailwind, durações e casos de uso.

---

## 5.1. Keyframes Definidos

O sistema possui **6 keyframes** principais definidos no Tailwind:

### 5.1.1. Blob (Esferas Animadas)

Movimento orgânico de esferas decorativas no background.

```css
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
```

### 5.1.2. Fade-In (Entrada Suave)

Animação de fade para entrada de conteúdo.

```css
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 5.1.3. Slide-Up (Entrada de Baixo)

Animação de slide para modais e alertas.

```css
@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 5.1.4. Shimmer (Brilho Percorrente)

Animação de brilho que percorre o gradiente do texto.

```css
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

### 5.1.5. Float (Flutuação Suave)

Animação de flutuação para o logo na página de login.

```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
```

### 5.1.6. Accordion Down/Up

Expansão e contração de acordeões.

```css
@keyframes accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}

@keyframes accordion-up {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}
```

---

## 5.2. Classes de Animação Tailwind

### Tabela de Animações

| Classe Tailwind | Duração | Easing | Loop | Uso |
|-----------------|---------|--------|------|-----|
| `animate-blob` | 7s | default | ∞ (infinito) | Esferas de fundo |
| `animate-fade-in` | 0.5s | ease-out | once (forward) | Entrada de conteúdo principal |
| `animate-slide-up` | 0.4s | ease-out | once (forward) | Entrada de alertas e modais |
| `animate-shimmer` | 3s | ease-in-out | ∞ (infinito) | Texto gradiente animado |
| `animate-float` | 3s | ease-in-out | ∞ (infinito) | Logo na página de login |
| `animate-accordion-down` | 0.2s | ease-out | once | Expansão de acordeão |
| `animate-accordion-up` | 0.2s | ease-out | once | Contração de acordeão |

### Configuração no Tailwind

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        blob: 'blob 7s infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        shimmer: 'shimmer 3s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
} satisfies Config;
```

---

## 5.3. Classes Auxiliares

### Delay de Animação

Para criar sequência de animações:

```css
.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
```

### Uso com Blob

```tsx
// Três blobs com delays diferentes para criar movimento orgânico
<div className="blob animate-blob" />                              // 0s
<div className="blob animate-blob animation-delay-2000" />        // 2s
<div className="blob animate-blob animation-delay-4000" />       // 4s
```

---

## 5.4. Casos de Uso por Contexto

### Página de Login

| Elemento | Animação | Duração |
|----------|----------|---------|
| Nome da marca | `animate-shimmer` | 3s (loop) |
| Logo | `animate-float` | 3s (loop) |
| Card de login | `animate-fade-in` | 0.5s |
| Campos de formulário | `animate-slide-up` | 0.4s |

### Dashboard/Admin

| Elemento | Animação | Duração |
|----------|----------|---------|
| Cards de conteúdo | `animate-fade-in` | 0.5s |
| Modais | `animate-slide-up` | 0.4s |
| Blobs de background | `animate-blob` | 7s (loop) |
| Acordeões | `animate-accordion-*` | 0.2s |

### Gamificação

| Elemento | Animação | Duração |
|----------|----------|---------|
| Conclusão de módulo | Confetti (canvas-confetti) | 1.5s |
| Badge conquistado | Múltiplos confettis | 3s |
| Progresso significativo | Explosão grande | 3s |

---

## 5.5. Transições CSS

Além das animações keyframe, o sistema usa transições CSS para interações:

### Transições Globais

```css
/* Transição padrão para cores */
.transition-colors {
  transition: colors 300ms ease;
}

/* Transição completa */
.transition-all {
  transition: all 300ms ease;
}

/* Transição para transform (escala, rotação) */
.transition-transform {
  transition: transform 500ms ease;
}
```

### Uso em Componentes

```tsx
// Botão com transição
<button className="transition-all hover:scale-105">
  Clique aqui
</button>

// Card interativo
<div className="transition-colors hover:bg-slate-700">
  Conteúdo do card
</div>

// Icon box
<div className="transition-all hover:rotate-12 hover:scale-110">
  <Icon />
</div>
```

---

## 5.6. Easing (Curvas de Interpolação)

### Easing Padrão

| Nome | Valor | Uso |
|------|-------|-----|
| `ease` | Cubic-bezier padrão | Transições simples |
| `ease-out` | Saída suave | Entrada de elementos (fade-in, slide-up) |
| `ease-in-out` | Entrada e saída | Animações contínuas (shimmer, float) |
| `ease-in` | Entrada suave | Animações de saída |

---

## 5.7. Performance das Animações

### Boas Práticas

| Prática | Recomendação |
|---------|---------------|
| **Propriedades animadas** | Usar `transform` e `opacity` — não animadas layout (width, height) |
| **GPU acceleration** | Usar `translate3d` para forçar aceleración |
| **will-change** | Adicionar para elementos que vão mudar |
| **Loop mínimo** | Evitar loops desnecessários |

### Exemplo de Otimização

```css
/* Bom: anima transform, não top/left */
@keyframes move {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}

/* Evitar: anima propriedade de layout */
@keyframes move-bad {
  from { left: 0; }
  to { left: 100px; }
}
```

---

## Checklist de Conclusão

- [ ] 6 keyframes documentados com código completo
- [ ] Classes Tailwind listadas em tabela
- [ ] Duração e easing de cada animação especificados
- [ ] Classe auxiliar animation-delay documentada
- [ ] Casos de uso por contexto (login, dashboard, gamificação)
- [ ] Transições CSS globais explicadas
- [ ] Curvas de easing documentadas
- [ ] Boas práticas de performance incluídas

---

## Próximo Passo

Avance para **[Capítulo 06: Componentes UI](./06-componentes-ui.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-BRANDING.md)*