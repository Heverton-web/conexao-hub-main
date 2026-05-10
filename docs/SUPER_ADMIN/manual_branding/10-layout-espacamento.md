# Capítulo 10: Layout e Espaçamento

## Objetivo

Documentar o sistema de layout da plataforma, incluindo container, breakpoints responsivos e tokens de border-radius.

---

## 10.1. Container

### Especificações

| Propriedade | Valor |
|-------------|-------|
| **Max-width** | 1400px (breakpoint 2xl) |
| **Padding** | 2rem (32px) |
| **Margin** | auto (centralizado) |
| **Center** | true |

### CSS

```css
.container {
  max-width: 1400px;
  padding: 2rem;
  margin: 0 auto;
}
```

### Implementação Tailwind

```tsx
// Container padrão
<div className="container mx-auto px-4 md:px-6 lg:px-8">
  {/* Conteúdo */}
</div>

// Com max-width explícito
<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
  {/* Conteúdo */}
</div>
```

---

## 10.2. Breakpoints Responsivos

A plataforma usa **6 breakpoints** baseados nos padrões do Tailwind:

### Tabela de Breakpoints

| Breakpoint | Largura Mínima | Comportamentos |
|------------|-----------------|-----------------|
| **Mobile** | < 640px | Nome do app oculto, seletor de idioma oculto, info do usuário oculta |
| **sm** | ≥ 640px | Nome do app visível no header |
| **md** | ≥ 768px | Seletor de idioma visível, padding `p-6` |
| **lg** | ≥ 1024px | Layout expandido, sidebar visível |
| **xl** | ≥ 1280px | Container máximo, mais espaço para conteúdo |
| **2xl** | ≥ 1400px | Container em max-width 1400px |

### Mapeamento de Comportamentos

```tsx
// Mobile: oculto tudo exceto menu hamburger
<header className="hidden md:flex"> {/* Seletor de idioma */}</header>
<h1 className="hidden sm:block">{appName}</h1>

// Tablet: mostra seletor de idioma
<div className="hidden md:flex items-center gap-2">
  <Globe size={14} />
  <span className="text-xs">PT</span>
</div>

// Desktop: layout completo
<div className="flex">
  <Sidebar />
  <MainContent />
</div>
```

---

## 10.3. Border Radius

### Tokens de Border Radius

| Token | Classe Tailwind | Valor (rem) | Valor (px) | Uso |
|-------|-----------------|-------------|------------|-----|
| `--radius` | `rounded` | 0.5rem | 8px | Padrão shadcn |
| `rounded-md` | `rounded-md` | 0.375rem | 6px | Componentes shadcn |
| `rounded-sm` | `rounded-sm` | 0.25rem | 4px | Variante mínima |
| `rounded-lg` | `rounded-lg` | 0.5rem | 8px | Componentes shadcn |
| `rounded-xl` | `rounded-xl` | 0.75rem | 12px | Inputs, botões, icon-box |
| `rounded-2xl` | `rounded-2xl` | 1rem | 16px | Cards, header |
| `rounded-[2.5rem]` | `rounded-[2.5rem]` | 2.5rem | 40px | Card de login |
| `rounded-full` | `rounded-full` | 9999px | ∞ | Avatares, pills, botão logout |

### Visual dos Border Radius

```
rounded-sm   ████░░░░░░░░░░░░░░░░  4px
rounded      ████████░░░░░░░░░░░░  8px
rounded-lg   ████████████░░░░░░░  8px
rounded-xl   ████████████████░░░  12px
rounded-2xl  ██████████████████  16px
rounded-[2]  ████████████████████  40px
rounded-full ████████████████████  ∞ (circle)
```

---

## 10.4. Uso de Border Radius por Componente

| Componente | Border Radius | Classe |
|------------|---------------|--------|
| **Botão principal** | 12px | `rounded-xl` |
| **Botão secundário** | 8px | `rounded-lg` |
| **Input** | 12px | `rounded-xl` |
| **Card de login** | 40px | `rounded-[2.5rem]` |
| **Card de conteúdo** | 16px | `rounded-2xl` |
| **Header** | 16px | `rounded-2xl` |
| **Icon box** | 12px | `rounded-xl` |
| **Icon box small** | 8px | `rounded-lg` |
| **Icon box large** | 14px | `rounded-0.875rem` |
| **Avatar** | ∞ | `rounded-full` |
| **Badge** | 4px | `rounded-sm` |
| **Pill** | ∞ | `rounded-full` |

---

## 10.5. Espaçamento (Spacing)

### Sistema de Espaçamento

A plataforma usa o sistema de spacing do Tailwind:

| Classe | Rem | Pixels |
|-------|-----|--------|
| `p-1` | 0.25rem | 4px |
| `p-2` | 0.5rem | 8px |
| `p-3` | 0.75rem | 12px |
| `p-4` | 1rem | 16px |
| `p-5` | 1.25rem | 20px |
| `p-6` | 1.5rem | 24px |
| `p-8` | 2rem | 32px |
| `p-10` | 2.5rem | 40px |
| `p-12` | 3rem | 48px |

### Margins e Gaps

```tsx
// Padding
<div className="p-4">...</div>
<div className="px-4 py-2">...</div>

// Margin
<div className="mt-4 mb-8">...</div>

// Gap (flex/grid)
<div className="flex gap-4">...</div>
<div className="grid grid-cols-3 gap-6">...</div>
```

---

## 10.6. Layout Responsive

### Exemplo de Layout Responsivo

```tsx
// Layout de dashboard responsivo
<div className="container mx-auto px-4 py-8">
  {/* Grid: 1 coluna mobile, 2 tablet, 3 desktop */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Cards */}
    <Card1 />
    <Card2 />
    <Card3 />
  </div>
</div>
```

### Sidebar Responsive

```tsx
// Sidebar responsiva
<aside className={`
  fixed inset-y-0 left-0 z-50
  w-64 transform transition-transform
  ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  md:translate-x-0 md:static
`}>
  {/* Conteúdo da sidebar */}
</aside>
```

---

## Checklist de Conclusão

- [ ] Container (max-width 1400px, padding 2rem) documentado
- [ ] 6 breakpoints responsivos listados em tabela
- [ ] Comportamentos por breakpoint especificados
- [ ] 8 tokens de border radius detalhados
- [ ] Uso de border radius por componente em tabela
- [ ] Sistema de spacing demostrado
- [ ] Layout responsive com exemplos de código

---

## Próximo Passo

Avance para **[Capítulo 11: Ambientes](./11-ambientes.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-BRANDING.md)*