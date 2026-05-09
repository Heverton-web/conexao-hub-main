# Capítulo 03: Tipografia

## Objetivo

Documentar o sistema tipográfico da plataforma, incluindo famílias de fontes, pesos, tamanhos e efeitos especiais como o texto shimmer.

---

## 3.1. Família de Fontes

### Abordagem: Performance First

A plataforma utiliza **fontes do sistema** em vez de fonts externas para maximizar performance:

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

### Por Que Fontes do Sistema?

| Benefício | Descrição |
|-----------|-----------|
| **Performance zero** | Sem download de arquivos, sem impacto no FCP |
| **Consistência nativa** | Cada plataforma exibe sua font preferida |
| **Acessibilidade** | Suporte nativo a screen readers |
| **Não requer FOUT** | Sem flash de texto não estilizado |

### breakdown por Plataforma

| Plataforma | Fonte Usada |
|------------|-------------|
| macOS | -apple-system (SF Pro) |
| Windows | Segoe UI |
| Linux | system-ui (GNOME/KDE) |
| iOS | -apple-system (San Francisco) |
| Android | Roboto |

---

## 3.2. Pesos Tipográficos

A plataforma usa **4 pesos distintos** para criar hierarquia visual:

| Peso | Valor Numérico | Classe Tailwind | Uso |
|------|----------------|-----------------|-----|
| Regular | 400 | `font-normal` | Texto corrido, parágrafos |
| Medium | 500 | `font-medium` | Labels de formulário, descrições |
| Semibold | 600 | `font-semibold` | Subtítulos, badges, tags |
| Bold | 700 | `font-bold` | Títulos, botões, nomes, headers |

### Uso por Contexto

```tsx
// Texto corrido (paragraphs)
<p className="font-normal text-slate-200">
  Conteúdo principal da página...
</p>

// Labels de formulário
<label className="font-medium text-sm text-slate-400">
  Nome completo
</label>

// Subtítulos e badges
<span className="font-semibold text-xs uppercase">
  Novo
</span>

// Títulos e headers
<h1 className="font-bold text-3xl text-white">
  Dashboard
</h1>
```

---

## 3.3. Tamanhos de Texto

A plataforma utiliza **7 tamanhos de texto** pré-definidos:

| Classe Tailwind | Tamanho (rem) | Tamanho (px) | Uso |
|-----------------|---------------|--------------|-----|
| `text-3xl` | 1.875rem | 30px | Título principal (página de login) |
| `text-xl` | 1.25rem | 20px | Nome do app no header |
| `text-lg` | 1.125rem | 18px | Nome da marca animado (login) |
| `text-base` | 1rem | 16px | Texto padrão |
| `text-sm` | 0.875rem | 14px | Descrições, tooltips |
| `text-xs` | 0.75rem | 12px | Labels de formulário, badges, metadata |
| `text-[10px]` | 0.625rem | 10px | Micro-texto (hints, sublabels) |
| `text-[9px]` | 0.5625rem | 9px | XP/nível do usuário no header |

### Escala Tipográfica

```
text-3xl  ████████████████████████████████████  30px
text-xl   ██████████████████████               20px
text-lg   ██████████████████                     18px
text-base ████████████████                       16px
text-sm   ████████████                           14px
text-xs   ██████████                             12px
text-[10] ████████                              10px
text-[9]  ███████                                9px
```

---

## 3.4. Estilos Especiais de Texto

### Label de Formulário

Uso: Campos de input, selects, checkboxes

```css
font-size: 0.75rem;        /* text-xs */
font-weight: 700;          /* font-bold */
text-transform: uppercase;
letter-spacing: 0.05em;    /* tracking-wider */
color: var(--color-text-muted);
```

**Exemplo visual:**
```tsx
<label className="text-xs font-bold uppercase tracking-wider text-slate-400">
  Email
</label>
```

### Título Principal

Uso: Páginas, seções grandes

```css
font-size: 1.875rem;       /* text-3xl */
font-weight: 700;          /* font-bold */
letter-spacing: -0.025em; /* tracking-tight */
color: var(--color-text-main);
```

**Exemplo visual:**
```tsx
<h1 className="text-3xl font-bold tracking-tight text-white">
  Bem-vindo ao Hub Conexão
</h1>
```

