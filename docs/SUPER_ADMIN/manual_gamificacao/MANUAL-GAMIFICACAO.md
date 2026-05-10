# Manual de Gamificação - Conexão Hub

## Visão Geral

O sistema de gamificação visa engajar usuários na plataforma através de um mecanismo de **pontos de experiência (XP)** e **níveis (patentes)**. Ao consumir conteúdos (materiais e trilhas), os usuários acumulam pontos e avançam na hierarquia de níveis, criando um ciclo de progressão que motiva o engajamento contínuo.

**Duração estimada**: 30 minutos para configuração completa
**Dificuldade**: Básico

---

## Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUÁRIO ACESSA PLATAFORMA                   │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DASHBOARD (Dashboard.tsx)                     │
│   ├── Exibe nível atual e barra de progresso                       │
│   └── Calcula progressão para próximo nível                      │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  ABRIR MATERIAL  │    │ COMPLETAR        │    │ COMPLETAR        │
│  (handleView     │    │ MATERIAL         │    │ TRILHA           │
│   Material)      │    │ (handleClose     │    │ (verificação     │
│                  │    │  Viewer)         │    │  automática)     │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ addPoints(30%)   │    │ addPoints(70%)   │    │ addPoints(100%) │
│ • upsertProgress │    │ • upsertProgress │    │ • upsertCollection│
│ • mockDb.addPoints    │ • mockDb.addPoints    │ • mockDb.addPoints  │
│ • WebhookEvents  │    │ • WebhookEvents  │    │ • WebhookEvents  │
│   materialAccessed    │   materialCompleted  │   collectionCompleted│
└──────────────────┘    └──────────────────┘    └──────────────────┘
                                   │                       │
                                   ▼                       ▼
                    ┌─────────────────────────┐  ┌─────────────────────────┐
                    │  SUPABASE (Banco)       │  │  SUPABASE (Banco)       │
                    │  • user_progress        │  │  • collection_progress │
                    │  • points (users table) │  │  • points (users table) │
                    └─────────────────────────┘  └─────────────────────────┘
```

---

## Estrutura do Manual

| Capítulo | Arquivo | Descrição |
|----------|---------|-----------|
| 01 | [01-introducao.md](./01-introducao.md) | Visão geral, exemplo prático, pré-requisitos |
| 02 | [02-sistema-xp.md](./02-sistema-xp.md) | Pontos ao abrir (30%) e completar (70%) materiais |
| 03 | [03-niveis-patentes.md](./03-niveis-patentes.md) | Níveis padrão, cálculo, configuração no Admin |
| 04 | [04-pontos-trilhas.md](./04-pontos-trilhas.md) | Lógica de completamento de trilhas |
| 05 | [05-webhooks.md](./05-webhooks.md) | Eventos Disparados, payload, configuração |
| 06 | [06-interface-dashboard.md](./06-interface-dashboard.md) | Card de gamificação, indicadores, celebração |
| 07 | [07-testes.md](./07-testes.md) | Cenários de validação |
| 08 | [08-troubleshooting.md](./08-troubleshooting.md) | Problemas comuns e soluções |

---

## Fluxo de Uso

### Exemplo Prático

1. Usuário entra no Dashboard → vê nível "Iniciante" com 0 XP
2. Abre material "Kit Iniciante" (50 XP) → recebe **15 XP** (30%)
3. Completa o material → recebe **35 XP** restantes (70%)
4. Accumula 50 XP → sobe para nível **Bronze** (100 XP mínimo)
5. Completa todos os materiais da trilha "Kit Iniciante" (100 XP) → recebe bônus
6. Ao final: 150 XP, nível **Bronze**

### Pontos por Material

| Material | Pontos Totais | Ao Abrir (30%) | Ao Completar (70%) |
|----------|---------------|----------------|-------------------|
| Kit Iniciante (PDF) | 50 | 15 XP | 35 XP |
| Marketing Dental (Vídeo) | 100 | 30 XP | 70 XP |
| Manual ExpertGuide (HTML) | 75 | 22 XP | 53 XP |

---

## Pré-requisitos

| Componente | Requisito |
|------------|-----------|
| **Supabase** | Banco de dados configurado com tabelas de progresso |
| **Admin** | Acesso ao painel Admin para configurar níveis |
| **Materiais** | terem pontos definidos (campo `points` > 0) |
| **Trilhas** | terem pontos definidos (campo `points` > 0) |

---

## Próximas Melhorias

- [ ] Badges colecionáveis por conquistas específicas
- [ ] Ranking de usuários por XP
- [ ] Recompensas semanais/mensais
- [ ] Sistema de streak (dias consecutivos de acesso)
- [ ] Gamificação por equipes/departamentos
- [ ] Integração com gamificação externa (Points, Rewards)

---

*Documento gerado automaticamente em 2026-05-09*