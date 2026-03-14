import { useState } from "react";
import { registerUser } from "../services/authService";
import "../styles/auth.css";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const data = await registerUser(name, email, password);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Account created!");

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>Campus Resource Manager</h1>
                <h2>Create Account</h2>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

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

                    <button type="submit">Create Account</button>

                </form>

                <p>
                    Already have an account? <a href="/">Login</a>
                </p>

            </div>

        </div>
    );
}

export default Register;