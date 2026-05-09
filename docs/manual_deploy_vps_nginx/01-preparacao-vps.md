# Capítulo 01: Preparação da VPS

## Objetivo

Configurar e preparar a instância VPS para receber o deploy da aplicação Hub Conexão.

---

## 1.1. Criar Conta no Provedor de VPS

Escolha um dos provedores abaixo:

### Opções Recomendadas

| Provedor | Painel | Preço Aprox. | Link |
|----------|--------|--------------|------|
| **Contabo** | my.contabo.com | ~€5/mês | [contabo.com](https://contabo.com) |
| **Hetzner** | console.hetzner.cloud | ~€4/mês | [hetzner.com](https://hetzner.com) |
| **DigitalOcean** | cloud.digitalocean.com | $6/mês | [digitalocean.com](https://digitalocean.com) |
| **Hostinger** | hpanel.hostinger.com | ~€5/mês | [hostinger.com](https://hostinger.com) |
| **Vultr** | my.vultr.com | $6/mês | [vultr.com](https://vultr.com) |

### Passos Genéricos

1. Acesse o site do provedor escolhido
2. Clique em **Sign Up** / **Criar Conta**
3. Preencha os dados pessoais
4. Complete a verificação de e-mail
5. Faça a verificação de identidade (KYC) se necessário
6. Adicione um método de pagamento

---

## 1.2. Criar Instância VPS

### Configuração Mínima

| Recurso | Especificação Mínima | Recomendada |
|---------|---------------------|-------------|
| **Sistema** | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| **vCPU** | 1 vCPU | 2 vCPU |
| **RAM** | 1 GB | 2 GB |
| **SSD** | 20 GB | 40 GB |
| **Rede** | 1 IPv4 pública | 1 IPv4 pública |

### Passos no Painel (Exemplo Contabo)

1. Faça login no painel do provedor
2. Vá em **Compute → VPS**
3. Clique em **Create VPS**
4. Selecione:
   - **Location**: Frankfurt (ou região mais próxima)
   - **Image**: Ubuntu 22.04 LTS
   - **Resources**: Plano mínimo ou superior
5. Configure:
   - **Hostname**: conexao-hub
   - **Password**: (defina uma senha forte)
6. Clique em **Create**
7. **Anote o IP público** da VPS

---

## 1.3. Acessar via SSH

### Windows (PowerShell, Git Bash ou CMD)

```bash
ssh root@<SEU_IP_VPS>
```

Ou usando chave SSH:

```bash
ssh -i ~/.ssh/id_rsa root@<SEU_IP_VPS>
```

### Linux/Mac

```bash
ssh root@<SEU_IP_VPS>
```

### Primeiro Login - Alterar Senha Root

Ao acessar pela primeira vez, altere a senha:

```bash
passwd
```

---

## 1.4. Atualizar Sistema

Após conectar, execute:

```bash
# Atualizar lista de pacotes
apt update

# Atualizar pacotes existentes
apt upgrade -y

# Instalar atualizações de segurança
apt install -y unattended-upgrades

# Limpar pacotes desnecessários
apt autoremove -y

# Limpar cache
apt clean
```

---

## 1.5. Configurar Hostname

```bash
# Definir hostname
hostnamectl set-hostname conexao-hub

# Verificar
hostname

# Adicionar ao /etc/hosts
echo "127.0.1.1 conexao-hub" >> /etc/hosts
```

---

## 1.6. Configurar Timezone

```bash
# Definir timezone para São Paulo
timedatectl set-timezone America/Sao_Paulo

# Verificar
timedatectl
```

---

## 1.7. Instalar Utilitários Essenciais

```bash
# Instalar utilitários essenciais
apt install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    net-tools \
    unzip \
    zip \
    ca-certificates \
    gnupg \
    lsb-release
```

---

## 1.8. Criar Usuário para Deploy

Não use root para deploy. Crie um usuário dedicado:

```bash
# Criar usuário
adduser deploy

# Adicionar ao grupo sudo
usermod -aG sudo deploy

# Copiar chave SSH (se usar chave)
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Testar login com novo usuário (em nova sessão)
ssh deploy@<SEU_IP_VPS>
```

---

## 1.9. Configurar Firewall (UFW)

```bash
# Instalar UFW (se não estiver instalado)
apt install -y ufw

# Definir políticas padrão
ufw default deny incoming
ufw default allow outgoing

# Permitir SSH (cuidado para não bloquear!)
ufw allow 22/tcp

# Permitir HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Ativar firewall
ufw enable

# Verificar status
ufw status verbose
```

> ⚠️ **Atenção**: Se você estiver usando chave SSH na porta 22, certifique-se de que o acesso está funcionando antes de ativar o firewall.

---

## 1.10. Configurar Swap (Opcional)

Se a VPS tem pouca RAM, adicione swap:

```bash
# Criar arquivo de swap de 2GB
fallocate -l 2G /swapfile

# Definir permissões
chmod 600 /swapfile

# Formatar como swap
mkswap /swapfile

# Ativar swap
swapon /swapfile

# Adicionar ao fstab
echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab

# Verificar
swapon --show
free -h
```

---

## 1.11. Instalar Node.js via NVM

```bash
# Instalador como usuário root ou deploy
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Recarregar perfil
source ~/.bashrc

#Instalar Node.js LTS (versão mais recente)
nvm install --lts

# Definir como padrão
nvm alias default lts/*

# Verificar instalação
node -v   # deve mostrar v20.x ou v22.x
npm -v    # deve mostrar 10.x+
```

---

## 1.12. Instalar Nginx

```bash
# Instalar Nginx
apt install nginx -y

# Verificar se está rodando
systemctl status nginx

# Iniciar se não estiver
systemctl start nginx

# Habilitar inicialização automática
systemctl enable nginx
```

---

## 1.13. Instalar Git e Certbot

```bash
# Git (se ainda não instalou)
apt install git -y

# Certbot e plugin Nginx
apt install certbot python3-certbot-nginx -y

# Verificar versão
certbot --version
```

---

## Checklist de Conclusão

- [ ] Conta no provedor VPS criada
- [ ] VPS criada com Ubuntu 22.04/24.04
- [ ] IP público anotado
- [ ] Acesso SSH funcionando
- [ ] Sistema atualizado
- [ ] Hostname configurado
- [ ] Timezone definido (America/Sao_Paulo)
- [ ] Usuário "deploy" criado
- [ ] Firewall UFW configurado
- [ ] Node.js instalado via NVM
- [ ] Nginx instalado
- [ ] Git e Certbot instalados

---

## Próximo Passo

Avance para **[Capítulo 02: Configurar Supabase](./02-configurar-supabase.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-VPS-NGINX.md)*