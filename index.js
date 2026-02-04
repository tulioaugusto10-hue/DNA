import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

// memória simples
let token = null;
let expiraEm = null;

// 🔔 WEBHOOK DA CAKTO
app.post("/webhook/cakto", (req, res) => {
  if (req.body.event === "purchase_approved") {
    token = crypto.randomBytes(16).toString("hex");
    expiraEm = Date.now() + (15 * 60 * 1000); // 15 minutos
    console.log("TOKEN LIBERADO:", token);
  }
  res.send("OK");
});

// 🔓 ACESSO AO DOCUMENTO
app.get("/gerar-documento", (req, res) => {
  if (
    req.query.token !== token ||
    !expiraEm ||
    Date.now() > expiraEm
  ) {
    return res.status(403).send("Acesso negado");
  }

  // invalida depois de usar
  token = null;
  expiraEm = null;

  res.send("Documento gerado com sucesso!");
});

app.listen(process.env.PORT || 3000);
