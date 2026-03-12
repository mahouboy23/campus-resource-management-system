import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

function App() {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/admin" element={<AdminDashboard />} />

                <Route path="/dashboard" element={<UserDashboard />} />

            </Routes>
        </Router>
    );
}

export default App;