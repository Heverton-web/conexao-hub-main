# GitHub Development Kit

Este kit contém ferramentas para padronizar o fluxo de desenvolvimento em qualquer projeto.

---

## Arquivos Inclusos

| Arquivo | Descrição |
|---------|-----------|
| `ISSUE_TEMPLATE.md` | Template para solicitações de desenvolvimento |
| `CHECKLIST.md` | Checklist de verificação durante o desenvolvimento |
| `workflows/feature-automation.md` | Guia de automação com prompts para IA |

---

## Como Usar em Novo Projeto

### Passo 1: Copiar a Pasta
```bash
# Clone o repositório com o kit
git clone https://github.com/usuario/gitHub-development-kit.git

# Copie a pasta .github para seu projeto
cp -r .github/ /caminho/do/seu-projeto/

# Ou manualmente: duplicate a pasta pelo sistema de arquivos
```

### Passo 2: Adaptar (Se Necessário)

#### Para ISSUE_TEMPLATE.md:
- Edite os tipos de solicitação conforme seu projeto
- Ajuste os critérios de aceitação
- Modifique as referências de comandos se necessário

#### Para CHECKLIST.md:
- Adapte os comandos de build/test (npm, yarn, etc.)
- Ajuste os caminhos de arquivos se diferente

#### Para workflows/feature-automation.md:
- Renomeie de `.md` para `.yml` se quiser usar como GitHub Action
- Adapte os comandos específicos do projeto

---

## Fluxo de Uso

```
1. Nova solicitação → Usar ISSUE_TEMPLATE
2. Desenvolvimento → Seguir CHECKLIST
3. Dúvidas de comandos → Consultar workflows/feature-automation
```

---

## Comandos Rápidos (Prompt para IA)

Copie e cole estes prompts em qualquer IA:

### Criar nova branch
```
Crie uma nova branch chamada 'feat/[nome]' a partir da main.
```

### Fazer commit
```
Execute 'git add .' e 'git commit -m "feat: [descrição]"'.
```

### Testar
```
Execute 'npm run build' para verificar se compila.
```

### Criar Pull Request
```
Crie um Pull Request da branch '[nome]' para 'main'.
```

---

## Personalização

Para personalizar para seu projeto específico:

1. Edite `ISSUE_TEMPLATE.md` - ajuste tipos de solicitação
2. Edite `CHECKLIST.md` - atualize comandos de build/test
3. Edite `workflows/feature-automation.md` - adapte fluxos

---

## Exemplos de Uso

### Exemplo 1: Nova Feature
```
1. Preencher ISSUE_TEMPLATE.md com "Nova Feature"
2. Criar branch feat/nome-da-feature
3. Desenvolver usando CHECKLIST
4. Criar Pull Request
5. Fazer Merge
```

### Exemplo 2: Correção de Bug
```
1. Preencher ISSUE_TEMPLATE.md com "Correção de Bug"
2. Criar branch fix/nome-do-bug
3. Desenvolver e testar
4. Criar Pull Request
5. Fazer Merge
```

---

## Suporte

Em caso de dúvidas, consulte:
- `CHECKLIST.md` - para verificação durante desenvolvimento
- `workflows/feature-automation.md` - para automação
- Documentação do GitHub: https://docs.github.com

---

**Este kit é genérico e pode ser usado em qualquer projeto.**