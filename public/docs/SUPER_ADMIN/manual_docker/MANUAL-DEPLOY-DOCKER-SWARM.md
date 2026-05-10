# Manual de Deploy - Docker Swarm (Contabo)

## Visão Geral

Este manual detalha o passo a passo para deploy da aplicação **Conexão Hub** em uma VPS Contabo utilizando Docker Swarm.

### Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    ARQUITETURA COMPLETA                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   USUÁRIOS (Navegador)                                       │
│         │                                                    │
│         ▼                                                    │
│   ┌──────────────────────────────────────────────────┐      │
│   │              TRAEFIK (Reverse Proxy)              │      │
│   │         SSL/HTTPS │ Load Balancing               │      │
│   └──────────────┬────────────────────────────────────┘      │
│                  │                                           │
│        ┌────────┴────────┐                                   │
│        ▼                 ▼                                   │
│   ┌─────────┐      ┌─────────┐                              │
│   │ Next.js │      │ Traefik │                              │
│   │ (App)   │      │  API    │                              │
│   └────┬────┘      └─────────┘                              │
│        │                                                    │
│        ├──────────┬────────────┬──────────┐                │
│        ▼          ▼            ▼          ▼                 │
│   ┌─────────┐ ┌─────────┐ ┌────────┐ ┌────────┐          │
│   │PostgreSQL│ │ MinIO   │ │  Auth  │ │  LLM   │          │
│   │ (Banco) │ │(Storage)│ │(Clerk) │ │  APIs  │          │
│   └─────────┘ └─────────┘ └────────┘ └────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Especificações (1000 usuários)

| Componente | Especificação |
|------------|---------------|
| **VPS** | Contabo Cloud VPS S (8GB RAM, 4 vCPU, 200GB SSD) |
| **SO** | Ubuntu 22.04 LTS |
| **Docker** | Engine 24.0+ |
| **PostgreSQL** | 4GB RAM, 50 conexões |
| **Next.js** | 2 réplicas (1GB RAM cada) |
| **MinIO** | 2GB RAM |
| **Traefik** | 512MB RAM |

---

## Índice dos Capítulos

| # | Capítulo | Descrição |
|---|----------|-----------|
| 01 | [Preparação da VPS](./01-preparacao-vps.md) | Configuração inicial da instância Contabo |
| 02 | [Instalação Docker](./02-instalacao-docker.md) | Docker Engine e Docker Compose |
| 03 | [Docker Swarm](./03-docker-swarm.md) | Configuração do Swarm |
| 04 | [PostgreSQL](./04-postgresql.md) | Banco de dados Dockerizado |
| 05 | [MinIO Storage](./05-minio-storage.md) | Armazenamento S3 compatível |
| 06 | [Next.js Deploy](./06-nextjs-deploy.md) | Deploy da aplicação |
| 07 | [Auth (Clerk)](./07-auth-config.md) | Sistema de autenticação |
| 08 | [Traefik](./08-nginx-traefik.md) | Reverse proxy e rotas |
| 09 | [SSL/HTTPS](./09-ssl-https.md) | Certificado Let's Encrypt |
| 10 | [Migração Supabase](./10-migration-supabase.md) | Migrar do Supabase Cloud |
| 11 | [Variáveis de Ambiente](./11-variaveis-ambiente.md) | Configurações .env |
| 12 | [Backup](./12-backup.md) | Backup automático |
| 13 | [Monitoramento](./13-monitoramento.md) | Logs e health checks |
| 14 | [Manutenção](./14-manutencao.md) | Comandos e troubleshooting |

---

## Pré-requisitos

- [ ] Conta Contabo criada
- [ ] Domínio apontado para VPS (A record)
- [ ] Certifique-se de ter acesso SSH à VPS
- [ ] Backup dos dados atuais (se houver)

---

## Tempo Estimado de Implementação

| Fase | Tempo |
|------|-------|
| Preparação VPS | 30 min |
| Docker + Swarm | 20 min |
| PostgreSQL | 15 min |
| MinIO | 15 min |
| Next.js | 30 min |
| Traefik + SSL | 20 min |
| Migração | 1-2 horas |
| **Total** | **~3-4 horas** |

---

## Próximo Passo

Comece pelo **[Capítulo 01: Preparação da VPS](./01-preparacao-vps.md)**

---

## Suporte

Em caso de dúvidas ou problemas, consulte:
- [Capítulo 14: Manutenção](./14-manutencao.md) para troubleshooting
- Documentação oficial: [docker.com](https://docs.docker.com), [traefik.io](https://doc.traefik.io)

---

*Última atualização: 2026-05-08*
*Versão: 1.0*
*Autor: Equipe Desenvolvimento*