# Capítulo 09: Internacionalização

## Objetivo

Documentar o sistema de internacionalização (i18n) da plataforma, incluindo idiomas suportados, seletor de idioma e estrutura de traduções.

---

## 9.1. Idiomas Suportados

A plataforma suporta **3 idiomas** com localização completa:

| Código | Idioma | Flag | Região |
|--------|--------|------|--------|
| `pt-br` | Português (Brasil) | 🇧🇷 | Brasil |
| `en-us` | English (US) | 🇺🇸 | Estados Unidos |
| `es-es` | Español | 🇪🇸 | Espanha |

### Definição de Tipo

```typescript
// Definido em src/types.ts
export type Language = 'pt-br' | 'en-us' | 'es-es';
```

---

## 9.2. Seletor de Idioma

### Localização no Header

O seletor de idioma está posicionado no **header**, à esquerda do toggle de tema:

```
[Globe] [PT] -------- [Theme Toggle] -------- [User Avatar] [Logout]
```

### Estilo Visual

| Propriedade | Valor |
|-------------|-------|
| **Formato** | Pill compacto |
| **Ícone** | Globo (Globe) |
| **Texto** | Sigla do idioma em maiúsculas (PT, EN, ES) |
| **Tamanho** | `text-xs font-bold uppercase` |
| **Visibilidade** | Oculto em mobile (`hidden md:flex`) |

### Implementação

```tsx
// Seletor de idioma no header
<button className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400 hover:text-white transition-colors">
  <Globe size={14} />
  <span>PT</span>
  <ChevronDown size={12} />
</button>
```

---

## 9.3. Estrutura de Traduções

### Keys de Idioma

```typescript
// Exemplo de estrutura de traduçõe
const translations = {
  'pt-br': {
    common: {
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
    },
    auth: {
      login: 'Entrar',
      logout: 'Sair',
      email: 'Email',
      password: 'Senha',
    },
  },
  'en-us': {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
    },
    auth: {
      login: 'Login',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
    },
  },
  'es-es': {
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
    },
    auth: {
      login: 'Iniciar sesión',
      logout: 'Cerrar sesión',
      email: 'Correo electrónico',
      password: 'Contraseña',
    },
  },
};
```

---

## 9.4. Armazenamento de Preferência

### no Perfil do Usuário

A preferência de idioma é armazenada no perfil do usuário:

```typescript
// Definido em UserProfile (src/types.ts)
interface UserProfile {
  // ...
  preferences: {
    theme: 'dark';
    language: Language;
  };
  // ...
}
```

###默认值

Se o usuário não tiver preferência definida:
1. Detectar idioma do navegador
2. Usar `pt-br` como fallback padrão

---

## 9.5. Context de Idioma

### Implementação

```tsx
// Pseudocódigo do LanguageContext
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}>(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt-br');

  const t = (key: string): string => {
    // Buscar tradução baseada na key
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
```

---

## 9.6. Uso em Componentes

### Exemplo de Uso

```tsx
// Usando o hook de tradução
const { language, setLanguage, t } = useLanguage();

// Renderizar
<button onClick={() => setLanguage('en-us')}>
  {t('common.changeLanguage')}
</button>

// No botão
<button>
  {language === 'pt-br' ? 'Mudar para Inglês' : 'Switch to Portuguese'}
</button>
```

---

## 9.7. Tradução de Conteúdo (Materiais)

### Estrutura Multi-Idioma

Materiais e coleções podem ter títulos e descrições em múltiplos idiomas:

```typescript
// Material com múltiplos idiomas
interface Material {
  id: string;
  title: {
    'pt-br': string;
    'en-us': string;
    'es-es': string;
  };
  // ...
}

// Uso
const title = material.title[user.language] || material.title['pt-br'];
```

---

## 9.8. Boas Práticas

### Keys de Tradução

| Padrão | Exemplo | Descrição |
|--------|---------|-----------|
| `section.subsection.key` | `auth.login.button` | Hierarquia clara |
| `all_lowercase` | `common.save` | Minúsculas |
| `snake_case` | `error_network` | Underscores |

### Fallbacks

```typescript
// Sempre ter fallback para pt-br
const title = material.title[language] || material.title['pt-br'];
```

---

## Checklist de Conclusão

- [ ] 3 idiomas documentados (pt-br, en-us, es-es)
- [ ] Flags e códigos definidos
- [ ] Seletor de idioma no header especificado
- [ ] Estilo visual do seletor documentado
- [ ] Estrutura de traduções demonstrada
- [ ] Armazenamento no perfil do usuário explicado
- [ ] LanguageContext documentado
- [ ] Uso em componentes demostrado
- [ ] Tradução de materiais multi-idioma incluída

---

## Próximo Passo

Avance para **[Capítulo 10: Layout e Espaçamento](./10-layout-espacamento.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-BRANDING.md)*