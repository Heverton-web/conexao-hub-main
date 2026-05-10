# Capítulo 03: Clonar e Buildar o Projeto

## Objetivo

Clonar o repositório do projeto, configurar as variáveis de ambiente e gerar os arquivos estáticos para deploy.

---

## 3.1. Clonar o Repositório

Conecte-se à VPS como usuário **deploy** (ou root):

```bash
# Criar diretório para projetos web
mkdir -p /var/www
cd /var/www

# Clonar o repositório (substitua pela URL real)
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git hub-conexao

# Entrar no diretório
cd hub-conexao
```

### Verificar a Branch

```bash
# Ver branches disponíveis
git branch -a

# Verificar branch atual
git branch

# Se precisar trocar de branch (ex: master -> main)
git checkout main
```

---

## 3.2. Criar Arquivo .env

```bash
# Criar arquivo .env
nano .env
```

Cole o seguinte conteúdo (substitua pelos valores do **seu** Supabase):

```env
VITE_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SUA_CHAVE_ANON_AQUI
VITE_SUPABASE_PROJECT_ID=SEU_PROJECT_ID
```

> ⚠️ **Importante**: Substitua os valores acima pelas credenciais obtidas no Capítulo 02.

### Salvar o arquivo

1. Pressione `Ctrl+O` para salvar
2. Pressione `Enter` para confirmar
3. Pressione `Ctrl+X` para sair

### Verificar

```bash
cat .env
```

---

## 3.3. Instalar Dependências

```bash
# Instalar dependências do projeto
npm install
```

Isso pode levar 1-3 minutos dependendo da conexão.

### Verificar instalação

```bash
# Verificar node_modules
ls -la node_modules | head -20

# Verificar package.json
cat package.json | grep -A 5 '"dependencies"'
```

---

## 3.4. Fazer o Build

```bash
# Gerar arquivos estáticos para produção
npm run build
```

Este comando:
1. Compila o código TypeScript/React
2. Otimiza assets e imagens
3. Gera a pasta `dist/` com os arquivos prontos

### Tempo estimado

- Primeira build: 1-3 minutos
- Builds subsequentes: 30-60 segundos

---

## 3.5. Verificar o Build

```bash
# Listar conteúdo da pasta dist
ls -la dist/

# Ver arquivos gerados
ls -la dist/assets/ | head -20
```

A saída deve incluir:
- `index.html` (arquivo principal)
- `assets/` (CSS, JS, fontes, imagens)
- `favicon.ico` (se existir)

### Estrutura típica

```
dist/
├── index.html
├── favicon.ico
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── imagens/
└── ...
```

---

## 3.6. Criar Arquivo .env para Produção (Opcional)

Se houver区别 entre desenvolvimento e produção:

```bash
# Criar .env para produção (se necessário)
nano .env.production
```

```env
VITE_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SUA_CHAVE_ANON_AQUI
VITE_SUPABASE_PROJECT_ID=SEU_PROJECT_ID
VITE_APP_ENV=production
```

---

## 3.7. Estrutura de Diretórios

Após o build, a estrutura final deve ser:

```
/var/www/hub-conexao/
├── .env                    # Variáveis de ambiente
├── package.json            # Dependências
├── dist/                   # Arquivos estáticos (para Nginx)
│   ├── index.html
│   ├── assets/
│   └── ...
├── node_modules/          # Dependências instaladas
├── src/                   # Código fonte
├── supabase/              # Migrações (se existirem)
├── .git/                  # Repositório Git
└── ...
```

---

## Checklist de Conclusão

- [ ] Repositório clonado em `/var/www/hub-conexao`
- [ ] Arquivo `.env` criado com credenciais do Supabase
- [ ] `npm install` executado com sucesso
- [ ] `npm run build` executado com sucesso
- [ ] Pasta `dist/` criada com arquivos estáticos
- [ ] Estrutura de diretórios verificada

---

## Troubleshooting

### Erro: "command not found: npm"

Execute:
```bash
source ~/.bashrc
nvm use default
npm -v
```

### Erro: "Module not found"

Execute:
```bash
rm -rf node_modules
npm install
```

### Build muito lenta

Considere usar:
```bash
npm run build -- --max-old-space-size=4096
```

---

## Próximo Passo

Avance para **[Capítulo 04: Configurar Nginx](./04-nginx.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-VPS-NGINX.md)*