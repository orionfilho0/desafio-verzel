# EliteTix — Sistema de Venda de Ingressos para Eventos

Sistema completo de venda de ingressos, com três papéis de usuário (Organizador, Cliente e Portaria), pagamento simulado, geração de ingressos com QR code assinado e validação na portaria.

## Stack utilizada

- **Front-end:** React + Vite
- **Back-end:** Node.js + Express
- **ORM:** Prisma
- **Banco de dados:** PostgreSQL, hospedado na nuvem via [Neon](https://neon.tech) (serverless Postgres)
- **Autenticação:** JWT, com três papéis (`ORGANIZER`, `CLIENT`, `GATE`)
- **API externa:** TMDb (The Movie Database), usada na criação de eventos

## Estrutura do projeto

```
raiz-do-projeto/
├── api/                  # Back-end (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   ├── .env              # variáveis de ambiente do back-end
│   └── package.json
├── src/                  # Front-end (React + Vite)
├── .env                  # porta API
├── package.json
└── vite.config.js
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior instalado (inclui o `npm`)

Nenhuma conta em serviço externo é necessária e nenhuma configuração manual é exigida — os arquivos `.env` (back-end e front-end) já estão incluídos neste repositório, prontos para uso.

---

## Como executar

### 1. Back-end (`api/`)

```bash
cd api
npm install
npm run dev
```

Se aparecer `Servidor rodando em http://localhost:3333`, está pronto. **Mantenha este terminal aberto.**

### 2. Front-end (raiz do projeto)

Abra um **segundo terminal**, na raiz do projeto (onde estão `package.json` e `vite.config.js`):

```bash
npm install
npm run dev
```

Acesse o endereço mostrado no terminal (geralmente `http://localhost:5173`).

---

## Testando o fluxo completo

Com os dois servidores rodando (back-end na porta 3333, front-end na porta indicada pelo Vite), use os usuários de teste criados no seed para validar cada papel:

### Como Organizador (`organizador@teste.com` / `123456`)
1. Faça login — você será direcionado à área do organizador.
2. Crie um novo evento, buscando um filme no catálogo TMDb (ex: digite "Matrix").
3. Selecione o filme, escolha uma categoria, preencha data, local, capacidade e preço, e publique.
4. Confira o evento na tela de gerenciamento, com status e contagem de ingressos disponíveis/vendidos.

### Como Cliente (`cliente@teste.com` / `123456`)
1. Faça logout do organizador e entre com o usuário cliente.
2. Veja o evento criado na listagem, use a busca/filtro por categoria.
3. Entre no evento, escolha a quantidade de ingressos e siga para o checkout.
4. Confirme o pagamento simulado (~80% de chance de aprovação; se recusado, tente novamente).
5. Se aprovado, acesse "Meus Ingressos" e veja o QR code gerado.
6. Use o botão de compartilhar para copiar o link público do ingresso (acessível sem login).

### Como Portaria (`portaria@teste.com` / `123456`)
1. Faça logout do cliente e entre com o usuário de portaria.
2. Na tela de validação, leia o QR code pela câmera (ou digite manualmente o código exibido junto ao ingresso).
3. Confirme que o ingresso é validado como "válido" na primeira leitura.
4. Tente validar o mesmo ingresso novamente — deve retornar "já utilizado".

---

## Observações técnicas

- **Concorrência:** a reserva de ingressos e a validação na portaria usam atualizações atômicas no banco (via `updateMany` com condição), garantindo que o mesmo ingresso/vaga não seja vendido ou validado duas vezes, mesmo em requisições simultâneas.
- **QR code não-forjável:** o QR code de cada ingresso contém um token JWT assinado com `JWT_SECRET` (não apenas um código aleatório), impedindo que seja forjado sem acesso à chave do servidor.
- **Compartilhamento de ingresso:** a rota `GET /tickets/:id` é pública (sem autenticação), permitindo o acesso ao ingresso via link direto.
- **Pagamento simulado:** não há integração com nenhum gateway de pagamento real; o resultado (aprovado/recusado) é sorteado no back-end (`api/src/controllers/checkoutController.js`).
- **Cadastro de usuários:** não existe tela de cadastro público — os únicos usuários do sistema são os criados via `npm run seed`. Para adicionar mais usuários de teste, edite `api/prisma/seed.js`.

## Solução de problemas comuns

- **`Can't reach database server` ao rodar `migrate` ou `seed`:** o banco do Neon (plano gratuito) hiberna após alguns minutos de inatividade. Rode o comando novamente — a primeira tentativa "acorda" o banco.
- **Erro de CORS no navegador:** confirme que o back-end está rodando (`npm run dev` dentro de `api/`) antes de usar o front-end.
- **Front-end não encontra a API:** confirme que o arquivo `.env` da raiz do front-end tem exatamente `VITE_API_URL=http://localhost:3333` e reinicie o `npm run dev` do front após criá-lo ou editá-lo (o Vite só lê `.env` na inicialização).

## Nota de segurança

Os arquivos `.env` estão incluídos neste repositório (que é privado) apenas para facilitar a avaliação deste projeto, dispensando a criação de contas em serviços externos. Em um ambiente de produção real, credenciais nunca devem ser versionadas em texto plano — o correto é usar variáveis de ambiente configuradas separadamente em cada ambiente (local, CI, produção) e nunca commitadas no controle de versão. Se este repositório for tornado público no futuro, as credenciais (senha do banco Neon e chave TMDb) devem ser removidas do histórico e rotacionadas.

## Extra

As funções na sessão para gerenciar ingressos(Editar e Excluir), como também o status do evento, não foram conluidas ou testadas corretamente, logo desconsidere na avaliação como também a funcionalidade de camera para o QRCode.

Todas as tecnlogoias utilizadas nesse desafio foram escolhidas basedas na praticidade de codificação e resolução so problema. A ideia foi construir algo simples e direto, sem participação ativa da IA durante todo o projeto, mas sim em alguns pontos.


