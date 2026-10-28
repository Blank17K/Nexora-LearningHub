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
} from "../Assets/scripts/usersList.js";
import Checkout from "./Checkout.js";
import CoursePlayer from "./coursePlayer.js";
import AuthPage from "./AuthPage.js"
import Favourites from "./favourites.js";
import Cart from "./cart.js";

function App() {
  // Restore the saved session on load so a refresh doesn't log the user out
  const [user, setUser] = useState(() => loadSession(usersInfo));
  const [userList, setUserList] = useState(usersInfo);
  const [wasCheckingOut, setCheck] = useState(-1);

  // remember = the "Keep me signed in" checkbox on the login form
  const updateUser = (userData, remember = false) => {
    setUser(userData);
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
      };
    });

    // Persist to localStorage so it survives a refresh
    savePurchase(userId, numericCourseId);
  };

  const checkingOut = (id) => {
    setCheck(id);
  };

  const logOut = () => {
    setUser(null);
    clearSession();
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
                <Header user={user} logout={logOut} />
                <Splash />
                <Footer />
              </>
            )
          }
        />

        {/* <Route path="/login" element={
          <>
          <Header user={null} logout={logOut} signUp={true}/>
          <Login updateU={updateUser} users={userList} check={wasCheckingOut} />
          </>
        } />

        <Route path="/signup" element={
          <>
          <Header user={user} logout={logOut} signUp={true}/>
          <SignUp addU={adduserData} />
          </>
          
          } /> */}
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
              <Header user={user} logout={logOut} />
              <AboutUs />
              <Footer />
            </>
          }
        />

        <Route
          path="/courses"
          element={
            <>
              <Header user={user} logout={logOut} />
              <Course />
              <Footer />
            </>
          }
        />

        <Route
          path="/course/:id"
          element={
            <>
              <Header user={user} logout={logOut} />
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
              <Header user={user} logout={logOut} />
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
              <Header user={user} logout={logOut} />
              <CoursePlayer />
            </>
          }
        />
        <Route
          path="/favourites"
          element={
            <>
              <Header user={user} logout={logOut} />
              <Favourites user={user}/>
              <Footer />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <>
              <Header user={user} logout={logOut} />
              <Cart user={user}/>
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;