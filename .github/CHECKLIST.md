# Checklist de Desenvolvimento (Genérico)

Este checklist serve para qualquer projeto. Ajuste os comandos conforme a tecnologia do seu projeto.

---

## Fase 1: Preparação

- [ ] **Solicitação recebida** - Descrição clara do que precisa ser feito
- [ ] **Entendimento validado** - Sem dúvidas sobre o que fazer
- [ ] **Branch criada** - Nome seguindo padrão (feat/fix/improvement/docs)
- [ ] **Branch atualizada** - Feito `git pull origin [branch-principal]` antes de começar

---

## Fase 2: Desenvolvimento

- [ ] **Alterações implementadas** - Código escrito segundo padrões do projeto
- [ ] **Commits pequenos** - Mensagens claras e descritivas
- [ ] **Documentação atualizada** - Se aplicável, docs/modificação

---

## Fase 3: Teste Local

Ajuste os comandos abaixo conforme seu projeto (npm, yarn, pnpm, etc):

- [ ] **Dependências instaladas** - `[gerenciador] install`
- [ ] **Build compilando** - `[gerenciador] run build` sem erros
- [ ] **Servidor iniciando** - `[gerenciador] run dev` funcionando
- [ ] **Funcionalidade testada** - Testei o que foi implementado
- [ ] **Funcionalidades existentes** - Verifiquei que não quebrei nada

---

## Fase 4: Pull Request

- [ ] **Branch enviada** - `git push origin nome-da-branch`
- [ ] **Pull Request criado** - Título e descrição claros
- [ ] **Revisão solicitada** - Outro membro para revisar

---

## Fase 5: Merge

- [ ] **Aprovação recebida** - Pull Request aprovado
- [ ] **Merge realizado** - Alterações integradas à branch principal
- [ ] **Branch limpa** - Branch deletada ou arquivada

---

## Atalhos Rápidos para IA

### Preparação
```
Crie uma nova branch chamada '[tipo]/[nome]' a partir da [branch-principal].
```

```
Execute 'git pull origin [branch-principal]' para atualizar.
```

### Desenvolvimento
```
Execute 'git add .' e 'git commit -m "[tipo]: [descrição]"'.
```

### Teste
```
Execute '[comando-de-build]' para verificar se compila.
```

### Pull Request
```
Crie um Pull Request da branch '[nome]' para '[branch-principal]' com título e descrição.
```

---

## Problemas Comuns e Soluções

### Problema: Branch desatualizada
**Solução:** `git pull origin [branch-principal]`

### Problema: Conflitos
**Solução:** Resolva manualmente, depois `git add .` e `git commit`

### Problema: Código não compila
**Solução:** Leia os erros, corrija, teste novamente

### Problema: Push rejeitado
**Solução:** `git pull --rebase origin [branch-principal]` depois `git push`

---

## Ajuste para Seu Projeto

Edite este arquivo conforme a tecnologia do seu projeto:

| Item | Ajuste |
|------|--------|
| Comandos de dependência | npm → yarn, pnpm, etc |
| Scripts de build | npm run build → gradle build, etc |
| Servidor dev | npm run dev → rails server, etc |
| Branch principal | main → master, develop |

---

**Documento vivo - Atualize conforme necessário**