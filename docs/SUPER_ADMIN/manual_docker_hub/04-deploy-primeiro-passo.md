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
docker logs -f conexao_hub_app
```

Você deve ver mensagens do Nginx indicando que o servidor está pronto.

## 3. Acessando a Interface
Como a aplicação está configurada para usar o Traefik, acesse via domínio configurado:

1.  **Via Domínio (Recomendado):** `https://hub.vpsconexao.org`
2.  **Via IP (Local/Teste):** `http://IP-DO-SERVIDOR:8080` (A porta 8080 está mapeada para testes rápidos).

Se tudo estiver correto, você verá a tela de **Setup Inicial** do Super Admin.


---
**Nota:** Se a página não carregar, verifique se a porta 8080 está liberada no seu firewall.
