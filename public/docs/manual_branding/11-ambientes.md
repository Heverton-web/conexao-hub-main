# Capítulo 11: Ambientes

## Objetivo

Documentar o sistema de Environment Effects — configurações visuais que variam por ambiente (auth, client, manager, admin), permitindo experiências distintas enquanto mantém a identidade da marca.

---

## 11.1. Conceito

### O que são Environment Effects?

Os **Environment Effects** são 13 tokens que controlam aspectos visuais que podem variar por "ambiente" da aplicação:

| Ambiente | Descrição |
|----------|-----------|
| **auth** | Página de login/cadastro |
| **client** | Área do cliente |
| **manager** | Área do gestor |
| **admin** | Área administrativa |
| **global** | Configurações globais (fallback) |

### Por Que Ambientes Diferentes?

Cada ambiente pode ter necessidades visuais diferentes:
- **Auth**: Blobs maiores e mais difusos para login
- **Client**: Visual mais clean para materiais
- **Manager**: Mais informação, menos ornamento
- **Admin**: Visual funcional e direto

---

## 11.2. Os 13 Tokens de Environment Effects

### Tabela de Todos os Tokens

| # | Token | Tipo | Descrição |
|---|-------|------|-----------|
| 1 | `pageBg` | cor HEX | Cor de fundo da página |
| 2 | `blob1Color` | cor HEX | Cor do 1º blob animado |
| 3 | `blob2Color` | cor HEX | Cor do 2º blob animado |
| 4 | `blob3Color` | cor HEX | Cor do 3º blob animado |
| 5 | `blobOpacity` | string (0-1) | Opacidade dos blobs |
| 6 | `blobSize` | string (rem) | Tamanho dos blobs |
| 7 | `blobBlur` | string (px) | Blur dos blobs |
| 8 | `grainOpacity` | string (0-1) | Opacidade do grain |
| 9 | `grainBlendMode` | string | Blend mode do grain |
| 10 | `grainContrast` | string (%) | Contraste do grain |
| 11 | `glassOpacity` | string (0-1) | Opacidade do glassmorphism |
| 12 | `glassBlur` | string (px) | Blur do glass |
| 13 | `glassBorderOpacity` | string (0-1) | Opacidade da borda glass |

---

## 11.3. Valores por Ambiente

### Valores Completos em Tabela

| Token | Global | Auth (Login) | Client | Manager | Admin |
|-------|--------|--------------|--------|---------|-------|
| **pageBg** | #0f172a | #0f172a | #0f172a | #0f172a | #0f172a |
| **blob1Color** | #c9a655 | #c9a655 | #c9a655 | #c9a655 | #c9a655 |
| **blob2Color** | #e8d48b | #c9a655 | #e8d48b | #d4b366 | #e8d48b |
| **blob3Color** | #a8873a | #c9a655 | #a8873a | #b8953e | #a8873a |
| **blobOpacity** | 0.20 | 0.15 | 0.20 | 0.15 | 0.18 |
| **blobSize** | 18 | 24 | 18 | 20 | 18 |
| **blobBlur** | 64 | 100 | 64 | 80 | 64 |
| **grainOpacity** | 0.20 | 0.10 | 0.20 | 0.20 | 0.20 |
| **grainBlendMode** | multiply | multiply | multiply | multiply | multiply |
| **grainContrast** | 150 | 150 | 150 | 150 | 150 |
| **glassOpacity** | 0.40 | 0.40 | 0.40 | 0.40 | 0.40 |
| **glassBlur** | 24 | 24 | 24 | 24 | 24 |
| **glassBorderOpacity** | 0.10 | 0.10 | 0.10 | 0.10 | 0.10 |

---

## 11.4. Diferenças Notáveis entre Ambientes

### Auth (Login)

| Característica | Valor | Impacto Visual |
|----------------|-------|----------------|
| **Blob size** | 24rem | Blobs maiores e mais impactantes |
| **Blob blur** | 100px | Mais difusos, efeito "sonhador" |
| **Blob opacity** | 0.15 | Menos visíveis, mais sutis |
| **Grain opacity** | 0.10 | Textura mais sutil |
| **Todas cores de blob** | #c9a655 | Monocromático dourado |

### Client

| Característica | Valor | Impacto Visual |
|----------------|-------|----------------|
| **Blob size** | 18rem | Tamanho padrão |
| **Blob blur** | 64px | Padrão de nitidez |
| **Blob opacity** | 0.20 | Visibilidade padrão |
| **Cores de blob** | Mix dourado | Gradiente natural |

### Manager

| Característica | Valor | Impacto Visual |
|----------------|-------|----------------|
| **Blob size** | 20rem | Intermediário |
| **Blob blur** | 80px | Levemente mais difuso |
| **Blob opacity** | 0.15 | Menos噪 (mais limpo) |
| **Cores de blob** | Paleta dourada própria | Distintivo do manager |

### Admin

| Característica | Valor | Impacto Visual |
|----------------|-------|----------------|
| **Blob opacity** | 0.18 | Levemente menor que global |
| **Propósito** | Visual mais clean | Mais espaço para dados |

