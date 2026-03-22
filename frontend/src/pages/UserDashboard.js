import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { getDashboardStats } from "../services/bookingService";
import NotificationContext from "../context/NotificationContext";
import "../styles/dashboard.css";

function UserDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const notification = useContext(NotificationContext);

    const [stats, setStats] = useState({
        totalBookings: 0,
        upcomingBookings: 0,
        pendingApproval: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data.stats);
            setRecentBookings(data.recentBookings);
        } catch (err) {
            notification?.showToast(err.message || "Failed to load dashboard", "error");
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        if (status === "approved") return "approved";
        if (status === "rejected") return "rejected";
        return "pending";
    };

    return (
        <div className="dashboard">
            <UserNavbar />

            <div className="main">
                <div className="welcome">
                    <h1>Welcome back, {user?.name || "User"}!</h1>
                    <p>Explore available campus resources and make bookings easily.</p>
                </div>

                {/* Stats Cards */}
                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <h3>Total Bookings</h3>
                        <p>{loading ? "—" : stats.totalBookings}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Upcoming</h3>
                        <p>{loading ? "—" : stats.upcomingBookings}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Pending Approval</h3>
                        <p>{loading ? "—" : stats.pendingApproval}</p>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="recent-section">
                    <div className="recent-header">
                        <h3>Recent Bookings</h3>
                        <button
                            className="view-all-btn"
                            onClick={() => navigate("/user/bookings")}
                        >
                            View all →
                        </button>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : recentBookings.length === 0 ? (
                        <p className="empty-state">No bookings yet</p>
                    ) : (
                        <div className="recent-list">
                            {recentBookings.map((b) => (
                                <div
                                    key={b._id}
                                    className="recent-booking-item"
                                    onClick={() => navigate("/user/bookings")}
                                >
                                    <div className="recent-booking-info">
                                        <span className="recent-resource-name">
                                            {b.resource?.icon} {b.resource?.name}
                                        </span>
                                        <span className="recent-booking-time">
                                            {new Date(b.startTime).toLocaleDateString()} ·{" "}
                                            {new Date(b.startTime).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </span>
                                    </div>

                                    <span className={`status ${getStatusClass(b.status)}`}>
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

export default UserDashboard;