# Capítulo 13: Monitoramento

## Objetivo

Configurar monitoramento de serviços, logs e alertas.

---

## 13.1. Visualizar Logs

### Todos os serviços:

```bash
# Ver todos os serviços
docker service ls

# Ver logs de um serviço específico
docker service logs -f app_app

# Ver logs de todos os serviços relacionados
docker service logs -f $(docker service ls -q --filter label=com.docker.stack.namespace=conexao-hub)
```

### Filtrar logs:

```bash
# Ver apenas erros
docker service logs --tail 100 app_app 2>&1 | grep -i error

# Ver últimos 50 logs
docker service logs --tail 50 -t app_app
```

---

## 13.2. Status dos Serviços

```bash
# Status completo
docker service ls

# Ver tarefas de cada serviço
docker service ps app_app
docker service ps db_postgres
docker service ps storage_minio
docker service ps traefik_traefik
```

Saída esperada:

```
ID             NAME               IMAGE                NODE   DESIRED STATE  CURRENT STATE         ERROR
abc123         app_app.1          conexao-hub:latest  node   Running        Running 2 minutes ago
def456         app_app.2          conexao-hub:latest  node   Running        Running 2 minutes ago
```

---

## 13.3. Health Checks

```bash
# Verificar health de cada serviço
docker service inspect --pretty app_app | grep -A 5 "Endpoint"

# Testar health manualmente
curl http://localhost:3000/api/health
curl http://localhost:9000/minio/health/live
docker exec db_postgres pg_isready -U conexao_hub
```

---

## 13.4. Recursos (CPU/Memória)

```bash
# Ver uso de recursos
docker stats --no-stream

# Ver stats de um serviço específico
docker stats $(docker ps -q -f name=app_app)

# Saída:
# CONTAINER       CPU %   MEM USAGE / LIMIT     MEM %   NET I/O           BLOCK I/O
# app_app.1.xxx   2.35%   512MiB / 1GiB         51.00%  1.23MB / 2.45MB   0B / 0B
```

---

## 13.5. Portainer (Interface Visual - Opcional)

Se quiser uma interface visual:

```bash
# Deploy Portainer no Swarm
docker stack deploy -c - portainer << 'EOF'
version: '3.8'
services:
  portainer:
    image: portainer/portainer-ce:latest
    ports:
      - "9443:9443"
      - "9000:9000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
    deploy:
      placement:
        constraints:
          - node.role == manager
EOF
```

Acesse: `https://<SEU_IP>:9443`

---

## 13.6. Prometheus + Grafana (Avançado - Opcional)

Para monitoramento avançado, considere:

1. **cAdvisor**: Coleta métricas de containers
2. **Prometheus**: Armazena métricas
3. **Grafana**: Visualiza dashboards

```yaml
# docker-compose.yml para stack de monitoramento
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    networks:
      - app-overlay

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - app-overlay
```

---

## 13.7. Alertas Básicos

Crie script de verificação em `/opt/conexao-hub/scripts/monitor.sh`:

```bash
#!/bin/bash

# Verificar serviços críticos
SERVICES=("app_app" "db_postgres" "storage_minio" "traefik_traefik")
EMAIL="seu-email@dominio.com"

for service in "${SERVICES[@]}"; do
  STATE=$(docker service inspect --pretty --format '{{.UpdateStatus.State}}' ${service} 2>/dev/null || echo "unknown")
  
  if [ "$STATE" != "completed" ]; then
    echo "ALERTA: $service está em estado: $STATE"
    # Enviar alerta (implementar com Mailgun/SendGrid/etc)
  fi
done

# Verificar disco
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
  echo "ALERTA: Disco com $DISK_USAGE% de uso!"
fi

# Verificar memória
MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
if [ $MEM_USAGE -gt 90 ]; then
  echo "ALERTA: Memória com $MEM_USAGE% de uso!"
fi
```

Adicione ao crontab:

```bash
# Verificar a cada 5 minutos
*/5 * * * * /opt/conexao-hub/scripts/monitor.sh >> /var/log/monitor.log 2>&1
```

---

## 13.8. Dashboard Simple (CLI)

Crie script para exibir status rápido:

```bash
cat > /opt/conexao-hub/status.sh << 'EOF'
#!/bin/bash
echo "════════════════════════════════════════════"
echo "       STATUS CONEXÃO HUB"
echo "════════════════════════════════════════════"
echo ""
echo "SERVIÇOS:"
docker service ls --format "table {{.Name}}\t{{.Replicas}}\t{{.Image}}\t{{.Status}}"
echo ""
echo "RECURSOS:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
echo ""
echo "DISCO:"
df -h / | tail -1 | awk '{print "  Uso: " $5}'
echo ""
echo "MEMÓRIA:"
free -h | grep Mem | awk '{print "  Total: " $2 ", Usado: " $3}'
echo ""
echo "UPTIME:"
uptime | awk '{print "  " $3}'
echo ""
echo "════════════════════════════════════════════"
EOF
chmod +x /opt/conexao-hub/status.sh
```

Use:

```bash
/opt/conexao-hub/status.sh
```

---

## Checklist de Conclusão

- [ ] Logs acessíveis
- [ ] Health checks funcionando
- [ ] Monitoramento de recursos
- [ ] Alertas configurados (opcional)
- [ ] Dashboard de status criado

---

## Próximo Passo

Avance para **[Capítulo 14: Manutenção](./14-manutencao.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-DOCKER-SWARM.md)*