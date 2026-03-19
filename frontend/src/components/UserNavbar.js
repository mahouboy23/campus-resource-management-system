import { Link, useLocation } from "react-router-dom";
import "../styles/layout.css";

function AdminNavbar() {
    const location = useLocation();

    return (
        <div className="sidebar">

            <div className="logo">
                    User Panel
            </div>

            <ul className="nav-links">
                <li className={location.pathname === "/user" ? "active" : ""}>
                    <Link to="/user">Dashboard</Link>
                </li>

                <li className={location.pathname === "/user/resources" ? "active" : ""}>
                    <Link to="/user/resources">Resources</Link>
                </li>

                <li className={location.pathname === "/user/bookings" ? "active" : ""}>
                    <Link to="/user/bookings">Bookings</Link>
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