# Preferências de Comunicação

## Idioma
- **Sempre responder em português brasileiro (pt-br)**

## Comportamento
- Pensar e raciocinar em pt-br
- Criar em pt-br
- Manter consistência linguística em todas as interações

## Memória de Sessão
- Lembrar contexto de conversas anteriores neste projeto
- Não pedir confirmações desnecessárias para tarefas já discutidas

---

# Fluxo de Desenvolvimento

## 1. Preparação

### Criar Branch
- Sempre criar a partir da **main** atualizada
- Atualizar main antes de criar branch: `git checkout main && git pull origin main`
- Nomenclatura segue padrão:

| Prefixo | Uso | Exemplo |
|---------|-----|---------|
| `feat/` | Nova funcionalidade | `feat/adicionar-chatbot` |
| `fix/` | Correção de bug | `fix/corrigir-erro-login` |
| `improvement/` | Melhoria | `improvement/refatorar-auth` |
| `docs/` | Documentação | `docs/atualizar-readme` |
| `refactor/` | Refatoração | `refactor/simplificar-codigo` |
| `test/` | Testes | `test/adicionar-testes-auth` |

## 2. Desenvolvimento

### Commits
- **Sempre fazer commit** das alterações quando solicitado pelo usuário
- Formato: `[tipo]: [descrição breve]`

```
feat: adicionar cards de login demo
fix: corrigir erro de validação de email
docs: atualizar manual de versionamento
refactor: simplificar lógica de autenticação
```

- Commits pequenos e frequentes
- Testar localmente após cada mudança significativa

### Testes Locais (antes de qualquer ação)
- Compilar projeto: `npm run build`
- Verificar que não quebrou funcionalidades existentes

## 3. Regras de Segurança

- **NÃO FAÇA PUSH ou MERGE sem autorização explícita do usuário!**
- Sempre pedir confirmação antes de modificar branches principais
- Pedir autorização antes de qualquer operação que modifique o repositório remoto
- Seguir o fluxo completo: Preparação → Desenvolvimento → Teste → PR → Merge

## 4. Pull Request

Quando solicitado:
- Título: `[tipo]: [nome da tarefa]`
- Descrição: Liste as alterações feitas e o que foi testado

## Gerenciamento de Contexto

- **Sempre que o context atingir 70% de utilização, executar `/compact`**
- Isso mantém a sessão organizada e evita perda de contexto

---

# Padrão de Excelência para Manuais

## Estrutura Obrigatória

Todo manual deve seguir esta estrutura:

```
# Título do Manual

**Data:** [DD de MMMM de YYYY]  
**Versão:** X.Y

---

## Objetivo
[Descrição clara do que a feature faz e para que serve]

### Exemplo de Uso
[Exemplo prático de utilização]

---

## Arquitetura do Sistema
[Diagrama ASCII do fluxo - se aplicável]

---

## Pré-requisitos
[Tabela com componentes e requisitos]

---

## 1. [Nome da Seção 1]
[Passo a passo numerado]

### 1.1 [Subseção]
[Detalhe técnico se necessário]

---

## 2. [Nome da Seção 2]
[Continua a estrutura...]

---

## 3. Testes
[Comandos para validar a implementação]

### 3.1 Teste de Conectividade
[Comando]

### 3.2 Teste E2E
[Passos visuais]

---

## 4. Resolução de Problemas
[Tabela: Problema | Solução]

---

## 5. Estrutura de Arquivos Criados
[Tree ou lista de arquivos]

---

## 6. Próximas Melhorias
[Lista de melhorias pendentes]

---

*Documento gerado automaticamente em YYYY-MM-DD*
```

## Elementos de Formatação

| Elemento | Como usar |
|----------|-----------|
| **Títulos** | `#` principal, `##` seção, `###` subseção |
| **Tabelas** | Pipe syntax com header |
| **Código** | Triple backticks com linguagem |
| **Alertas** | ℹ️ info, ⚠️ warning, 💡 tip, ✅ success |
| **Emojis** | Contextuais (🏆 gamificação, 🔗 links, 💾 salvar, etc) |
| **Diagramas** | ASCII art para arquiteturas |
| **Listas** |Bullet points para múltiplos itens |

## Linguagem e Estilo

- **Idioma:** PT-BR sempre
- **Verbos:** Imperativo (Configure, Execute, Crie)
- **Voz:** Ativa (Prefira "O sistema faz X" a "X é feito pelo sistema")
- **Tom:** Profissional mas acessível
- **Comprimento:** Seções concisas, detalhamento nos sub-itens

## Regras de Conteúdo

1. **Executável:** Todos os comandos devem ser copy-paste
2. **Testável:** Cada seção deve ter forma de validação
3. **Rastreável:** Incluir versão e data
4. **Manutenível:** Seções claramente separadas para atualização

---

# Atalhos Rápidos

```bash
# Atualizar main
git checkout main && git pull origin main

# Criar branch
git checkout -b feat/nome-da-tarefa

# Commit
git add . && git commit -m "feat: descrição"

# Push (apenas com autorização)
git push origin nome-da-branch
```

---

*Este arquivo segue as regras definidas em .github/CHECKLIST.md e .github/workflows/feature-automation.md*