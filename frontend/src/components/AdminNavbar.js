import { Link, useLocation } from "react-router-dom";
import "../styles/layout.css";

const NAV_LINKS = [
    { path: "/admin", label: "Dashboard", icon: "⊞" },
    { path: "/admin/resources", label: "Resources", icon: "📦" },
    { path: "/admin/bookings", label: "Bookings", icon: "📅" },
    { path: "/admin/users", label: "User Management", icon: "👥" },
];

function AdminNavbar() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const initials = user?.name
        ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
        : "A";

    return (
        <div className="sidebar">
            {/* Brand */}
            <div className="sidebar-brand">
                <span className="brand-icon">🏛️</span>
                <span className="brand-name">Campus</span>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <p className="nav-section-label">Admin Menu</p>
                <ul className="nav-links">
                    {NAV_LINKS.map(({ path, label, icon }) => (
                        <li key={path} className={location.pathname === path ? "active" : ""}>
                            <Link to={path}>
                                <span className="nav-icon">{icon}</span>
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Account section */}
            <div className="sidebar-footer">
                <div className="account-card">
                    <div className="account-avatar admin-avatar">{initials}</div>
                    <div className="account-info">
                        <p className="account-name">{user?.name || "Admin"}</p>
                        <p className="account-email">{user?.email || ""}</p>
                    </div>
                </div>
                <button
                    className="logout-btn"
                    onClick={() => { localStorage.clear(); window.location.href = "/"; }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default AdminNavbar;