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