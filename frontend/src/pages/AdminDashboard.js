import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { getAdminStats } from "../services/userService";
import NotificationContext from "../context/NotificationContext";
import "../styles/dashboard.css";
import "../styles/admin.css";

function AdminDashboard() {
    const navigate = useNavigate();
    const notification = useContext(NotificationContext);

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalResources: 0,
        pendingBookings: 0,
        totalBookings: 0,
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminStats()
            .then((data) => {
                setStats(data.stats);
                setRecentBookings(data.recentBookings);
            })
            .catch((err) =>
                notification?.showToast(err.message || "Failed to load stats", "error")
            )
            .finally(() => setLoading(false));
    }, []);

    const statCards = [
        { label: "Total Users", value: stats.totalUsers, icon: "👥", path: "/admin/users" },
        { label: "Total Resources", value: stats.totalResources, icon: "📦", path: "/admin/resources" },
        { label: "Pending Bookings", value: stats.pendingBookings, icon: "⏳", path: "/admin/bookings?status=pending" },
        { label: "Total Bookings", value: stats.totalBookings, icon: "📅", path: "/admin/bookings" },
    ];

    const statusClass = (s) =>
        s === "approved" ? "approved" : s === "rejected" ? "rejected" : "pending";

    return (
        <div className="dashboard">
            <AdminNavbar />

            <div className="main">
                <div className="welcome">
                    <h1>Admin Dashboard</h1>
                    <p>Overview of the Campus Resource Management System.</p>
                </div>

                {/* Stat cards */}
                <div className="dashboard-cards">
                    {statCards.map((c) => (
                        <div
                            key={c.label}
                            className="dashboard-card clickable-card"
                            onClick={() => navigate(c.path)}
                        >
                            <div className="card-icon">{c.icon}</div>
                            <h3>{c.label}</h3>
                            <p>{loading ? "—" : c.value}</p>
                        </div>
                    ))}
                </div>

                {/* Recent bookings */}
                <div className="recent-section">
                    <div className="recent-header">
                        <h3>Recent Booking Requests</h3>
                        <button
                            className="view-all-btn"
                            onClick={() => navigate("/admin/bookings")}
                        >
                            View all →
                        </button>
                    </div>

                    {loading ? (
                        <p className="loading-text">Loading…</p>
                    ) : recentBookings.length === 0 ? (
                        <p className="empty-state">No bookings yet</p>
                    ) : (
                        <div className="recent-list">
                            {recentBookings.map((b) => (
                                <div
                                    key={b._id}
                                    className="recent-booking-item"
                                    onClick={() => navigate("/admin/bookings")}
                                >
                                    <div className="recent-booking-info">
                                        <span className="recent-resource-name">
                                            {b.resource?.icon} {b.resource?.name}
                                        </span>
                                        <span className="recent-booking-time">
                                            {b.user?.name} · {new Date(b.startTime).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className={`status ${statusClass(b.status)}`}>
                                        {b.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;