import { useState } from "react";
import { createBooking } from "../services/bookingService";
import "../styles/modal.css";

function BookingModal({ resource, onClose, onSuccess }) {
    const [date, setDate] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const startTime = new Date(`${date}T${start}`);
        const endTime = new Date(`${date}T${end}`);

        if (startTime >= endTime) {
            return setError("End time must be after start time");
        }

        if (startTime < new Date()) {
            return setError("Cannot book in the past");
        }

        try {
            setLoading(true);
            await createBooking({
                resource: resource._id,
                startTime,
                endTime
            });

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Book {resource.name}</h2>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input type="date" onChange={(e) => setDate(e.target.value)} required />
                    <input type="time" onChange={(e) => setStart(e.target.value)} required />
                    <input type="time" onChange={(e) => setEnd(e.target.value)} required />

                    <button disabled={loading}>
                        {loading ? "Booking..." : "Confirm Booking"}
                    </button>
                </form>

                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default BookingModal;