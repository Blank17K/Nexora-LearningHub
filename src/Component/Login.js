import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Rendered inside <AuthPage />, which owns the page chrome (nav bar, hero
// image) and the enter/exit animation between this form and <SignUp />.
export default function Login(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const logIn = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const validate = (email, password) => {
    const activeU = props.users.find((user) => email === user.email);
    // Unknown email used to crash here (valU was undefined)
    if (!activeU || password !== activeU.password) {
      setError("*Check password or email if correct");
      return;
    }
    setError("");
    props.updateU(activeU);
    if (props.check > 0) {
      logIn(`/checkout/${props.check}`);
      return;
    }
    logIn("/courses");
  };

  return (
    <div className="loginContent">
      <h1 className="welcomeTitle">Welcome back</h1>
      <p className="welcomeSubtitle">Pick up where you left off.</p>
      {error === "" ? null : <p className="erorrSub">{error}</p>}

      <div className="tabSwitch" style={{ "--thumb": "0%", "--thumb-from": "100%" }}>
        <Link to="/login" className="tabBtn tabBtnActive" aria-current="page">
          Log in
        </Link>
        <Link to="/signup" className="tabBtn">
          Register
        </Link>
      </div>

      <form className="loginForm" onSubmit={handleSubmit}>
        <label className="fieldLabel" htmlFor="login-email">
          Email Address
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          className="textInput"
        />

        <div className="passwordRow">
          <label className="fieldLabel" htmlFor="login-password">
            Password
          </label>
          <a href="#forgot" className="forgotLink">
            Forgot password?
          </a>
        </div>
        <div className="passwordWrapper">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="textInput"
          />
          <button
            type="button"
            className="eyeBtn"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        <label className="keepSignedIn">
          <input
            type="checkbox"
            checked={keepSignedIn}
            onChange={() => setKeepSignedIn((s) => !s)}
          />
          Keep me signed in
        </label>

        <button
          type="submit"
          className="primaryBtn"
          onClick={() => {
            validate(form.email, form.password);
          }}
        >
          Log in
        </button>

        <div className="dividerRow">
          <span className="dividerLine" />
          <span className="dividerText">or continue with</span>
          <span className="dividerLine" />
        </div>

        <div className="oauthRow">
          <button type="button" className="oauthBtn">
            Google
          </button>
          <button type="button" className="oauthBtn">
            Github
          </button>
        </div>

        <p className="signupText">
          New here?{" "}
          <Link className="signupLink" to="/signup">
            Create Account
          </Link>
          — it takes about thirty seconds.
        </p>
      </form>
    </div>
  );
}