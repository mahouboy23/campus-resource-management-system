import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function UserDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div>
            <Navbar />

            <div className="dashboard-container">
                <h1>User Dashboard</h1>

                <p>Welcome {user?.name}</p>

                <p>You can view and book campus resources here.</p>
            </div>
        </div>
    );
}

export default UserDashboard;