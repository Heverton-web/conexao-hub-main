# Capítulo 05 - Hook useChat

## Visão Geral

O hook `useChat` gerencia o estado do chat: mensagens, loading, erros e histórico. Ele abstrai toda a lógica de comunicação entre o componente de interface e o serviço de chat.

**Localização:** `src/hooks/useChat.ts`

---

## Como Usar

### Importação

```typescript
import { useChat } from '../hooks/useChat';
```

### Uso no Componente

```tsx
const { messages, isLoading, error, sendMessage, clearChat } = useChat();

// Enviar mensagem
await sendMessage("Como funciona o marketing?");

// Limpar chat
clearChat();
```

---

## Estrutura do Hook

### Retorno

```typescript
interface UseChatReturn {
  // Estado
  messages: ChatMessage[];      // Lista de mensagens
  isLoading: boolean;            // Se está processando
  error: string | null;         // Mensagem de erro (se houver)
  
  // Ações
  sendMessage: (content: string) => Promise<void>;  // Enviar mensagem
  clearChat: () => void;                              // Limpar chat
}
```

### Estado Inicial

O hook carrega automaticamente o histórico do localStorage ao iniciar:

```typescript
const [messages, setMessages] = useState<ChatMessage[]>(() => loadChatHistory());
```

---

## Fluxo de Funcionamento

### 1. Enviar Mensagem

```typescript
const sendMessage = useCallback(async (content: string) => {
  // 1. Validação
  if (!content.trim() || isLoading) return;

  // 2. Criar mensagem do usuário
  const userMsg = createUserMessage(content);
  
  // 3. Atualizar estado (mostrar mensagem do usuário)
  const updatedMessages = [...messages, userMsg];
  setMessages(updatedMessages);
  
  // 4. Limpar erro anterior
  setError(null);
  
  // 5. Ativar loading
  setIsLoading(true);

  try {
    // 6. Chamar o serviço de chat
    const response = await sendChatMessage(content);
    
    // 7. Criar mensagem do assistente
    const assistantMsg = createAssistantMessage(response);
    
    // 8. Atualizar com resposta do assistente
    const finalMessages = [...updatedMessages, assistantMsg];
    setMessages(finalMessages);
    
    // 9. Salvar no localStorage
    saveChatHistory(finalMessages);
  } catch (err) {
    // 10. Tratar erro
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
    setError(errorMessage);
  } finally {
    // 11. Desativar loading
    setIsLoading(false);
  }
}, [messages, isLoading]);
```

### 2. Limpar Chat

```typescript
const clearChat = useCallback(() => {
  setMessages([]);
  setError(null);
  clearChatHistory();
}, []);
```

---

## Gerenciamento de Histórico

### Salvar

O histórico é salvo automaticamente após cada interação:

```typescript
saveChatHistory(finalMessages);
```

Limita a 50 mensagens mais recentes.

### Carregar

Carregado automaticamente ao iniciar o hook:

```typescript
const [messages, setMessages] = useState<ChatMessage[]>(() => loadChatHistory());
```

### Limpar

Quando o usuário clica no botão "Limpar":

```typescript
clearChatHistory(); // Remove do localStorage
setMessages([]);    // Limpa o estado
```

---

## Tratamento de Estados

### Loading

- `isLoading = true` enquanto aguarda resposta
- Interface deve mostrar indicador de carregamento

### Erro

- `error = null` quando tudo OK
- `error = string` quando há falha
- Interface deve exibir mensagem de erro

### Mensagens

- Array de `ChatMessage` com role 'user' ou 'assistant'
- Cada mensagem pode ter materiais e coleções anexados

---

## Exemplo de Uso no ChatWidget

```tsx
export const ChatWidget: React.FC = () => {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    await sendMessage(inputValue.trim());
    setInputValue('');
  };

  return (
    <div>
      {/* Lista de mensagens */}
      {messages.map(msg => (
        <MessageBubble 
          key={msg.id} 
          message={msg} 
        />
      ))}

      {/* Loading */}
      {isLoading && <Spinner />}

      {/* Erro */}
      {error && <ErrorMessage message={error} />}

      {/* Input */}
      <form onSubmit={handleSubmit}>
        <input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </div>
  );
};
```

---

## Próximos Passos

- [Capítulo 06 - Componente ChatWidget](./06-componente-chatwidget.md) → Interface do usuário
- [Capítulo 07 - Integração no Dashboard](./07-integracao-dashboard.md) → onde adicionar

---

*Manual do Chatbot RAG - Conexão Hub*