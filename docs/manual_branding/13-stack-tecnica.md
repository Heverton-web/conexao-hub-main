# Capítulo 13: Stack Técnica

## Objetivo

Documentar todas as libraries, frameworks e ferramentas técnicas utilizadas no design system e na aplicação.

---

## 13.1. Core do Design System

### 13.1.1. Tailwind CSS

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 3.x (especificamente 3.4.17) |
| **Tipo** | CSS Framework utility-first |
| **Package** | `tailwindcss` |
| **Propósito** | Estilização base de todos os componentes |

**Configuração principal:**

```typescript
// tailwind.config.ts
export default {
  darkMode: ['class'],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      // colors, keyframes, animation, borderRadius
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

### 13.1.2. tailwindcss-animate

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 1.0.7 |
| **Package** | `tailwindcss-animate` |
| **Propósito** | Animações declarativas para componentes |

**Animações disponíveis:**

```typescript
// Automaticamente adiciona:
// - animate-fade-in
// - animate-slide-up
// - animate-accordion-down
// - animate-accordion-up
// - E outras animações do Radix UI
```

---

### 13.1.3. shadcn/ui

| Propriedade | Valor |
|-------------|-------|
| **Tipo** | Componentes React |
| **Base** | Radix UI Primitives |
| **Estilização** | Tailwind CSS |
| **Propósito** | Componentes base (dialog, button, toast, etc) |

**Componentes utilizados:**

| Componente | Uso |
|------------|-----|
| **Button** | Botões de todas as variações |
| **Dialog** | Modais e popups |
| **DropdownMenu** | Menus dropdown |
| **Input** | Campos de formulário |
| **Select** | Seleções dropdown |
| **Tabs** | Abas de navegação |
| **Toast** | Notificações |
| **Tooltip** | Dicas contextual |
| **Avatar** | Imagens de perfil |
| **Badge** | Tags e indicadores |

---

## 13.2. Ícones

### Lucide React

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 0.462.0 |
| **Package** | `lucide-react` |
| **Estilo** | Outline (stroke), monocromático |
| **Tamanho bundle** | ~200KB |

```typescript
import { Star, Settings, User } from 'lucide-react';
```

---

## 13.3. Gráficos e Visualização

### Recharts

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 2.15.4 |
| **Package** | `recharts` |
| **Tipo** | Biblioteca de gráficos React |
| **Propósito** | Dashboards e visualizações de dados |

**Componentes disponíveis:**

| Componente | Uso |
|------------|-----|
| **LineChart** | Gráficos de linha |
| **BarChart** | Gráficos de barra |
| **PieChart** | Gráficos de pizza |
| **AreaChart** | Gráficos de área |
| **ResponsiveContainer** | Container responsivo |
| **Tooltip** | Tooltip customizável |
| **Legend** | Legenda |

**Exemplo de uso:**

```tsx
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
];

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="#c9a655" />
  </BarChart>
</ResponsiveContainer>
```

---

## 13.4. Animações de Celebração

### canvas-confetti

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 1.9.4 |
| **Package** | `canvas-confetti` |
| **Tipo** | Biblioteca de animação 2D |
| **Propósito** | Efeitos de celebração (gamificação) |

```typescript
import confetti from 'canvas-confetti';

confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: ['#c9a655', '#e8d48b', '#a8873a'],
});
```

---

## 13.5. Utilitários de Estilização

### tailwind-merge

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 2.6.0 |
| **Package** | `tailwind-merge` |
| **Propósito** | Merge de classes Tailwind sem conflitos |

```typescript
import { twMerge } from 'tailwind-merge';

// Resolve conflitos automaticamente
twMerge('px-2 py-2', 'px-4'); // 'py-2 px-4'
```

### clsx

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 2.1.1 |
| **Package** | `clsx` |
| **Propósito** | Criar classes condicionais |

```typescript
import { clsx } from 'clsx';

clsx('base-class', isActive && 'active', isDisabled && 'disabled');
```

### class-variance-authority

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 0.7.1 |
| **Package** | `class-variance-authority` |
| **Propósito** | Criar variantes de componentes |

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva('base-button', {
  variants: {
    variant: {
      primary: 'bg-gold text-black',
      secondary: 'bg-slate text-white',
    },
    size: {
      sm: 'px-2 py-1',
      lg: 'px-4 py-2',
    },
  },
});
```

---

## 13.6. Formulários e Validação

### react-hook-form

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 7.61.1 |
| **Package** | `react-hook-form` |
| **Propósito** | Gerenciamento de formulários |

