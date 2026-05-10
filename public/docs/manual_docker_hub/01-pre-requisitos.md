# 📋 Módulo 01: Pré-requisitos

Antes de iniciar a instalação da plataforma Hub, você precisa garantir que seu servidor (VPS) ou máquina local tenha as ferramentas necessárias.

## 1. Sistema Operacional Recomendado
- Ubuntu 22.04 LTS ou superior.
- Debian 11 ou superior.
- CentOS/RHEL 9.

## 2. Ferramentas Necessárias
Você deve ter o **Docker** e o **Docker Compose** instalados.

### Instalando no Linux (Comando Rápido):
```bash
# Baixar script oficial de instalação
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verificar instalação
docker --version
docker compose version
```

## 3. Infraestrutura de Rede (VPS)
Como o projeto utiliza uma rede externa para integração (Ex: Traefik), você deve garantir que a rede `network_conexao` exista no seu Docker Host:

```bash
docker network create network_conexao
```


## 3. Conectividade
Certifique-se de que as seguintes portas estão abertas no seu Firewall (UFW/AWS Security Groups):
- **8080**: Porta padrão da aplicação (pode ser alterada no docker-compose).
- **80/443**: Se for usar um Proxy Reverso com HTTPS futuramente.
