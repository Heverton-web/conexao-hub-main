# Capítulo 07: Ícones

## Objetivo

Documentar a biblioteca de ícones utilizada na plataforma, incluindo lista completa de ícones, contextos de uso e tamanhos padronizados.

---

## 7.1. Biblioteca de Ícones

### Informações Técnicas

| Propriedade | Valor |
|-------------|-------|
| **Biblioteca** | Lucide React |
| **Versão** | 0.462.0 |
| **Estilo** | Outline (stroke) |
| **Coloração** | Monocromático (usa cor do contexto) |
| **Tamanho padrão** | 24px |
| **Pacote NPM** | `lucide-react` |

### Por Que Lucide?

| Benefício | Descrição |
|-----------|-----------|
| **Consistência visual** | Todos os ícones seguem o mesmo estilo stroke |
| **Tamanho reduzido** |Bundle pequeno (~200KB) |
| **Manutenção ativa** | Atualizações frequentes |
| **Acessibilidade** | Suporte a screen readers |
| **Tailwind integrado** | classes de tamanho intuitivas |

---

## 7.2. Ícones Utilizados na Plataforma

### Tabela Completa de Ícones

| Ícone | Import | Contexto de Uso |
|-------|--------|-----------------|
| **Sparkles** | `lucide-react` | Destaques premium, gamificação, badge "novo" |
| **LogOut** | `lucide-react` | Botão de logout no header |
| **Globe** | `lucide-react` | Seletor de idioma no header |
| **Star** | `lucide-react` | XP/nível do usuário, favorito |
| **UserPlus** | `lucide-react` | Cadastro por convite |
| **Eye** | `lucide-react` | Toggle visibilidade (mostrar senha) |
| **EyeOff** | `lucide-react` | Toggle visibilidade (ocultar senha) |
| **Shield** | `lucide-react` | Perfil pré-definido (convite seguro) |
| **Info** | `lucide-react` | Informações, dicas, tooltips |
| **Database** | `lucide-react` | Configuração de banco de dados |
| **AlertTriangle** | `lucide-react` | Alertas e erros |
| **ChevronRight** | `lucide-react` | Indicador de ação em botões |
| **ChevronDown** | `lucide-react` | Menu dropdown, acordeão |
| **ChevronLeft** | `lucide-react` | Navegação voltar |
| **Copy** | `lucide-react` | Copiar para clipboard |
| **Check** | `lucide-react` | Copiado com sucesso, item selecionado |
| **X** | `lucide-react` | Fechar modal, remover item |
| **ArrowLeft** | `lucide-react` | Navegação voltar |
| **ArrowRight** | `lucide-react` | Próximo passo |
| **Box** | `lucide-react` | Ícone genérico, material |
| **Briefcase** | `lucide-react` | Perfil profissional |
| **User** | `lucide-react` | Perfil de usuário |
| **Settings** | `lucide-react` | Configurações |
| **Home** | `lucide-react` | Página inicial |
| **BookOpen** | `lucide-react` | Materiais, cursos |
| **FileText** | `lucide-react` | Documentos, PDFs |
| **Image** | `lucide-react` | Imagens |
| **Video** | `lucide-react` | Vídeos |
| **Mail** | `lucide-react` | Email, mensagens |
| **Phone** | `lucide-react` | Telefone, WhatsApp |
| **Calendar** | `lucide-react` | Calendário, datas |
| **Clock** | `lucide-react` | Tempo, horário |
| **TrendingUp** | `lucide-react` | Estatísticas, crescimento |
| **BarChart** | `lucide-react` | Gráficos, relatórios |
| **PieChart** | `lucide-react` | Gráficos de pizza |
| **Users** | `lucide-react` | Gestão de usuários |
| **Plus** | `lucide-react` | Adicionar, criar |
| **Minus** | `lucide-react` | Remover, excluir |
| **Edit** | `lucide-react` | Editar, modificar |
| **Trash** | `lucide-react` | Excluir permanentemente |
| **Download** | `lucide-react` | Baixar arquivo |
| **Upload** | `lucide-react` | Enviar arquivo |
| **Search** | `lucide-react` | Busca, pesquisa |
| **Filter** | `lucide-react` | Filtros, ordenação |
| **SortAsc** | `lucide-react` | Ordenar crescente |
| **SortDesc** | `lucide-react` | Ordenar decrescente |
| **Menu** | `lucide-react` | Menu mobile |
| **MoreVertical** | `lucide-react` | Menu de contexto |
| **ExternalLink** | `lucide-react` | Abrir em nova aba |
| **Link** | `lucide-react` | Link, URL |
| **Lock** | `lucide-react` | Bloqueado, segurança |
| **Unlock** | `lucide-react` | Desbloqueado |

---

## 7.3. Tamanhos por Contexto

