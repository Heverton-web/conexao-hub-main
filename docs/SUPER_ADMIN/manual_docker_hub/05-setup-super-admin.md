# 🛡️ Módulo 05: Setup do Super Administrador

Este é o passo mais importante da instalação. Como a aplicação é **White Label**, ela "nasce" sem um dono definido por segurança. Você precisa definir quem será o administrador mestre.

## 1. O Gatilho de Setup
Ao acessar a URL da aplicação pela primeira vez após o deploy Docker, o sistema fará uma varredura no banco de dados:
- Se não houver nenhum usuário com a função `super_admin`, você será redirecionado automaticamente para a tela de **Setup Inicial**.

## 2. Passo a Passo do Cadastro
Na tela de Setup, você deverá preencher:
1.  **Nome do Administrador**: O nome completo do responsável.
2.  **Email de Acesso**: Este será o email usado para todos os logins futuros.
3.  **Senha Mestra**: Defina uma senha forte (mínimo 6 caracteres).

> [!IMPORTANT]
> O email e a senha definidos aqui serão gravados no **Supabase Auth**. Certifique-se de salvar estas credenciais em um local seguro.

## 3. O que acontece após o clique em "Inicializar"?
Quando você clicar no botão de inicialização:
1.  O sistema cria o usuário no serviço de autenticação.
2.  Marca este usuário com a role `super_admin` na tabela `profiles`.
3.  Inicializa a tabela `system_config` com valores padrão.
4.  Bloqueia permanentemente a tela de setup (ninguém mais poderá acessá-la).

## 4. Próximos Passos
Após o redirecionamento automático para a Home:
- Faça login com as credenciais que acabou de criar.
- Vá até o menu **Admin** (ícone de engrenagem ou escudo).
- Comece a personalização da sua marca (White Label).

---

> [!TIP]
> Caso você erre o email ou queira reiniciar o processo, será necessário deletar o usuário criado no painel do Supabase e limpar a tabela `profiles` para que a tela de setup apareça novamente.
