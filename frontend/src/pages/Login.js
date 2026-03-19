import { useState } from "react";
import { loginUser } from "../services/authService";
import "../styles/auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await loginUser(email, password);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "admin") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/user";
            }

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">

            {/* LEFT SIDE */}
            <div className="auth-left">
                <div className="auth-card">

                    <h1>Login</h1>
                    <h2>Enter your account details</h2>

                    {error && <p className="error">{error}</p>}

                    <form onSubmit={handleSubmit}>

                        <input
                            type="email"
                            placeholder="Email"
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

                        <button type="submit">Login</button>

                    </form>

                    <p>
                        Don't have an account? <a href="/register">Sign up</a>
                    </p>

                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="auth-right">
                <h1>Welcome Back</h1>
                <p>
                    Access and manage campus resources, bookings, and availability with ease.
                </p>
            </div>

        </div>
    );
}

export default Login;