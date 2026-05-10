# 🚀 Deploy em VPS via Git & Docker

Este guia descreve o método profissional de implantação da plataforma **Conexão Hub** em uma VPS, utilizando o Git para sincronização e o Docker para execução.

---

## 📋 Pré-requisitos

1.  **Servidor VPS:** Com Ubuntu 22.04 LTS ou superior (recomendado).
2.  **Docker & Docker Compose:** Instalados no servidor.
3.  **Domínio:** Apontado para o IP da sua VPS.
4.  **Chaves Supabase:** URL e Anon Key prontas.

---

## 🛠️ Passo a Passo

### 1. Clonando o Repositório
Acesse sua VPS via SSH e execute o comando para baixar a versão mais recente do projeto:

```bash
git clone https://github.com/Heverton-web/conexao-hub-main.git
cd conexao-hub-main
```

### 2. Configurando o Ambiente
Crie o arquivo de variáveis de ambiente a partir do exemplo:

```bash
cp .env.example .env
nano .env
```
**Dentro do arquivo, insira suas credenciais:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY` (Opcional)

### 3. Iniciando o Docker
Execute o comando de build e inicialização. O Docker irá baixar as imagens necessárias e compilar o seu código para produção:

```bash
docker compose up -d --build
```

### 4. Verificando o Status
Certifique-se de que o container está rodando:

```bash
docker ps
```
Você deverá ver o container `conexao_hub_app` com o status "Up".

---

## 🔄 Como Atualizar o Sistema
Sempre que fizermos alterações no código e enviarmos para o GitHub, você pode atualizar sua VPS em segundos:

```bash
# 1. Baixa as novidades
git pull origin main

# 2. Reconstrói apenas o necessário e reinicia
docker compose up -d --build
```

---

## 🔒 Segurança e SSL
O sistema está pré-configurado para trabalhar com o **Traefik**. Certifique-se de que o Traefik está rodando na sua VPS na rede `network_conexao`. Ele gerará o certificado SSL (HTTPS) automaticamente para o seu domínio.

---
**Powered by Conexão Hub Team**
