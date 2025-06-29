# Estágio 1: Build com Node.js
# Usamos uma imagem com Node.js para instalar as dependências e gerar os arquivos de produção.
FROM node:18 AS builder

WORKDIR /app

# Copia os arquivos de definição de pacotes.
COPY package.json package-lock.json ./

# Instala as dependências.
RUN npm install

# Copia o resto do código-fonte do React.
COPY . .

# Executa o build de produção.
# Isso vai criar uma pasta 'build' com todos os arquivos estáticos (HTML, CSS, JS).
RUN npm run build

# Estágio 2: Servir com Nginx
# Usamos uma imagem oficial e leve do Nginx.
FROM nginx:1.27-alpine

# Copia os arquivos estáticos gerados no estágio anterior para a pasta padrão do Nginx.
COPY --from=builder /app/build /usr/share/nginx/html

# Quando o contêiner iniciar, o Nginx automaticamente servirá os arquivos da pasta acima.
# A porta padrão do Nginx é a 80.
EXPOSE 80