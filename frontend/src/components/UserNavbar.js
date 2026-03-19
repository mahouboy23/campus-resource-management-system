import { Link } from "react-router-dom";

function UserNavbar() {
    return (
        <div className="sidebar">
            <h2>Campus Manager</h2>

            <nav>
                <Link to="/user">Dashboard</Link>
                <Link to="/user/resources">Resources</Link>
                <Link to="/user/bookings">My Bookings</Link>
            </nav>

            <button onClick={() => {
                localStorage.clear();
                window.location.href = "/";
            }}>
                Logout
            </button>
        </div>
    );
}

export default UserNavbar;