# API - Sistema de Venda de Ingressos

## Passo a passo para rodar

1. **Instalar dependências**
   ```bash
   cd api
   npm install
   ```

2. **Preencher o `.env`**
   O arquivo `.env` já vem com `JWT_SECRET` e `TMDB_API_KEY` preenchidos.
   Falta só colar a sua `DATABASE_URL` do Neon (copie do painel do Neon):
   ```
   DATABASE_URL="postgresql://usuario:senha@host.neon.tech/nome_banco?sslmode=require"
   ```

3. **Rodar as migrations** (cria as tabelas no banco do Neon)
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Popular o banco com usuários de teste**
   ```bash
   npm run seed
   ```
   Isso cria:
   - `organizador@teste.com` / `123456` (role ORGANIZER)
   - `cliente@teste.com` / `123456` (role CLIENT)
   - `portaria@teste.com` / `123456` (role GATE)
   - 1 evento de exemplo

5. **Subir o servidor**
   ```bash
   npm run dev
   ```
   A API sobe em `http://localhost:3333`.

## Endpoints disponíveis

| Método | Rota | Protegida? | Role |
|---|---|---|---|
| POST | /auth/login | Não | - |
| GET | /events | Não | - |
| GET | /events/:id | Não | - |
| GET | /events/mine | Sim | ORGANIZER |
| POST | /events | Sim | ORGANIZER |
| POST | /reservations | Sim | CLIENT |
| POST | /checkout | Sim | CLIENT |
| GET | /tickets/me | Sim | CLIENT |
| GET | /tickets/:id | Não | - |
| POST | /gate/validate | Sim | GATE |
| GET | /catalog/search?query=... | Sim | ORGANIZER |

Rotas protegidas exigem o header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

## Observações
- O checkout é simulado: 80% de chance de aprovação, 20% de recusa (ver `checkoutController.js` se quiser ajustar).
- O QR code é gerado como uma string base64 (`data:image/png;base64,...`) — no front, basta usar direto em `<img src={ticket.qrCode} />`.
- O código manual do ticket (`ticket.code`) é o mesmo valor codificado no QR — serve para digitação manual na tela de portaria.
