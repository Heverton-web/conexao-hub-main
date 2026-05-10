# ☁️ Módulo 02: Configuração Supabase

A plataforma Hub utiliza o **Supabase** como backend (Banco de Dados, Autenticação e Storage).

## 1. Criar Projeto
Acesse [supabase.com](https://supabase.com), crie uma conta e inicie um novo projeto. Escolha a região mais próxima de você ou do seu cliente.

## 2. Tabelas e Estrutura
O sistema está preparado para criar a estrutura básica no primeiro acesso, mas é recomendado que você execute o script de SQL inicial se tiver acesso ao painel do Supabase.
- Vá em **SQL Editor**.
- Execute os scripts de criação de tabelas (se fornecidos pelo desenvolvedor).

## 3. Configurar Auth
No painel do Supabase:
- Vá em **Authentication** > **Providers**.
- Garanta que o provedor **Email** está habilitado.
- (Opcional) Desabilite a confirmação de email se quiser que o acesso seja imediato após o setup.
