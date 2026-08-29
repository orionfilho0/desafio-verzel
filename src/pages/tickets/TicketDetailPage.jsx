import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getTicketById } from "../../lib/api/ticketsApi";

export default function TicketDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const isPublic = new URLSearchParams(location.search).get("public") === "1";

  useEffect(() => {
    async function loadTicket() {
      try {
        setTicket(await getTicketById(id));
      } catch (requestError) {
        setError(requestError.response?.data?.error || "Não foi possível carregar o ingresso.");
      } finally {
        setLoading(false);
      }
    }

    loadTicket();
  }, [id]);

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/tickets/${ticket.id}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Não foi possível copiar o link. Copie a URL diretamente pelo navegador.");
    }
  }

  if (loading) return <main className="min-h-screen p-8 text-center">Carregando ingresso…</main>;
  if (error || !ticket) return <main className="min-h-screen p-8 text-center text-red-600">{error || "Ingresso não encontrado."}</main>;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-xl px-5 py-8">
        {isPublic ? <p className="mb-5 text-center text-lg font-bold">elite<span className="text-rose-500">tix</span></p> : <button onClick={() => navigate("/tickets")} className="mb-5 text-sm text-slate-500">← Meus ingressos</button>}
        <article className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="bg-slate-950 p-6 text-white"><p className="font-mono text-xs text-amber-300">INGRESSO DIGITAL</p><h1 className="mt-3 text-2xl font-black">{ticket.event.title}</h1><p className="mt-4 text-sm text-slate-300">{new Date(ticket.event.eventDate).toLocaleString("pt-BR")}</p><p className="mt-1 text-sm text-slate-300">{ticket.event.location}</p></div>
          <div className="p-7 text-center"><img src={ticket.qrCode} alt="QR code do ingresso" className="mx-auto h-44 w-44" /><p className="mt-5 text-xs font-bold text-slate-400">APRESENTE ESTE CÓDIGO NA ENTRADA</p></div>
          <div className="flex justify-between p-6"><div><p className="text-xs font-bold text-slate-400">TITULAR</p><p>{ticket.holderName}</p></div><div className="text-right"><p className="text-xs font-bold text-slate-400">CÓDIGO</p><p className="font-mono font-bold text-rose-500">{ticket.code}</p></div></div>
          <button onClick={copyShareLink} className="mx-6 mb-6 w-[calc(100%-3rem)] rounded-md border p-3 text-sm font-bold">{copied ? "Copiado!" : "Copiar link de compartilhamento"}</button>
        </article>
      </main>
    </div>
  );
}
