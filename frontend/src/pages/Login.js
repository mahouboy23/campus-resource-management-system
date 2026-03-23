import { useState } from "react";
import { loginUser } from "../services/authService";
import "../styles/auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            setLoading(true);
            const data = await loginUser(email, password);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = data.user.role === "admin" ? "/admin" : "/user";
        } catch (err) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            {/* LEFT — form */}
            <div className="auth-left">
                <div className="auth-card">
                    <h1>Welcome back</h1>
                    <h2>Sign in to your account</h2>

                    {error && <p className="error">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? "Signing in…" : "Sign In"}
                        </button>
                    </form>

                    <p>
                        Don't have an account? <a href="/register">Create one</a>
                    </p>
                </div>
            </div>

            {/* RIGHT — visual */}
            <div className="auth-right">
                <h1>Campus Resource Management</h1>
                <p>
                    Book rooms, reserve equipment, and manage campus resources — all in one place.
                </p>

                <div className="auth-features">
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot" />
                        Real-time availability tracking
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot" />
                        Instant booking approvals
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-dot" />
                        Full booking history
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Login;