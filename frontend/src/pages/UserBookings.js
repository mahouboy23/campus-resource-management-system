import { useEffect, useState, useContext } from "react";
import UserNavbar from "../components/UserNavbar";
import { getMyBookings, deleteBooking } from "../services/bookingService";
import ConfirmModal from "../components/ConfirmModal";
import "../styles/booking.css";
import NotificationContext from "../context/NotificationContext";

const PAST_PAGE_SIZE = 3;

function UserBookings() {
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("upcoming");
    const [pastVisible, setPastVisible] = useState(PAST_PAGE_SIZE);
    const [bookingToDelete, setBookingToDelete] = useState(null);

    const notification = useContext(NotificationContext);

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await getMyBookings();
            setAllBookings(data);
        } catch (err) {
            notification?.showToast(err.message || "Failed to load bookings", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!bookingToDelete) return;
        try {
            await deleteBooking(bookingToDelete._id);
            notification?.showToast("Booking cancelled successfully", "success");
            setBookingToDelete(null);
            fetchBookings();
        } catch (err) {
            notification?.showToast(err.message || "Failed to cancel booking", "error");
            setBookingToDelete(null);
        }
    };

    const now = new Date();
    const upcomingBookings = allBookings.filter((b) => new Date(b.endTime) >= now);
    const pastBookings = allBookings.filter((b) => new Date(b.endTime) < now);

    const statusClass = (s) =>
        s === "approved" ? "approved" : s === "rejected" ? "rejected" : "pending";

    const renderBookingCard = (b) => (
        <div key={b._id} className="booking-card">
            <div className="booking-info">
                <h3>{b.resource?.icon} {b.resource?.name}</h3>
                <p className="booking-time">
                    {new Date(b.startTime).toLocaleString()} →{" "}
                    {new Date(b.endTime).toLocaleString()}
                </p>
            </div>
            <div className="booking-right">
                <span className={`status ${statusClass(b.status)}`}>{b.status}</span>
                {b.status === "pending" && (
                    <button className="btn-delete" onClick={() => setBookingToDelete(b)}>
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="layout">
            <UserNavbar />

            <div className="content">
                <h1>My Bookings</h1>

                {/* Tabs */}
                <div className="booking-tabs">
                    <button
                        className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
                        onClick={() => setActiveTab("upcoming")}
                    >
                        Upcoming
                        {upcomingBookings.length > 0 && (
                            <span className="tab-count">{upcomingBookings.length}</span>
                        )}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "past" ? "active" : ""}`}
                        onClick={() => { setActiveTab("past"); setPastVisible(PAST_PAGE_SIZE); }}
                    >
                        Past
                        {pastBookings.length > 0 && (
                            <span className="tab-count">{pastBookings.length}</span>
                        )}
                    </button>
                </div>

                {loading ? (
                    <p className="loading-text">Loading…</p>
                ) : (
                    <>
                        {/* Upcoming */}
                        {activeTab === "upcoming" && (
                            <div className="booking-list">
                                {upcomingBookings.length === 0 ? (
                                    <p className="empty-state">No upcoming bookings</p>
                                ) : (
                                    upcomingBookings.map(renderBookingCard)
                                )}
                            </div>
                        )}

                        {/* Past — paginated with "Show more" */}
                        {activeTab === "past" && (
                            <>
                                {pastBookings.length === 0 ? (
                                    <p className="empty-state">No past bookings</p>
                                ) : (
                                    <>
                                        <div className="booking-list past-bookings">
                                            {pastBookings.slice(0, pastVisible).map(renderBookingCard)}
                                        </div>

                                        {pastVisible < pastBookings.length && (
                                            <div className="show-more-wrap">
                                                <button
                                                    className="show-more-btn"
                                                    onClick={() => setPastVisible((v) => v + PAST_PAGE_SIZE)}
                                                >
                                                    Show more ({pastBookings.length - pastVisible} remaining)
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            <ConfirmModal
                isOpen={!!bookingToDelete}
                title="Cancel Booking"
                message={`Cancel booking for "${bookingToDelete?.resource?.name}"? This cannot be undone.`}
                confirmText="Yes, cancel it"
                cancelText="Keep it"
                onConfirm={handleDelete}
                onCancel={() => setBookingToDelete(null)}
            />
        </div>
    );
}

export default UserBookings;