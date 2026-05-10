# Manual de Versionamento e Branching

## Introdução

### O que é Versionamento?

Versionamento é como um "controle de versões" ou "histórico de alterações" do seu projeto. Pense nele como o recurso "Rastrear alterações" do Google Docs ou o histórico de versões do Excel, mas muito mais poderoso.

**Por que é importante?**
- Permite voltar no tempo para qualquer versão anterior
- Facilita o trabalho em equipe sem sobrescrever o trabalho dos outros
- Permite testar ideias novas sem风险 (risco) de quebrar o que já funciona
- Mantém um registro claro de quem fez o quê e quando

### O que é Git?

Git é o sistema de controle de versão que usamos. É como um programa que monitorsa todas as mudanças nos arquivos do seu projeto.

** Analogia simples:**
- Git = O sistema de vigilância que monitorsa tudo
- Repositório = O álbum onde todas as fotos (versões) são guardadas
- Commit = Uma foto do projeto neste momento

### O que é GitHub?

GitHub é uma plataforma online onde você armazena seu código versionado pelo Git. É como uma rede social para código, onde você pode compartilhar, colaborar e controlar versões.

**Relação:**
- Git = O instrumento (como uma câmera)
- GitHub = O álbum online (como o Google Photos)

### Por que usar Branches (Ramificações)?

Branch é como criar uma "cópia paralela" do projeto para trabalhar sem afetar a versão principal (main).

**Analogia:**
Imagine que você tem um documento importantes como "Manual da Empresa.docx" e precisa fazer várias alterações. Você não quer alterar o arquivo original diretamente porque pode cometer erros. Então você:
1. Cria uma cópia chamada "Manual_v2_várias_alteracoes"
2. Trabalha na cópia
3. Só depois de tudo testado e aprovado, atualiza o original

Branches funcionam exatamente assim, mas de forma automática e muito mais eficiente.

---

## Conceitos Básicos

### Branch (Ramificação)

Uma branch é uma linha paralela de desenvolvimento. Você cria uma branch quando quer:
- Adicionar uma nova funcionalidade
- Corrigir um bug
- Experimentar algo novo

**A branch principal se chama "main"** (ou "master" em alguns projetos). Esta é a versão "oficial" do projeto.

### Commit

Um commit é como salvar uma versão do projeto. Cada commit tem:
- Uma mensagem explaining o que foi feito
- Um registro de quais arquivos foram alterados
- Um identificador único (como um RG do commit)

**Regra de ouro:** Faça commits pequenos e frequentes com mensagens claras.

### Merge

Merge (mesclar) é o processo de unir uma branch de volta à main. É como pegar todas as alterações de uma cópia e aplicar no documento original.

### Pull Request (PR)

Pull Request é uma solicitação para que suas alterações sejam revisadas e incorporadas à branch principal. É como dizer: "Eu terminei minhas alterações, por favor revise e aprove para incluir no projeto."

### Fork

Fork é criar uma cópia completa do projeto para trabalhar de forma independente. É útil quando você quer contribuir para um projeto que não é seu.

---

## Fluxo de Trabalho

### Quando Criar uma Nova Branch

**SEMPRE** que você for:
- Adicionar uma nova funcionalidade (feature)
- Corrigir um bug
- Fazer alterações significativas no código
- Experimentar algo que pode dar errado
- Modificar qualquer arquivo do projeto

**NUNCA** modifique a main diretamente!

### Ciclo de Vida de uma Feature

```
1. MAIN ─────────────────────────────────────────────►
          │
          ▼ (criar branch)
2. feat/nome-da-feature (trabalhar aqui)
          │
          ▼ (fazer commits enquanto trabalha)
3. ──────► (testar localmente)
          │
          ▼ (quando pronto, criar Pull Request)
4. Pull Request (revisão)
          │
          ▼ (aprovado)
5. MERGE ───────────────────────────────────────────► MAIN
```

### Quando Fazer Commit

- Após completar uma parte lógica do trabalho
- Antes de testar algo
- Ao final do dia de trabalho
- Quando você precisa mudar de tarefa

### Quando Criar Pull Request

- Quando a feature estiver completa
- Quando você quer que alguém revise seu código
- Antes de fazer merge na main

### Quando Fazer Merge

- Apenas após teste e validação local
- Após aprovação no Pull Request
- Após revisão de código

