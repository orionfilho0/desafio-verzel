import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import EventDetailPage from "./pages/events/EventDetailPage";
import EventListPage from "./pages/events/EventListPage";
import GateValidationPage from "./pages/gate/GateValidationPage";
import CreateEventPage from "./pages/organizer/CreateEventPage";
import ManageEventsPage from "./pages/organizer/ManageEventsPage";
import MyTicketsPage from "./pages/tickets/MyTicketsPage";
import TicketDetailPage from "./pages/tickets/TicketDetailPage";
import AppLayout from "./components/layout/AppLayout";
import RequireRole from "./components/routing/RequireRole";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/events" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/events" element={<EventListPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/tickets" element={<MyTicketsPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
        <Route path="/organizer" element={<ManageEventsPage />} />
        <Route path="/organizer/new" element={<CreateEventPage />} />
        <Route element={<RequireRole role="GATE" />}>
          <Route path="/gate" element={<GateValidationPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/events" replace />} />
    </Routes>
  );
}
