# Capítulo 02: Sistema de Cores

## Objetivo

Documentar o sistema completo de cores da plataforma, incluindo os 42 tokens do ColorScheme, gradientes, cores de feedback e tokens de componentes.

---

## 2.1. Paleta Base — Cores Fundamentais

As cores base formam o vocabulário visual da aplicação:

### Cores de Fundo e Superfície

| Token | Variável CSS | Cor HEX | Descrição |
|-------|--------------|---------|-----------|
| `background` | `--color-bg` | `#0f172a` | Fundo principal da página |
| `surface` | `--color-surface` | `#1e293b` | Cards, modais, painéis, menus dropdown |
| `surfaceHover` | `--color-surface-hover` | `#334155` | Estado hover de superfícies, linhas de tabela |
| `card` | `--color-card` | `#1e293b` | Fundo específico de cards |

### Cores de Texto

| Token | Variável CSS | Cor HEX | Descrição |
|-------|--------------|---------|-----------|
| `textMain` | `--color-text-main` | `#f8fafc` | Texto principal: títulos, parágrafos, nomes |
| `textMuted` | `--color-text-muted` | `#94a3b8` | Texto secundário: labels, descrições, placeholders |
| `textInverted` | `--color-text-inverted` | `#0f172a` | Texto sobre fundos coloridos (botões primários) |

### Cores de Borda

| Token | Variável CSS | Cor HEX | Descrição |
|-------|--------------|---------|-----------|
| `border` | `--color-border` | `transparent` | Borda principal (transparente para estética clean) |
| `borderSubtle` | `--color-border-subtle` | `#1e293b` | Borda sutil para divisores internos |

---

## 2.2. Cores de Marca (Accent)

O dourado é a **única cor de destaque** permitida na plataforma:

### Cores de Accent

| Token | Variável CSS | Cor HEX | Descrição |
|-------|--------------|---------|-----------|
| `accent` | `--color-accent` | `#c9a655` | Cor de destaque principal (dourado) |
| `accentHover` | `--color-accent-hover` | `#d4b366` | Variação hover do accent |
| `accentForeground` | `--color-accent-fg` | `#0f172a` | Texto sobre fundo accent (para contraste) |
| `accentMuted` | `--color-accent-muted` | `#c9a65520` | Accent com ~12% opacidade (para backgrounds) |

### Cores de Feedback

| Token | Variável CSS | Cor HEX | Descrição |
|-------|--------------|---------|-----------|
| `success` | `--color-success` | `#22c55e` | Status ativo, confirmações |
| `successBg` | `--color-success-bg` | `#22c55e15` | Background sutil de sucesso (~8% opacidade) |
| `warning` | `--color-warning` | `#eab308` | Pendências, avisos |
| `warningBg` | `--color-warning-bg` | `#eab30815` | Background sutil de warning |
| `error` | `--color-error` | `#ef4444` | Erros, ações destrutivas |
| `errorBg` | `--color-error-bg` | `#ef444415` | Background sutil de erro |

---

## 2.3. Cores de Componentes

Tokens específicos para elementos de interface:

| Token | Variável CSS | Cor HEX | Descrição |
|-------|--------------|---------|-----------|
| `inputBg` | `--color-input-bg` | `#0f172a` | Fundo de campos de input |
| `inputBorder` | `--color-input-border` | `#334155` | Borda de inputs em repouso |
| `inputFocus` | `--color-input-focus` | `#c9a655` | Ring/borda ao focar |
| `buttonPrimaryBg` | `--color-btn-primary-bg` | `#c9a655` | Fundo do botão primário (CTA) |
| `buttonPrimaryText` | `--color-btn-primary-text` | `#0f172a` | Texto do botão primário |
| `badgeBg` | `--color-badge-bg` | `#334155` | Fundo de badges, tags, chips |
| `tooltipBg` | `--color-tooltip-bg` | `#f8fafc` | Fundo de tooltips |
| `tooltipText` | `--color-tooltip-text` | `#0f172a` | Texto de tooltips |

---

## 2.4. Cores de Efeitos

Tokens para sombras, sobreposições e elementos visuais:

| Token | Variável CSS | Cor HEX | Descrição |
|-------|--------------|---------|-----------|
| `overlay` | `--color-overlay` | `#00000080` | Overlay de modais (50% opacidade) |
| `shadow` | `--color-shadow` | `#00000040` | Cor base para box-shadows |
| `glassTint` | `--color-glass-tint` | `#ffffff10` | Tint do glassmorphism |
| `headerBg` | `--color-header-bg` | `#1e293b` | Fundo base do header |
| `scrollbarThumb` | `--color-scrollbar-thumb` | `#c9a655` | Polegar da scrollbar |
| `scrollbarTrack` | `--color-scrollbar-track` | `transparent` | Trilha da scrollbar |
| `ring` | `--color-ring` | `#c9a65580` | Focus ring (50% opacidade) |

---

## 2.5. Cores de Gradiente

O gradiente metálico é o elemento visual distintivo da marca:

| Token | Variável CSS | Cor HEX | Descrição |
|-------|--------------|---------|-----------|
| `gradientStart` | `--color-gradient-start` | `#c9a655` | Ponto inicial do gradiente (dourado) |
| `gradientMid` | `--color-gradient-mid` | `#e8d48b` | Ponto médio (brilho central) |
| `gradientEnd` | `--color-gradient-end` | `#a8873a` | Ponto final (profundidade) |

---

## 2.6. Cores de Hover

Tokens específicos para estados de interação:

