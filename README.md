# Floripa na Praia - Frontend

Este é o frontend da aplicação **Floripa na Praia**, desenvolvido em React para fornecer uma interface intuitiva e responsiva para os usuários.

## Tecnologias Utilizadas
- React 18+
- TypeScript
- TailwindCSS
- React Router Dom

## Configuração do Ambiente
### Requisitos
- Node.js 18+
- npm ou yarn

### Instalação e Execução
1. Clone o repositório:
   ```sh
   git clone https://github.com/floripanapraia/flop-frontend.git
   cd flop-frontend
   ```
2. Instale as dependências:
   ```sh
   npm install
   # ou
   yarn install
   ```
3. Configure o arquivo `.env` para definir a URL da API:
   ```sh
   API_URL=http://localhost:8080
   ```
4. Inicie o servidor de desenvolvimento:
   ```sh
   npm run dev
   # ou
   yarn dev
   ```
5. O frontend estará disponível em `http://localhost:5173`.

## Estrutura do Projeto
```
floripa-na-praia-frontend/
├── src/
│   ├── components/    # Componentes reutilizáveis
│   ├── pages/         # Páginas principais
│   ├── services/      # Chamadas para a API
│   ├── hooks/         # Hooks personalizados
│   ├── assets/        # Arquivos estáticos
│   ├── App.tsx        # Componente principal
│   ├── main.tsx       # Ponto de entrada do app
├── public/            # Arquivos públicos
├── .env.example       # Exemplo de variáveis de ambiente
├── package.json       # Dependências do projeto
```

## Conexão com a API
O frontend consome os dados da API do backend **Floripa na Praia**, que deve estar rodando para que a aplicação funcione corretamente.

## Contribuição
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b minha-feature`)
3. Commit suas alterações (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin minha-feature`)
5. Abra um Pull Request

## Licença
Este projeto está sob a licença MIT.