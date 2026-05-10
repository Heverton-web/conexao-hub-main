# 🚀 Deploy em VPS via Portainer & Docker Hub

Guia oficial e definitivo de implantação da plataforma **Conexão Hub** em VPS utilizando Docker Swarm, Traefik (SSL automático) e Portainer.

---

## 📋 Pré-requisitos

| Item | Status necessário |
|---|---|
| Docker + Docker Swarm | Instalado e ativo |
| Portainer | Rodando na VPS |
| Traefik | Rodando, gerenciando a rede `network_conexao` |
| Domínio | Apontado para IP da VPS |
| Cloudflare | **Nuvenzinha CINZA** (DNS Only, sem proxy) |
| Conta Docker Hub | `hevertonperes` com acesso à imagem |

> ⚠️ **Segurança:** Nunca salve chaves reais neste arquivo. Guarde o comando de build em um bloco de notas local e seguro.

---

## 🛠️ PARTE 1: Build e Push da Imagem (na VPS via SSH)

### Passo 1 — Entrar na VPS e atualizar o código

```bash
# Conecte-se via SSH
ssh root@ip-da-vps

# Acesse a pasta do projeto (clone se necessário)
cd ~/conexao-hub-main
git pull origin main
```

### Passo 2 — Fazer login no Docker Hub

```bash
docker login -u hevertonperes
# Digite sua senha quando solicitado
```

### Passo 3 — Build da imagem com injeção de variáveis

> ⚠️ Substitua os valores `"..."` pelas suas chaves reais. O `MOCK_MODE` deve ser **sempre `false`** em produção.

```bash
docker build \
  --build-arg VITE_SUPABASE_URL="https://[sua-url].supabase.co" \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbG..." \
  --build-arg VITE_GEMINI_API_KEY="AIzaSy..." \
  --build-arg VITE_ENABLE_MOCK_MODE=false \
  -t hevertonperes/conexao-hub:latest .
```

**Por que isso é necessário?**
O Conexão Hub é uma aplicação React compilada (Vite). As variáveis de ambiente são "assadas" dentro do código durante o build — não podem ser passadas em tempo de execução. É por isso que o build deve ser feito com as chaves reais.

### Passo 4 — Enviar a imagem nova para o Docker Hub

```bash
docker push hevertonperes/conexao-hub:latest
```

Aguarde todas as camadas serem enviadas. Ao final aparecerá `latest: digest: sha256:...`.

---

## 🖥️ PARTE 2: Atualizar a Stack no Portainer

> **Este passo é obrigatório para que a VPS use a imagem nova.**

### Passo 5 — Acessar o Portainer

Abra no navegador: `https://portainer.vpsconexao.org` (ou o endereço do seu Portainer).

### Passo 6 — Navegar até a Stack

1. No menu lateral, clique em **Stacks**.
2. Localize a stack chamada **`hub-conexao`** e clique nela.

### Passo 7 — Abrir o Editor da Stack

1. Clique na aba **Editor** (no topo da página da Stack).
2. Apague todo o conteúdo atual da caixa de texto.
3. Cole o conteúdo abaixo **exatamente como está** (ele já tem as configurações de HTTPS e redirecionamento automático):

```yaml
services:

  app:
    image: hevertonperes/conexao-hub:latest

    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
      resources:
        limits:
          cpus: "1"
          memory: 1024M

    networks:
      - network_conexao

    environment:
      - NODE_ENV=production
      - TZ=America/Sao_Paulo

    labels:
      - "traefik.enable=true"
      # Roteador HTTPS (seguro)
      - "traefik.http.routers.conexao_hub.rule=Host(`hub.vpsconexao.org`)"
      - "traefik.http.routers.conexao_hub.entrypoints=websecure"
      - "traefik.http.routers.conexao_hub.tls.certresolver=letsencryptresolver"
      # Redirecionamento automático HTTP → HTTPS
      - "traefik.http.routers.conexao_hub_http.rule=Host(`hub.vpsconexao.org`)"
      - "traefik.http.routers.conexao_hub_http.entrypoints=web"
      - "traefik.http.routers.conexao_hub_http.middlewares=conexao_redirect"
      - "traefik.http.middlewares.conexao_redirect.redirectscheme.scheme=https"
      # Porta interna do container
      - "traefik.http.services.conexao_hub.loadbalancer.server.port=80"

networks:
  network_conexao:
    external: true
    name: network_conexao
```

### Passo 8 — Ativar o Re-pull e Atualizar

1. Role a página até o final.
2. ✅ **Marque a opção** `Re-pull image and redeploy` (isso força baixar a imagem nova que você enviou no Passo 4).
3. Clique no botão azul **`Update the stack`**.
4. Aguarde o Portainer reiniciar o container (leva de 30 a 60 segundos).

---

## ✅ Como verificar que funcionou

Após a atualização:

1. Abra uma **aba anônima** no navegador (Ctrl+Shift+N).
2. Acesse `http://hub.vpsconexao.org` (sem HTTPS).
3. O navegador deve **redirecionar automaticamente** para `https://hub.vpsconexao.org`.
4. O **cadeado de segurança** deve aparecer na barra de endereços.
5. A tela de login deve exibir a **logo oficial** e o nome **"Conexão"** com as cores corretas (azul marinho + dourado).

---

## 🔄 Fluxo de Atualização (Resumo para o dia a dia)

```
1. Alterar código → git push origin main
2. Na VPS: git pull → docker build [...] → docker push
3. No Portainer: Stack → Editor → colar yaml → ✅ Re-pull → Update
```

---

## 🔍 Diagnóstico Rápido de Problemas

| Sintoma | Causa | Solução |
|---|---|---|
| Logo "HU" em vez do globo | Imagem antiga no Portainer | Marcar `Re-pull image` e atualizar Stack |
| "Não Seguro" no navegador | HTTP não redireciona para HTTPS | Colar o YAML atualizado com labels de redirecionamento |
| Tela em branco | `MOCK_MODE=true` ou variáveis erradas | Refazer o build com `MOCK_MODE=false` e chaves corretas |
| Certificado inválido | Cloudflare em modo proxy (laranja) | Mudar Cloudflare para DNS Only (nuvem cinza) |

---

**Powered by Conexão Hub Team** 🚀
