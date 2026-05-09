# Capítulo 06: Atualizações e Deploy

## Objetivo

Configurar mecanismos para atualizar a aplicação de forma manual ou automática.

---

## 6.1. Atualização Manual

Sempre que houver alterações no código, execute:

```bash
# Ir para o diretório do projeto
cd /var/www/hub-conexao

# Verificar status do git
git status

# Baixar últimas alterações
git pull origin main

# Se mudou de branch
git checkout main && git pull

# Reinstalar dependências (se mudou package.json)
npm install

# Fazer build
npm run build

# O Nginx serve os novos arquivos automaticamente
```

---

## 6.2. Script de Deploy Automatizado

Crie um script para facilitar atualizações:

```bash
# Criar script
nano /var/www/deploy.sh
```

Cole o conteúdo:

```bash
#!/bin/bash

# ===========================================
# Script de Deploy - Hub Conexão
# ===========================================

set -e  # Sair em caso de erro

echo "========================================="
echo "🚀 Iniciando deploy do Hub Conexão"
echo "========================================="

# Definir variáveis
PROJECT_DIR="/var/www/hub-conexao"
BRANCH="main"

# Mudar para diretório do projeto
cd "$PROJECT_DIR"

# Verificar se há alterações pendentes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Alterações locais detectadas"
fi

# Buscar últimas alterações
echo "📥 Baixando alterações do Git..."
git fetch origin

# Verificar diferença com branch remota
git diff HEAD origin/$BRANCH --stat || true

# Aplicar alterações
echo "🔄 Aplicando alterações..."
git pull origin $BRANCH

# Verificar se package.json mudou
if [ package.json -nt node_modules ]; then
    echo "📦 package.json alterado, instalando dependências..."
    npm install
fi

# Fazer build
echo "🔨 Fazendo build..."
npm run build

echo "========================================="
echo "✅ Deploy concluído com sucesso!"
echo "========================================="
echo ""
echo "O site já está atualizado e acessível."
echo "Tempo: $(date)"
```

Tornar executável:

```bash
chmod +x /var/www/deploy.sh
```

### Usar o script

```bash
# Executar como qualquer usuário
/var/www/deploy.sh

# Ou como root
sudo /var/www/deploy.sh

# Como usuário deploy
sudo -u deploy /var/www/deploy.sh
```

---

## 6.3. Deploy Automático via GitHub Webhook

Para atualizar automaticamente ao dar push no GitHub:

### Passo 1: Criar endpoint de webhook na VPS

```bash
# Instalar ferramenta de webhook
apt install -y webhook

# Criar diretório para webhooks
mkdir -p /var/webhook
cd /var/webhook

# Criar script de deploy
nano deploy-hook.sh
```

```bash
#!/bin/bash
echo "📦 Recebido webhook do GitHub"
cd /var/www/hub-conexao
git pull origin main
npm install
npm run build
echo "✅ Deploy via webhook concluído"
```

```bash
chmod +x deploy-hook.sh
```

### Passo 2: Criar configuração do webhook

```bash
nano /var/webhook/hook.json
```

```json
[
  {
    "id": "deploy-hub-conexao",
    "execute-command": "/var/webhook/deploy-hook.sh",
    "command-working-directory": "/var/www/hub-conexao",
    "pass-arguments-to-command": [
      {
        "source": "payload",
        "name": "ref"
      },
      {
        "source": "payload",
        "name": "repository"
      }
    ],
    "trigger-rule": {
      "match": {
        "type": "value",
        "value": "SEU_SECRET_AQUI",
        "secret": {
          "source": "header",
          "name": "X-Hub-Signature-256"
        }
      }
    }
  }
]
```

### Passo 3: Iniciar o serviço

```bash
# Criar serviço systemd
nano /etc/systemd/system/webhook.service
```

```ini
[Unit]
Description=GitHub Webhook for Hub Conexão
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/webhook -hooks /var/webhook/hook.json -port 9000
Restart=always
User=root

[Install]
WantedBy=multi-user.target
```

```bash
# Ativar e iniciar
systemctl daemon-reload
systemctl enable webhook
systemctl start webhook

# Ver status
systemctl status webhook
```

### Passo 4: Configurar Firewall

```bash
# Permitir porta 9000
ufw allow 9000/tcp

# Ou se usar apenas nginx como proxy
# Não precisa abrir porta adicional
```

### Passo 5: Adicionar webhook no GitHub

1. Acesse **Settings → Webhooks** no seu repositório
2. Clique em **Add webhook**
3. Configure:
   - **Payload URL**: `https://seudominio.com.br:9000/hooks/deploy-hub-conexao`
   - **Content type**: `application/json`
   - **Secret**: `SEU_SECRET_AQUI`
   - **Events**: Just the `push` event

### Alternativa: Webhook via Nginx

Se não quiser abrir porta adicional, use o Nginx como proxy:

```nginx
server {
    listen 443 ssl;
    server_name seudominio.com.br;
    
    location /webhook/ {
        proxy_pass http://127.0.0.1:9000/;
    }
}
```

---

## 6.4. Estratégias de Deploy Avançadas

### Blue-Green Deploy

Mantenha duas versões e troque o apontamento:

```bash
# Clonar em diretório alternativo
cd /var/www
git clone https://github.com/... hub-conexao-v2
cd hub-conexao-v2
npm install && npm run build

# Criar link simbólico alternativo
ln -s /var/www/hub-conexao-v2/dist /var/www/hub-conexao-next
ln -s /var/www/hub-conexao/dist /var/www/hub-conexao-current

# Trocar apenas alterando root no Nginx
#零 downtime
```

### Deploy com Docker (Opcional)

Se preferir usar Docker:

```bash
# Criar Dockerfile
nano /var/www/hub-conexao/Dockerfile
```

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 6.5. Monitoramento de Deploy

Adicione notificação após deploy:

```bash
# Adicionar ao final do deploy.sh
if [ -f "$PROJECT_DIR/deploy-notify.sh" ]; then
    bash "$PROJECT_DIR/deploy-notify.sh"
fi
```

Exemplo de notificação Slack:

```bash
#!/bin/bash
# deploy-notify.sh
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"✅ Deploy concluído: Hub Conexão"}' \
  https://hooks.slack.com/services/SEU/WEBHOOK/AQUI
```

---

## Checklist de Conclusão

- [ ] Atualização manual funciona (`git pull && npm run build`)
- [ ] Script de deploy `/var/www/deploy.sh` criado e testado
- [ ] Deploy via webhook configurado (opcional)
- [ ] Notificações funcionando (opcional)
- [ ] Backup do banco feito antes de updates grandes

---

## Troubleshooting

### "error: failed to push some refs"

Resolver conflitos:
```bash
git status
git diff
# Resolva manualmente
git add .
git commit -m "Merge"
git push
```

### Build falha após pull

```bash
# Limpar e reinstallar
rm -rf node_modules
npm install
npm run build
```

### Nginx não mostra novos arquivos

```bash
# Limpar cache do Nginx
sudo nginx -s reload
# ou
sudo systemctl restart nginx
```

---

## Próximo Passo

Avance para **[Capítulo 07: Monitoramento e Manutenção](./07-monitoramento-manutencao.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-VPS-NGINX.md)*