# Capítulo 10: Migração do Supabase

## Objetivo

Migrar o banco de dados e configurações do Supabase Cloud para PostgreSQL Docker.

---

## 10.1. O que Migrar

| Componente | Origem | Destino |
|------------|--------|---------|
| **Dados** | Supabase (PostgreSQL) | PostgreSQL Docker |
| **Arquivos** | Supabase Storage | MinIO |
| **Auth** | Supabase Auth | Clerk (manter ou migrar) |
| **Edge Functions** | Supabase Functions | API Routes Next.js |

---

## 10.2. Exportar Dados do Supabase

### Via Dashboard:

1. Acesse [supabase.com](https://supabase.com)
2. Selecione seu projeto
3. Vá em **Settings → Database**
4. Clique em **Download a dump**
5. Escolha formato SQL

### Via linha de comando:

```bash
# Usando psql (instale primeiro)
# sudo apt install postgresql-client

# Conectar e exportar
pg_dump \
  "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  --clean \
  --if-exists \
  > backup_supabase.sql
```

---

## 10.3. Importar no PostgreSQL Docker

```bash
# Copiar arquivo para VPS
scp backup_supabase.sql root@<IP_VPS>:/opt/conexao-hub/

# Importar
docker exec -i db_postgres psql -U conexao_hub -d conexao_hub < /opt/conexao-hub/backup_supabase.sql
```

---

## 10.4. Migrar Arquivos (Storage)

### Baixar arquivos do Supabase:

```bash
# Listar buckets
curl -H "Authorization: Bearer [ANON_KEY]" \
  "https://[PROJECT].supabase.co/storage/v1/bucket"

# Baixar arquivos (manual - muito trabalho)
# Recomendamos: criar novos buckets no MinIO e configurar no frontend
```

### Configurar MinIO no Frontend:

No arquivo `src/lib/supabaseClient.ts` ou similar:

```typescript
import { createClient } from '@supabase/supabase-js';

// Usar PostgreSQL direto
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:5432';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## 10.5. Migrar Edge Functions

As Edge Functions do Supabase precisam se tornar API Routes do Next.js.

### Exemplo: translate-title

**Antes (Supabase Edge Function):**
```typescript
// supabase/functions/translate-title/index.ts
serve(async (req) => {
  const { text } = await req.json();
  // lógica de tradução
});
```

**Depois (Next.js API Route):**
```typescript
// src/app/api/translate-title/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { text } = await request.json();
  
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  // lógica de tradução
  
  return NextResponse.json({ translations: {...} });
}
```

---

## 10.6. Atualizar Variáveis de Ambiente

```bash
# No .env da produção
NEXT_PUBLIC_SUPABASE_URL=http://db_postgres:5432/conexao_hub
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# URL das Edge Functions
NEXT_PUBLIC_EDGE_FUNCTIONS_URL=https://seudominio.com/api
```

---

## 10.7. Criar Tabelas ausentes

Se o dump não incluir todas as tabelas, crie manualmente:

```sql
-- system_integrations (das fases anteriores)
CREATE TABLE system_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gemini_api_key_encrypted text,
  openai_api_key_encrypted text,
  groq_api_key_encrypted text,
  openrouter_api_key_encrypted text,
  gemini_function text DEFAULT 'translate',
  openai_function text DEFAULT 'image',
  groq_function text DEFAULT 'summarize',
  openrouter_function text DEFAULT 'chatbot',
  gemini_active boolean DEFAULT true,
  openai_active boolean DEFAULT true,
  groq_active boolean DEFAULT true,
  openrouter_active boolean DEFAULT true,
  supabase_url text,
  supabase_anon_key_encrypted text,
  supabase_publishable_key_encrypted text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

---

## 10.8. Testar a Migração

```bash
# Testar conexão
docker exec -it db_postgres psql -U conexao_hub -d conexao_hub -c "SELECT count(*) FROM profiles;"

# Testar API
curl https://seudominio.com/api/health

# Testar upload para MinIO
curl -X PUT -d "test" http://<IP_VPS>:9000/test-bucket/test.txt
```

---

## 10.9. Rollback (se necessário)

1. Mantenha o projeto Supabase ativo
2. Reconecte o frontend para Supabase
3. Corrija os problemas
4. Repita a migração

---

## Checklist de Conclusão

- [ ] Dados exportados do Supabase
- [ ] Dados importados no PostgreSQL Docker
- [ ] Edge Functions convertidas para API Routes
- [ ] Variáveis de ambiente atualizadas
- [ ] Testes passando

---

## Próximo Passo

Avance para **[Capítulo 11: Variáveis de Ambiente](./11-variaveis-ambiente.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-DOCKER-SWARM.md)*