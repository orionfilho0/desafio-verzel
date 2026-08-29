require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const gateRoutes = require("./routes/gateRoutes");
const catalogRoutes = require("./routes/catalogRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API de eventos rodando com sucesso." });
});

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/reservations", reservationRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/tickets", ticketRoutes);
app.use("/gate", gateRoutes);
app.use("/catalog", catalogRoutes);

// Handler genérico de erro (fallback). O 4º parâmetro (_next) é obrigatório:
// é assim que o Express reconhece esta função como error handler.
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor." });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
