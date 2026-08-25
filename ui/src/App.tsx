import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { GuestEventsPage } from "./pages/GuestEventsPage";
import { GuestEventSlotsPage } from "./pages/GuestEventSlotsPage";
import { OwnerProfilePage } from "./pages/OwnerProfilePage";
import { OwnerEventTypesPage } from "./pages/OwnerEventTypesPage";
import { OwnerBookingsPage } from "./pages/OwnerBookingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<GuestEventsPage />} />
        <Route path="/events/:id" element={<GuestEventSlotsPage />} />
        <Route path="/owner" element={<OwnerProfilePage />} />
        <Route path="/owner/event-types" element={<OwnerEventTypesPage />} />
        <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
        <Route path="/admin" element={<Navigate to="/owner" replace />} />
        <Route path="/admin/events" element={<Navigate to="/owner/event-types" replace />} />
        <Route path="/admin/bookings" element={<Navigate to="/owner/bookings" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
