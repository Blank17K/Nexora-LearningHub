import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styleComp/header.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../Assets/Images/Logo.png";

function getInitials(name = "") {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") || "?"
  );
}

export default function Header({ user, logout, signUp=false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Soft shadow + stronger glass once the page has been scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close any open menus when the route changes
  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  // Close the user dropdown on outside click / Escape
  useEffect(() => {
    const onDown = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setUserOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = () => {
    setUserOpen(false);
    setMenuOpen(false);
    logout();
    navigate("/", { replace: true });
  };

  // Signed-in users never see the marketing splash: "home" is the courses page.
  const homePath = user ? "/courses" : "/";

  const linkClass = ({ isActive }) =>
    "navLinkN" + (isActive ? " isCurrent" : "");

  // "Browse" should also stay highlighted while viewing a single course
  const browseClass = ({ isActive }) =>
    linkClass({ isActive: isActive || location.pathname.startsWith("/course/") });

  const renderAuth = () => {
    if (user == null) {
      return (
        <div className="headerActions">
          <Link to="/login" className="hBtn hBtnGhost">
            Login
          </Link>
          <Link to="/signup" className="hBtn hBtnSolid">
            Sign Up
          </Link>
        </div>
      );
    }

    return (
      <div className="headerActions">
        <div className={"userMenu" + (userOpen ? " open" : "")} ref={userRef}>
          <button
            type="button"
            className="userChip"
            aria-haspopup="menu"
            aria-expanded={userOpen}
            onClick={() => setUserOpen((o) => !o)}
          >
            <span className="userAvatar">{getInitials(user.name)}</span>
            <span className="userName">{user.name}</span>
            <svg
              className="chev"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div className="userDropdown" role="menu">
            <div className="userDropHead">
              <span className="userAvatar lg">{getInitials(user.name)}</span>
              <div className="userDropText">
                <strong>{user.name}</strong>
                {user.email && <small>{user.email}</small>}
              </div>
            </div>
            <Link to="/courses" role="menuitem" className="dropItem">
              Browse courses
            </Link>
            <button
              type="button"
              role="menuitem"
              className="dropItem dropLogout"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className={"header siteHeader" + (scrolled ? " scrolled" : "")}>
      <div className="headerInner">
        <Link to={homePath} className="brand" aria-label="Nexora home">
          <img alt="" src={logo} className="logoHead" />
          <span className="brandName">Nexora</span>
        </Link>

        <button
          type="button"
          className={"navToggle" + (menuOpen ? " open" : "")}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={"navPanel" + (menuOpen ? " open" : "")}>
          <nav className="mainNav" aria-label="Main">
            <NavLink
              to={homePath}
              end={!user}
              className={user ? browseClass : linkClass}
            >
              Home
            </NavLink>
            {/* Signed in: Home already is the courses page, so no duplicate "Browse" */}
            {!user && (
              <NavLink to="/courses" className={browseClass}>
                Browse
              </NavLink>
            )}
            <NavLink to="/aboutus" className={linkClass}>
              About
            </NavLink>
          </nav>

          {!signUp && renderAuth()}
          {signUp && <>
          <div>
            <Link to={homePath}>
            back to site
            </Link>
          </div>
          </>}
        </div>
      </div>
    </header>
  );
}