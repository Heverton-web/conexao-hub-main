# 🚀 Deploy em VPS via Portainer & Docker Hub

Este guia descreve o método oficial e profissional de implantação da plataforma **Conexão Hub** em uma VPS utilizando Docker Swarm, Traefik, Docker Hub e a interface visual do Portainer.

---

## 📋 Pré-requisitos

1.  **Servidor VPS:** Com Docker, Docker Swarm e Portainer instalados.
2.  **Proxy Reverso:** Traefik rodando e gerenciando a rede `network_conexao`.
3.  **Domínio:** Apontado para o IP da sua VPS (Ex: `hub.vpsconexao.org`) e SEM proxy da Cloudflare ativo ("Nuvenzinha Cinza").
4.  **Conta no Docker Hub:** Para armazenar a imagem compilada da plataforma.

---

## 🛠️ Passo a Passo (O Caminho do Super Admin)

### Passo 1: Construção da Imagem e Injeção de Variáveis
Como o Conexão Hub é uma aplicação React (Vite), as chaves do Supabase devem ser injetadas **durante a compilação**. Faça isso no terminal de uma máquina com acesso ao código (pode ser a própria VPS):

1. Acesse o servidor e baixe/atualize o projeto:
```bash
git clone https://github.com/Heverton-web/conexao-hub-main.git
cd conexao-hub-main
```

2. Autentique-se no Docker Hub:
```bash
docker login -u seu_usuario
```

3. Execute o Build injetando as variáveis (substitua pelos valores reais):
```bash
docker build \
  --build-arg VITE_SUPABASE_URL="https://sua-url-aqui.supabase.co" \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="sua-chave-aqui" \
  -t seu_usuario/conexao-hub:latest .
```

4. Envie a imagem compilada para o Docker Hub:
```bash
docker push seu_usuario/conexao-hub:latest
```

### Passo 2: Criação da Stack no Portainer
Agora que a imagem está no Docker Hub, o Portainer consegue gerenciá-la perfeitamente.

1. Abra o **Portainer** e acesse a aba **Stacks**.
2. Clique em **+ Add stack**.
3. Defina o nome como `hub-conexao`.
4. Em *Build method*, escolha **Web editor**.
5. Cole todo o conteúdo do seu arquivo `docker-compose.yml`.
6. Certifique-se de que a tag `image:` no arquivo aponta para o seu usuário do Docker Hub (ex: `image: hevertonperes/conexao-hub:latest`).
7. Clique em **Deploy the stack**.

---

## 🔄 Como Atualizar o Sistema (Redeploy)
Sempre que o código fonte for alterado, siga este fluxo de atualização:

1. **Terminal:** Repita o comando de `docker build` do Passo 1 para gerar uma nova imagem atualizada com o seu código novo.
2. **Terminal:** Repita o `docker push` para enviar a nova versão ao Docker Hub.
3. **Portainer:** Acesse a stack `hub-conexao`, clique na aba **Editor**. Role até o final, marque a opção **"Re-pull image and redeploy"** e clique no botão azul **"Update the stack"**.

O sistema será atualizado em poucos segundos, sem tempo de inatividade prolongado!

---
**Powered by Conexão Hub Team**
