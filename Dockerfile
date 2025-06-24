# Estágio 1: Build dos arquivos estáticos com Node.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# A variável de ambiente não é necessária aqui porque o Nginx vai cuidar do proxy
RUN npm run build

# Estágio 2: Servir os arquivos com Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]