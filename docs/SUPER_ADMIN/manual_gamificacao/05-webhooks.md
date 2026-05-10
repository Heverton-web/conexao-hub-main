# 05. Webhooks

## Visão Geral

O sistema de gamificação dispara **webhooks** para notificar sistemas externos sobre eventos de progresso. Isso permite integrações com CRMs, sistemas de reward, analytics, e outros serviços.

---

## 1. Eventos Disponíveis

| Evento | Trigger | Dado Enviado |
|--------|---------|--------------|
| `material_accessed` | Usuário abre material | userId, userRole, materialId |
| `material_completed` | Usuário completa material | userId, userRole, materialId, points |
| `collection_completed` | Usuário completa trilha | userId, userRole, collectionId, points |

---

## 2. Configuração

### Admin → Configurações → Integrações

```
┌─────────────────────────────────────────────┐
│              🔗 INTEGRAÇÕES                  │
├─────────────────────────────────────────────┤
│                                             │
│  Webhook URL:                               │
│  ┌─────────────────────────────────────┐    │
│  │ https://seu-sistema.com/webhook     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  💾 Salvar Configurações                    │
│                                             │
└─────────────────────────────────────────────┘
```

### Armazenamento

A URL do webhook é armazenada na tabela `app_config`:

```sql
-- Buscar webhook URL
SELECT value FROM app_config WHERE key = 'webhook_url';

-- Salvar webhook URL
INSERT INTO app_config (key, value) 
VALUES ('webhook_url', 'https://seu-sistema.com/webhook')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

---

## 3. Dispatcher de Webhooks

### Arquivo

`src/lib/webhookDispatcher.ts`

### Código

```typescript
// webhookDispatcher.ts
export const WebhookEvents = {
  materialAccessed: (data: { 
    userId: string; 
    userRole: Role; 
    materialId: string 
  }) => {
    sendWebhook('material_accessed', data);
  },

  materialCompleted: (data: { 
    userId: string; 
    userRole: Role; 
    materialId: string; 
    points: number 
  }) => {
    sendWebhook('material_completed', data);
  },

  collectionCompleted: (data: { 
    userId: string; 
    userRole: Role; 
    collectionId: string; 
    points: number 
  }) => {
    sendWebhook('collection_completed', data);
  },
};

async function sendWebhook(event: string, data: any) {
  try {
    const config = await mockDb.getAppConfig('webhook_url');
    const webhookUrl = config?.value;
    
    if (!webhookUrl) {
      console.log('Webhook URL não configurada, ignorando evento:', event);
      return;
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data,
      }),
    });
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
  }
}
```

---

## 4. Formato do Payload

### material_accessed

```json
{
  "event": "material_accessed",
  "timestamp": "2026-05-09T10:30:00Z",
  "data": {
    "userId": "user-uuid-123",
    "userRole": "cliente",
    "materialId": "material-uuid-456"
  }
}
```

### material_completed

```json
{
  "event": "material_completed",
  "timestamp": "2026-05-09T10:35:00Z",
  "data": {
    "userId": "user-uuid-123",
    "userRole": "cliente",
    "materialId": "material-uuid-456",
    "points": 50
  }
}
```

### collection_completed

```json
{
  "event": "collection_completed",
  "timestamp": "2026-05-09T11:00:00Z",
  "data": {
    "userId": "user-uuid-123",
    "userRole": "cliente",
    "collectionId": "collection-uuid-789",
    "points": 100
  }
}
```

---

## 5. Fluxo de Envio

```
EVENTO DISPARADO
     │
     ▼
┌─────────────────────────┐
│ mockDb.getAppConfig     │
│ ('webhook_url')        │
└────────┬────────────────┘
         │
    TEM URL? │ NÃO
      │     │
      ▼     ▼
┌──────────┐   ┌─────────────────┐
│ fetch()  │   │ Log (ignorado)  │
│ POST     │   └─────────────────┘
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Retorno: Sucesso/Erro  │
│ (async, não bloqueia)  │
└─────────────────────────┘
```

---

## 6. Integração com n8n

### Exemplo: Receber Webhook no n8n

```
┌──────────────────────────────────────┐
│         WEBHOOK (POST)              │
│   Path: gamification-events          │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│         SWITCH                       │
│  - material_accessed                 │
│  - material_completed                │
│  - collection_completed              │
└──────────────┬───────────────────────┘
               │
               ▼
    [Processos específicos por evento]
```

### Exemplo: Salvar em Planilha

```
Webhook → Switch → Google Sheets (Append Row)
```

### Exemplo: Enviar Notificação

```
Webhook → Switch → Slack (Send Message)
```

---

## 7. Teste de Webhook

### Via curl

```bash
curl -X POST https://seu-sistema.com/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "material_completed",
    "timestamp": "2026-05-09T10:00:00Z",
    "data": {
      "userId": "test-user",
      "userRole": "cliente",
      "materialId": "test-material",
      "points": 50
    }
  }'
```

### No n8n

1. Criar workflow com nó Webhook
2. Copiar URL do webhook
3. Enviar curl para testar
4. Verificar se dados aparecem no n8n

---

## 8. Tratamento de Erros

### Timeout

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

await fetch(webhookUrl, {
  ...options,
  signal: controller.signal
});

clearTimeout(timeoutId);
```

### Retry (opcional)

```typescript
// Retry com backoff exponencial
const retry = async (attempt = 0) => {
  if (attempt >= 3) return;
  
  try {
    await fetch(webhookUrl, options);
  } catch (error) {
    await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    retry(attempt + 1);
  }
};
```

---

## 9. Monitoramento

### Logs no Console

```typescript
// Quando webhook é disparado
console.log('🔗 Webhook disparado:', {
  event,
  userId: data.userId,
  timestamp: new Date().toISOString()
});

// Quando falha
console.error('❌ Webhook falhou:', error);
```

---

*Próximo: [06-interface-dashboard.md](./06-interface-dashboard.md) - Interface no Dashboard*