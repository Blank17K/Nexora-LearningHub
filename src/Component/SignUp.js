import React, { useState } from "react";
import logo from "../Assets/Images/Logo.png";
import loginHero from "../Assets/Images/LoginHeroSignUp.png";
import "../styleComp/Login.css";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating account with", form);
  };

  const hasMinLength = form.password.length >= 8;
  const hasNumber = /\d/.test(form.password);
  const hasCapital = /[A-Z]/.test(form.password);

  return (
    <div className="logInBody">
      <div className="navBar">
        <div className="loginNav">
          <div className="logo">
            <img src={logo} alt="Logo" />
            <p>Nexora</p>
          </div>
          <div className="backBtn">
            <Link to={"/"}>Back to site</Link>
          </div>
        </div>
      </div>

      <div className="logInAndImage">
        <div className="loginLeft">
          <div className="loginContent">
            <h1 className="welcomeTitle">Create your account</h1>
            <p className="welcomeSubtitle">Free to start. No card needed.</p>

            <div className="tabSwitch">
              <button type="button" className="tabBtn">
                <Link to={"/login"}>Log in</Link>
              </button>
              <button type="button" className="tabBtn tabBtnActive">
                Register
              </button>
            </div>

            <form className="loginForm" onSubmit={handleSubmit}>
              <label className="fieldLabel" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Luke Walker"
                value={form.fullName}
                onChange={handleChange}
                className="textInput"
              />

              <label className="fieldLabel" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="lukeWalker12@example.com"
                value={form.email}
                onChange={handleChange}
                className="textInput"
              />

              <label className="fieldLabel" htmlFor="password">
                Password
              </label>
              <div className="passwordWrapper">
                <input
                  id="password"
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

              <button type="submit" className="primaryBtn">
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
        </div>

        <div className="loginRight">
          <img src={loginHero} alt="" className="loginHeroImg" />
        </div>
      </div>
    </div>
  );
}
