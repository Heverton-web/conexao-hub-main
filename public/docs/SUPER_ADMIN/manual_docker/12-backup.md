# Capítulo 12: Backup

## Objetivo

Configurar backup automático do banco de dados e arquivos.

---

## 12.1. Estratégia de Backup

| Dado | Frequência | Retenção |
|------|------------|----------|
| PostgreSQL | Diária | 7 dias |
| MinIO | Diária | 7 dias |
| Configurações | Semanal | 4 semanas |

---

## 12.2. Script de Backup PostgreSQL

Crie `/opt/conexao-hub/scripts/backup-postgres.sh`:

```bash
#!/bin/bash
set -e

# Configurações
BACKUP_DIR="/opt/conexao-hub/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="conexao_hub"
DB_USER="conexao_hub"
DB_HOST="db_postgres"
RETENTION_DAYS=7

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

echo "Iniciando backup do PostgreSQL em $DATE"

# Fazer backup
docker exec $DB_HOST pg_dump -U $DB_USER $DB_NAME > "$BACKUP_DIR/postgres_$DATE.sql"

# Compactar
gzip "$BACKUP_DIR/postgres_$DATE.sql"

# Verificar tamanho
SIZE=$(du -h "$BACKUP_DIR/postgres_$DATE.sql.gz" | cut -f1)
echo "Backup criado: postgres_$DATE.sql.gz ($SIZE)"

# Remover backups antigos
find $BACKUP_DIR -name "postgres_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Listar backups restantes
echo "Backups restantes:"
ls -lh $BACKUP_DIR

echo "Backup concluído!"
```

Dê permissão:

```bash
chmod +x /opt/conexao-hub/scripts/backup-postgres.sh
```

---

## 12.3. Script de Backup MinIO

Crie `/opt/conexao-hub/scripts/backup-minio.sh`:

```bash
#!/bin/bash
set -e

BACKUP_DIR="/opt/conexao-hub/backups/minio"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

mkdir -p $BACKUP_DIR

echo "Iniciando backup do MinIO em $DATE"

# Usar mc para copiar buckets
docker exec storage_minio mc alias set local http://localhost:9000 minioadmin minioadmin

# Criar archive de cada bucket
for bucket in materials thumbnails avatars trail-covers; do
  docker exec storage_minio mc ls local/$bucket > /dev/null 2>&1 && \
    docker exec storage_minio mc mirror local/$bucket $BACKUP_DIR/$bucket-$DATE/ || \
    echo "Bucket $bucket vazio ou não existe, pulando..."
done

# Compactar
cd $BACKUP_DIR
tar -czf minio_$DATE.tar.gz */ 2>/dev/null || true

# Limpar diretórios descompactados
rm -rf $BACKUP_DIR/*/

# Remover backups antigos
find $BACKUP_DIR -name "minio_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup MinIO concluído!"
ls -lh $BACKUP_DIR
```

---

## 12.4. Configurar Cron (Agendamento)

Abra crontab:

```bash
crontab -e
```

Adicione:

```bash
# Backup PostgreSQL - todo dia às 2h
0 2 * * * /opt/conexao-hub/scripts/backup-postgres.sh >> /var/log/backup-postgres.log 2>&1

# Backup MinIO - todo dia às 3h
0 3 * * * /opt/conexao-hub/scripts/backup-minio.sh >> /var/log/backup-minio.log 2>&1
```

Verificar:

```bash
# Listar crons ativos
crontab -l

# Ver logs de hoje
tail -f /var/log/backup-postgres.log
tail -f /var/log/backup-minio.log
```

---

## 12.5. Backup Externo (Off-site)

Para enviar backups para armazenamento externo:

```bash
# Exemplo com Rclone (Cloudflare R2, S3, etc.)
# Install: curl https://rclone.org/install.sh | sudo bash

# Configurar rclone
rclone config

# Adicionar ao script de backup:
rclone copy /opt/conexao-hub/backups/postgres remote:conexao-hub-backups/ --update --verbose
```

---

## 12.6. Restore (Recuperar)

### Restore PostgreSQL:

```bash
# Descompactar
gunzip postgres_20240508_020000.sql.gz

# Restaurar
docker exec -i db_postgres psql -U conexao_hub -d conexao_hub < postgres_20240508_020000.sql
```

### Restore MinIO:

```bash
# Criar bucket se não existir
docker exec storage_minio mc mb local/materials

# Restaurar
docker exec storage_minio mc mirror /opt/conexao-hub/backups/minio/materials-20240508/ local/materials/
```

---

## 12.7. Verificar Backups

Script para verificar integridade:

```bash
cat > /opt/conexao-hub/scripts/verify-backups.sh << 'EOF'
#!/bin/bash
echo "=== Verificação de Backups ==="
echo ""

# PostgreSQL
echo "PostgreSQL:"
LATEST_PG=$(ls -t /opt/conexao-hub/backups/postgres/*.sql.gz 2>/dev/null | head -1)
if [ -z "$LATEST_PG" ]; then
  echo "  ❌ Nenhum backup encontrado!"
else
  # Verificar se arquivo não está vazio/corrompido
  if gunzip -t "$LATEST_PG" 2>/dev/null; then
    echo "  ✅ $LATEST_PG"
  else
    echo "  ❌ Backup corrompido: $LATEST_PG"
  fi
fi

# MinIO
echo ""
echo "MinIO:"
LATEST_MINIO=$(ls -t /opt/conexao-hub/backups/minio/*.tar.gz 2>/dev/null | head -1)
if [ -z "$LATEST_MINIO" ]; then
  echo "  ❌ Nenhum backup encontrado!"
else
  echo "  ✅ $LATEST_MINIO"
fi
EOF
```

Execute:

```bash
/opt/conexao-hub/scripts/verify-backups.sh
```

---

## Checklist de Conclusão

- [ ] Scripts de backup criados
- [ ] Cron configurado
- [ ] Backup manual executado
- [ ] Restore testado
- [ ] Verificação automatizada
- [ ] Armazenamento off-site (opcional)

---

## Próximo Passo

Avance para **[Capítulo 13: Monitoramento](./13-monitoramento.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-DOCKER-SWARM.md)*