# Capítulo 05: MinIO (Storage S3)

## Objetivo

Configurar o MinIO para armazenamento de arquivos (imagens, vídeos, thumbnails).

---

## 5.1. O que é MinIO?

MinIO é um armazenamento de objetos compatível com Amazon S3 API. Permite:
- Armazenar imagens de materiais
- Thumbnails de coleções
- Avatares de usuários
- Arquivos diversos

---

## 5.2. Criar Arquivo Docker Compose

Crie `/opt/conexao-hub/minio.yml`:

```bash
cat > /opt/conexao-hub/minio.yml << 'EOF'
version: '3.8'

services:
  minio:
    image: minio/minio:latest
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.labels.storage == true
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    networks:
      - app-overlay
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 10s
      retries: 3
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.minio.rule=PathPrefix(`/minio`)"
      - "traefik.http.services.minio.loadbalancer.server.port=9000"
      - "traefik.http.routers.minio-console.rule=PathPrefix(`/minio-console`)"
      - "traefik.http.services.minio-console.loadbalancer.server.port=9001"
    restart: unless-stopped

volumes:
  minio_data:
    driver: local

networks:
  app-overlay:
    external: true
    name: app-overlay
EOF
```

---

## 5.3. Adicionar Variáveis de Ambiente

Edite `/opt/conexao-hub/.env`:

```bash
# Adicionar ao .env existente
echo '
# MinIO (Storage S3)
MINIO_ROOT_USER=conexaohub
MINIO_ROOT_PASSWORD=SuaSenhaMinIO123!
' >> /opt/conexao-hub/.env
```

---

## 5.4. Deploy do MinIO

```bash
cd /opt/conexao-hub

# Deploy
docker stack deploy -c minio.yml storage

# Verificar
docker service ls
docker service ps storage_minio
```

---

## 5.5. Criar Buckets

Acesse o console do MinIO em: `http://<SEU_IP>/minio-console`

Use as credenciais do `.env` para登录.

### Criar buckets necessários:

| Bucket | Uso |
|--------|-----|
| `materials` | Arquivos de materiais (PDFs, vídeos) |
| `thumbnails` | Miniaturas de materiais/coleções |
| `avatars` | Fotos de perfil de usuários |
| `trail-covers` | Capas de trilhas/coleções |

#### Via CLI:

```bash
# Criar buckets
docker exec -it $(docker ps -qf name=minio) mc mb local/materials
docker exec -it $(docker ps -qf name=minio) mc mb local/thumbnails
docker exec -it $(docker ps -qf name=minio) mc mb local/avatars
docker exec -it $(docker ps -qf name=minio) mc mb local/trail-covers

# Definir política pública para thumbnails (opcional)
docker exec -i $(docker ps -qf name=minio) mc anonymous set download local/thumbnails
```

---

## 5.6. Configurar CORS (Cross-Origin)

O frontend precisa acessar o MinIO. Configure CORS:

```bash
# Editar configuração do MinIO
docker exec -it $(docker ps -qf name=minio) mc admin config set minio CORSAccessControlAllowOrigin="*"
docker exec -it $(docker ps -qf name=minio) mc admin config set minio CORSAllowedOrigins="http://seudominio.com,https://seudominio.com"

# Reiniciar MinIO
docker service update --force storage_minio
```

---

## 5.7. Testar Conexão S3

Código de teste em Node.js:

```javascript
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  endpoint: 'http://<SEU_IP>:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'conexaohub',
    secretAccessKey: 'SuaSenhaMinIO123!',
  },
  forcePathStyle: true,
});

async function testUpload() {
  const command = new PutObjectCommand({
    Bucket: 'test-bucket',
    Key: 'test.txt',
    Body: 'Hello World',
    ContentType: 'text/plain',
  });
  
  await s3Client.send(command);
  console.log('Upload successful!');
}

testUpload();
```

---

## 5.8. Configuração de Políticas

Crie políticas de acesso em `/opt/conexao-hub/minio-policies`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::thumbnails/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["s3:*"],
      "Resource": [
        "arn:aws:s3:::materials/*",
        "arn:aws:s3:::avatars/*",
        "arn:aws:s3:::trail-covers/*"
      ]
    }
  ]
}
```

Aplique:

```bash
docker exec -it $(docker ps -qf name=minio) mc admin policy create conexao-hub /path/to/policy.json
docker exec -it $(docker ps -qf name=minio) mc admin policy attach conexao-hub --user=conexaohub
```

---

## Checklist de Conclusão

- [ ] MinIO deployado
- [ ] Volume persistente configurado
- [ ] Buckets criados (materials, thumbnails, avatars, trail-covers)
- [ ] CORS configurado
- [ ] Teste de upload funcionando
- [ ] Políticas de acesso definidas

---

## Próximo Passo

Avance para **[Capítulo 06: Next.js Deploy](./06-nextjs-deploy.md)**

---

*Retornar para [Índice](./MANUAL-DEPLOY-DOCKER-SWARM.md)*