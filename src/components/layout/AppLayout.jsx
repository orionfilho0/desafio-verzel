import { NavLink, Outlet, useNavigate } from "react-router-dom";

const linkClass = ({ isActive }) => `cursor-pointer rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-white/10 hover:text-white ${isActive ? "bg-white/10 text-rose-400 shadow-sm" : "text-slate-300"}`;

export default function AppLayout() {
  const navigate = useNavigate();
  const role = localStorage.getItem("elitetix_role");

  function logout() {
    localStorage.removeItem("elitetix_token");
    localStorage.removeItem("elitetix_role");
    localStorage.removeItem("elitetix_user");
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950 text-white shadow-sm">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-2">
          <NavLink to="/events" className="cursor-pointer text-lg font-bold transition-opacity duration-200 hover:opacity-80">elite<span className="text-rose-500">tix</span></NavLink>
          <nav className="flex flex-wrap items-center gap-1" aria-label="Navegação principal">
            <NavLink to="/events" className={linkClass}>Eventos</NavLink>
            {role === "CLIENT" && <NavLink to="/tickets" className={linkClass}>Meus ingressos</NavLink>}
            {role === "ORGANIZER" && <><NavLink to="/organizer" end className={linkClass}>Gerenciar eventos</NavLink><NavLink to="/organizer/new" className={linkClass}>Criar evento</NavLink></>}
            {role === "GATE" && <NavLink to="/gate" className={linkClass}>Validar ingresso</NavLink>}
            {!role && <NavLink to="/login" className={linkClass}>Entrar</NavLink>}
            {role && <button type="button" onClick={logout} className="cursor-pointer rounded-md px-3 py-2 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:bg-white/10 hover:text-white">Sair</button>}
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
