# Estágio de Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./
COPY bun.lock ./

# Instalar dependências
RUN npm install

# Copiar resto do código
COPY . .

# Argumentos de build para variáveis VITE_
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_GEMINI_API_KEY
ARG VITE_OPENAI_API_KEY
ARG VITE_ENABLE_MOCK_MODE

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_OPENAI_API_KEY=$VITE_OPENAI_API_KEY
ENV VITE_ENABLE_MOCK_MODE=$VITE_ENABLE_MOCK_MODE

# Gerar build de produção
RUN npm run build

# Estágio de Produção
FROM nginx:alpine

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos estáticos do estágio de build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
