# Capítulo 14: Manutenção e Troubleshooting

## Objetivo

Comandos úteis para manutenção diária e solução de problemas comuns.

---

## 14.1. Comandos Rápidos

### Verificar status:

```bash
# Status geral
/opt/conexao-hub/status.sh

# Ver serviços
docker service ls

# Ver logs
docker service logs -f app_app
```

### Restart de serviços:

```bash
# Restart de um serviço
docker service update --force app_app

# Restart de toda a stack
docker stack deploy -c /opt/conexao-hub/app.yml app
```

### Escalar serviços:

```bash
# Escalar app para 3 réplicas
docker service scale app_app=3

# Escalar para 1
docker service scale app_app=1
```

---

## 14.2. Troubleshooting Comum

### Aplicação não inicia:

```bash
# 1. Ver logs
docker service logs app_app

# 2. Verificar variáveis de ambiente
docker service inspect app_app | grep -A 20 "Env"

# 3. Verificar rede
docker network inspect app-overlay

# 4. Testar conectividade com banco
docker exec -it $(docker ps -qf name=app) ping db_postgres
docker exec -it $(docker ps -qf name=app) nc -zv db_postgres 5432
```

### Banco não conecta:

```bash
# 1. Verificar se PostgreSQL está rodando
docker service ps db_postgres

# 2. Ver logs do banco
docker service logs db_postgres

# 3. Testar conexão
docker exec -it db_postgres psql -U conexao_hub -d conexao_hub -c "SELECT 1"

# 4. Ver espaço em disco
df -h /var/lib/docker
```

### SSL não funciona:

```bash
# 1. Ver logs do Let's Encrypt
docker service logs traefik_traefik | grep -i acme

# 2. Verificar certificados
docker exec -it $(docker ps -qf name=traefik) cat /letsencrypt/acme.json | jq

# 3. Testar portas
telnet seudominio.com 443

# 4. Forçar renovação
rm /opt/conexao-hub/letsencrypt/acme.json
docker service update --force traefik_traefik
```

### MinIO não conecta:

```bash
# 1. Verificar serviço
docker service ps storage_minio

# 2. Testar health
curl http://<IP>:9000/minio/health/live

# 3. Verificar buckets
docker exec -it storage_minio mc ls local/

# 4. Verificar credenciais no .env
```

---

## 14.3. Limpar Recursos

### Limpar containers parados:

```bash
docker container prune -f
```

### Limpar imagens não usadas:

```bash
docker image prune -a -f
```

### Limpar volumes órfãos:

```bash
docker volume prune -f
```

### Limpar logs antigos:

```bash
# Limitar tamanho dos logs do Docker
docker system df
docker system prune --volumes
```

---

## 14.4. Atualizar Aplicação

```bash
# 1. Fazer build local
docker build -t conexao-hub:latest .

# 2. Exportar e transferir para VPS
docker save conexao-hub:latest -o /tmp/conexao-hub.tar
scp /tmp/conexao-hub.tar root@<IP>:/opt/conexao-hub/

# 3. Carregar na VPS
docker load -i /opt/conexao-hub/conexao-hub.tar

# 4. Atualizar serviço com zero-downtime
docker service update --image conexao-hub:latest app_app

# 5. Verificar
docker service ps app_app
```

---

## 14.5. Atualizar Docker

```bash
# Atualizar Docker Engine
apt update && apt upgrade -y docker-ce docker-ce-cli containerd.io

# Reiniciar
systemctl restart docker

# Verificar versão
docker --version
```

---

## 14.6. Backup e Restore Completo

### Fazer backup completo:

```bash
# Backup PostgreSQL
/opt/conexao-hub/scripts/backup-postgres.sh

# Backup MinIO
/opt/conexao-hub/scripts/backup-minio.sh

# Backup configurações
tar -czf /opt/conexao-hub-backup-config.tar.gz /opt/conexao-hub/.env /opt/conexao-hub/traefik-config/
```

### Restore completo:

```bash
# 1. Parar stack
docker stack rm app db storage

# 2. Limpar volumes (CUIDADO!)
docker volume rm $(docker volume ls -q)

# 3. Restore PostgreSQL
docker volume create postgres_data
gunzip -c /opt/conexao-hub/backups/postgres/postgres_*.sql.gz | docker exec -i db_postgres psql -U conexao_hub -d conexao_hub

# 4. Redeploy
cd /opt/conexao-hub
docker stack deploy -c app.yml app
docker stack deploy -c postgres.yml db
docker stack deploy -c minio.yml storage
```

---

## 14.7. Recuperar de Falhas

### Se Swarm parar:

```bash
# Verificar nó manager
docker node ls

# Re inicializar Swarm (se necessário)
docker swarm init --force-new-cluster
```

### Se VPS reiniciar:

```bash
# Swarm inicia automaticamente
docker node ls
docker service ls

# Se serviços não iniciarem
docker stack deploy -c /opt/conexao-hub/swarm.yml conexao-hub
```

---

## 14.8. Checklist de Manutenção Semanal

- [ ] Verificar status dos serviços (`docker service ls`)
- [ ] Verificar logs de erros
- [ ] Verificar uso de disco (`df -h`)
- [ ] Verificar uso de memória (`free -h`)
- [ ] Verificar backups foram executados
- [ ] Verificar certificados SSL (data de expiração)
- [ ] Testar aplicação manualmente

---

## 14.9. Checklist de Manutenção Mensal

- [ ] Atualizar aplicação (se houver nova versão)
- [ ] Atualizar Docker
- [ ] Limpar recursos não utilizados
- [ ] Verificar integridade dos backups
- [ ] Revisar logs de segurança
- [ ] Verificar necessidade de scale

---

## 14.10. Contatos de Emergência

| Serviço | Suporte |
|---------|----------|
| Contabo | [contabo.com/en/support](https://contabo.com/en/support) |
| Docker | [docs.docker.com](https://docs.docker.com) |
| Traefik | [doc.traefik.io](https://doc.traefik.io) |
| MinIO | [min.io/docs](https://min.io/docs) |
| Clerk | [clerk.com/docs](https://clerk.com/docs) |

---

## Próximo Passo

Parabéns! Você completou o manual de deploy.

Retorne ao **[Índice](./MANUAL-DEPLOY-DOCKER-SWARM.md)** para revisão.

---

*Fim do Manual*