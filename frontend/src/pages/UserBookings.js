import { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import { getMyBookings } from "../services/bookingService";
import "../styles/booking.css";

function UserBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await getMyBookings();
            setBookings(data);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        if (status === "approved") return "green";
        if (status === "rejected") return "red";
        return "yellow";
    };

    return (
        <div className="layout">
            <UserNavbar />

            <div className="content">
                <h1>My Bookings</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : bookings.length === 0 ? (
                    <p>No bookings yet</p>
                ) : (
                    <div className="booking-list">
                        {bookings.map(b => (
                            <div key={b._id} className="booking-card">
                                <h3>{b.resource.name}</h3>

                                <p>
                                    {new Date(b.startTime).toLocaleString()} →
                                    {new Date(b.endTime).toLocaleString()}
                                </p>

                                <span className={getStatusClass(b.status)}>
                                    {b.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserBookings;