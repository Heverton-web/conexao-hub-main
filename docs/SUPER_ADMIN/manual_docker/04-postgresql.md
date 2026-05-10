# Capítulo 04: PostgreSQL

## Objetivo

Configurar o banco de dados PostgreSQL utilizando Docker.

---

## 4.1. Visão Geral

O PostgreSQL será o banco de dados principal da aplicação, armazenando:
- Usuários e perfis
- Materiais e coleções
- Configurações do sistema
- Logs de acesso
- Integrações (chaves de API)

---

## 4.2. Criar Arquivo Docker Compose

Crie `/opt/conexao-hub/postgres.yml`:

```bash
cat > /opt/conexao-hub/postgres.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.labels.database == true
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 2G
    environment:
      POSTGRES_USER: conexao_hub
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: conexao_hub
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d:ro
    networks:
      - app-overlay
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U conexao_hub"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  postgres_data:
    driver: local

networks:
  app-overlay:
    external: true
    name: app-overlay
EOF
```

---

## 4.3. Criar Arquivo .env

Crie `/opt/conexao-hub/.env`:

```bash
cat > /opt/conexao-hub/.env << 'EOF'
# Senha do PostgreSQL (MUDAR!)
POSTGRES_PASSWORD=SuaSenhaForte123!
EOF

# Proteger o arquivo
chmod 600 /opt/conexao-hub/.env
```

---

## 4.4. Deploy do PostgreSQL

```bash
cd /opt/conexao-hub

# Criar diretório para scripts de inicialização
mkdir -p /opt/conexao-hub/init-scripts

# Deploy
docker stack deploy -c postgres.yml db

# Verificar
docker service ls
docker service ps db_postgres
```

---

## 4.5. Verificar Conectividade

```bash
# Ver logs
docker service logs -f db_postgres

# Testar conexão
docker exec -it $(docker ps -qf name=postgres) psql -U conexao_hub -c "SELECT version();"
```

---

## 4.6. Configurações de Performance

Crie arquivo de configuração customizado em `/opt/conexao-hub/postgres.conf`:

```bash
cat > /opt/conexao-hub/postgres.conf << 'EOF'
# Conexões
max_connections = 50
shared_buffers = 1GB
effective_cache_size = 2GB

# WAL
wal_buffers = 16MB
min_wal_size = 1GB
max_wal_size = 4GB

# Checkpoint
checkpoint_completion_target = 0.9

# Queries
work_mem = 64MB
maintenance_work_mem = 256MB
random_page_cost = 1.1
effective_io_concurrency = 200

# Logs
log_destination = 'stderr'
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB

# Slow queries
log_min_duration_statement = 1000

# Autovacuum
autovacuum = on
autovacuum_max_workers = 4
autovacuum_naptime = 1min
EOF
```

Adicione ao `postgres.yml`:

```yaml
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d:ro
      - ./postgres.conf:/etc/postgresql/postgresql.conf:ro
    command: postgres -c config_file=/etc/postgresql/postgresql.conf
```

Reinicie:

```bash
docker service update --force db_postgres
```

---

## 4.7. Criar Usuário e Banco (via SQL)

Conecte ao PostgreSQL:

```bash
docker exec -it $(docker ps -qf name=postgres) psql -U conexao_hub
```

Execute:

```sql
-- Criar usuário admin (se necessário)
-- O usuário já foi criado pelas variáveis de ambiente

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Verificar bancos
\l
```

---

## 4.8. Conexão Externa (via DBeaver/TablePlus)

Para conectar ferramentas externas:

```yaml
# Adicionar ao postgres.yml
    ports:
      - "5432:5432"
```

⚠️ **Atenção**: exposing a porta do banco na internet é arriscado. Recomendamos usar tunnel SSH ou VPN.

---

## 4.9.Backup do PostgreSQL

Ver [Capítulo 12: Backup](./12-backup.md) para configuração completa.

Comando básico:

```bash
# Backup
docker exec $(docker ps -qf name=postgres) pg_dump -U conexao_hub conexao_hub > backup.sql

# Restore
docker exec -i $(docker ps -qf name=postgres) psql -U conexao_hub conexao_hub < backup.sql
```

---

## Checklist de Conclusão

- [ ] PostgreSQL deployado via Docker
- [ ] Volume persistente configurado
- [ ] Conexão funcionando
- [ ] Configurações de performance aplicadas
- [ ] Backup configurado

---

## Próximo Passo

Avance para **[Capítulo 05: MinIO Storage](./05-minio-storage.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-DOCKER-SWARM.md)*