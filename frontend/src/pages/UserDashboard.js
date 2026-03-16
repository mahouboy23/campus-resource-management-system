import "../dashboard.css";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/"); // goes back to login page
    };

    return (
        <div className="dashboard">

            {/* Sidebar */}
            <div className="sidebar">

                <div className="logo">
                    <span>Campus Resource Management System</span>
                </div>

                <nav>
                    <a className="active">Dashboard</a>
                    <a href="/resources">Resources</a>
                    <a href="/bookings">My Bookings</a>
                    <a className="logout" onClick={handleLogout}>Log Out</a>
                </nav>

            </div>

            {/* Main content */}
            <div className="main">

                <div className="welcome">
                    <h1>Welcome back, {user?.name || "User"}!</h1>
                    <p>Explore available campus resources and make bookings easily.</p>
                </div>

                {/* Resource cards */}
                <div className="cards">

                    <div className="card">
                        <h3>Video Equipment</h3>
                        <p>Check items available</p>
                    </div>

                    <div className="card">
                        <h3>Classrooms</h3>
                        <p>Check items available</p>
                    </div>

                    <div className="card">
                        <h3>Materials</h3>
                        <p>Check items available</p>
                    </div>

                </div>

                {/* Recent bookings */}
                <div className="recent">
                    <h3>Recent Bookings</h3>
                    <p>None</p>
                </div>

            </div>

        </div>
    );
}

export default UserDashboard;