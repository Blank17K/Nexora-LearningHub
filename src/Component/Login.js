import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/Images/Logo.png";
import loginHero from "../Assets/Images/LoginHero.png";
import "../styleComp/Login.css";

export default function Login() {
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Logging in with", form, "Keep signed in:", keepSignedIn);
  };

  return (
    <div className="logInBody">

      <div className="navBar">
        <div className="loginNav">
          <div className="logo">
            <img src={logo} alt="Logo" />
            <p>Nexora</p>
          </div>
          <div className="backBtn">
            <Link to={"/"}>Back to site</Link></div>
        </div>
      </div>

      <div className="logInAndImage">
        <div className="loginLeft">
          <div className="loginContent">
            <h1 className="welcomeTitle">Welcome back</h1>
            <p className="welcomeSubtitle">Pick up where you left off.</p>

            <div className="tabSwitch">
              <button
                type="button"
                className={`tabBtn ${activeTab === "login" ? "tabBtnActive" : ""}`}
                onClick={() => setActiveTab("login")}
              >
                Log in
              </button>
              <button
                type="button"
                className={`tabBtn ${activeTab === "register" ? "tabBtnActive" : ""}`}
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </div>

            <form className="loginForm" onSubmit={handleSubmit}>
              <label className="fieldLabel" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="textInput"
              />

              <div className="passwordRow">
                <label className="fieldLabel" htmlFor="password">
                  Password
                </label>
                <a href="#forgot" className="forgotLink">
                  Forgot password?
                </a>
              </div>
              <div className="passwordWrapper">
                <input
                  id="password"
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

              <button type="submit" className="primaryBtn">
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
                <a href="#register" className="signupLink">
                  Create an account
                </a>{" "}
                — it takes about thirty seconds.
              </p>
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
