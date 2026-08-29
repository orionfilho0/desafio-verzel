const QRCode = require("qrcode");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Código curto para digitação manual na portaria (independente do conteúdo do QR)
function generateManualCode() {
  return crypto.randomBytes(5).toString("hex").toUpperCase(); // ex: "A1B2C3D4E5"
}

// Token assinado (JWT) que vai DENTRO do QR — não pode ser forjado sem conhecer o JWT_SECRET
function generateTicketToken(ticketId) {
  return jwt.sign({ ticketId, type: "ticket" }, process.env.JWT_SECRET, { expiresIn: "2y" });
}

// Gera a imagem do QR code (base64) a partir do token assinado
async function generateQrCode(token) {
  return QRCode.toDataURL(token);
}

// Verifica um valor escaneado do QR. Retorna o ticketId se for um token válido, ou null caso contrário
// (nesse caso o chamador deve tentar tratar o valor como código manual digitado).
function verifyTicketToken(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== "ticket") return null;
    return payload.ticketId;
  } catch {
    return null;
  }
}

module.exports = { generateManualCode, generateTicketToken, generateQrCode, verifyTicketToken };