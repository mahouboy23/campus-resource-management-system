import { useState, useEffect, useContext } from "react";
import { createBooking, getResourceBookings } from "../services/bookingService";
import NotificationContext from "../context/NotificationContext";
import "../styles/modal.css";

// ─── tiny helper ──────────────────────────────────────────────────────────────
function isoDate(d) {
    return d.toISOString().split("T")[0];
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekday(year, month) {
    return new Date(year, month, 1).getDay(); // 0=Sun
}

// ─── MiniCalendar ─────────────────────────────────────────────────────────────
function MiniCalendar({ bookedDates, selectedDate, onSelect }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstWeekday = getFirstWeekday(viewYear, viewMonth);
    const monthName = new Date(viewYear, viewMonth).toLocaleString("default", {
        month: "long", year: "numeric",
    });

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const cells = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div className="mini-calendar">
            <div className="mini-cal-nav">
                <button type="button" onClick={prevMonth}>‹</button>
                <span>{monthName}</span>
                <button type="button" onClick={nextMonth}>›</button>
            </div>

            <div className="mini-cal-grid">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                    <div key={d} className="mini-cal-dow">{d}</div>
                ))}

                {cells.map((day, i) => {
                    if (!day) return <div key={`e${i}`} />;

                    const date = new Date(viewYear, viewMonth, day);
                    const dateStr = isoDate(date);
                    const isPast = date < today;
                    const isBooked = bookedDates.has(dateStr);
                    const isSelected = selectedDate === dateStr;

                    let cls = "mini-cal-day";
                    if (isPast) cls += " past";
                    else if (isBooked) cls += " booked";
                    if (isSelected) cls += " selected";

                    return (
                        <button
                            key={day}
                            type="button"
                            className={cls}
                            disabled={isPast}
                            onClick={() => !isPast && onSelect(dateStr)}
                        >
                            {day}
                            {isBooked && !isPast && <span className="booked-dot" />}
                        </button>
                    );
                })}
            </div>

            <div className="mini-cal-legend">
                <span className="legend-booked" /> Already booked
            </div>
        </div>
    );
}

// ─── BookingModal ──────────────────────────────────────────────────────────────
function BookingModal({ resource, onClose, onSuccess }) {
    const [date, setDate] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [bookedDates, setBookedDates] = useState(new Set());

    const { showToast } = useContext(NotificationContext);

    // Fetch existing bookings for this resource to highlight the calendar
    useEffect(() => {
        getResourceBookings(resource._id)
            .then((bookings) => {
                const dates = new Set();
                bookings.forEach((b) => {
                    const start = new Date(b.startTime);
                    const end = new Date(b.endTime);
                    // Mark every calendar day that overlaps this booking
                    const cursor = new Date(start);
                    cursor.setHours(0, 0, 0, 0);
                    const endDay = new Date(end);
                    endDay.setHours(0, 0, 0, 0);
                    while (cursor <= endDay) {
                        dates.add(isoDate(cursor));
                        cursor.setDate(cursor.getDate() + 1);
                    }
                });
                setBookedDates(dates);
            })
            .catch(() => { }); // silently ignore — calendar still works without it
    }, [resource._id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!date) return setError("Please select a date");

        const startTime = new Date(`${date}T${start}`);
        const endTime = new Date(`${date}T${end}`);

        if (startTime >= endTime) return setError("End time must be after start time");
        if (startTime < new Date()) return setError("Cannot book in the past");

        try {
            setLoading(true);
            await createBooking({
                resource: resource._id,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
            });
            showToast("Booking request sent!", "success");
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
            showToast(err.message || "Failed to create booking", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content booking-modal-wide">

                <div className="modal-header">
                    <h2>Reserve {resource.icon} {resource.name}</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="resource-info">
                    <p><strong>Category:</strong> {resource.category}</p>
                    {resource.description && (
                        <p><strong>Description:</strong> {resource.description}</p>
                    )}
                </div>

                <div className="booking-modal-body">
                    {/* Left: calendar */}
                    <MiniCalendar
                        bookedDates={bookedDates}
                        selectedDate={date}
                        onSelect={setDate}
                    />

                    {/* Right: time + submit */}
                    <form className="modal-form booking-form-right" onSubmit={handleSubmit}>
                        <div className="selected-date-display">
                            {date
                                ? new Date(date + "T00:00").toLocaleDateString("default", {
                                    weekday: "long", year: "numeric",
                                    month: "long", day: "numeric",
                                })
                                : "No date selected"}
                        </div>

                        {bookedDates.has(date) && date && (
                            <p className="warning-text">
                                ⚠️ This day already has bookings — pick different times or another day.
                            </p>
                        )}

                        <label className="form-label">Start time</label>
                        <input
                            type="time"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            required
                        />

                        <label className="form-label">End time</label>
                        <input
                            type="time"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            required
                        />

                        {error && <p className="error">{error}</p>}

                        <div className="modal-actions">
                            <button type="button" className="cancel-btn" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="confirm-btn" disabled={loading || !date}>
                                {loading ? "Booking…" : "Book Now"}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default BookingModal;