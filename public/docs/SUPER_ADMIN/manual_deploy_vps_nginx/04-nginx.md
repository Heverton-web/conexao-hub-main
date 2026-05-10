# Capítulo 04: Configurar Nginx

## Objetivo

Configurar o Nginx para servir os arquivos estáticos da aplicação React com suporte a SPA (Single Page Application).

---

## 4.1. Criar Arquivo de Configuração do Site

```bash
# Criar arquivo de configuração
sudo nano /etc/nginx/sites-available/hub-conexao
```

---

## 4.2. Configuração com Domínio

Cole o seguinte conteúdo (substitua `seudominio.com.br` pelo seu domínio):

```nginx
server {
    listen 80;
    server_name seudominio.com.br www.seudominio.com.br;

    # diretório raiz dos arquivos estáticos
    root /var/www/hub-conexao/dist;
    index index.html;

    # Compressão gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types 
        text/plain 
        text/css 
        application/json 
        application/javascript 
        text/xml 
        application/xml 
        text/javascript 
        image/svg+xml
        application/font-woff
        application/font-woff2;

    # Cache de assets estáticos (1 ano para versioning)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Cache de imagens (6 meses)
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 6M;
        add_header Cache-Control "public";
        access_log off;
    }

    # SPA fallback - ESSENCIAL para React Router
    # Qualquer rota que não seja arquivo retorna index.html
    location / {
        try_files $uri $uri/ /index.html;
        
        # Headers de segurança
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        
        # Headers de cache para index.html (não cache em produção)
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Bloquear arquivos ocultos
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Log de acessos
    access_log /var/log/nginx/hub-conexao-access.log;
    error_log /var/log/nginx/hub-conexao-error.log;
}
```

---

## 4.3. Configuração Sem Domínio (Apenas IP)

Se não tiver um domínio, use esta configuração:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/hub-conexao/dist;
    index index.html;

    # Compressão gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types 
        text/plain 
        text/css 
        application/json 
        application/javascript 
        text/xml 
        application/xml 
        text/javascript 
        image/svg+xml;

    # Cache de assets estáticos
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    access_log /var/log/nginx/hub-conexao-access.log;
    error_log /var/log/nginx/hub-conexao-error.log;
}
```

---

## 4.4. Ativar o Site

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/hub-conexao /etc/nginx/sites-enabled/

# Remover site padrão (opcional)
sudo rm -f /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t
```

---

## 4.5. Recarregar Nginx

```bash
# Se a configuração estiver correta, recarregar
sudo systemctl reload nginx

# Se preferir reiniciar completamente
sudo systemctl restart nginx

# Verificar status
sudo systemctl status nginx
```

---

## 4.6. Configuração HTTPS Redirect (Após SSL)

Após configurar o SSL (Capítulo 05), substitua a configuração acima por:

```nginx
# HTTP -> HTTPS redirect
server {
    listen 80;
    server_name seudominio.com.br www.seudominio.com.br;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name seudominio.com.br www.seudominio.com.br;

    root /var/www/hub-conexao/dist;
    index index.html;

    # Certificado SSL (via Certbot)
    ssl_certificate /etc/letsencrypt/live/seudominio.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com.br/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    
    # Protocols e ciphers modernos
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # HSTS (opcional - ativa após testar)
    # add_header Strict-Transport-Security "max-age=63072000" always;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
        
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

---

## 4.7. Verificar Funcionamento

```bash
# Testar via curl (HTTP)
curl -I http://localhost

# Verificar arquivo index.html
curl http://localhost

# Verificar se assets são servidos
curl -I http://localhost/assets/
```

Acesse no navegador:
- `http://SEU_IP_DA_VPS` (se não tiver domínio)
- `http://seudominio.com.br` (se tiver domínio)

---

## 4.8. Estrutura de Arquivos Nginx

```
/etc/nginx/
├── nginx.conf              # Configuração global
├── sites-available/
│   └── hub-conexao        # Configuração do site
└── sites-enabled/
    └── hub-conexao -> ../sites-available/hub-conexao
```

---

## Checklist de Conclusão

- [ ] Arquivo de configuração criado em `/etc/nginx/sites-available/hub-conexao`
- [ ] Link simbólico criado em `/etc/nginx/sites-enabled/`
- [ ] Configuração testada com `nginx -t`
- [ ] Nginx recarregado com sucesso
- [ ] SPA fallback configurado (`try_files $uri $uri/ /index.html`)
- [ ] Gzip ativado
- [ ] Headers de segurança adicionados
- [ ] Site acessível via IP ou domínio

---

## Troubleshooting

### Erro: "nginx: [emerg] could not be resolved"

Verifique o `/etc/hosts`:
```bash
sudo nano /etc/hosts
# Adicione: 127.0.1.1   seudominio.com.br
```

### Erro: "Permission denied" no /var/www

```bash
sudo chown -R www-data:www-data /var/www/hub-conexao/dist
```

### Página branca ou 404 em rotas

Certifique-se de que o `try_files` está correto:
```nginx
try_files $uri $uri/ /index.html;
```

---

## Próximo Passo

Avance para **[Capítulo 05: SSL com Let's Encrypt](./05-ssl-https.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-VPS-NGINX.md)*