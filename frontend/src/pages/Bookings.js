import "../dashboard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Bookings() {

    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const [booking, setBooking] = useState({
        resourceType: "",
        resource: "",
        date: "",
        startTime: "",
        endTime: "",
        purpose: ""
    });

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleChange = (e) => {
        setBooking({
            ...booking,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Booking submitted!");
    };

    return (
        <div className="dashboard">

            {/* Sidebar */}
            <div className="sidebar">

                <div className="logo">
                    <span>Campus Resource Management System</span>
                </div>

                <nav>
                    <a href="/dashboard">Dashboard</a>
                    <a href="/resources">Resources</a>
                    <a className="active">My Bookings</a>
                    <a className="logout" onClick={handleLogout}>Log Out</a>
                </nav>

            </div>

            {/* Main Content */}
            <div className="main">

                <div className="welcome">
                    <h1>Book a Resource</h1>
                    <p>Select a resource and reserve it.</p>
                </div>

                <div className="booking-form">

                    <form onSubmit={handleSubmit}>

                        <label>Resource Type</label>
                        <select name="resourceType" onChange={handleChange}>
                            <option>Select Type</option>
                            <option>Video Equipment</option>
                            <option>Classroom</option>
                            <option>Materials</option>
                        </select>

                        <label>Resource</label>
                        <input
                            type="text"
                            name="resource"
                            placeholder="Enter resource name"
                            onChange={handleChange}
                        />

                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            onChange={handleChange}
                        />

                        <label>Start Time</label>
                        <input
                            type="time"
                            name="startTime"
                            onChange={handleChange}
                        />

                        <label>End Time</label>
                        <input
                            type="time"
                            name="endTime"
                            onChange={handleChange}
                        />

                        <label>Purpose</label>
                        <input
                            type="text"
                            name="purpose"
                            placeholder="Reason for booking"
                            onChange={handleChange}
                        />

                        <button type="submit">Submit Booking</button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Bookings;