# Capítulo 11: Variáveis de Ambiente

## Objetivo

Documentar todas as variáveis de ambiente necessárias para a aplicação.

---

## 11.1. Arquivo .env Completo

Crie `/opt/conexao-hub/.env`:

```bash
# ===========================================
# DATABASE - PostgreSQL
# ===========================================
POSTGRES_PASSWORD=SuaSenhaForte123!

# ===========================================
# APP - Next.js
# ===========================================
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://seudominio.com
NEXT_PUBLIC_API_URL=https://seudominio.com/api

# ===========================================
# SUPABASE (se ainda usar)
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=http://db_postgres:5432
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui

# ===========================================
# CLERK - Autenticação
# ===========================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# ===========================================
# MINIO - Storage S3
# ===========================================
NEXT_PUBLIC_MINIO_ENDPOINT=http://<IP_VPS>:9000
MINIO_ACCESS_KEY=conexaohub
MINIO_SECRET_KEY=SuaSenhaMinIO123!
MINIO_BUCKET=materials

# ===========================================
# LLM APIs - Integrações
# ===========================================
# Adicionar via Admin Panel (criptografadas no banco)
# GEMINI_API_KEY=
# OPENAI_API_KEY=
# GROQ_API_KEY=
# OPENROUTER_API_KEY=

# ===========================================
# OUTROS
# ===========================================
# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Log (opcional)
LOG_LEVEL=info
```

---

## 11.2. Variáveis por Serviço

### App (Next.js):

```bash
NODE_ENV=production
PORT=3000

# URLs
NEXT_PUBLIC_APP_URL=https://seudominio.com

# Banco (se usar Prisma/direct PostgreSQL)
DATABASE_URL=postgresql://conexao_hub:senha@db_postgres:5432/conexao_hub

# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://db_postgres:5432
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# MinIO
NEXT_PUBLIC_MINIO_ENDPOINT=http://<IP>:9000
```

### PostgreSQL:

```bash
POSTGRES_USER=conexao_hub
POSTGRES_PASSWORD=senha_forte
POSTGRES_DB=conexao_hub
```

### MinIO:

```bash
MINIO_ROOT_USER=conexaohub
MINIO_ROOT_PASSWORD=senha_minio
```

---

## 11.3. Secrets no Docker Swarm

Para informações sensíveis, use Docker Secrets:

```bash
# Criar secrets
echo "senha_muito_segura" | docker secret create postgres_password -
echo "chave_secreta" | docker secret create clerk_secret_key -

# Usar no compose
secrets:
  - postgres_password
  - clerk_secret_key
```

No serviço:

```yaml
secrets:
  postgres_password:
    external: true
environment:
  - POSTGRES_PASSWORD_FILE=/run/secrets/postgres_password
```

---

## 11.4. Variables para Desenvolvedor

Crie `.env.local` para desenvolvimento:

```bash
# Desenvolvimento
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Banco local (opcional)
DATABASE_URL=postgresql://conexao_hub:senha@localhost:5432/conexao_hub

# Supabase desenvolvimento
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Clerk desenvolvimento
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

---

## Checklist de Conclusão

- [ ] Arquivo .env criado com todas variáveis
- [ ] Variáveis documentadas
- [ ] Secrets configurados (opcional)
- [ ] .env.local para desenvolvimento

---

## Próximo Passo

Avance para **[Capítulo 12: Backup](./12-backup.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-DOCKER-SWARM.md)*