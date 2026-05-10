# 🔑 Módulo 03: Variáveis de Ambiente

Para que o Docker construa a aplicação corretamente, ele precisa saber onde se conectar. Estas informações são passadas via arquivo `.env`.

## 📝 O Arquivo .env
Localizado na raiz do projeto, este arquivo deve conter as seguintes chaves:

### Configurações Obrigatórias
| Variável | Descrição | Onde Encontrar |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase | Project Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima (public) | Project Settings > API |

### Configurações Opcionais (Integrações)
| Variável | Descrição | Finalidade |
| :--- | :--- | :--- |
| `VITE_GEMINI_API_KEY` | Chave da API Google Gemini | Habilita o Chatbot IA |
| `VITE_OPENAI_API_KEY` | Chave da API OpenAI | Alternativa para IA |

## 🛠️ Como configurar
1.  Renomeie o arquivo `.env.example` para `.env`.
2.  Abra o arquivo com um editor (nano, vim ou VS Code).
3.  Preencha os valores entre aspas (ex: `VITE_SUPABASE_URL="https://abc.supabase.co"`).

> [!CAUTION]
> **Segurança**: Nunca compartilhe seu arquivo `.env` ou o suba para repositórios públicos. Ele contém chaves que dão acesso ao seu banco de dados.

## 🔄 Aplicando Mudanças
Se você alterar o `.env` após a aplicação já estar rodando, precisará reconstruir o contêiner para que o Vite injete os novos valores:

```bash
docker compose up -d --build
```
