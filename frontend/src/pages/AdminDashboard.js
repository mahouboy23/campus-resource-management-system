import AdminNavbar from "../components/AdminNavbar";
import "../styles/dashboard.css";

function AdminDashboard() {
    return (
        <div className="dashboard-container">

            <AdminNavbar />

            <div className="dashboard-content">

                <h1>Admin Dashboard</h1>

                <p>Welcome to the Campus Resource Management System.</p>

                <div className="dashboard-cards">

                    <div className="card">
                        <h3>Total Users</h3>
                        <p>--</p>
                    </div>

                    <div className="card">
                        <h3>Total Resources</h3>
                        <p>--</p>
                    </div>

                    <div className="card">
                        <h3>Pending Approvals</h3>
                        <p>--</p>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;