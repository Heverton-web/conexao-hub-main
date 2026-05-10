# Capítulo 01: Identidade da Marca

## Objetivo

Definir e documentar a identidade visual da marca Hub Conexão, incluindo nome oficial, logo dinâmico e configurações armazenadas no banco de dados.

---

## 1.1. Nome da Marca

### Nome Oficial

| Variante | Uso |
|----------|-----|
| **Nome completo** | Conexão Digital Implant |
| **Nome curto** | Hub Conexão (ou apenas "Conexão") |
| **Título HTML** | `<title>Conexão</title>` |

### Configuração no Banco de Dados

O nome da aplicação é armazenado na tabela `system_config` e pode ser alterado pelo administrador:

```sql
-- Ver configuração atual
SELECT * FROM system_config WHERE key = 'app_name';

-- Atualizar nome
UPDATE system_config SET value = 'Novo Nome' WHERE key = 'app_name';
```

**Chave de configuração**: `system_config.app_name`

---

## 1.2. Logo

### Logo Dinâmico

O logo da aplicação é **carregado dinamicamente** a partir de uma URL configurada no banco de dados:

| Propriedade | Descrição |
|-------------|-----------|
| **Fonte** | `system_config.logo_url` |
| **Tipo** | URL para imagem (PNG, SVG, JPG) |
| **Fallback** | Ícone textual gerado automaticamente |

### Lógica de Fallback

Quando não há logo configurado (ou a URL está inválida), o sistema gera um **ícone textual** com as duas primeiras letras do nome:

```typescript
// Exemplo: "Hub Conexão" → "HU"
const firstTwoLetters = appName.substring(0, 2).toUpperCase();
```

### Estilo do Fallback

| Propriedade | Valor |
|-------------|-------|
| **Formato** | Quadrado com `border-radius: 1rem` (16px) |
| **Background** | Gradiente metálico dourado |
| **Cor do texto** | Branco (#ffffff) |
| **Peso da fonte** | Bold (700) |

**Gradiente do fallback:**
```css
background: linear-gradient(135deg, #c9a655 0%, #e8d48b 40%, #a8873a 70%, #c9a655 100%);
```

---

## 1.3. Efeito Hover do Logo

O logo possui uma animação especial quando o usuário passa o mouse sobre ele:

### Propriedades da Animação

| Propriedade | Valor | Descrição |
|-------------|-------|-----------|
| **Transformação** | `rotate(12deg) scale(1.10)` | Rotação de 12° + escala 110% |
| **Duração** | 700ms | Transição suave |
| **Timing** | `ease` | Curva de interpolação padrão |

### Código CSS

```css
.logo-fallback {
  transition: transform 700ms ease;
}

.logo-fallback:hover {
  transform: rotate(12deg) scale(1.10);
}
```

### Sombra do Logo

```css
.logo-shadow {
  box-shadow: 0 25px 50px -12px rgba(201, 166, 85, 0.4);
}
```

---

## 1.4. Configuração Dinâmica via Banco de Dados

A identidade visual completa pode ser configurada via `system_config`:

### Campos Relacionados

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `app_name` | string | Nome da aplicação exibido no header |
| `logo_url` | string | URL do logo personalizado |
| `theme_dark` | JSON | Objeto ColorScheme com todas as cores |
| `environment_themes` | JSON | Configurações visuais por ambiente |

### Exemplo de Estrutura JSON

```json
{
  "app_name": "Conexão Digital Implant",
  "logo_url": "https://exemplo.com/logo.png",
  "theme_dark": {
    "background": "#0f172a",
    "accent": "#c9a655"
  }
}
```

---

## 1.5. Injeção de Estilos no Frontend

### BrandContext

O componente `BrandContext` injeta as configurações do banco de dados como **CSS custom properties** no `:root` do documento:

```typescript
// Pseudocódigo do BrandContext
const buildCssVars = (colorScheme: ColorScheme): string => {
  return Object.entries(colorScheme)
    .map(([key, value]) => `--color-${key}: ${value};`)
    .join(' ');
};

// Aplicação no :root
document.documentElement.style.cssText = buildCssVars(themeConfig);
```

### Variáveis CSS Geradas

```css
:root {
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-accent: #c9a655;
  --color-text-main: #f8fafc;
  /* ... mais 38 tokens */
}
```

---

## 1.6. Tokens de Cores do Tema

O tema escuro é pré-definido com os seguintes valores padrão:

| Token | Valor Default | Descrição |
|-------|---------------|-----------|
| `--color-bg` | `#0f172a` | Fundo principal |
| `--color-surface` | `#1e293b` | Superfícies (cards, modais) |
| `--color-text-main` | `#f8fafc` | Texto principal |
| `--color-text-muted` | `#94a3b8` | Texto secundário |
| `--color-accent` | `#c9a655` | Cor de destaque (dourado) |
| `--color-success` | `#22c55e` | Sucesso |
| `--color-warning` | `#eab308` | Alerta |
| `--color-error` | `#ef4444` | Erro |

---

## 1.7. White-Labeling

A plataforma permite **white-labeling completo** através das configurações do banco de dados. Um administrador pode:

1. Alterar o nome da aplicação
2. Substituir o logo
3. Modificar todas as 42 cores do ColorScheme
4. Ajustar efeitos visuais por ambiente

> ⚠️ **Importante**: As alterações são aplicadas em tempo real sem necessidade de rebuild ou deploy.

---

## Checklist de Conclusão

- [ ] Nome oficial definido: "Conexão Digital Implant"
- [ ] Nome curto definido: "Hub Conexão"
- [ ] Logo dinâmico configurável via banco de dados
- [ ] Fallback textual implementado (duas primeiras letras)
- [ ] Gradiente metálico dourado no fallback
- [ ] Efeito hover de rotação e escala documentado
- [ ] Sombra do logo documentada
- [ ] Configuração via `system_config` mapeada
- [ ] BrandContext documentado
- [ ] Sistema de white-labeling explicado

---

## Próximo Passo

Avance para **[Capítulo 02: Sistema de Cores](./02-sistema-cores.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-BRANDING.md)*