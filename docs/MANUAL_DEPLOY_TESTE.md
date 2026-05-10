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
```powershell
git checkout -b feat/primeiro-acesso
```

### B. Salvar o Trabalho (Commit)
Após fazer as alterações, salve-as localmente:
```powershell
git add .
git commit -m "feat: arquitetura limpa e fluxo de primeiro acesso finalizados"
```

### C. Enviar para a Nuvem (GitHub)
Envie essa branch para o GitHub:
```powershell
git push origin feat/primeiro-acesso
```

---

## 🖥️ 3. Na sua VPS (Servidor)

Agora você vai entrar no terminal da sua VPS (letras pretas e brancas) para preparar a versão de teste.

### A. Atualizar o código na VPS
Entre na pasta do projeto e baixe as novidades do GitHub:
```bash
cd conexao-hub-main
git fetch origin
git checkout feat/primeiro-acesso
```

### B. Criar a Imagem de Teste (Build)
Como o projeto usa variáveis de ambiente para o Supabase, você **precisa** passá-las no comando de build. Use o comando `--no-cache` para garantir que o Docker não use erros antigos:

```bash
docker build --no-cache \
  --build-arg VITE_SUPABASE_URL="SUA_URL_DO_SUPABASE" \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="SUA_CHAVE_PUBLISHABLE" \
  -t hevertonperes/conexao-hub:teste-arquitetura .
```
*Dica: O `:teste-arquitetura` é uma "tag". Ela garante que você não vai apagar a imagem que está rodando no site oficial.*

---

## 🚢 4. No Portainer (Publicação)

Agora vamos dizer ao Docker Swarm para usar essa imagem de teste.

1.  Abra o **Portainer** e vá em **Stacks**.
2.  Clique na sua Stack e vá no **Web Editor**.
3.  Localize a linha que começa com `image: hevertonperes/conexao-hub...`.
4.  Mude para: `image: hevertonperes/conexao-hub:teste-arquitetura`.
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
*Manual atualizado por Antigravity em 2026 para a Feature de Primeiro Acesso.*
