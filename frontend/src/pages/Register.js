import { useState } from "react";
import { registerUser } from "../services/authService";
import "../styles/auth.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            setLoading(true);
            const data = await registerUser(name, email, password);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "/user";
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            {/* LEFT — form */}
            <div className="auth-left">
                <div className="auth-card">
                    <h1>Create account</h1>
                    <h2>Join the platform today</h2>

                    {error && <p className="error">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password (min. 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? "Creating account…" : "Create Account"}
                        </button>
                    </form>

                    <p>
                        Already have an account? <a href="/">Sign in</a>
                    </p>
                </div>
            </div>

            {/* RIGHT — visual */}
            <div className="auth-right">
                <h1>Join the Platform</h1>
                <p>
                    Get access to all campus resources, make bookings, and stay organised with our management system.
                </p>

                <div className="auth-features">
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot" />
                        Browse available rooms & equipment
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot" />
                        Submit and track booking requests
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot" />
                        Manage your schedule in one place
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Register;