| Token | Variável CSS | Cor HEX | Descrição |
|-------|--------------|---------|-----------|
| `hoverBg` | `--color-hover-bg` | `#334155` | Fundo no hover |
| `hoverBorder` | `--color-hover-border` | `#c9a65540` | Borda no hover (~25% opacidade) |
| `hoverScale` | — | `1.02` | Fator de escala no hover (JS, não CSS) |
| `hoverShadow` | `--color-hover-shadow` | `#c9a65525` | Sombra no hover (~15% opacidade) |

---

## 2.7. Gradiente Metálico Assinatura

O gradiente-metálico é usado em elementos de alto impacto:

### Fórmula do Gradiente

```css
background: linear-gradient(135deg,
  var(--color-gradient-start) 0%,
  var(--color-gradient-mid) 40%,
  var(--color-gradient-end) 70%,
  var(--color-gradient-start) 100%
);
```

### Valores Concretos (Fallback)

```css
background: linear-gradient(135deg,
  #c9a655 0%,  /* Dourado principal */
  #e8d48b 40%, /* Dourado claro (brilho) */
  #a8873a 70%, /* Dourado escuro (profundidade) */
  #c9a655 100% /* Retorno ao dourado */
);
```

### Onde Usar

| Contexto | Uso |
|----------|-----|
| Botão principal de login | Gradiente completo |
| Avatar do usuário no header | Gradiente completo |
| Logo fallback | Gradiente completo |
| Nome da marca na página de login | Com animação shimmer |

---

## 2.8. Cores por Ambiente (Environment Effects)

Cada ambiente (auth, client, manager, admin) pode ter cores diferentes para blobs decorativos:

### Valores por Ambiente

| Token | Global | Auth (Login) | Client | Manager | Admin |
|-------|--------|--------------|--------|---------|-------|
| `blob1Color` | `#c9a655` | `#c9a655` | `#c9a655` | `#c9a655` | `#c9a655` |
| `blob2Color` | `#e8d48b` | `#c9a655` | `#e8d48b` | `#d4b366` | `#e8d48b` |
| `blob3Color` | `#a8873a` | `#c9a655` | `#a8873a` | `#b8953e` | `#a8873a` |

> 📊 Mais detalhes sobre Environment Effects no **Capítulo 11**.

---

## 2.9. Tokens HSL (shadcn/ui)

Além das CSS variables em HEX, o sistema usa tokens HSL para compatibilidade com componentes shadcn/ui:

### Tokens Definidos em `index.css`

| Token | Valor HSL | Uso |
|-------|-----------|-----|
| `--background` | `222.2 84% 4.9%` | Fundo da aplicação |
| `--foreground` | `210 40% 98%` | Texto principal |
| `--card` | `222.2 84% 4.9%` | Fundo de cards |
| `--card-foreground` | `210 40% 98%` | Texto de cards |
| `--popover` | `222.2 84% 4.9%` | Fundo de popovers |
| `--popover-foreground` | `210 40% 98%` | Texto de popovers |
| `--primary` | `210 40% 98%` | Cor primária |
| `--primary-foreground` | `222.2 47.4% 11.2%` | Texto sobre primário |
| `--secondary` | `217.2 32.6% 17.5%` | Cor secundária |
| `--secondary-foreground` | `210 40% 98%` | Texto sobre secundário |
| `--muted` | `217.2 32.6% 17.5%` | Fundos atenuados |
| `--muted-foreground` | `215 20.2% 65.1%` | Texto atenuado |
| `--accent` | `217.2 32.6% 17.5%` | Accent shadcn |
| `--accent-foreground` | `210 40% 98%` | Texto sobre accent |
| `--destructive` | `0 62.8% 30.6%` | Ações destrutivas |
| `--destructive-foreground` | `210 40% 98%` | Texto sobre destructive |
| `--border` | `217.2 32.6% 17.5%` | Bordas shadcn |
| `--input` | `217.2 32.6% 17.5%` | Bordas de inputs |
| `--ring` | `212.7 26.8% 83.9%` | Focus ring |
| `--radius` | `0.5rem` | Border-radius base |

### Tokens da Sidebar

| Token | Valor HSL |
|-------|-----------|
| `--sidebar-background` | `240 5.9% 10%` |
| `--sidebar-foreground` | `240 4.8% 95.9%` |
| `--sidebar-primary` | `224.3 76.3% 48%` |
| `--sidebar-primary-foreground` | `0 0% 100%` |
| `--sidebar-accent` | `240 3.7% 15.9%` |
| `--sidebar-accent-foreground` | `240 4.8% 95.9%` |
| `--sidebar-border` | `240 3.7% 15.9%` |
| `--sidebar-ring` | `217.2 91.2% 59.8%` |

---

## 2.10. Resumo Visual

### Paleta Consolidada Dark Mode

| Elemento | Cor HEX |
|----------|---------|
| **Fundo** | `#0f172a` (azul marinho) |
| **Superfícies** | `#1e293b` (slate escuro) |
| **Bordas** | `transparent` |
| **Texto principal** | `#f8fafc` |
| **Texto secundário** | `#94a3b8` |
| **Accent (dourado)** | `#c9a655` |
| **Glass effect** | 6% branco com blur 20px |
| **Scrollbar** | Dourado sobre transparente |

---

## Checklist de Conclusão

- [ ] Cores base documentadas (background, surface, text)
- [ ] 42 tokens ColorScheme mapeados em tabela
- [ ] Cores de marca/accent definidas
- [ ] Cores de feedback (success, warning, error) documentadas
- [ ] Cores de componentes (input, button, badge) listadas
- [ ] Cores de efeitos (overlay, shadow, glass) incluídas
- [ ] Gradiente metálico definido com 3 stops
- [ ] Cores de hover documentadas
- [ ] Tokens HSL shadcn/ui incluídos
- [ ] Paleta consolidada resumida

---

## Próximo Passo

Avance para **[Capítulo 03: Tipografia](./03-tipografia.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-BRANDING.md)*