import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { api } from "../services/api";
import "../styles/Auth.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required.";
    }

    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!gmailPattern.test(email.trim())) {
      newErrors.email = "Please enter a valid Gmail address ending with @gmail.com.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await api.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      });

      if (res.success && res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        alert("Account created successfully! Welcome to Little Learners 🎉");
        navigate("/home");
      } else {
        setServerError(res.message || "Failed to create account. Please try again.");
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
          <div className="brand">🧸 Little Learners</div>

          <div className="welcome-content">
            <span className="welcome-tag">
              🌟 A world of discovery!
            </span>

            <h1>Every child is a little explorer!</h1>

            <p>
              Create your account and begin a wonderful
              journey filled with learning and fun.
            </p>

            <div className="hero-emoji">🐻 🐸 🐱</div>
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

            <span className="form-tag">JOIN THE FUN!</span>

            <h2>Create your account</h2>

            <p className="form-description">
              Let's make learning an exciting adventure!
            </p>

            {serverError && (
              <div className="validation-error" style={{ marginBottom: "15px", fontWeight: "bold" }}>
                ⚠️ {serverError}
              </div>
            )}

            <form onSubmit={handleSignup} noValidate>
              <label>Full Name</label>

              <div className={`input-box ${errors.name ? "input-error" : ""}`}>
                <User size={19} />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((prev) => ({ ...prev, name: "" }));
                    setServerError("");
                  }}
                />
              </div>

              {errors.name && (
                <p className="validation-error">⚠️ {errors.name}</p>
              )}

              <label>Email Address</label>

              <div className={`input-box ${errors.email ? "input-error" : ""}`}>
                <Mail size={19} />
                <input
                  type="email"
                  placeholder="Enter your Gmail address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                    setServerError("");
                  }}
                />
              </div>

              {errors.email && (
                <p className="validation-error">⚠️ {errors.email}</p>
              )}

              <label>Password</label>

              <div className={`input-box ${errors.password ? "input-error" : ""}`}>
                <Lock size={19} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                    setServerError("");
                  }}
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              {errors.password && (
                <p className="validation-error">⚠️ {errors.password}</p>
              )}

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Creating Account... 🎉" : "Create Account 🎉"}
              </button>
            </form>

            <div className="auth-switch">
              Already have an account?{" "}
              <Link to="/">Login here</Link>
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

export default Signup;
