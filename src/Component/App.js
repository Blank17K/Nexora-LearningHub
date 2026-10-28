import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./ScrollToTop.js";
import Splash from "./splash.js";
import BackToSite from "./backTosite.js";
import Header from "./header.js";
import AboutUs from "./AboutUs.js";
import Footer from "./footer.js";
import Login from "./Login.js";
import SignUp from "./SignUp.js";
import Course from "./Course.js";
import CourseView from "./CourseView.js";
import usersInfo, {
  savePurchase,
  saveRegisteredUser,
  saveSession,
  loadSession,
  clearSession,
  loadCart,
  saveCart,
  loadFavourites,
  saveFavourites,
} from "../Assets/scripts/usersList.js";
import Checkout from "./Checkout.js";
import CoursePlayer from "./coursePlayer.js";
import AuthPage from "./AuthPage.js";
import MyCourses from "./Mycourses.js";

function App() {
  // Restore the saved session on load so a refresh doesn't log the user out
  const [user, setUser] = useState(() => loadSession(usersInfo));
  const [userList, setUserList] = useState(usersInfo);
  const [wasCheckingOut, setCheck] = useState(-1);

  // The search text lives here so the Header (where the user types)
  // and the Course page (where results are filtered) share it.
  const [searchQuery, setSearchQuery] = useState("");

  // remember = the "Keep me signed in" checkbox on the login form
  const updateUser = (userData, remember = false) => {
    // Re-read this user's cart + favourites from storage so they are
    // always up to date, even if the user logged out and back in.
    setUser({
      ...userData,
      cart: loadCart(userData.id),
      favourites: loadFavourites(userData.id),
    });
    saveSession(userData.id, remember);
  };

  const adduserData = (fullName, email, password) => {
    // Safer ID: max existing + 1
    const nextId = userList.length
      ? Math.max(...userList.map((u) => u.id)) + 1
      : 1;

    const newUser = {
      id: nextId,
      name: fullName,
      email,
      password,
      cards: [],
      purchasedCourses: [],
      cart: [],
      favourites: [],
    };

    setUserList((prev) => [...prev, newUser]);
    setUser(newUser); // optional: auto-login
    saveRegisteredUser(newUser); // keep the account after a refresh
    saveSession(newUser.id);
  };

  const updatePurchasedCourses = (userId, courseId) => {
    const numericCourseId = Number(courseId);

    setUserList((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id !== userId) return u;
        if (u.purchasedCourses.includes(numericCourseId)) return u;
        return {
          ...u,
          purchasedCourses: [...u.purchasedCourses, numericCourseId],
        };
      }),
    );

    setUser((prevUser) => {
      if (!prevUser || prevUser.id !== userId) return prevUser;
      if (prevUser.purchasedCourses.includes(numericCourseId)) return prevUser;
      return {
        ...prevUser,
        purchasedCourses: [...prevUser.purchasedCourses, numericCourseId],
        // A bought course no longer belongs in the cart
        cart: (prevUser.cart || []).filter((c) => c !== numericCourseId),
      };
    });

    // Persist to localStorage so it survives a refresh
    savePurchase(userId, numericCourseId);

    // Keep the saved cart in sync too
    saveCart(
      userId,
      loadCart(userId).filter((c) => c !== numericCourseId),
    );
  };

  // ---------- Per-user Cart + Favourites ----------
  const cart = user?.cart || [];
  const favourites = user?.favourites || [];

  const addToCart = (courseId) => {
    if (!user) return;
    const id = Number(courseId);
    if (cart.includes(id)) return;
    const next = [...cart, id];
    setUser({ ...user, cart: next });
    saveCart(user.id, next);
  };

  const removeFromCart = (courseId) => {
    if (!user) return;
    const id = Number(courseId);
    const next = cart.filter((c) => c !== id);
    setUser({ ...user, cart: next });
    saveCart(user.id, next);
  };

  const toggleFavourite = (courseId) => {
    if (!user) return;
    const id = Number(courseId);
    const next = favourites.includes(id)
      ? favourites.filter((c) => c !== id)
      : [...favourites, id];
    setUser({ ...user, favourites: next });
    saveFavourites(user.id, next);
  };

  // Everything the future Cart / Favourites pages and the heart icon on the
  // course price will need. Pass `shop` to them when we build those.
  const shop = {
    cart,
    favourites,
    addToCart,
    removeFromCart,
    toggleFavourite,
  };

  const checkingOut = (id) => {
    setCheck(id);
  };

  const logOut = () => {
    setUser(null);
    clearSession();
  };

  // One shared set of props, spread into EVERY page's Header.
  const headerProps = {
    user,
    logout: logOut,
    searchQuery,
    onSearchChange: setSearchQuery,
    cartCount: cart.length,
    favCount: favourites.length,
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              // Signed in: skip the marketing splash
              <Navigate to="/courses" replace />
            ) : (
              <>
                <ScrollToTop />
                <Header {...headerProps} />
                <Splash />
                <Footer />
              </>
            )
          }
        />

        <Route
          element={
            <AuthPage
              loginProps={{
                updateU: updateUser,
                users: userList,
                check: wasCheckingOut,
              }}
              signupProps={{ addU: adduserData }}
            />
          }
        >
          <Route path="/login" element={null} />
          <Route path="/signup" element={null} />
        </Route>

        <Route
          path="/aboutus"
          element={
            <>
              <ScrollToTop />
              <Header {...headerProps} />
              <AboutUs />
              <Footer />
            </>
          }
        />

        <Route
          path="/courses"
          element={
            <>
              <Header {...headerProps} />
              <Course
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <Footer />
            </>
          }
        />

        <Route
          path="/course/:id"
          element={
            <>
              <Header {...headerProps} />
              <ScrollToTop />
              <CourseView user={user} check={checkingOut} />
              <Footer />
            </>
          }
        />

        <Route
          path="/checkout/:id"
          element={
            <>
              <Header {...headerProps} />
              <Checkout
                checkOut={checkingOut}
                user={user}
                paycheck={updatePurchasedCourses}
              />
            </>
          }
        />

        <Route
          path="/courseplayer"
          element={
            <>
              <Header {...headerProps} />
              <CoursePlayer />
            </>
          }
        />

        <Route
          path="/mycourses"
          element={
            user ? (
              <>
                <Header {...headerProps} />
                <MyCourses user={user} />
                <Footer />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Placeholders, replace with the real pages later */}
        <Route
          path="/cart"
          element={
            user ? (
              <>
                <Header {...headerProps} />
                <div className="container mt-4">
                  <h2>Your Cart ({shop.cart.length})</h2>
                  <p>Cart page coming soon.</p>
                </div>
                <Footer />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/favourites"
          element={
            user ? (
              <>
                <Header {...headerProps} />
                <div className="container mt-4">
                  <h2>Your Favourites ({shop.favourites.length})</h2>
                  <p>Favourites page coming soon.</p>
                </div>
                <Footer />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;