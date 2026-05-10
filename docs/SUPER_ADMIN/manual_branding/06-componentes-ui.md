# Capítulo 06: Componentes UI

## Objetivo

Documentar todos os componentes de interface da plataforma, incluindo estilos de botões, inputs, cards, header e icon boxes.

---

## 6.1. Botões

### 6.1.1. Botão Principal (CTA / Login)

O botão principal usa o **gradiente metálico dourado** como elemento de destaque máximo.

**Especificações:**

| Propriedade | Valor |
|-------------|-------|
| **Background** | Gradiente metálico (135deg) |
| **Cores** | #c9a655 → #e8d48b → #a8873a → #c9a655 |
| **Texto** | #0f172a (dark) |
| **Peso da fonte** | Bold (700) |
| **Padding** | py-4 (vertical) |
| **Border-radius** | rounded-xl (12px) |
| **Sombra** | `0 10px 25px -5px rgba(201,166,85,0.3)` |

**CSS Completo:**

```css
.btn-primary {
  /* Gradiente metálico */
  background: linear-gradient(
    135deg,
    var(--color-gradient-start) 0%,
    var(--color-gradient-mid) 40%,
    var(--color-gradient-end) 70%,
    var(--color-gradient-start) 100%
  );

  /* Texto escuro sobre dourado */
  color: var(--color-text-inverted);
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 0.75rem;

  /* Sombra */
  box-shadow: 0 10px 25px -5px rgba(201, 166, 85, 0.3);

  /* Transição */
  transition: all 300ms ease;
}

/* Hover: overlay branco + escala */
.btn-primary:hover {
  /* Overlay branco translúcido */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 100%
  ),
  linear-gradient(
    135deg,
    var(--color-gradient-start) 0%,
    var(--color-gradient-mid) 40%,
    var(--color-gradient-end) 70%,
    var(--color-gradient-start) 100%
  );

  /* Escala */
  transform: scale(1.02);
}

/* Active: redução */
.btn-primary:active {
  transform: scale(0.95);
}
```

**Exemplo JSX:**

```tsx
<button className="btn-primary">
  Entrar na Plataforma
</button>
```

---

### 6.1.2. Botão Secundário

Botão com estilo mais discreto, para ações não prioritárias.

**Especificações:**

| Propriedade | Valor |
|-------------|-------|
| **Background** | `--color-bg` |
| **Texto** | `--color-text-muted` |
| **Border-radius** | rounded-lg (8px) |
| **Border** | 1px solid transparent |

**CSS:**

```css
.btn-secondary {
  background-color: var(--color-bg);
  color: var(--color-text-muted);
  border-radius: 0.5rem;
  border: 1px solid transparent;
  padding: 0.75rem 1.5rem;
  transition: all 300ms ease;
}

.btn-secondary:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-text-main);
}
```

---

### 6.1.3. Botão de Logout

Botão circular com ícone, usado para logout no header.

**Especificações:**

| Propriedade | Valor |
|-------------|-------|
| **Formato** | Circular |
| **Tamanho** | 40px (w-10 h-10) |
| **Background default** | red-500/10 (vermelho sutil) |
| **Background hover** | red-500 (vermelho sólido) |
| **Texto hover** | white |
| **Sombra hover** | `0 0 20px rgba(239,68,68,0.3)` |
| **Ícone** | LogOut (lucide-react) |

**CSS:**

```css
.btn-logout {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  transition: all 300ms ease;
}

.btn-logout:hover {
  background-color: #ef4444;
  color: white;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}
```

---

## 6.2. Inputs de Formulário

### Especificações

| Propriedade | Valor |
|-------------|-------|
| **Background** | `bg-black/5 dark:bg-white/5` |
| **Border** | `border-white/10` |
| **Padding** | p-4 (16px) |
| **Border-radius** | rounded-xl (12px) |
| **Shadow** | shadow-inner |
| **Hover** | `bg-black/10 dark:bg-white/10` |
| **Focus** | ring-2 com cor do accent |

**CSS:**

```css
.input-field {
  background: rgba(0, 0, 0, 0.05); /* fallback */
  background: var(--color-input-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  color: var(--color-text-main);
  transition: all 300ms ease;
}

.input-field:hover {
  background: rgba(0, 0, 0, 0.1);
}

.input-field:focus {
  outline: none;
  ring: 2px;
  ring-color: var(--color-input-focus); /* #c9a655 */
}
```

**Exemplo JSX:**

```tsx
<input
  type="email"
  placeholder="seu@email.com"
  className="input-field w-full"
/>
```

### Input com Toggle de Senha

```tsx
<div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    className="input-field pr-10"
  />
  <button
    type="button"
    className="absolute right-3 top-1/2 -translate-y-1/2"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>
```

---

## 6.3. Cards

### 6.3.1. Card de Login

**Especificações:**