---

## Passo a Passo

### Opção 1: Via GitHub Desktop (Recomendado para Iniciantes)

#### Criar Nova Branch

1. Abra o GitHub Desktop
2. Clique em "Current Branch" (Branch Atual)
3. Clique em "New Branch"
4. Dê um nome significativo:
   - Para features: `feat/nome-da-feature`
   - Para correções: `fix/nome-do-bug`
   - Para melhorias: `improvement/nome-da-melhoria`
5. Clique em "Create Branch"

**Exemplo de nome:**
- `feat/adicionar-login-social`
- `fix/corrigir-erro-tela-login`
- `improvement/atualizar-documentacao`

#### Fazer Commit

1. No GitHub Desktop, você verá os arquivos alterados na aba "Changes"
2. Selecione os arquivos que deseja incluir no commit
3. No campo abaixo, escreva uma mensagem clara
4. Clique em "Commit to [nome-da-branch]"

**Exemplo de mensagem de commit:**
- "feat: adicionar botão de login demo"
- "fix: corrigir erro de validação de email"
- "docs: atualizar manual de versionamento"

#### Enviar para o Servidor (Push)

1. Clique em "Push origin" no menu superior
2. Suas alterações serão enviadas para o GitHub

#### Criar Pull Request

1. Após o push, clique em "Create Pull Request"
2. Preencha o título (já terá o nome da branch)
3. Adicione uma descrição explicando o que foi feito
4. Clique em "Create Pull Request"

#### Fazer Merge

1. No site do GitHub, vá até o Pull Request
2. Clique em "Merge Pull Request"
3. Confirme o merge
4. Delete a branch (opcional, mas recomendado para manter organização)

---

### Opção 2: Via Terminal

#### Verificar Status Atual

```bash
git status
```

Este comando mostra quais arquivos foram modificados.

#### Criar Nova Branch

```bash
git checkout -b feat/nome-da-feature
```

Este comando cria uma nova branch e muda para ela automaticamente.

#### Verificar Branch Atual

```bash
git branch
```

Este comando lista todas as branches e mostra qual você está no momento (com um asterisco).

#### Adicionar Alterações

```bash
git add .
```

Este comando adiciona todas as alterações para o próximo commit. Para adicionar arquivos específicos, use:
```bash
git add nome-do-arquivo
```

#### Fazer Commit

```bash
git commit -m "feat: descrição do que foi feito"
```

#### Enviar para o Servidor

```bash
git push origin feat/nome-da-feature
```

#### Atualizar Branch Local

```bash
git pull origin main
```

Baixa as últimas alterações da main para sua branch.

#### Criar Pull Request via Terminal

```bash
gh pr create --title "feat: nome da feature" --body "Descrição do que foi feito"
```

(O comando `gh` requer instalação do GitHub CLI)

---

### Opção 3: Prompts Prontos para IA

Você pode usar qualquer IA (OpenCode, Claude, Gemini, ChatGPT) para executar as tarefas. Basta copiar e colar o prompt adequado.

#### Criar Nova Branch

**Prompt:**
```
Crie uma nova branch chamada 'feat/[nome-da-feature]' a partir da branch 'main' e faça checkout para ela. Use o padrão de nomenclatura: feat/ para features, fix/ para correções, improvement/ para melhorias.
```

#### Verificar Status do Repositório

**Prompt:**
```
Execute 'git status' para verificar o estado atual do repositório e me mostre quais arquivos foram modificados.
```

#### Adicionar e Commitar Alterações

**Prompt:**
```
Adicione todas as alterações com 'git add .' e faça um commit com a mensagem "[tipo]: [descrição]", onde tipo pode ser feat (nova funcionalidade), fix (correção), docs (documentação), refactor (refatoração), ou test (testes). Use uma mensagem clara e descritiva.
```

#### Verificar Diferenças (Diff)

**Prompt:**
```
Execute 'git diff' para mostrar as diferenças entre os arquivos modificados e a última versão commitada. Me mostre o que foi alterado, adicionado ou removido.
```

#### Enviar Alterações (Push)

**Prompt:**
```
Execute 'git push origin [nome-da-branch]' para enviar suas alterações para o repositório remoto.
```

#### Atualizar com a Main

**Prompt:**
```
Atualize sua branch local com a última versão da main usando 'git pull origin main'. Mostre se houve conflitos.
```

