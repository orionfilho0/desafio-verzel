import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTickets } from "../../lib/api/ticketsApi";

const status = { valid: ["Válido", "bg-rose-100 text-rose-700"], used: ["Utilizado", "bg-amber-100 text-amber-800"], expired: ["Expirado", "bg-slate-200 text-slate-600"] };
const date = (iso) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTickets() {
      try {
        setTickets(await getMyTickets());
      } catch (requestError) {
        setError(requestError.response?.data?.error || "Não foi possível carregar seus ingressos.");
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

  return <div className="min-h-screen bg-slate-50"><main className="mx-auto max-w-5xl px-5 py-9"><p className="font-mono text-xs font-bold text-rose-500">ÁREA DO CLIENTE</p><h1 className="mt-2 text-3xl font-black">Meus ingressos</h1>{loading && <p className="mt-7">Carregando ingressos…</p>}{error && <p className="mt-7 text-red-600">{error}</p>}{!loading && !error && <div className="mt-7 grid gap-4">{tickets.length ? tickets.map((ticket) => { const current = status[ticket.status] || [ticket.status, "bg-slate-200 text-slate-600"]; return <article key={ticket.id} className="relative overflow-hidden rounded-lg border bg-white sm:grid sm:grid-cols-[145px_1fr_auto]"><div className="flex min-h-32 items-end bg-slate-950 p-4 text-white"><p className="font-mono text-xs"><strong className="block text-amber-300">{date(ticket.event.eventDate)}</strong>{new Date(ticket.event.eventDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p></div><div className="p-5"><h2 className="font-black">{ticket.event.title}</h2><p className="mt-2 text-sm text-slate-500">{ticket.event.location}</p><p className="mt-3 font-mono text-xs text-slate-400">{ticket.code}</p></div><div className="flex items-center gap-4 p-5 sm:flex-col sm:justify-center"><img src={ticket.qrCode} alt="QR code do ingresso" className="h-20 w-20" /><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${current[1]}`}>{current[0]}</span><button onClick={() => navigate(`/tickets/${ticket.id}`)} className="text-sm font-bold text-rose-500">Ver ingresso →</button></div></article>; }) : <p>Nenhum ingresso encontrado.</p>}</div>}</main></div>;
}
