# Capítulo 02: Instalação do Docker

## Objetivo

Instalar e configurar o Docker Engine e Docker Compose na VPS.

---

## 2.1. Remover Versões Antigas

```bash
# Remover versões antigas do Docker
apt remove -y docker docker-engine docker.io containerd runc

# Limpar apt cache
apt autoremove -y
```

---

## 2.2. Instalar Pré-requisitos

```bash
# Atualizar índice de pacotes
apt update

# Instalar pacotes necessários
apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

---

## 2.3. Adicionar Repositório Docker

```bash
# Criar diretório para chave GPG
install -m 0755 -d /etc/apt/keyrings

# Baixar chave GPG do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Definir permissões
chmod a+r /etc/apt/keyrings/docker.gpg

# Adicionar repositório
echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
```

---

## 2.4. Instalar Docker Engine

```bash
# Atualizar índices de pacotes
apt update

# Instalar Docker Engine
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verificar versão
docker --version
docker compose version
```

---

## 2.5. Iniciar e Habilitar Docker

```bash
# Iniciar serviço Docker
systemctl start docker

# Habilitar inicialização automática
systemctl enable docker

# Verificar status
systemctl status docker
```

---

## 2.6. Configurar Docker para Usuário Deploy

```bash
# Adicionar usuário deploy ao grupo docker
usermod -aG docker deploy

# Verificar se funciona sem sudo
su - deploy
docker ps
exit
```

---

## 2.7. Configurar Docker Daemon

Crie o arquivo `/etc/docker/daemon.json`:

```bash
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "live-restore": true,
  "default-address-pools": [
    {
      "base": "172.17.0.0/12",
      "size": 24
    }
  ]
}
EOF

# Reiniciar Docker
systemctl restart docker
```

---

## 2.8. Criar Redes Docker

```bash
# Criar rede para a aplicação
docker network create -d overlay --attachable app-network

# Listar redes
docker network ls
```

---

## 2.9. Instalar Docker Compose Standalone (Opcional)

Se preferir ter o Docker Compose como comando separado:

```bash
# Baixar versão mais recente
curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Tornar executável
chmod +x /usr/local/bin/docker-compose

# Criar link simbólico
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Verificar
docker-compose --version
```

---

## 2.10. Teste do Docker

```bash
# Testar com container hello-world
docker run --rm hello-world

# Ver containers
docker ps -a
```

---

## 2.11. Limitar Recursos (Recomendado)

Adicione ao `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "live-restore": true,
  "default-address-pools": [
    {
      "base": "172.17.0.0/12",
      "size": 24
    }
  ],
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  }
}
```

Reinicie o Docker:

```bash
systemctl restart docker
```

---

## Checklist de Conclusão

- [ ] Docker Engine instalado
- [ ] Docker Compose instalado
- [ ] Docker funcionando
- [ ] Usuário deploy com acesso ao Docker
- [ ] Rede criada para aplicação
- [ ] Teste com hello-world passou

---

## Próximo Passo

Avance para **[Capítulo 03: Docker Swarm](./03-docker-swarm.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-DOCKER-SWARM.md)*