### @hookform/resolvers

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 3.10.0 |
| **Package** | `@hookform/resolvers` |
| **Propósito** | Integração com Zod |

### Zod

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 3.25.76 |
| **Package** | `zod` |
| **Propósito** | Validação de schemas |

---

## 13.7. Backend/State

### @supabase/supabase-js

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 2.95.3 |
| **Package** | `@supabase/supabase-js` |
| **Propósito** | Cliente Supabase |

### @tanstack/react-query

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 5.83.0 |
| **Package** | `@tanstack/react-query` |
| **Propósito** | Gerenciamento de estado de servidor |

---

## 13.8. Date/Time

### date-fns

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 3.6.0 |
| **Package** | `date-fns` |
| **Propósito** | Manipulação de datas |

### react-day-picker

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 8.10.1 |
| **Package** | `react-day-picker` |
| **Propósito** | Componente de seleção de data |

---

## 13.9. Utilitários de UI

### cmdk

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 1.1.1 |
| **Package** | `cmdk` |
| **Propósito** | Command palette (Ctrl+K) |

### sonner

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 1.7.4 |
| **Package** | `sonner` |
| **Propósito** | Toast notifications |

### vaul

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 0.9.9 |
| **Package** | `vaul` |
| **Propósito** | Drawer/sheet component |

### next-themes

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 0.3.0 |
| **Package** | `next-themes` |
| **Propósito** | Gerenciamento de temas |

---

## 13.10. Geração de PDF

### jspdf

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 4.2.0 |
| **Package** | `jspdf` |
| **Propósito** | Geração de PDFs |

### html2canvas

| Propriedade | Valor |
|-------------|-------|
| **Versão** | 1.4.1 |
| **Package** | `html2canvas` |
| **Propósito** | Captura de screenshots de elementos DOM |

---

## 13.11. Outras Dependências

### Dependencies de UI

| Package | Versão | Uso |
|---------|--------|-----|
| `@radix-ui/react-*` | Diversos | Componentes base shadcn |
| `embla-carousel-react` | 8.6.0 | Carrossel de imagens |
| `input-otp` | 1.4.2 | OTP input |
| `react-resizable-panels` | 2.1.9 | Painéis redimensionáveis |
| `canvas-confetti` | 1.9.4 | Celebração gamificação |

### Dev Dependencies

| Package | Versão | Uso |
|---------|--------|-----|
| `typescript` | 5.8.3 | Tipo-checking |
| `vite` | 5.4.19 | Build tool |
| `vitest` | 3.2.4 | Testes |
| `eslint` | 9.32.0 | Linting |
| `postcss` | 8.5.6 | Processamento CSS |
| `autoprefixer` | 10.4.21 | Prefixing CSS |

---

## 13.12. Arquivos de Configuração

| Arquivo | Propósito |
|---------|-----------|
| `tailwind.config.ts` | Configuração do Tailwind, theme, animações |
| `postcss.config.js` | Configuração do PostCSS |
| `tsconfig.json` | Configuração do TypeScript |
| `vite.config.ts` | Configuração do Vite |
| `eslint.config.js` | Configuração do ESLint |

---

## Checklist de Conclusão

- [ ] Tailwind CSS documentado
- [ ] tailwindcss-animate incluído
- [ ] shadcn/ui componentes listados
- [ ] Lucide React documentado (v0.462.0)
- [ ] Recharts incluído (v2.15.4) - NOVO
- [ ] canvas-confetti documentado (v1.9.4)
- [ ] Utilitários (twMerge, clsx, cva) listados
- [ ] Formulários (react-hook-form, zod) mapados
- [ ] Backend (supabase, react-query) descritos
- [ ] Date/Time (date-fns) documentados
- [ ] Utilitários UI (cmdk, sonner) incluídos
- [ ] PDF (jspdf, html2canvas) mapeados
- [ ] Arquivos de configuração listados
- [ ] Versões de todos os packages confirmadas

---

## Fim do Manual

Este é o último capítulo. Você completou a documentação completa do design system do Hub Conexão!

---

## Resumo do Manual

| Métrica | Valor |
|---------|-------|
| Total de capítulos | 13 |
| Total de arquivos | 14 (13 capítulos + índice) |
| Tokens ColorScheme | 42 |
| Tokens EnvironmentEffects | 13 |
| Animações | 6 keyframes |
| Componentes documentados | 10+ |
| Libraries da stack | 20+ |

---

*Retornar para [Índice](./MANUAL-DEPLOY-BRANDING.md)*