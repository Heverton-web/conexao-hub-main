# 🚀 Módulo 04: Deploy (Primeiro Passo)

Com o Docker instalado e o arquivo `.env` configurado, estamos prontos para subir a aplicação.

## 1. Comando de Build e Start
Execute o comando abaixo na pasta raiz do projeto:

```bash
docker compose up -d --build
```

**O que este comando faz?**
- `--build`: Reconstrói a imagem da aplicação (garantindo que as variáveis do `.env` sejam lidas).
- `-d`: Roda em modo "detached" (em segundo plano).

## 2. Verificando o Status
Para garantir que tudo subiu corretamente, verifique os logs:

```bash
docker logs -f conexao-hub
```

Você deve ver mensagens do Nginx indicando que o servidor está pronto.

## 3. Acessando a Interface
Abra o seu navegador e acesse:
`http://localhost:8080` (se estiver no seu PC)
ou
`http://IP-DO-SERVIDOR:8080` (se estiver em uma VPS)

Se tudo estiver correto, você verá a tela de **Setup Inicial** do Super Admin.

---
**Nota:** Se a página não carregar, verifique se a porta 8080 está liberada no seu firewall.
