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
Como o Conexão Hub é uma aplicação React (Vite), as configurações devem ser injetadas **durante a compilação**. 

⚠️ **Atenção:** Nunca salve as suas chaves reais neste manual, pois ele é público no GitHub! Guarde o comando abaixo em um bloco de notas seguro no seu computador.

Execute o Build no terminal (substituindo pelos valores reais):

```bash
docker build \
  --build-arg VITE_SUPABASE_URL="https://[sua-url].supabase.co" \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbG..." \
  --build-arg VITE_GEMINI_API_KEY="AIzaSy..." \
  --build-arg VITE_ENABLE_MOCK_MODE=false \
  -t seu_usuario/conexao-hub:latest .
```

**Explicando o Código:**
*   `--build-arg VITE_SUPABASE_URL`: Diz ao sistema onde o banco de dados Supabase mora.
*   `--build-arg VITE_SUPABASE_PUBLISHABLE_KEY`: A chave que dá permissão ao site para consultar os dados.
*   `--build-arg VITE_GEMINI_API_KEY`: Injeta a chave da Inteligência Artificial do Google para o chatbot e IA do sistema.
*   `--build-arg VITE_ENABLE_MOCK_MODE`: Se for `true`, o sistema não usará o banco de dados real e rodará dados de teste (modo simulação). Na VPS em produção, deixe sempre `false` ou omita essa linha.
*   `-t hevertonperes/conexao-hub:latest`: Etiqueta a imagem recém-criada com a sua identidade para enviarmos ao Armazém.

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
