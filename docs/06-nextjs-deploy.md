# Capítulo 06: Deploy do Next.js

## Objetivo

Fazer o build e deploy da aplicação Next.js no Docker Swarm.

---

## 6.1. Preparar o Código

No seu computador local:

```bash
# Clone do repositório (se ainda não tiver)
git clone https://github.com/Heverton-web/conexao-hub-main.git
cd conexao-hub-main

# Verificar package.json
cat package.json | grep -A 5 '"scripts"'
```

---

## 6.2. Criar Dockerfile

Na raiz do projeto, crie `Dockerfile`:

```dockerfile
# Dockerfile para produção
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage de produção
FROM node:18-alpine

WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar apenas arquivos necessários do builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Configurar Next.js
ENV NODE_ENV=production
ENV PORT=3000

# Criar diretório para cache
RUN mkdir -p /app/.next/cache

# Trocar para usuário non-root
USER nextjs

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Iniciar aplicação
CMD ["node", "server.js"]
```

---

## 6.3. Criar next.config.js

Atualize `next.config.js` para modo standalone:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'seudominio.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Configurações de ambiente
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

module.exports = nextConfig;
```

---

## 6.4. Criar/health endpoint

Em `src/pages/api/health.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ status: string; timestamp: string }>
) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
```

---

## 6.5. Fazer Build da Imagem

```bash
# No seu computador local
docker build -t conexao-hub-app:latest .

# Ou com docker-compose
docker-compose build
```

---

## 6.6. Enviar Imagem para VPS

**Opção A: Docker Registry (recomendado)**

```bash
# 1. Criar registry local na VPS
docker service create --name registry --publish 5000:5000 --mount type=bind,source=/opt/registry,target=/var/lib/registry registry:2

# 2. Enviar imagem para registry
docker tag conexao-hub-app:latest <IP_VPS>:5000/conexao-hub:latest
docker push <IP_VPS>:5000/conexao-hub:latest
```

**Opção B: Save/Load (simples)**

```bash
# Na sua máquina
docker save conexao-hub-app:latest -o conexao-hub.tar

# Transferir via scp
scp conexao-hub.tar root@<IP_VPS>:/opt/conexao-hub/

# Na VPS
docker load -i /opt/conexao-hub/conexao-hub.tar
docker tag <IMAGE_ID> conexao-hub:latest
```

---

## 6.7. Criar docker-compose.yml para App

Em `/opt/conexao-hub/app.yml`:

```bash
cat > /opt/conexao-hub/app.yml << 'EOF'
version: '3.8'

services:
  app:
    image: conexao-hub:latest
    deploy:
      replicas: 2
      placement:
        constraints:
          - node.labels.app == true
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    env_file:
      - .env
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://conexao_hub:${POSTGRES_PASSWORD}@db_postgres:5432/conexao_hub
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    networks:
      - app-overlay
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=PathPrefix(`/`)"
      - "traefik.http.services.app.loadbalancer.server.port=3000"
      - "traefik.http.middlewares.app-headers.headers.customresponseheaders.X-Frame-Options=SAMEORIGIN"
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  app-overlay:
    external: true
    name: app-overlay
EOF
```

---

## 6.8. Configurar Variáveis de Ambiente

Edite `/opt/conexao-hub/.env`:

```bash
# Adicionar variáveis do app
cat >> /opt/conexao-hub/.env << 'EOF'

# App URL
NEXT_PUBLIC_APP_URL=https://seudominio.com

# Supabase (ou PostgreSQL direto)
NEXT_PUBLIC_SUPABASE_URL=http://<IP_VPS>:5432
NEXT_PUBLIC_SUPABASE_ANON_KEY=chave_anon_do_supabase

# MinIO (Storage)
NEXT_PUBLIC_MINIO_ENDPOINT=<IP_VPS>:9000
MINIO_ACCESS_KEY=conexaohub
MINIO_SECRET_KEY=SuaSenhaMinIO123!
MINIO_BUCKET=materials
EOF
```

---

## 6.9. Deploy da Aplicação

```bash
cd /opt/conexao-hub

# Deploy
docker stack deploy -c app.yml app

# Verificar
docker service ls
docker service ps app_app
docker service logs -f app_app
```

---

## 6.10. Verificar Status

```bash
# Ver logs
docker service logs -f app_app

# Ver réplicas
docker service ps app_app

# Testar health check
curl http://localhost:3000/api/health

# Testar via Traefik
curl http://<SEU_IP>/
```

---

## 6.11. Atualizar Aplicação

```bash
# Fazer nova build (na sua máquina)
docker build -t conexao-hub:latest .

# Transferir para VPS (Opção B)
docker save conexao-hub:latest -o conexao-hub.tar
scp conexao-hub.tar root@<IP_VPS>:/opt/conexao-hub/

# Na VPS
docker load -i /opt/conexao-hub/conexao-hub.tar

# Atualizar serviço
docker service update --image conexao-hub:latest app_app

# Ver rollout
docker service inspect app_app --format '{{.UpdateStatus}}'
```

---

## Checklist de Conclusão

- [ ] Dockerfile criado
- [ ] Imagem compilada
- [ ] Imagem transferida para VPS
- [ ] Variáveis de ambiente configuradas
- [ ] App deployado no Swarm
- [ ] Health check funcionando
- [ ] Traefik configurado para rotear para app

---

## Próximo Passo

Avance para **[Capítulo 07: Auth (Clerk)](./07-auth-config.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-DOCKER-SWARM.md)*