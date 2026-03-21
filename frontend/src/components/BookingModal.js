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

                <div className="modal-header">
                    <h2>Reserve {resource.name}</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="resource-info">
                    <p><strong>Category:</strong> {resource.category}</p>
                    <p><strong>Description:</strong> {resource.description}</p>
                </div>

                {error && <p className="error">{error}</p>}

                <form className="modal-form" onSubmit={handleSubmit}>

                    <input
                        type="date"
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />

                    <div className="form-row">
                        <input
                            type="time"
                            onChange={(e) => setStart(e.target.value)}
                            required
                        />

                        <input
                            type="time"
                            onChange={(e) => setEnd(e.target.value)}
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="confirm-btn"
                            disabled={loading}
                        >
                            {loading ? "Booking..." : "Book Now"}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default BookingModal;