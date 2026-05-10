# Capítulo 09: SSL/HTTPS

## Objetivo

Configurar certificado SSL automático com Let's Encrypt via Traefik.

---

## 9.1. Pré-requisitos

- [ ] Domínio apontado para VPS (Registro A)
- [ ] Porta 80 e 443 liberadas no firewall

Teste:

```bash
# Verificar DNS
nslookup seudominio.com

# Verificar portas
telnet seudominio.com 80
telnet seudominio.com 443
```

---

## 9.2. Configurar DNS

No seu registrador (GoDaddy, Hostgator, etc.):

| Tipo | Nome | Valor |
|------|------|-------|
| A | @ | <IP_DA_VPS> |
| A | www | <IP_DA_VPS> |

---

## 9.3. Atualizar Configuration do Traefik

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

certificatesResolvers:
  letsencrypt:
    acme:
      email: seu-email@dominio.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web
      # Para usar DNS-01 (mais complexo, mas funciona com wildcard)
      # dnsChallenge:
      #   provider: cloudflare

log:
  level: INFO
  filePath: /var/log/traefik/traefik.log

accessLog:
  filePath: /var/log/traefik/access.log
```

---

## 9.4. Criar diretório para certificados

```bash
mkdir -p /opt/conexao-hub/letsencrypt

# No docker-compose do Traefik, adicionar volume:
# - /opt/conexao-hub/letsencrypt:/letsencrypt
```

---

## 9.5. Forçar HTTPS em Todos os Serviços

Adicione labels aos serviços:

```yaml
# App
labels:
  - "traefik.http.routers.app.tls=true"
  - "traefik.http.routers.app.entrypoints=websecure"

# Redirecionar HTTP para HTTPS
  - "traefik.http.middlewares.redirect-https.redirectScheme.scheme=https"
  - "traefik.http.middlewares.redirect-https.redirectScheme.permanent=true"
```

---

## 9.6. Reiniciar Traefik

```bash
docker service update --force traefik_traefik
```

---

## 9.7. Verificar Certificados

```bash
# Verificar logs do Let's Encrypt
docker service logs traefik_traefik | grep -i "acme"

# Listar certificados
docker exec -it <traefik_container> cat /letsencrypt/acme.json | jq

# Testar SSL
curl -I https://seudominio.com
```

---

## 9.8. Renovação Automática

O Let's Encrypt renova automaticamente a cada 60-90 dias. Não é necessário fazer nada.

Para forçar renovação:

```bash
# Remover certificado antigo
rm /opt/conexao-hub/letsencrypt/acme.json

# Restart do Traefik
docker service update --force traefik_traefik
```

---

## 9.9. Certificado Personalizado (Opcional)

Se tiver certificado próprio:

```bash
# Criar secrets
docker secret create ssl-cert /path/to/cert.pem
docker secret create ssl-key /path/to/key.pem

# Usar no Traefik
docker secret create ssl-cert /path/to/fullchain.pem
docker secret create ssl-key /path/to/privkey.pem
```

No `traefik.yml`:

```yaml
tls:
  stores:
    default:
      defaultCertificate:
        secretName: ssl-cert
```

---

## Checklist de Conclusão

- [ ] DNS configurado
- [ ] Certificados Let's Encrypt funcionando
- [ ] HTTPS forçado em todos os serviços
- [ ] Renovação automática configurada
- [ ] Teste de SSL passando (A+ no SSL Labs)

---

## Próximo Passo

Avance para **[Capítulo 10: Migração Supabase](./10-migration-supabase.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-DOCKER-SWARM.md)*