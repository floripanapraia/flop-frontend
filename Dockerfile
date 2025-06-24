# Estágio 1: Build dos arquivos estáticos com Node.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# A variável de ambiente não é necessária aqui porque o Nginx vai cuidar do proxy
RUN npm run build