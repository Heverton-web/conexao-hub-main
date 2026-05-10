# Capítulo 03: Configuração do Docker Swarm

## Objetivo

Configurar o Docker Swarm para orquestração de containers.

---

## 3.1. O que é Docker Swarm?

Docker Swarm é o recurso nativo de orquestração do Docker que permite:
- Balanceamento de carga automático
- Service discovery
- Rollback automático
- Escalabilidade horizontal

---

## 3.2. Inicializar o Swarm

Como temos apenas uma VPS, inicializamos em modo de nó único:

```bash
# Como root ou usuário com permissão
docker swarm init --advertise-addr <IP_DA_VPS>

# Exemplo:
# docker swarm init --advertise-addr 194.164.56.78

# Verificar status do Swarm
docker swarm info
```

---

## 3.3. Criar Labels para Serviços

Labels ajudam a organizar e posicionar serviços:

```bash
# Adicionar label ao nó atual para PostgreSQL
docker node update --label-add database=true $(hostname)

# Adicionar label para Redis
docker node update --label-add cache=true $(hostname)

# Adicionar label para App
docker node update --label-add app=true $(hostname)

# Verificar labels
docker node inspect $(hostname) --format '{{ .Spec.Labels }}'
```

---

## 3.4. Criar Redes Overlay

Redes overlay permitem comunicação entre serviços em diferentes nós:

```bash
# Rede principal da aplicação (Swarm)
docker network create -d overlay \
  --attachable \
  --driver overlay \
  app-overlay

# Rede interna para serviços (sem acesso externo)
docker network create -d overlay \
  --internal \
  app-internal
```

---

## 3.5. Criar Arquivo Docker Compose para Swarm

Crie o arquivo base em `/opt/conexao-hub/swarm.yml`:

```bash
mkdir -p /opt/conexao-hub
cd /opt/conexao-hub
```

```bash
cat > /opt/conexao-hub/swarm.yml << 'EOF'
version: '3.8'

services:
  # Traefik - Reverse Proxy
  traefik:
    image: traefik:v3.0
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    networks:
      - app-overlay
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik-config:/etc/traefik:ro
    environment:
      - TRAEFIK_LOG_LEVEL=INFO
      - TRAEFIK_API=true
      - TRAEFIK_DASHBOARD=true

networks:
  app-overlay:
    external: true
    name: app-overlay

volumes:
  traefik-config:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /opt/conexao-hub/traefik-config
EOF
```

---

## 3.6. Configurar Diretórios

```bash
# Criar diretório para Traefik
mkdir -p /opt/conexao-hub/traefik-config

# Criar arquivo de configuração Traefik
cat > /opt/conexao-hub/traefik-config/traefik.yml << 'EOF'
api:
  dashboard: true
  insecure: true

entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    network: app-overlay

certificatesResolvers:
  letsencrypt:
    acme:
      email: seu-email@dominio.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web

log:
  level: INFO

accessLog:
  fields:
    defaultMode: keep
EOF
```

---

## 3.7. Deploy Inicial do Traefik

```bash
cd /opt/conexao-hub

# Deploy da stack
docker stack deploy -c swarm.yml conexao-hub

# Verificar serviços
docker service ls

# Verificar logs
docker service logs conexao-hub_traefik
```

---

## 3.8. Verificar Status

```bash
# Ver serviços rodando
docker service ls

# Ver tarefas do serviço
docker service ps conexao-hub_traefik

# Ver logs em tempo real
docker service logs -f conexao-hub_traefik

# Ver nós do Swarm
docker node ls
```

---

## 3.9. Testar o Traefik

Acesse no navegador:
- `http://<SEU_IP_VPS>/` → erro 404 (normal, nada ainda)
- `http://<SEU_IP_VPS>/dashboard/` → painel Traefik

---

## 3.10. Comandos Úteis do Swarm

```bash
# Ver logs de um serviço
docker service logs -f <serviço>

# Escalar um serviço
docker service scale conexao-hub_app=3

# Atualizar imagem de um serviço
docker service update --image <nova-imagem> <serviço>

# Rollback (voltar versão anterior)
docker service rollback <serviço>

# Remover stack
docker stack rm conexao-hub
```

---

## Checklist de Conclusão

- [ ] Swarm inicializado
- [ ] Labels configuradas
- [ ] Redes overlay criadas
- [ ] Traefik deployado
- [ ] Dashboard do Traefik acessível

---

## Próximo Passo

Avance para **[Capítulo 04: PostgreSQL](./04-postgresql.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-DOCKER-SWARM.md)*