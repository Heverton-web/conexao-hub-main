# Capítulo 02: Configurar Supabase

## Objetivo

Criar o projeto Supabase, configurar o banco de dados, autenticação e obter as credenciais necessárias para a aplicação.

---

## 2.1. Criar Projeto no Supabase

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique em **"New Project"**
3. Preencha os dados:
   - **Name**: `hub-conexao` (ou outro nome)
   - **Database Password**: Defina uma senha forte e **anote**
   - **Region**: Selecione a região mais próxima (ex: `São Paulo` ou `N. Virginia`)
4. Clique em **"Create new project"**
5. Aguarde 1-2 minutos para a criação

> ⚠️ **Importante**: Guarde a senha do banco! Você precisará dela para alcune operações.

---

## 2.2. Obter Credenciais API

Após o projeto ser criado:

1. No painel do Supabase, vá em **Settings** (ícone de engrenagem) → **API**
2. Anote os seguintes valores:

| Credencial | Variável de Ambiente | Onde Encontrar |
|------------|---------------------|-----------------|
| **Project URL** | `VITE_SUPABASE_URL` | Settings → API → Project URL |
| **anon / public key** | `VITE_SUPABASE_PUBLISHABLE_KEY` | Settings → API → Project API keys → `anon` |
| **Project Reference ID** | `VITE_SUPABASE_PROJECT_ID` | Settings → API → Project URL (parte do URL) |

**Exemplo de valores:**
```
VITE_SUPABASE_URL=https://abc123def456.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM2RlZjQ1NiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE5MTgzODAwMDB9.XXXXX
VITE_SUPABASE_PROJECT_ID=abc123def456
```

---

## 2.3. Executar Script SQL de Criação de Tabelas

O projeto Hub Conexão possui migrations em `supabase/migrations/`. Você precisa executar todas elas.

### Opção A: Executar via SQL Editor (Recomendado)

1. No painel Supabase, vá em **SQL Editor**
2. Clique em **New query**
3. Para cada arquivo em `supabase/migrations/`, copie o conteúdo e execute

### Opção B: Usar Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Linkar ao projeto
supabase link --project-ref <PROJECT_REF>

# Executar migrações
supabase db push
```

### Lista de Migrations

O projeto contém as seguintes migrations:

| Arquivo | Descrição |
|---------|-----------|
| `20260216162244_*.sql` | Tabelas base (profiles, user_roles) |
| `20260218203300_*.sql` | Convites e convites_tokens |
| `20260220163623_*.sql` | Conteúdo e módulos |
| `20260220170044_*.sql` | Progresso de usuários |
| `20260220172414_*.sql` | Certificados |
| `20260220180522_*.sql` | Configurações do sistema |
| `20260220181522_*.sql` | Relatórios |
| `20260226195222_*.sql` | Integrações |
| `20260226200120_*.sql` | Webhooks |
| `20260508120000_*.sql` | Sistema de integrações |

> 📁 As migrations estão em: `./supabase/migrations/` no repositório do projeto.

---

## 2.4. Configurar Autenticação

1. No painel Supabase, vá em **Authentication** → **Settings**
2. Configure:

| Configuração | Valor |
|--------------|-------|
| **Enable Email Signup** | ✅ Ativado |
| **Enable Anonymous Sign-ins** | ❌ Desativado (recomendado) |
| **Site URL** | `https://seudominio.com.br` (ou IP temporário) |
| **Redirect URLs** | `https://seudominio.com.br/auth/callback` |

### Configurações de Email (Opcional)

Se quiser usar email transactional:
1. Vá em **Authentication** → **Email**
2. Configure um provedor SMTP ou use o padrão do Supabase

---

## 2.5. Configurar Row Level Security (RLS)

As migrations já incluem políticas RLS, mas verifique:

1. Vá em **Database** → **Tables**
2. Para cada tabela, verifique se há políticas de segurança em **RLS Policies**

As tabelas típicas com RLS:
- `profiles` - Apenas o próprio usuário pode ver/editar
- `user_roles` - Apenas admins podem modificar
- `invite_tokens` - Apenas quem criou o convite
- `user_progress` - Apenas o próprio usuário
- `certificates` - Apenas o próprio usuário

---

## 2.6. Criar Usuário Administrador

### Passo 1: Criar usuário via painel

1. Vá em **Authentication** → **Users**
2. Clique em **Add user**
3. Preencha:
   - **Email**: admin@seudominio.com
   - **Password**: Defina uma senha
   - **Email confirm**: Ativado
4. Clique em **Create user**

### Passo 2: Promover a super_admin via SQL

No **SQL Editor**, execute:

```sql
-- Atualizar role para super_admin
UPDATE public.user_roles
SET role = 'super_admin'
WHERE user_id = 'ID_DO_USUARIO_AQUI';

-- Ativar status do perfil
UPDATE public.profiles
SET status = 'active'
WHERE id = 'ID_DO_USUARIO_AQUI';

-- Verificar se foi criado (substitua o ID)
SELECT * FROM public.user_roles WHERE user_id = 'ID_DO_USUARIO_AQUI';
```

> ⚠️ Substitua `ID_DO_USUARIO_AQUI` pelo ID do usuário criado (disponível na tabela Authentication → Users).

---

## 2.7. Verificar Configuração

Execute no SQL Editor:

```sql
-- Verificar tabelas criadas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar policies RLS
SELECT tablename, policyname FROM pg_policies
WHERE schemaname = 'public';

-- Verificar usuário admin
SELECT ur.user_id, ur.role, p.email, p.status
FROM public.user_roles ur
JOIN public.profiles p ON p.id = ur.user_id
WHERE ur.role = 'super_admin';
```

---

## Checklist de Conclusão

- [ ] Projeto Supabase criado
- [ ] Credenciais API obtidas (URL, key, project ID)
- [ ] Todas as migrations executadas
- [ ] Autenticação configurada (email signup ativado)
- [ ] Site URL configurado
- [ ] Usuário admin criado e promovido
- [ ] Teste de login via painel funciona

---

## Próximo Passo

Avance para **[Capítulo 03: Clonar e Buildar o Projeto](./03-clonar-build.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-VPS-NGINX.md)*