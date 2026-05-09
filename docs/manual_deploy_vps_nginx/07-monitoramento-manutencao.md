# Capítulo 07: Monitoramento e Manutenção

## Objetivo

Configurar monitoramento, logging e rotinas de manutenção para garantir o funcionamento contínuo da aplicação.

---

## 7.1. Verificar Status dos Serviços

### Nginx

```bash
# Status do Nginx
systemctl status nginx

# Ver se está rodando
systemctl is-active nginx

# Ver tempo online
systemctl show nginx --property=ActiveEnterTimestamp
```

### Sistema

```bash
# Ver uso de recursos
htop

# Resumo rápido
uptime

# Memória
free -h

# Disco
df -h
```

---

## 7.2. Logs do Nginx

### Ver logs em tempo real

```bash
# Logs de acesso
tail -f /var/log/nginx/hub-conexao-access.log

# Logs de erro
tail -f /var/log/nginx/hub-conexao-error.log

# Todos os logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Analisar logs

```bash
# Ver últimos 100 acessos
tail -n 100 /var/log/nginx/hub-conexao-access.log

# Ver erros apenas
grep "error" /var/log/nginx/hub-conexao-error.log

# Ver IP específico
grep "192.168.1.1" /var/log/nginx/hub-conexao-access.log

# Contar requisições por IP
awk '{print $1}' /var/log/nginx/hub-conexao-access.log | sort | uniq -c | sort -rn | head -10
```

### Rotação de logs

```bash
# Ver configuração
cat /etc/logrotate.d/nginx
```

---

## 7.3. Reiniciar Serviços

```bash
# Reiniciar Nginx (troca config, mantém online)
systemctl reload nginx

# Reiniciar completamente (curto downtime)
systemctl restart nginx

# Parar
systemctl stop nginx

# Iniciar
systemctl start nginx
```

---

## 7.4. Firewall UFW

### Comandos básicos

```bash
# Ver status
ufw status verbose

# Ver regras numeradas
ufw status numbered

# Adicionar regra
ufw allow 22/tcp

# Remover regra (pelo número)
ufw delete 2

# Bloquear IP
ufw insert 1 deny from 192.168.1.100

# Ver logs do firewall
tail -f /var/log/ufw.log
```

### Regras recomendadas

```bash
# Políticas padrão
ufw default deny incoming
ufw default allow outgoing

# Permitir SSH (porta padrão)
ufw allow 22/tcp

# Permitir HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Denegar ping (opcional)
echo "1" > /proc/sys/net/ipv4/icmp_echo_ignore_all
```

---

## 7.5. Monitoramento com Uptime Robot (Opcional)

Para monitoramento externo gratuito:

1. Acesse [uptimerobot.com](https://uptimerobot.com)
2. Crie conta gratuita
3. Adicione novo monitor:
   - **Type**: HTTPS
   - **URL**: `https://seudominio.com.br`
   - **Interval**: 5 minutos
4. Configure alertas (email, Slack, etc.)

---

## 7.6. Backup do Supabase

### Exportar dados (via dashboard)

1. Vá em **Settings** → **Database**
2. Clique em **Download backup**

### Backup via API

```bash
# Usar pg_dump (requer credenciais)
pg_dump -h db.PROJECT_ID.supabase.co -U postgres -d postgres > backup.sql
```

> 📋 Anote as credenciais do Supabase em local seguro.

---

## 7.7. Atualizações de Segurança

### Atualizar sistema

```bash
# Atualizar pacotes de segurança
apt update && apt upgrade -y

# Ver atualizações disponíveis
apt list --upgradable

# Ver kernel
uname -r
```

### Atualizar Node.js

```bash
# Listar versões instaladas
nvm list

# Ver versão atual
node -v

# Instalar nova versão LTS
nvm install --lts

# Usar nova versão
nvm use lts/*

# Definir como padrão
nvm alias default lts/*

# Rebuild npm global packages
npm rebuild
```

### Atualizar Nginx

```bash
# Ver versão atual
nginx -v

# Atualizar
apt update && apt upgrade nginx

# Ver nova versão
nginx -v
```

---

## 7.8. Manutenção Programada

### Checklist mensal

- [ ] Verificar uso de disco (`df -h`)
- [ ] Verificar logs por erros (`grep -i error`)
- [ ] Testar backup do Supabase
- [ ] Atualizar pacotes de segurança
- [ ] Verificar validade do SSL (`certbot certificates`)
- [ ] Revisar usuários e permissões
- [ ] Testar restauração de backup

### Checklist trimestral

- [ ] Renovar certificado SSL (se não for automático)
- [ ] Avaliar recursos da VPS (upgrade se necessário)
- [ ] Revisar configuração do Nginx
- [ ] Atualizar documentação se necessário

---

## 7.9. Custo Mensal

| Item | Custo |
|------|-------|
| VPS (Contabo/Hetzner) | €4-5/mês |
| Domínio (opcional) | R$30-50/ano |
| Supabase Free | Grátis |
| **Total** | **€4-5/mês** |

---

## 7.10. Resource Monitor (Opcional)

Instalar ferramenta de monitoramento leve:

```bash
# Instalar Netdata (pesado) ou alternativas
# Ou usar monit

apt install monit

# Configurar
nano /etc/monit/monitrc
```

---

## Checklist de Conclusão

- [ ] Logs do Nginx configurados e acessíveis
- [ ] Firewall UFW ativo com regras corretas
- [ ] Rotina de backup do Supabase definida
- [ ] Atualizações de segurança agendadas
- [ ] Monitoramento externo configurado (opcional)
- [ ] Checklist de manutenção documentado

---

## Troubleshooting Comum

### Nginx retorna 502 Bad Gateway

```bash
# Verificar se Nginx está rodando
systemctl status nginx

# Ver logs de erro
tail -f /var/log/nginx/error.log
```

### Site lento

```bash
# Ver uso de recursos
htop

# Ver conexões ativas
netstat -an | grep :80 | wc -l

# Verificar logs de erro
grep -i "slow" /var/log/nginx/error.log
```

### SSL expirou

```bash
# Renovação manual
sudo certbot renew
sudo systemctl reload nginx
```

---

## Fim do Manual

Este é o último capítulo. Você completou o deploy completo do Hub Conexão!

### Resumo do que foi feito

1. ✅ Preparação da VPS (Ubuntu, SSH, firewall)
2. ✅ Configuração do Supabase (banco, auth, admin)
3. ✅ Clonagem e build do projeto
4. ✅ Configuração do Nginx (SPA fallback)
5. ✅ SSL com Let's Encrypt
6. ✅ Automação de deploy
7. ✅ Monitoramento e manutenção

---

*Retornar para [Índice](./MANUAL-DEPLOY-VPS-NGINX.md)*