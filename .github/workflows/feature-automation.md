# Automação de Fluxo de Desenvolvimento

## Fluxo Completo - Passo a Passo

Este arquivo documenta o fluxo completo de desenvolvimento para seguir em toda solicitação.

---

## Cenário: Nova Solicitação Recebida

### Passo 1: Entender a Solicitação
- [ ] Ler e entender o que precisa ser feito
- [ ] Se houver dúvidas, perguntar antes de começar
- [ ] Identificar o tipo: feature, bug, melhoria, docs, refactor

### Passo 2: Preparar o Ambiente
```bash
# Verificar status atual
git status

# Atualizar main
git checkout main
git pull origin main

# Criar nova branch
git checkout -b [tipo]/[nome-da-tarefa]
```
**Prompt para IA:**
```
Prepare o ambiente criando uma nova branch chamada '[tipo]/[nome]' a partir da main e faça o pull das últimas alterações.
```

### Passo 3: Desenvolver
- [ ] Implementar as alterações necessárias
- [ ] Testar localmente durante o desenvolvimento
- [ ] Fazer commits frequentes com mensagens claras

```bash
# Commits durante desenvolvimento
git add .
git commit -m "feat: descrição do que foi feito"
```

### Passo 4: Testar Localmente
```bash
# Instalar dependências
npm install

# Compilar projeto
npm run build

# Iniciar servidor (se aplicável)
npm run dev
```
**Prompts para IA:**
```
Execute 'npm run build' para verificar se o projeto compila.
```
```
Verifique se todas as funcionalidades existentes continuam funcionando.
```

### Passo 5: Preparar Pull Request
```bash
# Enviar branch para o servidor
git push origin [nome-da-branch]
```
**Prompt para IA:**
```
Crie um Pull Request com título '[tipo]: [nome]' e descrição explicando as alterações realizadas.
```

### Passo 6: Revisão
- [ ] Aguardar aprovação
- [ ] Se houver反馈s, implementar correções
- [ ] Se aprovada, fazer o merge

### Passo 7: Finalização
```bash
# Voltar para main
git checkout main

# Atualizar main local
git pull origin main
```

---

## Comandos por Fase

### Fase de Preparação

| Ação | Comando |
|------|---------|
| Verificar status | `git status` |
| Atualizar main | `git checkout main && git pull origin main` |
| Criar branch | `git checkout -b feat/nome` |
| Criar branch com prefixo automático | Verificar tipo e usar `feat/` ou `fix/` |

### Fase de Desenvolvimento

| Ação | Comando |
|------|---------|
| Verificar alterações | `git diff` |
| Adicionar arquivos | `git add .` |
| Fazer commit | `git commit -m "feat: descrição"` |
| Ver histórico | `git log --oneline -5` |

### Fase de Teste

| Ação | Comando |
|------|---------|
| Instalar dependências | `npm install` |
| Compilar projeto | `npm run build` |
| Iniciar desenvolvimento | `npm run dev` |
| Rodar testes | `npm test` |

### Fase de Envio

| Ação | Comando |
|------|---------|
| Enviar para servidor | `git push origin nome-da-branch` |
| Atualizar branch | `git pull origin main` |

---

## Prompts Completos para IA

### Prompt 1: Iniciar Nova Tarefa
```
Siga o fluxo de desenvolvimento:

1. Atualize a branch main: git checkout main && git pull origin main
2. Crie uma nova branch chamada 'feat/[nome-da-feature]' a partir da main
3. Faça checkout para essa nova branch

Informe quando estiver pronto para começar o desenvolvimento.
```

### Prompt 2: Durante Desenvolvimento
```
Durante o desenvolvimento, siga estas práticas:
- Faça commits pequenos e frequentes
- Teste localmente após cada mudança significativa
- Use npm run build para verificar erros

Ao fazer commit, use: git add . && git commit -m "feat: [descrição]"
```

### Prompt 3: Finalizar e Enviar
```
Quando o desenvolvimento estiver pronto:

1. Execute 'npm run build' para verificar que compila
2. Execute 'git push origin [nome-da-branch]' para enviar
3. Crie um Pull Request para a main com:
   - Título: '[tipo]: [nome da tarefa]'
   - Descrição: Liste as alterações feitas e o que foi testado
```

### Prompt 4: Resolver Problemas
```
Se houver conflitos ou problemas:
- Para conflitos: Edite os arquivos marcados como conflict, remova os marcadores <<< === >>>, e faça git add . && git commit
- Para branch desatualizada: git pull origin main
- Para erros de compilação: Leia as mensagens de erro e corrija

Informe qualquer problema encontrado.
```

---

## Padrão de Nomenclatura

### Tipos de Branch

| Prefixo | Uso | Exemplo |
|---------|-----|---------|
| `feat/` | Nova funcionalidade | `feat/adicionar-login-demo` |
| `fix/` | Correção de bug | `fix/corrigir-erro-login` |
| `improvement/` | Melhoria | `improvement/refatorar-auth` |
| `docs/` | Documentação | `docs/atualizar-readme` |
| `refactor/` | Refatoração | `refactor/simplificar-codigo` |
| `test/` | Testes | `test/adicionar-testes-auth` |

### Mensagens de Commit

```
[tipo]: [descrição breve]

Exemplos:
feat: adicionar cards de login demo
fix: corrigir erro de validação de email
docs: atualizar manual de versionamento
refactor: simplificar lógica de autenticação
```

---

## Checklist Final

- [ ] Branch criada corretamente
- [ ] Alterações desenvolvidas e testadas
- [ ] Build compilando sem erros
- [ ] Pull Request criado
- [ ] Aprovação recebida
- [ ] Merge realizado
- [ ] Main atualizada localmente

---

**Este documento deve ser seguido em toda solicitação de desenvolvimento.**