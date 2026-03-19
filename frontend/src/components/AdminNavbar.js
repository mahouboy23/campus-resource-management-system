import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <nav className="navbar">

            <div className="navbar-logo">
                Campus Resource Manager
            </div>

            <div className="navbar-links">

                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/resources">Resources</Link>
                <Link to="/admin/bookings">Bookings</Link>

                {user && (
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                )}

            </div>

        </nav>
    );
}

export default Navbar;