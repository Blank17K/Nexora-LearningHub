import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import usersInfo from '../Assets/scripts/usersList.js';
import { savePurchase } from '../Assets/scripts/usersList.js';
import Checkout from "./Checkout.js";
import CoursePlayer from "./coursePlayer.js";

function App() {
  const [user, setUser] = useState(null);
  const [userList, setUserList] = useState(usersInfo);
  const [wasCheckingOut, setCheck] = useState(-1);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const adduserData = (fullName, email, password) => {
    // Safer ID: max existing + 1
    const nextId = userList.length
      ? Math.max(...userList.map(u => u.id)) + 1
      : 1;

    const newUser = {
      id: nextId,
      name: fullName,
      email,
      password,
      cards: [],
      purchasedCourses: [],
    };

    setUserList(prev => [...prev, newUser]);
    setUser(newUser); // optional: auto-login
  };

  // Updates BOTH the userList state and the logged-in user,
  // then persists the purchase to localStorage.
  const updatePurchasedCourses = (userId, courseId) => {
    const numericCourseId = Number(courseId);

    setUserList(prevUsers =>
      prevUsers.map(u => {
        if (u.id !== userId) return u;
        if (u.purchasedCourses.includes(numericCourseId)) return u;
        return {
          ...u,
          purchasedCourses: [...u.purchasedCourses, numericCourseId],
        };
      })
    );

    setUser(prevUser => {
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
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <ScrollToTop />
            <Header user={user} logout={logOut} />
            <Splash />
            <Footer />
          </>
        } />

        <Route path="/login" element={
          <Login updateU={updateUser} users={userList} check={wasCheckingOut} />
        } />

        <Route path="/signup" element={<SignUp addU={adduserData} />} />

        <Route path="/aboutus" element={
          <>
            <ScrollToTop />
            <BackToSite />
            <AboutUs />
            <Footer />
          </>
        } />

        <Route path="/courses" element={
          <>
            <Header user={user} logout={logOut} />
            <Course />
            <Footer />
          </>
        } />

        <Route path="/course/:id" element={
          <>
            <Header user={user} logout={logOut} />
            <ScrollToTop />
            <CourseView user={user} check={checkingOut} />
            <Footer />
          </>
        } />

        <Route path="/checkout/:id" element={
          <>
            <Header user={user} logout={logOut} />
            <Checkout
              checkOut={checkingOut}
              user={user}
              paycheck={updatePurchasedCourses}
            />
          </>
        } />

        <Route path="/courseplayer" element={
          <>
            <CoursePlayer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;