---

## 11.5. Implementação no Frontend

### Interface TypeScript

```typescript
// Definido em src/types.ts
export interface EnvironmentEffects {
  pageBg: string;
  blob1Color: string;
  blob2Color: string;
  blob3Color: string;
  blobOpacity: string;
  blobSize: string;
  blobBlur: string;
  grainOpacity: string;
  grainBlendMode: string;
  grainContrast: string;
  glassOpacity: string;
  glassBlur: string;
  glassBorderOpacity: string;
}

export type EnvironmentKey = 'auth' | 'client' | 'manager' | 'admin' | 'global';
export type EnvironmentThemes = Record<EnvironmentKey, EnvironmentEffects>;
```

### Valores Padrão

```typescript
// Definido em src/lib/themeDefaults.ts
const DEFAULT_GLOBAL_EFFECTS: EnvironmentEffects = {
  pageBg: '#0f172a',
  blob1Color: '#c9a655',
  blob2Color: '#e8d48b',
  blob3Color: '#a8873a',
  blobOpacity: '0.20',
  blobSize: '18',
  blobBlur: '64',
  grainOpacity: '0.20',
  grainBlendMode: 'multiply',
  grainContrast: '150',
  glassOpacity: '0.40',
  glassBlur: '24',
  glassBorderOpacity: '0.10',
};
```

---

## 11.6. Injeção de CSS Variables

### BrandContext

O `BrandContext` injeta as variáveis de ambiente como CSS custom properties:

```typescript
// Pseudocódigo
const buildEnvCssVars = (effects: EnvironmentEffects): string => {
  return `
    --env-page-bg: ${effects.pageBg};
    --env-blob1-color: ${effects.blob1Color};
    --env-blob2-color: ${effects.blob2Color};
    --env-blob3-color: ${effects.blob3Color};
    --env-blob-opacity: ${effects.blobOpacity};
    --env-blob-size: ${effects.blobSize}rem;
    --env-blob-blur: ${effects.blobBlur}px;
    --env-grain-opacity: ${effects.grainOpacity};
    --env-grain-blend: ${effects.grainBlendMode};
    --env-grain-contrast: ${effects.grainContrast}%;
    --env-glass-opacity: ${effects.glassOpacity};
    --env-glass-blur: ${effects.glassBlur}px;
    --env-glass-border-opacity: ${effects.glassBorderOpacity};
  `;
};
```

---

## 11.7. Uso nos Componentes

### GlobalEffects.tsx

```tsx
// Renderização dos blobs com variáveis de ambiente
const GlobalEffects = () => {
  return (
    <>
      {/* Blob 1 */}
      <div
        className="absolute rounded-full animate-blob"
        style={{
          width: 'var(--env-blob-size, 18rem)',
          height: 'var(--env-blob-size, 18rem)',
          backgroundColor: 'var(--env-blob1-color)',
          opacity: 'var(--env-blob-opacity, 0.2)',
          filter: 'blur(var(--env-blob-blur, 64px))',
        }}
      />

      {/* Blob 2 */}
      <div
        className="absolute rounded-full animate-blob"
        style={{
          width: 'var(--env-blob-size, 18rem)',
          height: 'var(--env-blob-size, 18rem)',
          backgroundColor: 'var(--env-blob2-color)',
          opacity: 'var(--env-blob-opacity, 0.2)',
          filter: 'blur(var(--env-blob-blur, 64px))',
        }}
      />

      {/* Blob 3 */}
      <div
        className="absolute rounded-full animate-blob"
        style={{
          width: 'var(--env-blob-size, 18rem)',
          height: 'var(--env-blob-size, 18rem)',
          backgroundColor: 'var(--env-blob3-color)',
          opacity: 'var(--env-blob-opacity, 0.2)',
          filter: 'blur(var(--env-blob-blur, 64px))',
        }}
      />
    </>
  );
};
```

---

## 11.8. Configuração no Banco de Dados

As configurações de ambiente podem ser armazenadas em `system_config`:

```sql
-- Estrutura da tabela
CREATE TABLE system_config (
  key VARCHAR(255) PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMP
);

-- Configuração de ambientes
INSERT INTO system_config (key, value) VALUES
('environment_themes', '{
  "global": {...},
  "auth": {...},
  "client": {...},
  "manager": {...},
  "admin": {...}
}');
```

---

## Checklist de Conclusão

- [ ] Conceito de Environment Effects explicado
- [ ] 5 ambientes definidos (auth, client, manager, admin, global)
- [ ] 13 tokens documentados em tabela
- [ ] Valores por ambiente em tabela comparativa
- [ ] Diferenças notáveis entre ambientes detalhadas
- [ ] Interface TypeScript demonstrada
- [ ] Injeção de CSS variables explicada
- [ ] Uso em componentes (GlobalEffects) demostrado
- [ ] Configuração via banco de dados mapeada

---

## Próximo Passo

Avance para **[Capítulo 12: Compatibilidade](./12-compatibilidade.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-BRANDING.md)*