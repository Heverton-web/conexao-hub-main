# Capítulo 11 - Testes

## Visão Geral

Este capítulo descreve como testar cada componente do Chatbot RAG para garantir que tudo está funcionando corretamente.

---

## Checklist de Testes

### ✅ Teste 1: Build do Projeto

```bash
npm run build
```

**Esperado:** Build passa sem erros

---

### ✅ Teste 2: Interface do ChatWidget

1. Execute `npm run dev`
2. Faça login na plataforma
3. Vá para o Dashboard
4. Verifique se o botão **"Assistente"** aparece no canto inferior direito
5. Clique no botão para abrir o chat
6. Verifique se:
   - Header mostra "Assistente IA"
   - Campo de input está presente
   - Botão de enviar está visível

---

### ✅ Teste 3: Enviar Mensagem (Modo Demo)

1. No chat aberto, digite: `oi`
2. Pressione Enter ou clique em Enviar
3. Verifique se:
   - Mensagem do usuário aparece
   - Loading indicator aparece
   - Resposta do assistente aparece

---

### ✅ Teste 4: Busca por Palavras-chave

| Digite | Verifique |
|--------|-----------|
| `marketing` | Retorna materiais com "marketing" |
| `vendas` | Retorna materiais com "vendas" |
| `vídeo` | Retorna materiais em vídeo |
| `kit` | Retorna materiais com "kit" |

---

### ✅ Teste 5: Links Clícáveis

1. Após receber resposta com materiais
2. Verifique se os itens têm link
3. Clique em um dos links
4. Confirme que redireciona corretamente

---

### ✅ Teste 6: Histórico de Chat

1. Envie uma mensagem
2. Atualize a página (F5)
3. Verifique se as mensagens anteriores aparecem
4. Clique no botão limpar (lixeira)
5. Confirme que o histórico é removido

---

### ✅ Teste 7: Tratamento de Erros

1. Desconecte o servidor de desenvolvimento
2. Tente enviar uma mensagem (se em modo produção)
3. Verifique se mensagem de erro amigável aparece

---

## Testes por Componente

### chatService.ts

```typescript
// Teste unitário manual
import { sendChatMessage, createUserMessage, createAssistantMessage } from './chatService';

// Testar criação de mensagens
const userMsg = createUserMessage("teste");
console.log(userMsg.role); // 'user'

// Testar resposta mock (demo mode)
const response = await sendChatMessage("marketing");
console.log(response.materials); // Array de materiais
```

### useChat.ts

```typescript
// Verificar estados
const { messages, isLoading, error } = useChat();

console.log('Mensagens:', messages.length);
console.log('Carregando:', isLoading);
console.log('Erro:', error);
```

### ChatWidget.tsx

- Verificar renderização do botão flutuante
- Verificar abertura/fechamento do chat
- Verificar scroll automático para última mensagem
- Verificar estilos de mensagens (user vs assistant)

---

## Teste de Integração (Produção)

### Pré-requisitos
- n8n configurado e rodando
- DEMO_MODE = false
- Banco com dados populados

### Teste E2E

1. Digite uma pergunta complexa: "Quais materiais vocês têm sobre marketing para dentistas?"
2. Aguarde resposta
3. Verifique se:
   - n8n processou a mensagem (verifique logs)
   - embedding foi gerado
   - busca no banco retornou resultados
   - Gemini gerou resposta contextualizada

---

## Scripts de Teste

### Verificar dados do mockDb

```bash
# No browser console (página do Dashboard)
const materials = await mockDb.getMaterials('client');
console.log('Total materiais:', materials.length);
console.log('Primeiro material:', materials[0]?.title);
```

---

## Próximos Passos

- [Capítulo 12 - Solução de Problemas](./12-solucao-problemas.md) → Se algo não funcionar

---

*Manual do Chatbot RAG - Conexão Hub*