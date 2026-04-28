import { Car, Heart, LogOut, Shield } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

const navClass = ({ isActive }) =>
  `text-sm font-semibold transition ${isActive ? "text-teal" : "text-ink/70 hover:text-ink"}`;

export default function Layout() {
  const { isAuthenticated, logout } = useAuth();
  const { ids } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-mist text-ink">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur">
        <div className="container-pad flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-lg font-black">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-white">
              <Car size={20} />
            </span>
            Reliable Drives
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <NavLink className={navClass} to="/cars">Cars</NavLink>
            <span className="hidden items-center gap-1 text-sm font-semibold text-ink/60 sm:inline-flex">
              <Heart size={16} /> {ids.length}
            </span>
            {isAuthenticated ? (
              <>
                <NavLink className={navClass} to="/admin">Dashboard</NavLink>
                <button className="btn-secondary px-3" onClick={handleLogout} title="Logout">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <NavLink className={navClass} to="/admin/login">
                <span className="inline-flex items-center gap-1"><Shield size={16} /> Admin</span>
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="mt-16 border-t border-line bg-white">
        <div className="container-pad flex flex-col gap-3 py-8 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between">
          <p>Reliable Drives. Inspected second-hand cars with transparent pricing.</p>
          <p>Built for Vercel, Netlify, Render, Railway, and MongoDB Atlas.</p>
        </div>
      </footer>
    </div>
  );
}
