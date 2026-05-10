# Manual do Chatbot RAG - Índice

**Data:** 10 de Maio de 2026  
**Versão:** 1.0  
**Branch:** `feature/chatbot-rag`

---

## Índice Geral

| Capítulo | Título | Arquivo | Descrição |
|----------|--------|---------|-----------|
| 00 | Índice | Este arquivo | Visão geral do manual |
| 01 | Visão Geral | [01-visao-geral.md](./01-visao-geral.md) | O que é o chatbot, arquitetura e fluxo |
| 02 | Pré-requisitos | [02-pre-requisitos.md](./02-pre-requisitos.md) | n8n, pgvector, API Keys |
| 03 | Migration do Banco | [03-migration-banco.md](./03-migration-banco.md) | Script SQL completo |
| 04 | Serviço de Chat | [04-servico-chat.md](./04-servico-chat.md) | chatService.ts - lógica e configuração |
| 05 | Hook useChat | [05-hook-usechat.md](./05-hook-usechat.md) | useChat.ts - estado do chat |
| 06 | ChatWidget | [06-componente-chatwidget.md](./06-componente-chatwidget.md) | Interface do usuário |
| 07 | Integração Dashboard | [07-integracao-dashboard.md](./07-integracao-dashboard.md) | Onde adicionar no código |
| 08 | Modo Demo | [08-modo-demo.md](./08-modo-demo.md) | Como testar agora |
| 09 | Modo Produção | [09-modo-producao.md](./09-modo-producao.md) | Configurar n8n real |
| 10 | Fluxo do n8n | [10-fluxo-n8n.md](./10-fluxo-n8n.md) | Workflow detalhado |
| 11 | Testes | [11-testes.md](./11-testes.md) | Como verificar cada parte |
| 12 | Troubleshooting | [12-solucao-problemas.md](./12-solucao-problemas.md) | Erros comuns e soluções |
| 13 | Atualizações | [13-atualizacoes-futuras.md](./13-atualizacoes-futuras.md) | Próximas melhorias |

---

## Arquivos da Feature

```
src/
├── lib/
│   └── chatService.ts              # Serviço de chat (modo demo/produção)
├── hooks/
│   └── useChat.ts                  # Hook React para gerenciamento
├── components/hub/
│   └── ChatWidget.tsx              # Interface flutuante do chatbot
├── pages/
│   └── Dashboard.tsx               # Integração com o Dashboard

supabase/migrations/
└── 20260510000000_create_embeddings_setup.sql  # Banco de dados

docs/
└── manual_chatbot_rag/
    └── (este manual)
```

---

## Quick Links

- [Capítulo 01 - Visão Geral](./01-visao-geral.md)
- [Capítulo 08 - Modo Demo](./08-modo-demo.md) ← Comece aqui para testar
- [Capítulo 09 - Modo Produção](./09-modo-producao.md) ← Para deploy

---

*Este índice faz parte do Manual do Chatbot RAG - Conexão Hub*