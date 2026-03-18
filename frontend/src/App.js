import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Resources from "./pages/Resources";
import Bookings from "./pages/Bookings";

function App() {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/admin" element={<AdminDashboard />} />

                <Route path="/dashboard" element={<UserDashboard />} />

                <Route path="/resources" element={<Resources />} />

                <Route path="/bookings" element={<Bookings />} />

            </Routes>
        </Router>
    );
}

export default App;