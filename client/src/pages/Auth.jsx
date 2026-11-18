
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form);
      }

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect to server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth card">
      <p className="eyebrow">
        ALZIKRAYAT ACCOUNT
      </p>

      <h1>
        {mode === "login" ? "Welcome back" : "Create an account"}
      </h1>

      <p className="muted">
        {mode === "login"
          ? "Login to share and explore your memories."
          : "Join Alzikrayat and start sharing your photos."}
      </p>

      <form onSubmit={submit}>
        {mode === "register" && (
          <div className="two">
            <input
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={change}
              required
            />

            <input
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={change}
              required
            />
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={change}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password (minimum 6 characters)"
          value={form.password}
          onChange={change}
          minLength="6"
          required
        />

        {error && <p className="error">{error}</p>}

        <button disabled={busy}>
          {busy
            ? "Please wait..."
            : mode === "login"
              ? "Login"
              : "Register"}
        </button>
      </form>

      <p className="switch">
        {mode === "login" ? "Don't have an account?" : "Already registered?"}

        {" "}

        <button
          className="linkbtn"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
        >
          {mode === "login" ? "Create account" : "Login"}
        </button>
      </p>
    </section>
  );
}