| Propriedade | Valor |
|-------------|-------|
| **Background** | `color-mix(in srgb, var(--color-surface) 40%, transparent)` |
| **Backdrop-filter** | blur(2rem) |
| **Border** | `border-white/20 dark:border-white/10` |
| **Border-radius** | rounded-[2.5rem] (40px) |
| **Shadow** | shadow-2xl |
| **Linha decorativa** | Gradiente horizontal (accent) no topo |

**CSS:**

```css
.card-login {
  background: linear-gradient(
    135deg,
    rgba(30, 41, 59, 0.4) 0%,
    transparent 100%
  );
  backdrop-filter: blur(2rem);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 2rem;
}

/* Linha decorativa superior */
.card-login::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--color-accent) 0%,
    var(--color-gradient-mid) 50%,
    var(--color-accent) 100%
  );
  border-radius: 2.5rem 2.5rem 0 0;
}
```

---

### 6.3.2. Card de Conteúdo

**Especificações:**

| Propriedade | Valor |
|-------------|-------|
| **Background** | `var(--color-surface)` |
| **Border-radius** | rounded-xl (12px) |
| **Padding** | p-4 ou p-6 |
| **Shadow** | shadow-lg |

---

## 6.4. Header

### Especificações

| Propriedade | Valor |
|-------------|-------|
| **Posição** | sticky top-0 |
| **z-index** | z-40 |
| **Estilo** | liquid-glass |
| **Border-radius** | rounded-2xl (16px) |
| **Margem do topo** | pt-4 (flutua sobre o conteúdo) |

**Estrutura:**

```tsx
<header className="sticky top-0 z-40 pt-4">
  <div className="liquid-glass rounded-2xl px-6 py-4">
    {/* Conteúdo do header */}
  </div>
</header>
```

### Header com Refleto de Patente

O header adapta-se visualmente ao nível do usuário:

```css
.header-level {
  /* Borda com cor da patente */
  border: 1px solid color-mix(in srgb, var(--level-color) 25%, transparent);

  /* Fundo com cor da patente */
  background-color: color-mix(in srgb, var(--level-color) 8%, var(--color-surface), 100%);

  /* Sombra com glow */
  box-shadow: 0 0 20px color-mix(in srgb, var(--level-color) 8%, transparent),
              inset 0 0 30px color-mix(in srgb, var(--level-color) 5%, transparent);
}
```

---

## 6.5. Icon Box

O **icon box** é um contêiner padronizado para ícones em toda a plataforma.

### Variantes

| Variante | Classe | Tamanho | Border Radius |
|----------|--------|----------|---------------|
| **Small** | `.icon-box-sm` | 2rem (32px) | 0.5rem (8px) |
| **Default** | `.icon-box` | 2.5rem (40px) | 0.75rem (12px) |
| **Large** | `.icon-box-lg` | 3rem (48px) | 0.875rem (14px) |

### CSS Completo

```css
/* Icon Box Default */
.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;

  /* Background: mix de surface com preto */
  background-color: rgba(15, 23, 42, 0.8); /* fallback */
  background-color: color-mix(in srgb, var(--color-surface) 60%, black);

  /* Borda com accent */
  border: 1px solid rgba(201, 166, 85, 0.2);
  border: 1px solid color-mix(in srgb, var(--color-accent) 20%, transparent);

  /* Cor do ícone */
  color: var(--color-accent);

  flex-shrink: 0;
  transition: all 0.3s ease;
}

/* Icon Box Small */
.icon-box-sm {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
}

/* Icon Box Large */
.icon-box-lg {
  width: 3rem;
  height: 3rem;
  border-radius: 0.875rem;
}
```

### Uso

```tsx
// Default
<div className="icon-box">
  <Star size={20} />
</div>

// Small
<div className="icon-box-sm">
  <Check size={16} />
</div>

// Large
<div className="icon-box-lg">
  <Settings size={24} />
</div>
```

---

## 6.6. Badges e Tags

### Badge de Status

```css
.badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}
```

### Tipos de Badge

| Tipo | Background | Texto |
|------|------------|-------|
| Default | accent/10% | accent |
| Success | success/15% | success |
| Warning | warning/15% | warning |
| Error | error/15% | error |

---

## 6.7. Tabela

### Estilo de Linha

```css
.table-row:nth-child(even) {
  background-color: color-mix(in srgb, var(--color-surface) 30%, transparent);
}

.table-row:hover {
  background-color: var(--color-surface-hover);
}
```

---

## Checklist de Conclusão

- [ ] Botão principal (CTA) com gradiente completo documentado
- [ ] Efeito hover (overlay branco + escala) detalhado
- [ ] Botão secundário especificado
- [ ] Botão de logout (circular, vermelho) documentado
- [ ] Inputs de formulário com todas as variações
- [ ] Toggle de senha (eye icon) incluso
- [ ] Card de login com border-radius 2.5rem detalhado
- [ ] Header sticky com liquid-glass especificado
- [ ] Header com reflexão de patente (cores dinâmicas)
- [ ] Icon Box nas 3 variantes (sm, default, lg)
- [ ] Badges e tags documentados

---

## Próximo Passo

Avance para **[Capítulo 07: Ícones](./07-icones.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-BRANDING.md)*