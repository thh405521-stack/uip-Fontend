import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';

// Ported from layouts/header.php + layouts/footer.php's <div class="app-shell">
// structure: fixed sidebar, topbar + routed content on the right, bottom nav
// on mobile. The AI Assistant widget from the full platform is dropped here
// since this standalone build has no /api/v1/ai-assistant/* backend.
export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar role={user?.role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className={`sidebar-overlay${sidebarOpen ? ' is-visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="app-shell__content">
        <Topbar user={user} onMenuClick={() => setSidebarOpen((o) => !o)} onLogout={logout} />

        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>

      <BottomNav role={user?.role} />
    </div>
  );
}
