import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { api } from "../services/api";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};

    // Gmail validation
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!gmailPattern.test(email.trim())) {
      newErrors.email =
        "Please enter a valid Gmail address ending with @gmail.com.";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password =
        "Password must contain at least 6 characters.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await api.login({
        email: email.trim().toLowerCase(),
        password
      });

      if (res.success && res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        navigate("/home");
      } else {
        setServerError(res.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setServerError("Unable to connect to the backend server. Please verify the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-left">
          <div className="brand">
            🧸 Little Learners
          </div>

          <div className="welcome-content">
            <span className="welcome-tag">
              ✨ Learn through play!
            </span>

            <h1>Big dreams start with little steps!</h1>

            <p>
              Explore, discover and learn something new
              every day with fun activities and games.
            </p>

            <div className="hero-emoji">
              🦁 🐼 🐰
            </div>
          </div>

          <p className="left-footer">
            Play • Learn • Grow 🌈
          </p>
        </div>

        <div className="auth-right">
          <div className="auth-form">

            <div className="mobile-brand">
              🧸 Little Learners
            </div>

            <span className="form-tag">
              WELCOME BACK!
            </span>

            <h2>Let's start learning!</h2>

            <p className="form-description">
              Sign in to continue your learning adventure.
            </p>

            {serverError && (
              <div className="validation-error" style={{ marginBottom: "15px", fontWeight: "bold" }}>
                ⚠️ {serverError}
              </div>
            )}

            <form onSubmit={handleLogin} noValidate>

              <label>Email Address</label>

              <div className={`input-box ${errors.email ? "input-error" : ""}`}>
                <Mail size={19} />

                <input
                  type="email"
                  placeholder="Enter your Gmail address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      email: ""
                    }));
                    setServerError("");
                  }}
                />
              </div>

              {errors.email && (
                <p className="validation-error">
                  ⚠️ {errors.email}
                </p>
              )}

              <label>Password</label>

              <div className={`input-box ${errors.password ? "input-error" : ""}`}>
                <Lock size={19} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      password: ""
                    }));
                    setServerError("");
                  }}
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? <EyeOff size={19} />
                    : <Eye size={19} />
                  }
                </button>
              </div>

              {errors.password && (
                <p className="validation-error">
                  ⚠️ {errors.password}
                </p>
              )}

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Signing in... 🚀" : "Let's Go! 🚀"}
              </button>

            </form>

            <div className="auth-switch">
              New here? <Link to="/signup">Create an account</Link>
            </div>

            <div className="auth-bottom">
              Made with ❤️ for little learners
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