---

## 3.5. Texto Shimmer (Texto Animado com Gradiente)

O **texto shimmer** é uma animação especial aplicada ao nome da marca na página de login. Cria um efeito de brilho percorrendo o gradiente dourado.

### Código CSS Completo

```css
.text-shimmer {
  /* Gradiente de 4 cores */
  background-image: linear-gradient(
    90deg,
    var(--color-gradient-start),    /* #c9a655 */
    var(--color-gradient-mid),      /* #e8d48b */
    var(--color-gradient-end),      /* #a8873a */
    var(--color-gradient-start)     /* #c9a655 - para loop */
  );

  /* Aplica o gradiente ao texto */
  background-clip: text;
  -webkit-background-clip: text;

  /* Torna o texto transparente para mostrar o gradiente */
  -webkit-text-fill-color: transparent;

  /* Tamanho do gradiente (maior que o texto para permitir movimento) */
  background-size: 200% 100%;

  /* Animação infinita */
  animation: shimmer 3s ease-in-out infinite;
}

/* Keyframes da animação */
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

### Configuração por Contexto

| Propriedade | Valor | Descrição |
|-------------|-------|-----------|
| `font-size` | 1.125rem | text-lg |
| `font-weight` | 700 | Bold |
| `background-size` | 200% 100% | Gradiente 2x o tamanho do texto |
| `animation` | shimmer 3s ease-in-out infinite | Loop de 3 segundos |

### Implementação JSX

```tsx
// Página de Login - Nome da marca
<span className="text-lg font-bold text-shimmer">
  Conexão Digital Implant
</span>
```

---

## 3.6. Fontes Responsivas

### Breakpoints por Tamanho

| Breakpoint | Largura | Comportamento |
|------------|---------|---------------|
| Mobile | < 640px | Nome do app oculto no header |
| Tablet (md) | ≥ 768px | Padding p-6, seletor de idioma visível |
| Desktop (sm) | ≥ 640px | Nome do app visível no header |

---

## 3.7. Textos Especializados

### XP/Nível do Usuário (Header)

Localização: Header, ao lado do nome do usuário

```css
font-size: 0.5625rem;    /* text-[9px] */
font-weight: 600;        /* font-semibold */
text-transform: uppercase;
letter-spacing: 0.05em;
```

**Formato visual:**
```tsx
<span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: levelColor }}>
  MASTER · 1.250 XP
</span>
```

### Labels de Badges

```css
font-size: 0.75rem;       /* text-xs */
font-weight: 600;         /* font-semibold */
text-transform: uppercase;
letter-spacing: 0.025em;
padding: 0.25rem 0.5rem;  /* py-1 px-2 */
border-radius: 0.25rem;   /* rounded */
```

---

## 3.8. Resumo de Classes Tailwind

| Uso | Classe | Equivalente |
|-----|--------|-------------|
| Título grande | `text-3xl font-bold tracking-tight` | 30px, bold, tight |
| Nome app header | `text-xl font-bold` | 20px, bold |
| Nome marca login | `text-lg font-bold text-shimmer` | 18px, bold, animado |
| Texto padrão | `text-base` | 16px |
| Descrições | `text-sm text-slate-400` | 14px, cinza |
| Labels | `text-xs font-bold uppercase tracking-wider` | 12px, maiúsculas |
| Micro texto | `text-[10px]` | 10px |
| XP usuário | `text-[9px] uppercase tracking-wider font-semibold` | 9px |

---

## Checklist de Conclusão

- [ ] Família de fontes definida (system-ui, -apple-system, etc.)
- [ ] Justificativa de performance documentada
- [ ] 4 pesos tipográficos listados (400, 500, 600, 700)
- [ ] 8 tamanhos de texto documentados
- [ ] Estilo label de formulário especificado
- [ ] Estilo título principal definido
- [ ] Texto shimmer com código completo incluído
- [ ] Uso de text-shimmer no login demonstrado
- [ ] Textos especializados (XP, badges) detalhados
- [ ] Classes Tailwind resumidas em tabela

---

## Próximo Passo

Avance para **[Capítulo 04: Efeitos Visuais](./04-efeitos-visuais.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-BRANDING.md)*