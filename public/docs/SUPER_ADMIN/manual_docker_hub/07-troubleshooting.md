# 🔧 Módulo 07: Troubleshooting (Resolução de Problemas)

## 1. Erro "Database Connection Failed"
- **Causa**: Variáveis `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY` incorretas no `.env`.
- **Solução**: Verifique o `.env`, corrija e rode `docker compose up -d --build`.

## 2. Tela de Setup não aparece (mesmo em banco novo)
- **Causa**: Pode haver algum perfil fantasma no banco.
- **Solução**: Acesse o painel do Supabase, limpe a tabela `profiles` e recarregue a página.

## 3. Erro 404 ao atualizar páginas (F5)
- **Solução**: O arquivo `nginx.conf` deve estar configurado com `try_files $uri $uri/ /index.html;`. Verifique se o arquivo foi copiado corretamente no Dockerfile.

## 4. Onde ficam os arquivos carregados?
- Todos os arquivos (PDFs, Vídeos, Logos) ficam armazenados no **Buckets do Supabase Storage**. Certifique-se de criar o bucket `materials` com acesso público se necessário.
