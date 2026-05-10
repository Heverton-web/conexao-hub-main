# Capítulo 07 - Integração no Dashboard

## Visão Geral

O ChatWidget precisa ser adicionado ao Dashboard para que os usuários vejam e utilizem o chatbot. Esta integração é simples e não requer alterações complexas.

**Localização:** `src/pages/Dashboard.tsx`

---

## Alterações Realizadas

### 1. Import do ChatWidget

**Arquivo:** `src/pages/Dashboard.tsx`  
**Linha:** ~21

```typescript
// Import adicionado
import { ChatWidget } from '../components/hub/ChatWidget';
```

### 2. Uso do Componente

**Arquivo:** `src/pages/Dashboard.tsx`  
**Linha:** ~560

```tsx
// Componente adicionado antes do fechamento da div principal
<ChatWidget />
```

---

## Código Completo da Integração

### Antes (Linhas 19-21)

```typescript
import { TrailCompletionCelebration } from '../components/hub/TrailCompletionCelebration';
import { colorMix } from '../lib/utils';
```

### Depois (Linhas 19-22)

```typescript
import { TrailCompletionCelebration } from '../components/hub/TrailCompletionCelebration';
import { ChatWidget } from '../components/hub/ChatWidget';
import { colorMix } from '../lib/utils';
```

### Antes (Linha ~556-562)

```tsx
<TrailCompletionCelebration
  isOpen={!!celebration}
  trailName={celebration?.trailName || ''}
  bonusXp={celebration?.bonusXp || 0}
  onClose={() => setCelebration(null)}
/>
</div>
```

### Depois (Linha ~556-565)

```tsx
<TrailCompletionCelebration
  isOpen={!!celebration}
  trailName={celebration?.trailName || ''}
  bonusXp={celebration?.bonusXp || 0}
  onClose={() => setCelebration(null)}
/>

<ChatWidget />
</div>
```

---

## Onde Aparece

O ChatWidget aparece como botão flutuante no **canto inferior direito** da tela, visível apenas para usuários logados (não aparece na tela de login/auth).

### Usuários que veem o ChatWidget:

| Role | vê o ChatWidget? |
|------|------------------|
| `client` | ✅ Sim |
| `distributor` | ✅ Sim |
| `consultant` | ✅ Sim |
| `manager` | ✅ Sim |
| `super_admin` | ✅ Sim |

---

## Verificação

Para verificar se a integração está funcionando:

1. Execute `npm run dev`
2. Faça login na plataforma
3. Vá para o Dashboard
4. Procure o botão **"Assistente"** no canto inferior direito
5. Clique para abrir o chat

---

## Remover o ChatWidget (Se Necessário)

Para desabilitar temporariamente:

```tsx
{/* Comentário simples */}
{/* <ChatWidget /> */}
```

Ou remova completamente:

1. Remova a linha do import:
```typescript
// import { ChatWidget } from '../components/hub/ChatWidget';
```

2. Remova a linha do uso:
```tsx
// <ChatWidget />
```

---

## Possíveis Customizações

### Mostrar apenas para certas roles

```tsx
{user?.role === 'client' && <ChatWidget />}
```

### Mostrar apenas em certas páginas

Se quiser adicionar em outras páginas, repita o processo de integração.

---

## Próximos Passos

- [Capítulo 08 - Modo Demo](./08-modo-demo.md) → Testar agora
- [Capítulo 11 - Testes](./11-testes.md) → Verificar funcionamento

---

*Manual do Chatbot RAG - Conexão Hub*