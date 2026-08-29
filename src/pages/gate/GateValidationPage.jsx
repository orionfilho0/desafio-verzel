import { Html5QrcodeScanner } from "html5-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import { validateTicket } from "../../lib/api/gateApi";

const results = { valid: { label: "INGRESSO VÁLIDO", color: "bg-emerald-600" }, invalid: { label: "CÓDIGO INVÁLIDO", color: "bg-red-600" }, already_used: { label: "INGRESSO JÁ UTILIZADO", color: "bg-amber-500" }, wrong_event: { label: "EVENTO INCORRETO", color: "bg-orange-500" } };

export default function GateValidationPage() {
  const scannerRef = useRef(null);
  const scanHandledRef = useRef(false);
  const [code, setCode] = useState("");
  const [eventId, setEventId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");

  const validateCode = useCallback(async (value) => {
    const ticketCode = value.trim();
    if (!ticketCode) return;

    setCode(ticketCode);
    setLoading(true);
    setError("");
    setResult(null);
    try {
      setResult(await validateTicket({ code: ticketCode, eventId }));
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Não foi possível validar o ingresso.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
    scannerRef.current = scanner;
    scanHandledRef.current = false;

    function onScanSuccess(decodedText) {
      if (scanHandledRef.current) return;

      scanHandledRef.current = true;
      void scanner.clear().catch(() => {});
      validateCode(decodedText);
    }

    function onScanFailure(scanError) {
      if (/notallowed|permission|denied|notfound|notreadable/i.test(String(scanError))) {
        setCameraError("Não foi possível acessar a câmera. Verifique a permissão do navegador ou use o código manual abaixo.");
      }
    }

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scannerRef.current = null;
      void scanner.clear().catch(() => {});
    };
  }, [validateCode]);

  function submit(event) {
    event.preventDefault();
    validateCode(code);
  }

  const current = result && (results[result.status] || results.invalid);

  return <div className="min-h-screen bg-slate-950 text-white"><main className="mx-auto max-w-5xl px-5 py-8"><p className="font-mono text-xs font-bold text-amber-300">VALIDAÇÃO DE ENTRADA</p><h1 className="mt-2 text-3xl font-black">Portaria</h1><section className="mt-6 rounded-lg bg-white p-4 text-slate-950"><h2 className="text-sm font-bold">Aponte a câmera para o QR code</h2><div id="qr-reader" className="mt-3 overflow-hidden rounded-md" />{cameraError && <p className="mt-3 text-sm text-amber-700">{cameraError}</p>}<p className="mt-6 border-t pt-5 text-sm font-bold">Ou digite o código</p><form onSubmit={submit} className="mt-3 sm:flex sm:items-end sm:gap-3"><label className="block flex-1 text-sm font-bold">Código do ingresso<input value={code} onChange={(event) => setCode(event.target.value)} required className="mt-2 w-full rounded-md border p-3 font-mono" /></label><label className="mt-3 block flex-1 text-sm font-bold sm:mt-0">ID do evento (opcional)<input value={eventId} onChange={(event) => setEventId(event.target.value)} className="mt-2 w-full rounded-md border p-3 font-mono" /></label><button disabled={loading} className="mt-3 rounded-md bg-rose-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-60 sm:mt-0">{loading ? "Validando…" : "Validar"}</button></form></section>{error && <p className="mt-6 text-red-300">{error}</p>}{current && <div className={`mt-8 rounded-xl p-7 text-center shadow-lg ${current.color}`}><p className="font-mono text-xs font-bold text-white/70">RESULTADO</p><h2 className="mt-3 text-3xl font-black">{current.label}</h2><p className="mt-3 text-white/90">{result.message}</p><p className="mt-5 font-mono text-xs text-white/70">{code}</p></div>}</main></div>;
}
