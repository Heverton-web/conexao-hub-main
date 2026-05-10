# 🎨 Módulo 06: Customização White Label

Agora que você já criou seu Super Admin e fez o primeiro login, é hora de deixar a plataforma com a cara da sua marca.

## 1. Acessando as Configurações
- No menu lateral, clique em **Admin**.
- Vá até a aba **Branding** ou **Configurações de Sistema**.

## 2. O que você pode alterar:
- **Nome da Aplicação**: Aparece no título da página e nos emails.
- **Logo**: Envie uma imagem (PNG/SVG) para o Storage do Supabase e cole a URL pública aqui.
- **Cores do Tema**: Ajuste as cores primárias e de destaque para combinar com a identidade visual do seu cliente.

## 3. Persistência
Estas mudanças são gravadas na tabela `system_config` do banco de dados. Isso significa que mesmo se você reiniciar o Docker, as configurações de marca serão mantidas.
