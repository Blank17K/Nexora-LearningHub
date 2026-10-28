import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./ScrollToTop.js";
import Splash from "./splash.js";
import Header from "./header.js";
import AboutUs from "./AboutUs.js";
import Footer from "./footer.js";
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
import Favourites from "./favourites.js";
import Cart from "./cart.js";

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
    // Re-read this user's cart + favourites from storage so they are always up
    // to date, even if the user logged out and back in. If nothing has been
    // saved yet, fall back to the starter lists that came with the account.
    setUser({
      ...userData,
      cart: loadCart(userData.id, userData.cart || []),
      favourites: loadFavourites(userData.id, userData.favourites || []),
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

    // Keep the saved cart in sync too (fallback = the cart currently on screen,
    // so a starter cart that was never saved isn't wiped by mistake)
    const onScreenCart = user && user.id === userId ? user.cart || [] : [];
    saveCart(
      userId,
      loadCart(userId, onScreenCart).filter((c) => c !== numericCourseId),
    );
  };

  // ---------- Per-user Cart + Favourites ----------
  // Courses the user already owns never count as "in the cart".
  const ownedIds = user?.purchasedCourses || [];
  const cart = (user?.cart || []).filter((id) => !ownedIds.includes(id));
  const favourites = user?.favourites || [];

  // These use the "previous state" form of setUser so several calls in a row
  // (e.g. "move to favourites" = add favourite + remove from cart) never
  // overwrite each other.
  const addToCart = (courseId) => {
    const id = Number(courseId);
    setUser((prev) => {
      if (!prev) return prev;
      const list = prev.cart || [];
      if (list.includes(id) || (prev.purchasedCourses || []).includes(id)) {
        return prev;
      }
      const next = [...list, id];
      saveCart(prev.id, next);
      return { ...prev, cart: next };
    });
  };

  const removeFromCart = (courseId) => {
    const id = Number(courseId);
    setUser((prev) => {
      if (!prev) return prev;
      const next = (prev.cart || []).filter((c) => c !== id);
      saveCart(prev.id, next);
      return { ...prev, cart: next };
    });
  };

  const toggleFavourite = (courseId) => {
    const id = Number(courseId);
    setUser((prev) => {
      if (!prev) return prev;
      const list = prev.favourites || [];
      const next = list.includes(id)
        ? list.filter((c) => c !== id)
        : [...list, id];
      saveFavourites(prev.id, next);
      return { ...prev, favourites: next };
    });
  };

  // Everything the Cart / Favourites pages and the buttons on the course page need.
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

  // Pages that only make sense when signed in
  const signedInOnly = (page) =>
    user ? page : <Navigate to="/login" replace />;

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
                shop={user ? shop : null}
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
              <CourseView user={user} check={checkingOut} shop={shop} />
              <Footer />
            </>
          }
        />

        {/* /checkout/5 buys one course, /checkout/cart buys everything in the cart */}
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
          path="/favourites"
          element={signedInOnly(
            <>
              <ScrollToTop />
              <Header {...headerProps} />
              <Favourites user={user} shop={shop} />
              <Footer />
            </>,
          )}
        />

        <Route
          path="/cart"
          element={signedInOnly(
            <>
              <ScrollToTop />
              <Header {...headerProps} />
              <Cart user={user} shop={shop} />
              <Footer />
            </>,
          )}
        />

        <Route
          path="/mycourses"
          element={signedInOnly(
            <>
              <Header {...headerProps} />
              <MyCourses user={user} />
              <Footer />
            </>,
          )}
        />

        <Route
          path="/courseplayer/:id"
          element={
            <>
              <ScrollToTop />
              <CoursePlayer user={user} />
            </>
          }
        />

        {/* Old link without a course id: send people to their courses */}
        <Route
          path="/courseplayer"
          element={<Navigate to="/mycourses" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;