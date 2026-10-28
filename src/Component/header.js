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

// Badge text: caps at 99+
function badgeText(n) {
  return n > 99 ? "99+" : String(n);
}

// Props: cartCount and favCount drive the badges on the cart and heart icons.
export default function Header({
  user,
  logout,
  signUp = false,
  searchQuery = "",
  onSearchChange,
  cartCount = 0,
  favCount = 0,
}) {
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

  // Runs on every keystroke in the header search box.
  // Updates the shared query in App; if the user is on another page, sends
  // them to /courses. `focusSearch` tells the Header on the new page to put
  // the cursor back in the box (the Header remounts on each page).
  const handleSearch = (e) => {
    onSearchChange(e.target.value);
    if (location.pathname !== "/courses") {
      navigate("/courses", { state: { focusSearch: true } });
    }
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
        <div className="cartPref" onClick={()=>{navigate('/favourites')}}><i class="lni lni-heart"></i></div>
        <div className="cartPref" on><i class="lni lni-cart-1"></i><span className="cartAmount">{user.cart.length}</span></div>
        <NavLink
          to="/mycourses"
          className={({ isActive }) =>
            "myCoursesLink" + (isActive ? " isCurrent" : "")
          }
        >
          My Courses
        </NavLink>

        {/* Favourites + Cart icons, only for signed-in users */}
        <div className="headerIcons">
          <NavLink
            to="/favourites"
            className={({ isActive }) =>
              "hIconBtn" + (isActive ? " isCurrent" : "")
            }
            aria-label={`Favourites${favCount ? `, ${favCount} items` : ""}`}
            title="Favourites"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            {favCount > 0 && (
              <span className="hBadge">{badgeText(favCount)}</span>
            )}
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              "hIconBtn" + (isActive ? " isCurrent" : "")
            }
            aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ""}`}
            title="Shopping cart"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="hBadge">{badgeText(cartCount)}</span>
            )}
          </NavLink>
        </div>

        <div className={"userMenu" + (userOpen ? " open" : "")} ref={userRef}>
          <button
            type="button"
            className="userChip"
            aria-haspopup="menu"
            aria-expanded={userOpen}
            aria-label={`Account menu for ${user.name}`}
            onClick={() => setUserOpen((o) => !o)}
          >
            <span className="userAvatar">{getInitials(user.name)}</span>
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
        {/* Logo + icon + name are all one link. Signed in -> courses page,
            signed out -> home/splash. Clicking while already on that page
            clears the search and scrolls back to the top. */}
        <Link
          to={homePath}
          className="brand"
          aria-label={user ? "Nexora courses" : "Nexora home"}
          title="Nexora"
          onClick={() => {
            setMenuOpen(false);
            if (location.pathname === homePath) {
              onSearchChange && onSearchChange("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <img alt="" src={logo} className="logoHead" draggable={false} />
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
            <NavLink to="/courses" className={browseClass}>
              Browse
              <svg
                className="navCaret"
                viewBox="0 0 10 10"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M1 3h8L5 8z" />
              </svg>
            </NavLink>
            <NavLink to="/aboutus" className={linkClass}>
              About us
            </NavLink>
          </nav>

          {/* Search bar. Shows on every page whose <Header> receives
              `onSearchChange` (all of them, via headerProps in App.js). */}
          {onSearchChange && !signUp && (
            <form
              className="headerSearch"
              role="search"
              onSubmit={(e) => e.preventDefault()} // stop page reload on Enter
            >
              <svg
                className="hsIcon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search courses, topics or instructors..."
                aria-label="Search courses"
                autoFocus={!!location.state?.focusSearch}
              />
              {/* Clear button, only visible while there is text */}
              {searchQuery && (
                <button
                  type="button"
                  className="hsClear"
                  aria-label="Clear search"
                  onClick={() => onSearchChange("")}
                >
                  &times;
                </button>
              )}
            </form>
          )}

          {!signUp && renderAuth()}
          {signUp && (
            <>
              <div>
                <Link to={homePath}>back to site</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}