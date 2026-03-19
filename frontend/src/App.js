import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/UserDashboard";
import UserBookings from "./pages/UserBookings";
import UserResources from "./pages/UserResources";

import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import AdminResources from "./pages/AdminResources";

function App() {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* USER */}
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/user/bookings" element={<UserBookings />} />
                <Route path="/user/resources" element={<UserResources />} />

                {/* ADMIN */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/resources" element={<AdminResources />} />

            </Routes>
        </Router>
    );
}

export default App;