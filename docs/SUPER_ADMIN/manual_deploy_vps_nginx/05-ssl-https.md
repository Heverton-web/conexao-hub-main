# Capítulo 05: SSL com Let's Encrypt

## Objetivo

Configurar HTTPS gratuito usando Let's Encrypt (Certbot) para garantir comunicação segura.

---

## 5.1. Pré-requisitos

- Domínio apontando para o IP da VPS (A Record)
- Nginx instalado e configurado (Capítulo 04)
- Certbot instalado

---

## 5.2. Configurar DNS

No painel do seu provedor de domínio, crie os seguintes registros:

| Tipo | Nome | Valor |
|------|------|-------|
| A | @ | IP_DA_SUA_VPS |
| A | www | IP_DA_SUA_VPS |

### Exemplos de provedores

| Provedor | Painel de DNS |
|----------|---------------|
| **Cloudflare** | cloudflare.com → DNS |
| **GoDaddy** | godaddy.com → DNS Management |
| **Namecheap** | namecheap.com → Advanced DNS |
| **Registro.br** | registro.br → Zones |

### Verificar propagação

```bash
# Usar dig para verificar
dig seudominio.com.br A

# Ou usar nslookup
nslookup seudominio.com.br
```

> ⏱️ A propagação pode levar de minutos a 24 horas. Use [dnschecker.org](https://dnschecker.org) para acompanhar.

---

## 5.3. Gerar Certificado SSL

```bash
# Gerar certificado (substitua pelo seu domínio)
sudo certbot --nginx -d seudominio.com.br -d www.seudominio.com.br
```

Siga as instruções interativas:

```
Enter email address: (seu-email@dominio.com)
- Please read the Terms of Service at: (A)gree/(C)ancel: A
- Would you like to run a test? (Y)es/(N)o: N (ou Y para testar)
- How would you like to choose the redirect?:
  1: No redirect - Make no further changes to the webserver configuration.
  2: Redirect - Make all requests redirect to secure HTTPS access.
  
  Selecione: 2 (Redirect HTTP to HTTPS)
```

---

## 5.4. Verificar Certificado

```bash
# Listar certificados
sudo certbot certificates

# Detalhes de um certificado específico
sudo certbot certificates -d seudominio.com.br
```

Saída esperada:
```
Certificate Name: seudominio.com.br
  Serial Number: 03a1b2c3d4e5...
  Key Type: RSA
  Domains: seudominio.com.br www.seudominio.com.br
  Expiry: 2024-XX-XX (89 days)
  Certificate Path: /etc/letsencrypt/live/seudominio.com.br/fullchain.pem
  Private Key Path: /etc/letsencrypt/live/seudominio.com.br/privkey.pem
```

---

## 5.5. Renovação Automática

O Certbot configura renovação automática por padrão. Teste:

```bash
# Simular renovação (dry run)
sudo certbot renew --dry-run
```

### Verificar cronjob de renovação

```bash
# Listar tarefas agendadas do certbot
sudo systemctl list-timers | grep certbot

# Ver logs de renovação
sudo journalctl -u certbot.timer -f
```

### Renovação manual (se necessário)

```bash
# Forçar renovação (apenas se próximo do vencimento)
sudo certbot renew
sudo systemctl reload nginx
```

---

## 5.6. Configuração HTTPS no Nginx

O Certbot modifica automaticamente o arquivo de configuração. Verifique:

```bash
sudo cat /etc/nginx/sites-enabled/hub-conexao
```

Deve conter seções como:

```nginx
listen 443 ssl http2;
server_name seudominio.com.br;

ssl_certificate /etc/letsencrypt/live/seudominio.com.br/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/seudominio.com.br/privkey.pem;
```

E um redirect de HTTP para HTTPS:

```nginx
server {
    listen 80;
    server_name seudominio.com.br www.seudominio.com.br;
    return 301 https://$server_name$request_uri;
}
```

---

## 5.7. Testar HTTPS

```bash
# Verificar se HTTPS funciona
curl -I https://seudominio.com.br

# Verificar certificado
curl -I -v https://seudominio.com.br 2>&1 | grep -E "SSL|TLS|certificate"

# Testar com testssl.sh (se instalado)
testssl.sh seudominio.com.br
```

Acesse no navegador:
- 🔒 https://seudominio.com.br
- O cadeado deve estar verde

---

## 5.8. Forçar HTTPS no Código (Opcional)

No Supabase, configure o Site URL com HTTPS:

1. Vá no painel Supabase → **Authentication** → **Settings**
2. Atualize **Site URL** para `https://seudominio.com.br`
3. Adicione em **Redirect URLs**:
   - `https://seudominio.com.br/auth/callback`
   - `https://seudominio.com.br/`

---

## Checklist de Conclusão

- [ ] DNS configurado (A Record para @ e www)
- [ ] Domínio propagado e acessível
- [ ] Certbot instalado
- [ ] Certificado SSL gerado
- [ ] Redirect HTTP → HTTPS funcionando
- [ ] Renovação automática configurada
- [ ] HTTPS acessível no navegador (cadeado verde)
- [ ] Site URL do Supabase atualizado para HTTPS

---

## Troubleshooting

### "Failed to connect to external host"

O domínio ainda não propagou. Aguarde ou verifique as configurações DNS.

### "The certificate is not trusted"

O certificado Let's Encrypt é válido e confiável. Atualize o navegador.

### " Too many requests"

Você excedeu o limite de emissões. Aguarde 1 hora e tente novamente.

### Renovação automática não funciona

Verifique o cron:
```bash
sudo systemctl status certbot.timer
sudo systemctl status certbot.service
```

---

## Próximo Passo

Avance para **[Capítulo 06: Atualizações e Deploy](./06-atualizacoes-deploy.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-VPS-NGINX.md)*