import { Link, useLocation } from "react-router-dom";
import "../styles/layout.css";

function AdminNavbar() {
    const location = useLocation();

    return (
        <div className="sidebar">

            <div className="logo">
                Admin Panel
            </div>

            <ul className="nav-links">
                <li className={location.pathname === "/admin" ? "active" : ""}>
                    <Link to="/admin">Dashboard</Link>
                </li>

                <li className={location.pathname === "/admin/resources" ? "active" : ""}>
                    <Link to="/admin/resources">Resources</Link>
                </li>

                <li className={location.pathname === "/admin/bookings" ? "active" : ""}>
                    <Link to="/admin/bookings">Bookings</Link>
                </li>
                <li className={location.pathname === "/admin/users" ? "active" : ""}>
                    <Link to="/admin/users">User management</Link>
                </li>
            </ul>

            <button className="logout-btn" onClick={() => {
                localStorage.clear();
                window.location.href = "/";
            }}>
                Logout
            </button>

        </div>
    );
}

export default AdminNavbar;