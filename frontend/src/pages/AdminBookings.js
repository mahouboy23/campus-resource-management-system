import { useEffect, useState, useContext } from "react";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/booking.css";
import ConfirmModal from "../components/ConfirmModal";

import {
    getAllBookings,
    approveBooking,
    rejectBooking
} from "../services/bookingService";

import NotificationContext from "../context/NotificationContext";

function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [actionType, setActionType] = useState(null);

    const notification = useContext(NotificationContext);

    const load = async () => {
        try {
            setLoading(true);
            const data = await getAllBookings();
            setBookings(data || []);
        } catch (err) {
            setError(err.message || "Failed to load bookings");
            notification?.showToast(err.message || "Failed to load bookings", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const openApprove = (booking) => {
        setSelectedBooking(booking);
        setActionType("approve");
    };

    const openReject = (booking) => {
        setSelectedBooking(booking);
        setActionType("reject");
    };

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
        }
    };

    return (
        <div className="layout">
            <AdminNavbar />

            <div className="content">
                <h1>Admin Bookings</h1>
                <p>Manage and approve user booking requests.</p>

                {loading ? (
                    <p>Loading bookings...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : bookings.length === 0 ? (
                    <p>No bookings found</p>
                ) : (
                    <div className="booking-list">
                        {bookings.map((b) => (
                            <div key={b._id} className="booking-card">

                                <div className="booking-info">
                                    <h3>{b.resource?.name || "Resource"}</h3>

                                    <p className="booking-time">
                                        {new Date(b.startTime).toLocaleString()} →
                                        {new Date(b.endTime).toLocaleString()}
                                    </p>

                                    <p className="muted">
                                        By: {b.user?.name || b.user?.email || "Unknown"}
                                    </p>
                                </div>

                                <div className="booking-right">
                                    <span className={`status ${b.status}`}>
                                        {b.status}
                                    </span>

                                    {b.status === "pending" && (
                                        <div className="admin-actions">
                                            <button
                                                className="btn-approve"
                                                onClick={() => openApprove(b)}
                                            >
                                                Approve
                                            </button>

                                            <button
                                                className="btn-reject"
                                                onClick={() => openReject(b)}
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
                title={
                    actionType === "approve"
                        ? "Approve Booking"
                        : "Reject Booking"
                }
                message={`Are you sure you want to ${actionType} this booking?`}
                confirmText={actionType === "approve" ? "Approve" : "Reject"}
                cancelText="Cancel"
                onConfirm={handleConfirm}
                onCancel={() => setSelectedBooking(null)}
            />
        </div>
    );
}

export default AdminBookings;
