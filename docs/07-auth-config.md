# Capítulo 07: Autenticação (Clerk)

## Objetivo

Configurar o sistema de autenticação usando Clerk.

---

## 7.1. Por que Clerk?

Clerk é um serviço de autenticação que oferece:
- Login social (Google, GitHub, etc.)
- Autenticação por e-mail/senha
- MFA (autenticação em duas etapas)
- Gerenciamento de usuários
- UI components prontos
- Rate limiting

---

## 7.2. Criar Conta no Clerk

1. Acesse [clerk.com](https://clerk.com)
2. Crie uma conta gratuita
3. Crie uma nova aplicação:
   - **Name**: Conexão Hub
   - **Sandbox**: Enabled (para testes)
4. Copie as chaves API

---

## 7.3. Configurar no Clerk Dashboard

### Configurações Gerais:
- **Sandbox**: Mantenha ativado enquanto desenvolve
- **Email**: Configure seu domínio verificado

### Métodos de Login:
1. Vá em **Users → Authentication**
2. Configure:
   - **Email + Password**: Ativar
   - **Google**: Ativar (opcional)
   - **GitHub**: Ativar (opcional)

### Redes Sociais (OAuth):

**Google:**
1. Vá em **SSO → Google**
2. Clique em **Setup**
3. Siga as instruções para criar projeto no Google Cloud
4. Copie Client ID e Client Secret

**GitHub:**
1. Vá em **SSO → GitHub**
2. Clique em **Setup**
3. Crie OAuth App no GitHub Developer Settings
4. Copie Client ID e Client Secret

---

## 7.4. Configurar no Frontend

Instale o SDK do Clerk:

```bash
npm install @clerk/nextjs
```

Crie arquivo `src/middleware.ts` (se não existir):

```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/health"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

---

## 7.5. Configurar Variáveis de Ambiente

No seu `.env.local` (desenvolvimento) e `.env` (produção):

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# URL do Clerk no frontend
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

---

## 7.6. Integração com Componente

No `src/app/layout.tsx` ou `src/pages/_app.tsx`:

```typescript
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="pt-br">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

## 7.7. Criar Rotas de Auth

### Sign In (src/app/sign-in/[[...sign-in]]/page.tsx):

```typescript
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn />;
}
```

### Sign Up (src/app/sign-up/[[...sign-up]]/page.tsx):

```typescript
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return <SignUp />;
}
```

---

## 7.8. Obter Dados do Usuário

```typescript
import { currentUser } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();
  
  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}</h1>
      <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
      <p>ID: {user.id}</p>
    </div>
  );
}
```

---

## 7.9. Sincronizar com Banco de Dados

Para sincronizar usuários do Clerk com seu banco:

1. Crie endpoint `src/app/api/auth/sync/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabaseClient";

export async function POST() {
  const user = await currentUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Criar ou atualizar usuário no banco
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.emailAddresses[0]?.emailAddress,
    status: "active",
  }, { onConflict: "id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

2. Chame este endpoint após login no frontend

---

## 7.10. Configurar Webhooks (Opcional)

Para sincronização automática:

1. Vá em **Webhooks** no Clerk Dashboard
2. Adicione novo webhook:
   - **URL**: `https://seudominio.com/api/webhooks/clerk`
   - **Events**: `user.created`, `user.updated`, `user.deleted`
3. Crie endpoint para tratar:

```typescript
// src/app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  
  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    } as any);
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;
  
  if (eventType === "user.created" || eventType === "user.updated") {
    // Sincronizar com banco de dados
    console.log("User event:", evt.data);
  }

  return new Response("OK", { status: 200 });
}
```

---

## Checklist de Conclusão

- [ ] Conta Clerk criada
- [ ] Aplicação configurada
- [ ] Métodos de login configurados
- [ ] Keys configuradas no frontend
- [ ] Páginas de Sign-in/Sign-up criadas
- [ ] Middleware configurado
- [ ] Sincronização com banco funcionando

---

## Próximo Passo

Avance para **[Capítulo 08: Traefik (Reverse Proxy)](./08-nginx-traefik.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-DOCKER-SWARM.md)*