import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../Assets/Images/Logo.png";
import loginHero from "../Assets/Images/LoginHero.png";
import signupHero from "../Assets/Images/LoginHeroSignUp.png";
import Login from "./Login.js";
import SignUp from "./SignUp.js";
import "../styleComp/Login.css";

// How long the outgoing form stays mounted. Must be >= the longest CSS exit
// animation in Login.css (.isLeave / .heroOut).
const EXIT_MS = 560;

const HERO = { login: loginHero, signup: signupHero };

/*
  Keeps /login and /signup on ONE mounted page so the form that is leaving can
  stay on screen while the new one animates in (what AnimatePresence does in
  framer-motion). Login and SignUp are still two separate components; this
  shell just decides which one(s) are mounted and which CSS class each gets.
*/
export default function AuthPage({ loginProps, signupProps }) {
  const { pathname } = useLocation();
  const mode = pathname.startsWith("/signup") ? "signup" : "login";

  const [current, setCurrent] = useState(mode); // form that is on screen
  const [leaving, setLeaving] = useState(null); // form that is animating out
  const [dir, setDir] = useState(1); // 1 = heading to signup, -1 = back to login
  const [firstLoad, setFirstLoad] = useState(true); // no slide on first paint
  const [height, setHeight] = useState(undefined);
  const currentRef = useRef(null);

  // Route changed -> the form that was showing becomes the "leaving" one.
  // (Setting state while rendering is the supported way to derive state.)
  if (mode !== current) {
    setLeaving(current);
    setCurrent(mode);
    setDir(mode === "signup" ? 1 : -1);
    setFirstLoad(false);
  }

  // Unmount the old form once its exit animation is done
  useEffect(() => {
    if (!leaving) return undefined;
    const t = setTimeout(() => setLeaving(null), EXIT_MS);
    return () => clearTimeout(t);
  }, [leaving, current]);

  // Panels are stacked on top of each other, so the stage needs an explicit
  // height. We follow the current panel's height (and animate changes to it).
  useLayoutEffect(() => {
    const el = currentRef.current;
    if (!el) return undefined;
    const update = () => setHeight(el.offsetHeight);
    update();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [current]);

  const panelClass = (m) => {
    if (m === current) {
      return firstLoad
        ? "authPanel isIntro"
        : `authPanel isEnter ${dir > 0 ? "fromRight" : "fromLeft"}`;
    }
    return `authPanel isLeave ${dir > 0 ? "toLeft" : "toRight"}`;
  };

  const renderPanel = (m) => {
    if (m !== current && m !== leaving) return null;
    const isLeaving = m === leaving && m !== current;
    return (
      <div
        key={m}
        ref={m === current ? currentRef : null}
        className={panelClass(m)}
        aria-hidden={isLeaving ? "true" : undefined}
        inert={isLeaving ? true : undefined}
      >
        {m === "login" ? <Login {...loginProps} /> : <SignUp {...signupProps} />}
      </div>
    );
  };

  const renderHero = (m) => {
    if (m !== current && m !== leaving) return null;
    const cls =
      m === current ? (firstLoad ? "" : " heroIn") : " heroOut";
    return <img key={m} src={HERO[m]} alt="" className={"loginHeroImg" + cls} />;
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
            <Link to="/">Back to site</Link>
          </div>
        </div>
      </div>

      <div className="logInAndImage">
        <div className="loginLeft">
          <div className="authStage" style={{ height }}>
            {renderPanel("login")}
            {renderPanel("signup")}
          </div>
        </div>

        <div className="loginRight">
          {renderHero("login")}
          {renderHero("signup")}
        </div>
      </div>
    </div>
  );
}