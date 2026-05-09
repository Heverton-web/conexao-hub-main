# Capítulo 08: Traefik (Reverse Proxy)

## Objetivo

Configurar o Traefik como reverse proxy para rotear requisições para os serviços.

---

## 8.1. Conceitos

O Traefik atua como:
- **Reverse Proxy**: Recebe requisições e redireciona para serviços
- **Load Balancer**: Distribui carga entre réplicas
- **SSL/TLS Terminator**: Gerencia HTTPS
- **Service Discovery**: Detecta automaticamente novos containers

---

## 8.2. Arquitetura Atual

```
Usuário → Traefik → App (Next.js)
                → PostgreSQL (não exposto)
                → MinIO (não exposto)
                → Traefik Dashboard
```

---

## 8.3. Atualizar Configuração do Traefik

Edite `/opt/conexao-hub/traefik-config/traefik.yml`:

```yaml
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
    watch: true

  file:
    directory: /etc/traefik/dynamic
    watch: true

log:
  level: INFO

accessLog:
  fields:
    defaultMode: keep
    headers:
      - name: Authorization
        mode: redact
      - name: Cookie
        mode: redact
```

---

## 8.4. Criar Configurações Dinâmicas

Crie diretório `/opt/conexao-hub/traefik-config/dynamic/`:

```bash
mkdir -p /opt/conexao-hub/traefik-config/dynamic
```

Crie `/opt/conexao-hub/traefik-config/dynamic/middlewares.toml`:

```toml
[http.middlewares.compress.compress]
  excludedContentTypes = ["text/event-stream"]

[http.middlewares.security.headers]
  frameDeny = true
  contentTypeNosniff = true
  browserXssFilter = true
  referrerPolicy = "strict-origin-when-cross-origin"
  customFrameOptionsValue = "SAMEORIGIN"

[http.middlewares.rateLimit]
  [http.middlewares.rateLimit.rateLimit]
    average = 100
    burst = 50

[http.middlewares.redirectHTTP]
  [http.middlewares.redirectHTTP.redirectScheme]
    scheme = "https"
    permanent = true
```

---

## 8.5. Configurar Roteamento

Atualize o `swarm.yml` para adicionar as labels corretas ao Traefik:

```bash
cat > /opt/conexao-hub/traefik-config/traefik.yml << 'EOF'
api:
  dashboard: true
  insecure: true

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"
    http:
      tls:
        certResolver: letsencrypt

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    network: app-overlay

  file:
    directory: /etc/traefik/dynamic
    watch: true

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
  format: json
EOF
```

---

## 8.6. Labels de Roteamento

Adicione estas labels aos seus serviços no `docker-compose.yml`:

### App (Next.js):

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.app.rule=PathPrefix(`/`)"
  - "traefik.http.routers.app.entrypoints=web,websecure"
  - "traefik.http.routers.app.tls=true"
  - "traefik.http.services.app.loadbalancer.server.port=3000"
  - "traefik.http.middlewares.app-compress.compress=true"
  - "traefik.http.middlewares.app-security.headers=true"
```

### MinIO Console:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.minio.rule=PathPrefix(`/minio`)"
  - "traefik.http.services.minio.loadbalancer.server.port=9000"
```

---

## 8.7. Autenticação no Dashboard

Crie `/opt/conexao-hub/traefik-config/dynamic/dashboard-auth.toml`:

```toml
[http.middlewares.dashboard-auth.basicAuth]
  users = [
    "admin:$apr1$H6uskkkW$IgXLP6ewTrSuBkTrqnu8j0",  # senha: admin
  ]

[http.routers.dashboard]
  rule = "PathPrefix(`/dashboard`)"
  service = "api@internal"
  middlewares = ["dashboard-auth"]
  [http.routers.tls]
    match = "Host(`seudominio.com`)"
    rule = "PathPrefix(`/dashboard`)"
    [http.routers.tls.tls]
      certResolver = "letsencrypt"
```

Gere hash de senha:

```bash
# Gerar hash de senha
apt install -y apache2-utils
htpasswd -nb admin senhaforte
```

---

## 8.8. Reiniciar Traefik

```bash
# Atualizar configuração
docker service update --force traefik_traefik

# Ver logs
docker service logs -f traefik_traefik
```

---

## 8.9. Testar Roteamento

```bash
# Testar se Traefik está respondendo
curl http://<SEU_IP>/

# Testar via domínio (depois de configurar DNS)
curl https://seudominio.com/

# Verificar serviços descobertos
curl http://<SEU_IP>/api/http/services
```

---

## 8.10. Solução de Problemas

### Serviços não aparecem:

```bash
# Verificar se o Docker socket está acessível
docker exec -it <traefik_container> ls -la /var/run/docker.sock

# Ver logs de erro
docker service logs traefik_traefik | grep -i error
```

### SSL não funciona:

```bash
# Verificar se as portas estão abertas
telnet seu-dominio.com 443

# Ver logs do Let's Encrypt
docker service logs traefik_traefik | grep -i acme
```

---

## Checklist de Conclusão

- [ ] Traefik configurado
- [ ] Dashboard acessível com autenticação
- [ ] Roteamento para app funcionando
- [ ] Compressão habilitada
- [ ] Headers de segurança aplicados

---

## Próximo Passo

Avance para **[Capítulo 09: SSL/HTTPS](./09-ssl-https.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-DOCKER-SWARM.md)*