#### Criar Pull Request

**Prompt:**
```
Crie um Pull Request no GitHub com título "[tipo]: [descrição]" e corpo explicando as alterações realizadas, os testes feitos e por que esta mudança é necessária.
```

#### Listar Branches Existentes

**Prompt:**
```
Liste todas as branches do repositório com 'git branch -a' e me mostre quais estão no repositório local e quais estão no remoto.
```

#### Voltar para a Main

**Prompt:**
```
Execute 'git checkout main' para voltar para a branch principal.
```

#### Verificar Histórico de Commits

**Prompt:**
```
Execute 'git log --oneline -10' para mostrar os últimos 10 commits e me explique o histórico recente do projeto.
```

#### Reverter Último Commit (Sem Apagar do Histórico)

**Prompt:**
```
Execute 'git revert HEAD' para criar um novo commit que desfaz as alterações do último commit. Explique o que isso faz.
```

#### Resetar para Estado Antes das Alterações

**Prompt:**
```
Execute 'git checkout -- .' para descartar todas as alterações não commitadas. Atenção: isso não pode ser desfeito!
```

#### Excluir Branch Local

**Prompt:**
```
Execute 'git branch -d [nome-da-branch]' para excluir uma branch local que já foi mesclada.
```

#### Excluir Branch Remota

**Prompt:**
```
Execute 'git push origin --delete [nome-da-branch]' para excluir uma branch do repositório remoto.
```

---

## Teste e Validação

### Checklist Antes de Criar Pull Request

Antes de solicitar que suas alterações sejam mescladas, verifique:

- [ ] O código compila sem erros (`npm run build` ou equivalente)
- [ ] A aplicação inicia sem erros
- [ ] A funcionalidade implementada está funcionando
- [ ] Você não quebrou nenhuma funcionalidade existente
- [ ] Os testes existentes ainda passam (se houver)
- [ ] Você testou em diferentes cenários (sucesso e erro)
- [ ] As mensagens de commit estão claras e descritivas

### Como Testar Localmente

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Abra o navegador** e teste a funcionalidade

4. **Execute a build** para verificar erros:
   ```bash
   npm run build
   ```

5. **Execute os testes** (se houver):
   ```bash
   npm test
   ```

### O que Fazer se Algo Não Funcionar

1. **Erro de compilação:**
   - Leia a mensagem de erro com atenção
   - Procure a linha indicada no erro
   - Verifique se você seguiu o padrão do projeto

2. **Erro de functionality:**
   - Use o console do navegador (F12) para ver erros
   - Verifique se a API/backend está funcionando
   - Revise as alterações que você fez

3. **Conflitos de merge:**
   - Entre em contato com quem fez as alterações conflitantes
   - Discuta a melhor forma de resolver
   - Faça o merge da main na sua branch e resolva manualmente

---

## Rollback (Como Voltar Atrás)

### Reverter Último Commit (Mantém no Histórico)

```bash
git revert HEAD
```

Este comando cria um novo commit que desfaz as alterações anteriores. É seguro porque mantém o histórico.

### Descartar Alterações Não Commitadas

```bash
git checkout -- .
```

**ATENÇÃO:** Este comando não pode ser desfeito! Use apenas se tiver certeza.

### Voltar para um Commit Específico

```bash
git reset --hard [hash-do-commit]
```

**ATENÇÃO:** Isso apaga todos os commits depois do especificado. Use com cautela!

### Encontrar o Hash do Commit

```bash
git log --oneline
```

Mostra a lista de commits com seus hashes (código curto como `195cc4b`).

### Criar Branch de Emergência

Se você fez alterações na main e quer salvá-las:

```bash
git stash
git checkout -b emergencia/backup-rapido
git stash pop
```

---

## FAQ - Perguntas Frequentes

### O que fazer quando a branch está desatualizada?

**Problema:** Outras pessoas fizeram alterações na main e sua branch está velha.

**Solução:**
```bash
git pull origin main
```
Isso baixa as últimas alterações da main para sua branch.

---

### Como resolver conflitos?

**Problema:** O mesmo arquivo foi modificado em dois lugares diferentes.

**Solução:**
1. Abra o arquivo com conflito (marcado como `<<<<<<<`)
2. Escolha qual versão manter (sua, a outra, ou mesclar manualmente)
3. Remova os marcadores de conflito (`<<<<<<<`, `=======`, `>>>>>>>`)
4. Faça commit das alterações resolvidas

