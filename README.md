# GitHub Follower Manager

O **GitHub Follower Manager** é uma API REST para automação de gerenciamento de seguidores no GitHub. Permite verificar reciprocidade de follows, seguir e deixar de seguir usuários em lote, clonar seguidores de perfis referência e filtrar bots automaticamente.

---

## Tecnologias Utilizadas

- **Node.js + TypeScript** – ambiente robusto e tipado
- **Express** – framework HTTP
- **Axios** – requisições à API do GitHub
- **Puppeteer** – automação e web scraping
- **Cheerio** – parsing de HTML
- **Swagger UI** – documentação interativa dos endpoints
- **Dotenv** – gerenciamento de variáveis de ambiente
- **ts-node / nodemon** – execução e hot reload em desenvolvimento

---

## Estrutura do Projeto

```bash
github-follower-manager/
├── index.ts                        # Entry point da aplicação
├── src/
│   ├── config/
│   │   ├── .env                    # Variáveis de ambiente (não versionar)
│   │   ├── .env-example.txt        # Exemplo de configuração
│   │   └── swagger.ts              # Configuração do Swagger
│   ├── controllers/
│   │   ├── RegisterRoutes.ts       # Registro central de rotas
│   │   └── routes/
│   │       └── apiRoutes.ts        # Definição de todos os endpoints
│   ├── models/
│   │   └── request/                # Interfaces TypeScript dos requests
│   ├── requests/                   # Funções de requisição à API do GitHub
│   └── services/
│       ├── webScraping/            # Scraping com Puppeteer
│       └── useCases/               # Lógica de negócio por caso de uso
│           ├── checkFollowerAndFollowing/
│           ├── checkUnfollowAndFollow/
│           ├── fetchUserFollowData/
│           ├── filterOrganicFollowers/
│           ├── followUsersFollowers/
│           ├── logChangeCount/
│           └── unfollowUsers/
```

---

## Instalação Local

### Requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- Conta no GitHub com **token de acesso pessoal (PAT)**

> Gere seu token em: **GitHub > Settings > Developer settings > Personal access tokens**. Permissão necessária: escopo `user` (follow/unfollow).

### 1. Clonar o repositório

```bash
git clone https://github.com/Ton-Chyod-s/fallowbackgit.git
cd fallowbackgit
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp src/config/.env-example.txt src/config/.env
```

Edite `src/config/.env`:

```env
USER=seu_login_github
KEY=ghp_xxxxxxxxxxxxxxxxxxxx
```

| Variável | Descrição                         |
|----------|-----------------------------------|
| `USER`   | Login do usuário GitHub           |
| `KEY`    | Token de acesso pessoal do GitHub |

### 4. Rodar a aplicação

```bash
# Desenvolvimento (hot reload)
npm run dev

# Produção
npm run build
npm start
```

| Serviço        | URL                              |
|----------------|----------------------------------|
| API            | http://localhost:3000            |
| Swagger (docs) | http://localhost:3000/api-docs   |

### Web Scraping (opcional)

Para funcionalidades que utilizam automação via Puppeteer:

```bash
node ./src/services/webScraping/webScrapingData.js
```

Siga as instruções exibidas no terminal.

---

## Endpoints

| Método     | Rota                | Descrição                                                     |
|------------|---------------------|---------------------------------------------------------------|
| `GET`      | `/`                 | Boas-vindas e listagem dos endpoints disponíveis              |
| `GET`      | `/check-follower`   | Lista quem você segue mas não te segue de volta               |
| `GET`      | `/check-unfollower` | Lista quem te segue mas você ainda não segue de volta         |
| `POST`     | `/follow-users`     | Copia e segue os seguidores orgânicos de uma conta referência |
| `POST`     | `/new-follower`     | Segue um ou mais usuários específicos                         |
| `DELETE`   | `/unfollow-users`   | Para de seguir uma lista de usuários em lote                  |
| `POST`     | `/filter-organic`   | Separa usuários orgânicos de suspeitos (bots)                 |

> A autenticação é feita via variáveis de ambiente. Não há token por requisição.

### Exemplos de body

**POST `/follow-users`**
```json
{ "targetUser": "conta_referencia" }
```

**POST `/new-follower`**
```json
{ "usernames": ["usuario1", "usuario2"] }
```

**DELETE `/unfollow-users`**
```json
{ "usernames": ["usuario1", "usuario2"] }
```

**POST `/filter-organic`**
```json
{ "usernames": ["usuario1", "usuario2", "usuario3"] }
```

---

## Contribuição

Contribuições são bem-vindas. Abra uma issue ou pull request.

## Licença

Este projeto está licenciado sob a [MIT License](./LICENSE).