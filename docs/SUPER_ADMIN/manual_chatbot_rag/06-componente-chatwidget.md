# Capítulo 06 - Componente ChatWidget

## Visão Geral

O ChatWidget é a interface do chatbot visível para o usuário. É um componente flutuante que pode ser aberto/fechado e exibe mensagens em tempo real.

**Localização:** `src/components/hub/ChatWidget.tsx`

---

## Características

| Característica | Descrição |
|----------------|-----------|
| **Tipo** | Flutuante (fixed position) |
| **Posição** | Canto inferior direito |
| **Dimensões** | 380px × 500px |
| **Estado** | Minimizado (botão) / Maximizado (chat) |
| **Tema** | Segue o tema da plataforma (dark) |

---

## Estrutura Visual

### Estado Minimizado (Botão)

```
┌─────────────────────────────┐
│ 🤖 Assistent  │ ← Botão flutuante
└─────────────────────────────┘
```

### Estado Maximizado (Chat)

```
┌─────────────────────────────────────────┐
│ 🤖 Assistente IA              🗑️ ✕    │ ← Header
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Olá! Como posso ajudar?         │   │ ← Saudação inicial
│  │ Pergunte sobre materiais...     │   │
│  └─────────────────────────────────┘   │
│                                         │
│                               ┌─────┐  │
│  ┌──────────────────────────┐ │ Env │  │ ← Input + Enviar
│  │ Digite sua pergunta...  │ └─────┘  │
│  └──────────────────────────┘          │
└─────────────────────────────────────────┘
```

### Resposta com Resultados

```
┌─────────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │ Encontrei materiais sobre marketing!│ │ ← Resposta texto
│ │                                     │ │
│ │ Materiais relacionados:             │ │
│ │ ┌─────────────────────────────┐    │ │
│ │ │ 📄 Guia de Marketing      → │    │ │ ← Link material
│ │ └─────────────────────────────┘    │ │
│ │ ┌─────────────────────────────┐    │ │
│ │ │ 📄 Marketing Digital      → │    │ │
│ │ └─────────────────────────────┘    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Componentes Internos

### 1. Botão Flutuante

```tsx
<button
  onClick={() => setIsOpen(true)}
  className="flex items-center gap-2 px-4 py-3 rounded-full"
>
  <Bot size={20} />
  <span className="font-medium text-sm">Assistente</span>
</button>
```

### 2. Header

- Título: "Assistente IA"
- Botão limpar (lixeira)
- Botão fechar (X)

### 3. Lista de Mensagens

- Percorre array de `messages`
- Renderiza cada mensagem com estilo diferente para user/assistant
- Exibe materiais e coleções como itens clicáveis

### 4. Resultados (Materiais/Coleções)

```tsx
{msg.materials?.map((mat) => (
  <a key={mat.id} href={mat.url} className="...">
    {mat.title}
  </a>
}))}

{msg.collections?.map((col) => (
  <a key={col.id} href={col.url} className="...">
    {col.title}
  </a>
))}
```

### 5. Input

- Textarea redimensionável
- Enter para enviar (sem shift)
- Disable enquanto carrega

---

## Props

```typescript
interface ChatWidgetProps {
  className?: string;  // Classe adicional para customização
}
```

---

## Customização

### Posição

O ChatWidget usa `position: fixed` com:

```css
position: fixed;
bottom: 1rem;    /* 16px do fundo */
right: 1rem;     /* 16px da direita */
```

Para mudar a posição, edite o arquivo `ChatWidget.tsx`:

```tsx
// Linha ~10 do return do componente
<div className={`fixed bottom-4 right-4 z-50 ${className}`}>
```

### Cores

O componente usa variáveis CSS do tema:

```css
--color-surface     /* Fundo do chat */
--color-accent      /* Cor do botão */
--color-text-main   /* Texto principal */
--color-border      /* Bordas */
```

Estas são herdadas do tema dark existente.

### Tamanho

Para alterar o tamanho:

```tsx
// Dimensões do container do chat
className="w-[380px] h-[500px]"
//                ^largura  ^altura
```

---

## Icones e Recursos

O componente usa ícones do `lucide-react`:

| Ícone | Uso |
|-------|-----|
| `Bot` | Botão flutuante e header |
| `Send` | Botão enviar |
| `X` | Fechar chat |
| `Trash2` | Limpar conversa |
| `FileText` | Icone para materiais |
| `Layers` | Icone para coleções |
| `Loader2` | Loading spinner |

---

## Próximos Passos

- [Capítulo 07 - Integração no Dashboard](./07-integracao-dashboard.md) → Onde adicionar
- [Capítulo 11 - Testes](./11-testes.md) → Como verificar

---

*Manual do Chatbot RAG - Conexão Hub*