import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../../lib/api/eventsApi";

const CATEGORIES = ["Todos", "Show", "Teatro", "Cinema", "Esporte", "Festival", "Outro"];
const formatDate = (iso) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
const formatTime = (iso) => new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

export default function EventListPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        setEvents(await getEvents({ category: activeCategory === "Todos" ? undefined : activeCategory, search }));
      } catch (requestError) {
        setError(requestError.response?.data?.error || "Não foi possível carregar os eventos.");
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [activeCategory, search]);

  return <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4", minHeight: "100vh", color: "#333" }}>
    <div style={{ backgroundColor: "#3a3a3a", padding: "20px 0", color: "#fff", borderBottom: "1px solid rgba(255, 255, 255, 0.14)" }}><div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}><label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "bold" }}>Buscar Evento:<input placeholder="Digite o nome do evento..." value={search} onChange={(event) => setSearch(event.target.value)} className="event-search-input" /></label></div></div>
    <main style={{ maxWidth: "1000px", margin: "20px auto", padding: "0 20px" }}><div style={{ borderBottom: "2px solid #ccc", marginBottom: "20px", display: "flex", gap: "5px", flexWrap: "wrap" }}>{CATEGORIES.map((category) => <button key={category} onClick={() => setActiveCategory(category)} style={{ padding: "8px 16px", border: "1px solid #ccc", background: activeCategory === category ? "#fff" : "#e0e0e0", fontWeight: activeCategory === category ? "bold" : "normal", cursor: "pointer" }}>{category}</button>)}</div><div style={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "3px" }}><div style={{ backgroundColor: "#eee", padding: "10px 15px", fontWeight: "bold" }}>Próximos Eventos Disponíveis</div>{loading && <p style={{ padding: "30px" }}>Carregando eventos…</p>}{error && <p style={{ padding: "30px", color: "#b91c1c" }}>{error}</p>}{!loading && !error && (events.length ? <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>{events.map((event, index) => <li key={event.id} style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", padding: "15px", borderBottom: index < events.length - 1 ? "1px solid #eee" : "none" }}><div style={{ minWidth: "120px" }}><strong style={{ color: "#d9534f" }}>{formatDate(event.eventDate)}</strong><br /><small>{formatTime(event.eventDate)} hs</small></div><div style={{ flex: 1, minWidth: "200px" }}><small>{event.category}</small><h3 style={{ margin: "5px 0" }}>{event.title}</h3><small>{event.location}</small></div><div style={{ textAlign: "right", minWidth: "140px" }}><b>R$ {Number(event.price).toFixed(2)}</b><br /><button onClick={() => navigate(`/events/${event.id}`)} className="buy-tickets-btn">Comprar Ingressos</button></div></li>)}</ul> : <p style={{ padding: "30px", textAlign: "center" }}>Nenhum evento encontrado.</p>)}</div></main>
  </div>;
}
