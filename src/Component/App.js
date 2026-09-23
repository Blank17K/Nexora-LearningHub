import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop.js";
import Splash from "./splash.js"; 
import  BackToSite from "./backTosite.js";
import  Header  from "./header.js";
import  AboutUs  from "./AboutUs.js";
import Footer  from "./footer.js";
import Login from "./Login.js"; 
import SignUp from "./SignUp.js";
import Course from "./Course.js";
import CourseView from "./CourseView.js";
import usersInfo from '../Assets/scripts/userList.js'

function App() {
  const [user, setUser] = useState(null);
  const [userList, setUserList] = useState(usersInfo)
  const updateUser =(userData)=>{
    setUser(userData);
  }
  const adduserData = (uId, fullName,email,password)=>{
    let user = {
        id: uId,
        name: fullName,
        email: email,
        password: password,
        cards: [],
        purchasedCourses: []
    }
  }
  return (
    <BrowserRouter>
      <Routes>
        {<Route path="/" element={
        <>
          <Header user={user}/>
          <Splash />
          <Footer/>
        </>
        } />}
        <Route path="/login" element={<Login updateU = {updateUser}/>} />
        <Route path="/signup" element={<SignUp addU = {adduserData}/>} />
        <Route path="/aboutus" element={
            <>
              <BackToSite />
              <AboutUs />
              <Footer/>
            </>
          
          } />
          <Route path="/courses" element={
            <>
              <Header user={user}/>
              <Course/>
              <Footer/>
            </>
          } />
          <Route path="/course/:id" element={
            <>
              <Header user={user}/>
              <ScrollToTop/>{/*just scrolls to top */}
              <CourseView/>
              <Footer/>
            </>
          } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;