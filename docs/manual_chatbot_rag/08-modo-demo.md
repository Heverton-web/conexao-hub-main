# Capítulo 08 - Modo Demo

## O que é o Modo Demo?

O modo demo é uma versão de desenvolvimento do chatbot que usa dados locais (mockDb) em vez de chamar o n8n. Isso permite testar toda a interface e fluxo sem precisar configurar a infraestrutura completa.

**Localização da configuração:** `src/lib/chatService.ts`, linha 26

---

## Configuração Atual

```typescript
const DEMO_MODE = true;  // ← Ativado por padrão
```

---

## Como Funciona

```
Usuário → ChatWidget → useChat → chatService.ts (DEMO_MODE=true)
                                               │
                                               ▼
                                         mockDb.ts
                                         (dados locais)
                                               │
                                               ▼
                                    Resposta com materiais
                                    (sem n8n)
```

---

## Palavras-chave Suportadas

O modo demo responde às seguintes palavras-chave:

| Palavra-chave | Resposta |
|---------------|----------|
| `kit` | "Encontrei materiais sobre kits!" |
| `expert` | "Aqui está o que tenho sobre o tema:" |
| `marketing` | "Temos ótimos materiais de marketing!" |
| `venda` / `vender` | "Aqui estão os materiais sobre vendas:" |
| `produto` | "Encontrei materiais sobre produtos!" |
| `vídeo` / `video` | "Aqui estão os materiais em vídeo:" |
| `pdf` | "Encontrei materiais em PDF!" |
| `imagem` | "Encontrei materiais com imagens!" |
| `implante` | "Sobre implantes dentários, encontrei:" |
| `dentista` | "Materiais para dentistas:" |
| `odontologia` | "Materiais de odontologia:" |
| `curso` | "Aqui estão os cursos disponíveis:" |
| `trilha` / `coleção` / `collection` | "Aqui estão as trilhas disponíveis:" |

### Saudações

Se o usuário digitar apenas saudações:

| Entrada | Resposta (aleatória) |
|---------|---------------------|
| `oi`, `olá`, `hello`, `hi` | "Olá! Sou o assistente da plataforma..." |
| `bom dia`, `boa tarde`, `boa noite` | "Bem-vindo ao assistente IA!" |
| `help`, `ajuda` | "Olá! Estou aqui para ajudar..." |

---

## Como Testar

### Passo 1: Iniciar o projeto

```bash
npm run dev
```

### Passo 2: Acessar a plataforma

1. Abra o navegador em `http://localhost:5173`
2. Faça login (use credenciais demo ou crie uma conta)

### Passo 3: Abrir o Chatbot

1. No Dashboard, procure o botão **"Assistente"** no canto inferior direito
2. Clique para abrir o chat

### Passo 4: Testar perguntas

| Digite isso | Experimente isso também |
|-------------|------------------------|
| `oi` | `olá` |
| `marketing` | `vendas` |
| `vídeo` | `pdf` |
| `kit` | `trilha` |

### Passo 5: Verificar resultados

- ✅ Mensagem de resposta aparece
- ✅ Lista de materiais (se encontrado)
- ✅ Lista de trilhas/coleções (se encontrado)
- ✅ Links clicáveis

---

## Sem Resultados

Se a pergunta não corresponder a nenhuma palavra-chave e não encontrar materiais no mockDb:

> "Não encontrei materiais específicos sobre isso no momento. Que tal tentar outro termo? Posso ajudar com temas como marketing, vendas, produtos, ou perguntar sobre algo específico."

---

## Verificar Dados do mockDb

Para saber quais materiais estão disponíveis no mockDb:

1. Abra o arquivo `src/lib/mockDb.ts`
2. Procure a função `getMaterials` ou `getCollections`
3. Verifique os dados de exemplo (seed)

---

## Limitações do Modo Demo

| Limitação | Descrição |
|-----------|-----------|
| **Dados fixos** | Usa apenas os dados do mockDb |
| **Sem busca semântica** | Não usa embeddings reais |
| **Palavras-chave** | Funciona apenas com palavras pré-definidas |
| **Sem IA** | Não usa Gemini para gerar respostas |
| **Sem aprendizado** | Não evolui com uso |

---

## Quando Usar o Modo Demo

- ✅ Durante desenvolvimento
- ✅ Testes de interface
- ✅ Demonstração para clientes
- ✅ Quando n8n não está disponível
- ✅ Debugging de problemas

---

## Próximos Passos

- [Capítulo 11 - Testes](./11-testes.md) → Verificar funcionamento completo
- [Capítulo 09 - Modo Produção](./09-modo-producao.md) → Mudar para n8n real

---

*Manual do Chatbot RAG - Conexão Hub*