# Manual de Deploy: Hub Conexão — VPS + Nginx + Supabase

## Visão Geral

Este manual descreve como instalar a plataforma Hub Conexão em uma **VPS tradicional** (Contabo, Hetzner, DigitalOcean, Hostinger, etc.) usando **Nginx** como servidor web e **Supabase** como backend.

**Duração estimada**: 1-2 horas
**Dificuldade**: Intermediário

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        Navegador do Usuário                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS (porta 443)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  VPS (Contabo/Hetzner/DigitalOcean/etc)                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Nginx (servidor web)                                      │  │
│  │ - Serve arquivos estáticos (dist/)                       │  │
│  │ - Proxy reverso (se necessário)                           │  │
│  │ - SSL/TLS (Certbot)                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ API calls (HTTPS)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Supabase (Cloud)                                              │
│  - PostgreSQL (banco de dados)                                  │
│  - Auth (autenticação)                                         │
│  - Edge Functions (serverless)                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Estrutura do Manual

| Capítulo | Arquivo | Descrição |
|----------|---------|-----------|
| 01 | [01-preparacao-vps.md](./01-preparacao-vps.md) | Configurar VPS, SSH, firewall, usuário |
| 02 | [02-configurar-supabase.md](./02-configurar-supabase.md) | Criar projeto, tabelas, autenticação |
| 03 | [03-clonar-build.md](./03-clonar-build.md) | Clonar repositório, variáveis de ambiente, build |
| 04 | [04-nginx.md](./04-nginx.md) | Configurar Nginx, SPA fallback, cache |
| 05 | [05-ssl-https.md](./05-ssl-https.md) | Configurar DNS, SSL Let's Encrypt |
| 06 | [06-atualizacoes-deploy.md](./06-atualizacoes-deploy.md) | Updates, scripts, webhooks |
| 07 | [07-monitoramento-manutencao.md](./07-monitoramento-manutencao.md) | Logs, firewall, custos |

---

## Pré-requisitos

- VPS com Ubuntu 22.04 ou 24.04 (mínimo 1GB RAM, 1 vCPU)
- Acesso SSH (via terminal, Bitvise, PuTTY, etc.)
- Domínio apontando para o IP da VPS (opcional, mas recomendado)
- Conta no Supabase (gratuita em supabase.com)
- Repositório do projeto no GitHub

---

## Custos Estimados

| Provedor | Plano Mínimo | RAM | Disco | Preço/mês |
|----------|---------------|-----|-------|-----------|
| Contabo | VPS S | 4 GB | 50 GB SSD | ~€5 |
| Hetzner | CX22 | 4 GB | 40 GB | ~€4 |
| DigitalOcean | Basic | 1 GB | 25 GB SSD | $6 |
| Hostinger | KVM 1 | 4 GB | 50 GB | ~€5 |
| Vultr | Cloud | 1 GB | 25 GB SSD | $6 |
| **Supabase** | Free | - | 500 MB DB | Grátis |

---

## Diferenças entre Provedores de VPS

O processo é **idêntico** para todos os provedores. A única diferença é como você acessa o painel de controle:

| Provedor | Painel | Observações |
|----------|--------|-------------|
| **Contabo** | my.contabo.com | VPS mais baratas, bom custo-benefício |
| **Hetzner** | console.hetzner.cloud | Excelente performance na Europa |
| **DigitalOcean** | cloud.digitalocean.com | Interface amigável, bons tutoriais |
| **Hostinger** | hpanel.hostinger.com | Bom para iniciantes |
| **Vultr** | my.vultr.com | Boa variedade de localizações |
| **Linode/Akamai** | cloud.linode.com | Boa documentação técnica |

---

## Próximo Passo

Inicie pelo **[Capítulo 01: Preparação da VPS](./01-preparacao-vps.md)**

---

## Checklist Final

- [ ] VPS criada com Ubuntu 22.04/24.04
- [ ] Sistema atualizado (`apt update && apt upgrade`)
- [ ] Node.js instalado via NVM
- [ ] Nginx instalado e rodando
- [ ] Git instalado
- [ ] Repositório clonado em `/var/www/hub-conexao`
- [ ] Arquivo `.env` criado com credenciais do Supabase
- [ ] `npm install` executado com sucesso
- [ ] `npm run build` executado com sucesso
- [ ] Nginx configurado com `try_files` para SPA
- [ ] Site acessível via IP
- [ ] DNS configurado (se usando domínio)
- [ ] SSL ativado via Certbot (se usando domínio)
- [ ] Firewall configurado (UFW)
- [ ] Supabase configurado (tabelas, RLS, admin)
- [ ] Testar login, cadastro e navegação