---

### Posso criar branch a partir de outra branch que não seja a main?

**Resposta:** Sim! Você pode criar branch a partir de qualquer branch existente:

```bash
git checkout -b feat/nova-feature origin/outra-branch
```

---

### Como renomear uma branch?

**Branch local:**
```bash
git branch -m nome-antigo nome-novo
```

**Branch remota (excluir a antiga e criar nova):**
```bash
git push origin --delete nome-antigo
git push -u origin nome-novo
```

---

### O que é "origin"?

**Resposta:** "origin" é o nome padrão que o Git dá ao repositório remoto. É como um atalho para a URL do repositório.

---

### O que fazer quando o push é rejeitado?

**Problema:** O repositório remoto tem alterações que você não tem.

**Solução:**
```bash
git pull --rebase origin main
```
ou
```bash
git pull origin main
```

Depois tente fazer push novamente.

---

### Como abandonar uma branch sem salvar?

```bash
git checkout main
git branch -D nome-da-branch
```

Isso exclui a branch sem salvar. Use apenas se você realmente não precisa das alterações!

---

### Posso trabalhar em mais de uma branch ao mesmo tempo?

**Resposta:** Sim, mas você precisa fazer checkout para mudar entre elas:
```bash
git checkout branch-1
# trabalha...
git checkout branch-2
# trabalha...
git checkout branch-1
```

---

### O que é "origin/main"?

**Resposta:** É a branch "main" do repositório remoto "origin". É a versão oficial do projeto no servidor.

---

## Glossário de Termos

| Termo | Significado |
|-------|-------------|
| **Branch** | Uma linha de desenvolvimento paralela |
| **Checkout** | Mover-se entre branches |
| **Clone** | Baixar o repositório para seu computador |
| **Commit** | Salvar uma versão das alterações |
| **Fork** | Criar uma cópia do projeto |
| **HEAD** | O commit ou branch atual |
| **Merge** | Unir branches |
| **Origin** | Nome padrão do repositório remoto |
| **Pull** | Baixar alterações do servidor |
| **Push** | Enviar alterações para o servidor |
| **Rebase** | Reescrever o histórico de commits |
| **Stash** | Salvar alterações temporariamente |
| **Upstream** | Repositório original (em projetos forks) |

---

## Atalhos e Dicas

### Comandos Mais Usados

| Comando | Função |
|---------|--------|
| `git status` | Ver estado atual |
| `git add .` | Adicionar tudo |
| `git commit -m "msg"` | Salvar versão |
| `git push` | Enviar para servidor |
| `git pull` | Baixar alterações |
| `git branch` | Listar branches |
| `git checkout -b` | Criar e mudar |
| `git log` | Ver histórico |

### Boas Práticas

1. **Sempre** crie uma nova branch para cada feature ou correção
2. **Sempre** faça testes locais antes de criar Pull Request
3. **Sempre** escreva mensagens de commit claras e descritivas
4. **Sempre** atualize sua branch com a main antes de fazer merge
5. **Nunca** faça push direto para a main (use Pull Request)
6. **Mantenha** as branches pequenas e focadas em uma única coisa
7. **Comunique** com a equipe quando criar ou mesclar branches

### Padrão de Nomenclatura

Use prefixos para identificar o tipo de alteração:

- `feat/` - Nova funcionalidade (feature)
- `fix/` - Correção de bug
- `docs/` - Documentação
- `refactor/` - Refatoração de código
- `test/` - Adicionar ou corrigir testes
- `chore/` - Tarefas de manutenção
- `improvement/` - Melhoria de funcionalidade existente

**Exemplos:**
- `feat/adicionar-login-social`
- `fix/corrigir-erro-validacao`
- `docs/atualizar-readme`
- `refactor/simplificar-logica`
- `improvement/melhorar-performance`

---

## Conclusão

Este manual cobre o fluxo básico de versionamento. Com o tempo, você自然会 (naturalmente) desenvolveu suas próprias práticas e descobrirá o que funciona melhor para você e sua equipe.

Lembre-se: o objetivo do versionamento é facilitar o trabalho, não complicar. Se algo parecer muito complexo, simplificatione ou peça ajuda.

**Em caso de dúvida, pergunte!**