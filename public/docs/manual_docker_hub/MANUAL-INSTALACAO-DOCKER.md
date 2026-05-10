# 🐋 Manual de Instalação Docker Hub (White Label)

Este manual descreve o processo completo de implantação da plataforma **Conexão Hub** utilizando Docker. Este método é o recomendado para produção, pois garante isolamento, segurança e facilidade de atualização.

## 📌 Visão Geral

A plataforma foi projetada para ser **White Label**. Ao subir o contêiner, o sistema detecta automaticamente se é uma nova instalação e solicita a criação do **Super Administrador**.

## 📂 Estrutura do Guia

Para facilitar a instalação, dividimos este manual nos seguintes módulos:

1.  **[01-Pre-requisitos](file:///docs/manual_docker_hub/01-pre-requisitos.md)**: Preparação do servidor (VPS) e instalação do Docker.
2.  **[02-Configuracao-Supabase](file:///docs/manual_docker_hub/02-configuracao-supabase.md)**: Preparando o backend antes do deploy.
3.  **[03-Variaveis-Ambiente](file:///docs/manual_docker_hub/03-variaveis-ambiente.md)**: Configurando o arquivo `.env`.
4.  **[04-Deploy-Primeiro-Passo](file:///docs/manual_docker_hub/04-deploy-primeiro-passo.md)**: Subindo os contêineres e verificando o status.
5.  **[05-Setup-Super-Admin](file:///docs/manual_docker_hub/05-setup-super-admin.md)**: Realizando a configuração inicial e primeiro login.
6.  **[06-Customizacao-White-Label](file:///docs/manual_docker_hub/06-customizacao-white-label.md)**: Personalizando logo, cores e nome.
7.  **[07-Troubleshooting](file:///docs/manual_docker_hub/07-troubleshooting.md)**: Solução de problemas comuns.

---

## 🚀 Início Rápido

Se você já tem o Docker instalado e as chaves do Supabase, siga estes 3 comandos:

```bash
# 1. Clone o repositório
git clone https://github.com/Heverton-web/conexao-hub-main.git
cd conexao-hub-main

# 2. Configure as variáveis
cp .env.example .env
nano .env # Insira suas chaves aqui

# 3. Suba a aplicação
docker compose up -d --build
```

Após isso, acesse `https://hub.vpsconexao.org` (ou seu domínio configurado) para realizar o setup inicial.


---
**Powered by Conexão Hub Team**
