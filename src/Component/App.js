import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./splash.js"; 
import  BackToSite from "./backTosite.js";
import  Header  from "./header.js";
import  AboutUs  from "./AboutUs.js";
import Footer  from "./footer.js";
import Login from "./Login.js"; 
import SignUp from "./SignUp.js";
import Course from "./Course.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {<Route path="/" element={
        <>
          <Header/>
          <Splash />
          <Footer/>
        </>
        } />}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/aboutus" element={
            <>
              <BackToSite />
              <AboutUs />
              <Footer/>
            </>
          
          } />
          <Route path="/courses" element={
            <>
              <Header/>
              <Course/>
              <Footer/>
            </>
          } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;