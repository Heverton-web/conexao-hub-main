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
Nunca trabalhe direto na `main`. Crie uma branch para a sua nova ideia:
```powershell
git checkout -b nome-da-minha-ideia
```

### B. Salvar o Trabalho (Commit)
Após fazer as alterações, salve-as localmente:
```powershell
git add .
git commit -m "Explique aqui o que você mudou"
```

### C. Enviar para a Nuvem (GitHub)
Envie essa "pasta separada" para o GitHub:
```powershell
git push origin nome-da-minha-ideia
```

---

## 🖥️ 3. Na sua VPS (Servidor)

Agora você vai entrar no terminal da sua VPS (letras pretas e brancas) para preparar a versão de teste.

### A. Atualizar o código na VPS
Entre na pasta do projeto e baixe as novidades do GitHub:
```bash
cd /caminho/do/projeto
git fetch origin
git checkout nome-da-minha-ideia
```

### B. Criar a Imagem de Teste (Build)
Em vez de usar o nome padrão, vamos dar um "nome de teste" para essa imagem:
```bash
docker build -t hevertonperes/conexao-hub:teste-versao-1 .
```
*Dica: O `:teste-versao-1` é uma "tag". Ela garante que você não vai apagar a imagem que está rodando no site oficial.*

---

## 🚢 4. No Portainer (Publicação)

Agora vamos dizer ao Docker Swarm para usar essa imagem de teste.

1.  Abra o **Portainer** e vá em **Stacks**.
2.  Clique na sua Stack e vá no **Web Editor**.
3.  Localize a linha `image: hevertonperes/conexao-hub:latest`.
4.  Mude para: `image: hevertonperes/conexao-hub:teste-versao-1`.
5.  Clique em **Update the stack**.

---

## 🛡️ 5. Segurança: Como Reverter (Rollback)

Se você abrir o site e algo estiver errado, não entre em pânico. Siga este passo para voltar ao normal:

1.  Volte no **Web Editor** do Portainer.
2.  Mude a imagem de volta para a original: `image: hevertonperes/conexao-hub:latest`.
3.  Clique em **Update the stack**.
4.  O site antigo volta a funcionar em segundos.

---

## ✅ 6. Quando o Teste der Certo?
Se tudo estiver perfeito na imagem de teste, você pode:
1.  Fazer o **Merge** no GitHub (unir a branch de teste com a `main`).
2.  Na VPS, voltar para a branch `main`: `git checkout main` e `git pull`.
3.  Fazer o build oficial: `docker build -t hevertonperes/conexao-hub:latest .`.
4.  No Portainer, voltar a imagem para `:latest`.

---
*Manual criado por Antigravity em 2026.*
