# Capítulo 01: Preparação da VPS (Contabo)

## Objetivo

Configurar e preparar a instância VPS na Contabo para receber o deploy da aplicação.

---

## 1.1. Criar Conta na Contabo

1. Acesse [contabo.com](https://contabo.com)
2. Clique em **Sign Up** / **Criar Conta**
3. Preencha os dados pessoais
4. Complete a verificação de e-mail
5. Faça a verificação de identidade (KYC)

---

## 1.2. Criar Instância VPS

### Configuração Recomendada (1000 usuários)

| Recurso | Especificação |
|---------|---------------|
| **Modelo** | Cloud VPS S |
| **vCPU** | 4 vCPU |
| **RAM** | 8 GB |
| **SSD** | 200 GB |
| **Rede** | 1 IPv4 pública |
| **Sistema** | Ubuntu 22.04 LTS |

### Passos no Painel Contabo:

1. Faça login no [Painel Contabo](https://my.contabo.com)
2. Vá em **Compute → VPS**
3. Clique em **Create VPS**
4. Selecione:
   - **Location**: Frankfurt (ou mais próximo de você)
   - **Image**: Ubuntu 22.04 LTS
   - **Resources**: Cloud VPS S (8GB/4vCPU)
5. Configure:
   - **Hostname**: conexao-hub
   - **Password**: (defina uma senha forte)
6. Clique em **Create**

---

## 1.3. Acessar via SSH

### Windows (PowerShell ou Git Bash)

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
```

---

## 1.5. Configurar Hostname

```bash
# Definir hostname
hostnamectl set-hostname conexao-hub

# Verificar
hostname
```

Adicione ao `/etc/hosts`:

```bash
echo "127.0.1.1 conexao-hub" >> /etc/hosts
```

---

## 1.6. Configurar Firewall Básico

```bash
# Instalar UFW (Uncomplicated Firewall)
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

---

## 1.7. Criar Usuário para Deploy (Recomendado)

Não use root para deploy. Crie um usuário dedicado:

```bash
# Criar usuário
adduser deploy

# Adicionar ao grupo sudo
usermod -aG sudo deploy

# Adicionar ao grupo docker
usermod -aG docker deploy

# Copiar chave SSH (se usar chave)
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Testar login com novo usuário
ssh deploy@<SEU_IP_VPS>
```

---

## 1.8. Configurar Swap (Opcional)

Se quiser adicionar swap para evitar problemas de memória:

```bash
# Criar arquivo de swap de 4GB
fallocate -l 4G /swapfile

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

## 1.9. Configurar Timezone

```bash
# Definir timezone para São Paulo
timedatectl set-timezone America/Sao_Paulo

# Verificar
timedatectl
```

---

## 1.10. Instalação de Utilitários

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

## Checklist de Conclusão

- [ ] Conta Contabo criada
- [ ] VPS criada com Ubuntu 22.04
- [ ] Acesso SSH funcionando
- [ ] Sistema atualizado
- [ ] Firewall configurado
- [ ] Usuário deploy criado
- [ ] Timezone configurado

---

## Próximo Passo

Avance para **[Capítulo 02: Instalação Docker](./02-instalacao-docker.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-DOCKER-SWARM.md)*