A plataforma usa **tamanhos específicos** de ícones dependendo do contexto:

| Contexto | Tamanho (px) | Exemplo |
|----------|-------------|---------|
| **Header (tema, logout)** | 18px | LogOut, Settings |
| **Header (idioma)** | 14px | Globe |
| **Nível do usuário (estrela)** | 8px | Star (XP) |
| **Formulários (eye toggle)** | 20px | Eye, EyeOff |
| **Alertas** | 16-18px | AlertTriangle, Info |
| **Botão CTA (seta)** | 18px | ChevronRight |
| **Modais (fechar)** | 24px | X |
| **Cards de conteúdo** | 20px | Icones genéricos |
| **Tabelas (ações)** | 16px | Edit, Trash |
| **Badges** | 12px | Check em badges |

### Tabela de Tamanhos

| Classe Tailwind | Tamanho (px) | Uso |
|-----------------|---------------|-----|
| `w-4 h-4` | 16px | Tabelas, ações |
| `w-4.5 h-4.5` | 18px | Header, botões |
| `w-5 h-5` | 20px | Formulários, eye |
| `w-6 h-6` | 24px | Modais, cards |
| `w-8 h-8` | 32px | Páginas grandes |
| `w-10 h-10` | 40px | Heróis, CTAs |

---

## 7.4. Cores dos Ícones

Os ícones são **monocromáticos** e adotam a cor do contexto onde são usados:

### Cores por Contexto

| Contexto | Cor | Variável |
|----------|-----|----------|
| **Default** | Dourado | `var(--color-accent)` |
| **Ativo/Selecionado** | Dourado | `var(--color-accent)` |
| **Desabilitado** | Cinza | `var(--color-text-muted)` |
| **Erro** | Vermelho | `var(--color-error)` |
| **Sucesso** | Verde | `var(--color-success)` |
| **Warning** | Amarelo | `var(--color-warning)` |
| **Header (logout)** | Vermelho | `#ef4444` |

### Exemplo de Uso

```tsx
// Ícone padrão (dourado)
<Star className="w-4 h-4" />;

// Ícone de erro
<AlertTriangle className="w-4 h-4 text-red-500" />;

// Ícone de sucesso (pode usar verde ou dourado)
<Check className="w-4 h-4 text-green-500" />;

// Ícone desabilitado (herda do texto)
<span className="text-slate-500">
  <Globe className="w-3.5 h-3.5" />
</span>
```

---

## 7.5. Icon Box com Ícones

Os ícones frequentemente aparecem dentro de **icon boxes**:

```tsx
// Icon box com ícone
<div className="icon-box">
  <Star className="w-5 h-5" />
</div>

// Icon box small com ícone
<div className="icon-box-sm">
  <Check className="w-4 h-4" />
</div>

// Icon box large com ícone
<div className="icon-box-lg">
  <Settings className="w-6 h-6" />
</div>
```

---

## 7.6. Animação de Ícones

### Rotação no Hover

```tsx
// Ícone com rotação no hover
<Box className="icon-box transition-transform hover:rotate-12" />
```

### Pulse (para indicadores)

```tsx
// Pulse animation (ex: carregando)
<Loader className="w-5 h-5 animate-spin" />
```

---

## 7.7. Acessibilidade

###aria-label

Para ícones sem texto visível, usar `aria-label`:

```tsx
// Botão de logout
<button aria-label="Sair da conta">
  <LogOut className="w-5 h-5" />
</button>

// Toggle senha
<button aria-label="Mostrar senha">
  {showPassword ? <EyeOff /> : <Eye />}
</button>
```

### Screens Readers

Os ícones de Lucide são SVGs com `aria-hidden="true"` por padrão, o que os torna invisíveis para screen readers. Sempre Pair com texto ou `aria-label`.

---

## 7.8. Extensões Futuras

### Adicionar Novos Ícones

Para adicionar novos ícones:

```bash
# Instalar nova versão (mantém consistência)
npm install lucide-react@latest
```

### Verificar Ícones Disponíveis

Acesse [lucide.dev/icons](https://lucide.dev/icons) para visualizar todos os ícones disponíveis.

---

## Checklist de Conclusão

- [ ] Biblioteca Lucide React documentada (v0.462.0)
- [ ] Razões para escolha da biblioteca explicadas
- [ ] Tabela completa de ícones utilizada (50+ ícones)
- [ ] Tamanhos por contexto especificados em tabela
- [ ] Cores dos ícones (monocromático) detalhadas
- [ ] Icon box com ícones demonstrado
- [ ] Animações (rotação, pulse) incluídas
- [ ] Acessibilidade (aria-label) documentada
- [ ] Como adicionar novos ícones explicado

---

## Próximo Passo

Avance para **[Capítulo 08: Gamificação](./08-gamificacao.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-BRANDING.md)*