# Capítulo 04 - Serviço de Chat (chatService.ts)

## Visão Geral

O arquivo `src/lib/chatService.ts` é o núcleo do sistema de chat. Ele gerencia as requisições, decidindo se usa o modo demo (mock local) ou o n8n em produção.

**Localização:** `src/lib/chatService.ts`

---

## Configuração Principal

### Chave DEMO_MODE

```typescript
// Linha 26 do chatService.ts
const DEMO_MODE = true;
```

| Valor | Comportamento |
|-------|---------------|
| `true` | Usa o mock local (mockDb) - Desenvolvimento |
| `false` | Chama o n8n real - Produção |

### URL do Webhook

```typescript
// Linha 25 do chatService.ts
const N8N_WEBHOOK_URL = 'http://n8n:5678/webhook/chat-rag';
```

Aloque esta URL se o n8n estiver em outro servidor.

---

## Estrutura do Código

### Interfaces

```typescript
// Mensagem do chat
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  materials?: ChatResult[];
  collections?: ChatResult[];
}

// Resultado de material/coleção
interface ChatResult {
  id: string;
  title: string;
  type: 'material' | 'collection';
  url: string;
  icon?: string;
}

// Resposta completa do chat
interface ChatResponse {
  answer: string;
  materials: ChatResult[];
  collections: ChatResult[];
}
```

---

## Modo Demo - Lógica de Busca

O modo demo busca materiais no `mockDb` baseado na pergunta do usuário:

### Palavras-chave Suportadas

```typescript
const DEMO_RESPONSES: Record<string, string> = {
  'kit': "Encontrei materiais sobre kits!",
  'expert': "Aqui está o que tenho sobre o tema:",
  'marketing': "Temos ótimos materiais de marketing!",
  'venda': "Aqui estão os materiais sobre vendas:",
  'vender': "Aqui estão os materiais sobre vendas:",
  'produto': "Encontrei materiais sobre produtos!",
  'vídeo': "Aqui estão os materiais em vídeo:",
  'video': "Aqui estão os materiais em vídeo:",
  'pdf': "Encontrei materiais em PDF!",
  'imagem': "Encontrei materiais com imagens!",
  'implante': "Sobre implantes dentários, encontrei:",
  'dentista': "Materiais para dentistas:",
  'odontologia': "Materiais de odontologia:",
  'curso': "Aqui estão os cursos disponíveis:",
  'trilha': "Aqui estão as trilhas disponíveis:",
  'coleção': "Aqui estão as coleções disponíveis:",
  'collection': "Aqui estão as coleções disponíveis:",
};
```

### Saudações

```typescript
const GREETING_RESPONSES = [
  "Olá! Sou o assistente da plataforma. Posso ajudá-lo a encontrar materiais e trilhas. Sobre qual assunto gostaria de saber mais?",
  "Bem-vindo ao assistente IA! Digite o que procura e eu encontrei materiais relacionados na plataforma.",
  "Olá! Estou aqui para ajudar. Pergunte sobre qualquer tema dos nossos materiais ou trilhas.",
];
```

---

## Funções Exportadas

### sendChatMessage(message: string)

Função principal que processa a mensagem do usuário.

```typescript
const response = await sendChatMessage("Como funciona o marketing?");

// Retorna:
{
  answer: "Encontrei materiais sobre marketing!",
  materials: [
    { id: "xxx", title: "Guia de Marketing", type: "material", url: "/material/xxx" }
  ],
  collections: []
}
```

### createUserMessage(content: string)

Cria uma mensagem do usuário.

### createAssistantMessage(response: ChatResponse)

Cria uma mensagem do assistente com a resposta.

### saveChatHistory(messages: ChatMessage[])

Salva o histórico no localStorage (até 50 mensagens).

### loadChatHistory()

Carrega o histórico do localStorage.

### clearChatHistory()

Limpa o histórico salvo.

---

## Alterando para Produção

Para mudar do modo demo para produção:

### Passo 1: Alterar DEMO_MODE

Edite `src/lib/chatService.ts`:

```typescript
// De:
const DEMO_MODE = true;

// Para:
const DEMO_MODE = false;
```

### Passo 2: Configurar URL do n8n

Se o n8n estiver em outro servidor:

```typescript
// De:
const N8N_WEBHOOK_URL = 'http://n8n:5678/webhook/chat-rag';

// Para (exemplo):
const N8N_WEBHOOK_URL = 'https://seu-n8n.exemplo.com/webhook/chat-rag';
```

### Passo 3: Configurar o n8n

Consulte o [Capítulo 10 - Fluxo do n8n](./10-fluxo-n8n.md).

---

## Timeout e Erros

```typescript
const TIMEOUT_MS = 30000; // 30 segundos
```

| Erro | Causa | Solução |
|------|-------|---------|
| "Tempo limite excedido" | n8n não respondeu em 30s | Verificar se n8n está acessível |
| "Falha ao conectar" | Rede não conseguiu alcançar n8n | Verificar URL e firewall |
| "Erro do n8n: 500" | Erro interno do n8n | Verificar logs do n8n |

---

## Próximos Passos

- [Capítulo 05 - Hook useChat](./05-hook-usechat.md) → Gerenciamento de estado
- [Capítulo 08 - Modo Demo](./08-modo-demo.md) → Como testar
- [Capítulo 09 - Modo Produção](./09-modo-producao.md) → Configuração final

---

*Manual do Chatbot RAG - Conexão Hub*