# 📘 Manual de Deploy e Teste de Features (Iniciante)

Este guia explica como testar novas funcionalidades na sua VPS sem correr o risco de quebrar o site principal que já está no ar.

---

## 🏗️ 1. Entendendo os "Lugares"
Antes de começar, entenda a diferença entre as duas ferramentas que usamos:
*   **GitHub**: Guarda o seu **código** (os arquivos `.tsx`, `.css`, `.json`). É onde ficam as "receitas".
*   **Docker Hub / Docker Image**: É o **pacote pronto** (o bolo já assado). É o que o servidor (VPS) usa para rodar o site.

---

## 💻 2. No seu Computador (Desenvolvimento)

Sempre que você quiser fazer uma mudança grande, siga estes passos no terminal do seu computador (VS Code ou terminal local):

### A. Criar uma "Pasta Separada" (Branch)
Nunca trabalhe direto na `main`. No nosso caso, criamos esta branch:
```bash
git checkout -b feat/primeiro-acesso
```

### B. Salvar o Trabalho (Commit)
Após fazer as alterações, salve-as localmente:
```bash
git add .
git commit -m "feat: arquitetura limpa e fluxo de primeiro acesso finalizados"
```

### C. Enviar para a Nuvem (GitHub)
Envie essa branch para o GitHub:
```bash
git push origin feat/primeiro-acesso
```

---

## 🖥️ 3. Na sua VPS (Servidor)

Agora você vai entrar no terminal da sua VPS (letras pretas e brancas) para preparar a versão de teste.

### A. Atualizar o código na VPS
Entre na pasta do projeto e baixe as novidades do GitHub:
```bash
cd /root/conexao-hub-main
git fetch origin
git checkout feat/primeiro-acesso
git pull origin feat/primeiro-acesso
```

### B. Criar a Imagem de Teste (Build)
Use o comando **exato** abaixo para construir a imagem. Ele já inclui as suas chaves e desativa o modo de teste:

```bash
docker build \
  --build-arg VITE_SUPABASE_URL="https://fzsgljiqxxopwwogwspd.supabase.co" \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6c2dsamlxeHhvcHd3b2d3c3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzY1NTAsImV4cCI6MjA4Njg1MjU1MH0.BJIvW3ee33tnu9pEcMwUOsnn_37N1xwl-1xomN7z2LY" \
  --build-arg VITE_GEMINI_API_KEY="AIzaSyC_fyabrwoDhRR_1Trh-mSLaNbyJo33FNw" \
  --build-arg VITE_ENABLE_MOCK_MODE=false \
  -t hevertonperes/conexao-hub:primeiro-acesso .
```
*Dica: O `:primeiro-acesso` é uma "tag". Ela garante que você não vai apagar a imagem oficial.*

---

## 🚢 4. No Portainer (Publicação)

Agora vamos dizer ao Docker Swarm para usar essa imagem de teste.

1.  Abra o **Portainer** e vá em **Stacks**.
2.  Clique na sua Stack e vá no **Web Editor**.
3.  Localize a linha que começa com `image: hevertonperes/conexao-hub...`.
4.  Mude para: `image: hevertonperes/conexao-hub:primeiro-acesso`.
5.  Clique em **Update the stack**.

---

## 🛡️ 5. Segurança: Como Reverter (Rollback)

Se você abrir o site e algo estiver errado (como a tela preta), não entre em pânico. Siga este passo para voltar ao normal:

1.  Volte no **Web Editor** do Portainer.
2.  Mude a imagem de volta para a original (que estava antes): `image: hevertonperes/conexao-hub:latest`.
3.  Clique em **Update the stack**.
4.  O site antigo volta a funcionar em segundos.

---

## ✅ 6. Quando o Teste der Certo?
Se tudo estiver perfeito na imagem de teste, você pode:
1.  Fazer o **Merge** no GitHub (unir a branch `feat/primeiro-acesso` com a `main`).
2.  Na VPS, voltar para a branch `main`: `git checkout main` e depois `git pull`.
3.  Fazer o build oficial: `docker build -t hevertonperes/conexao-hub:latest .`.
4.  No Portainer, voltar a imagem para `:latest`.

---
*Manual finalizado com dados reais de produção.*
