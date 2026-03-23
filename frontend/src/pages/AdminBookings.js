import { useEffect, useState, useContext, useCallback } from "react";
import AdminNavbar from "../components/AdminNavbar";
import ConfirmModal from "../components/ConfirmModal";
import { getAllBookings, approveBooking, rejectBooking } from "../services/bookingService";
import NotificationContext from "../context/NotificationContext";
import "../styles/booking.css";
import "../styles/admin.css";

const STATUS_TABS = [
    { key: "", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
];

function AdminBookings() {
    const notification = useContext(NotificationContext);

    const [bookings, setBookings] = useState([]);
    const [allBookings, setAllBookings] = useState([]); // unfiltered, for user list
    const [loading, setLoading] = useState(true);
    const [activeStatus, setActiveStatus] = useState("");
    const [userFilter, setUserFilter] = useState("");
    const [userSearch, setUserSearch] = useState("");

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [actionType, setActionType] = useState(null); // "approve"|"reject"

    // Build unique users from all bookings for the dropdown
    const uniqueUsers = useCallback(() => {
        const map = {};
        allBookings.forEach((b) => {
            if (b.user?._id) map[b.user._id] = b.user.name || b.user.email;
        });
        return Object.entries(map).map(([id, name]) => ({ id, name }));
    }, [allBookings]);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllBookings({
                status: activeStatus || undefined,
                user: userFilter || undefined,
            });
            setBookings(data || []);
            // keep the full list for user dropdown (only refresh when no filters)
            if (!activeStatus && !userFilter) setAllBookings(data || []);
        } catch (err) {
            notification?.showToast(err.message || "Failed to load bookings", "error");
        } finally {
            setLoading(false);
        }
    }, [activeStatus, userFilter]);

    // Initial load of all bookings for the user dropdown
    useEffect(() => {
        getAllBookings().then((d) => setAllBookings(d || [])).catch(() => { });
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleConfirm = async () => {
        try {
            if (actionType === "approve") {
                await approveBooking(selectedBooking._id);
                notification?.showToast("Booking approved", "success");
            } else {
                await rejectBooking(selectedBooking._id);
                notification?.showToast("Booking rejected", "success");
            }
            setSelectedBooking(null);
            load();
        } catch (err) {
            notification?.showToast(err.message || "Action failed", "error");
            setSelectedBooking(null);
        }
    };

    // Client-side user search on top of selected user filter
    const displayed = userSearch
        ? bookings.filter((b) =>
            (b.user?.name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
            (b.user?.email || "").toLowerCase().includes(userSearch.toLowerCase())
        )
        : bookings;

    const statusClass = (s) =>
        s === "approved" ? "approved" : s === "rejected" ? "rejected" : "pending";

    // Counts per tab
    const countByStatus = (key) =>
        allBookings.filter((b) => (key ? b.status === key : true)).length;

    return (
        <div className="layout">
            <AdminNavbar />

            <div className="content">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1>Bookings</h1>
                        <p className="page-subtitle">Review and manage all booking requests.</p>
                    </div>
                </div>

                {/* Status tabs */}
                <div className="booking-tabs">
                    {STATUS_TABS.map((t) => (
                        <button
                            key={t.key}
                            className={`tab-btn ${activeStatus === t.key ? "active" : ""}`}
                            onClick={() => { setActiveStatus(t.key); setUserFilter(""); }}
                        >
                            {t.label}
                            <span className="tab-count">{countByStatus(t.key)}</span>
                        </button>
                    ))}
                </div>

                {/* Filters bar */}
                <div className="admin-filters">
                    <input
                        className="search-bar"
                        placeholder="Search by user name or email…"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                    />

                    <select
                        className="sort-select"
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                    >
                        <option value="">All users</option>
                        {uniqueUsers().map((u) => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>

                {/* Booking list */}
                {loading ? (
                    <p className="loading-text">Loading bookings…</p>
                ) : displayed.length === 0 ? (
                    <p className="empty-state">No bookings found</p>
                ) : (
                    <div className="booking-list">
                        {displayed.map((b) => (
                            <div key={b._id} className="booking-card">
                                <div className="booking-info">
                                    <h3>
                                        {b.resource?.icon && `${b.resource.icon} `}
                                        {b.resource?.name || "Resource"}
                                    </h3>
                                    <p className="booking-time">
                                        {new Date(b.startTime).toLocaleString()} →{" "}
                                        {new Date(b.endTime).toLocaleString()}
                                    </p>
                                    <p className="muted">
                                        <span className="user-badge">
                                            {b.user?.name || b.user?.email || "Unknown"}
                                        </span>
                                        {b.resource?.category && (
                                            <span className="category-tag">
                                                {b.resource.category}
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="booking-right">
                                    <span className={`status ${statusClass(b.status)}`}>
                                        {b.status}
                                    </span>

                                    {b.status === "pending" && (
                                        <div className="admin-actions">
                                            <button
                                                className="btn-approve"
                                                onClick={() => { setSelectedBooking(b); setActionType("approve"); }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => { setSelectedBooking(b); setActionType("reject"); }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={!!selectedBooking}
                title={actionType === "approve" ? "Approve Booking" : "Reject Booking"}
                message={`Are you sure you want to ${actionType} the booking for "${selectedBooking?.resource?.name}" by ${selectedBooking?.user?.name}?`}
                confirmText={actionType === "approve" ? "Yes, Approve" : "Yes, Reject"}
                cancelText="Cancel"
                onConfirm={handleConfirm}
                onCancel={() => setSelectedBooking(null)}
            />
        </div>
    );
}

export default AdminBookings;