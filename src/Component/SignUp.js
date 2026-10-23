import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Rendered inside <AuthPage />, which owns the page chrome (nav bar, hero
// image) and the enter/exit animation between this form and <Login />.
export default function SignUp(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const hasMinLength = form.password.length >= 8;
  const hasNumber = /\d/.test(form.password);
  const hasCapital = /[A-Z]/.test(form.password);

  return (
    <div className="loginContent">
      <h1 className="welcomeTitle">Create your account</h1>
      <p className="welcomeSubtitle">Free to start. No card needed.</p>

      <div className="tabSwitch" style={{ "--thumb": "100%", "--thumb-from": "-100%" }}>
        <Link to="/login" className="tabBtn">
          Log in
        </Link>
        <Link to="/signup" className="tabBtn tabBtnActive" aria-current="page">
          Register
        </Link>
      </div>

      <form className="loginForm" onSubmit={handleSubmit}>
        <label className="fieldLabel" htmlFor="signup-name">
          Full Name
        </label>
        <input
          id="signup-name"
          name="fullName"
          type="text"
          placeholder="Luke Walker"
          value={form.fullName}
          onChange={handleChange}
          className="textInput"
        />

        <label className="fieldLabel" htmlFor="signup-email">
          Email Address
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          placeholder="lukeWalker12@example.com"
          value={form.email}
          onChange={handleChange}
          className="textInput"
        />

        <label className="fieldLabel" htmlFor="signup-password">
          Password
        </label>
        <div className="passwordWrapper">
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
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

        <ul className="passwordChecklist">
          <li className={hasMinLength ? "checkDone" : ""}>
            <span className="checkDot">{hasMinLength ? "✓" : ""}</span>
            At least 8 characters
          </li>
          <li className={hasNumber ? "checkDone" : ""}>
            <span className="checkDot">{hasNumber ? "✓" : ""}</span>
            One number
          </li>
          <li className={hasCapital ? "checkDone" : ""}>
            <span className="checkDot">{hasCapital ? "✓" : ""}</span>
            One capital letter
          </li>
        </ul>

        <button
          type="submit"
          className="primaryBtn"
          onClick={() => {
            props.addU(form.fullName, form.email, form.password);
            navigate("/courses");
          }}
        >
          Create Account
        </button>

        <p className="termsText">
          By creating an account you agree to our{" "}
          <a href="#terms" className="signupLink">
            Terms
          </a>{" "}
          and{" "}
          <a href="#privacy" className="signupLink">
            Privacy Policy
          </a>
          .
        </p>

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
      </form>
    </div>
  );
}