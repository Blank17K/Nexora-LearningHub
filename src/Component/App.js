import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./splash.js"; 
import Login from "./Login.js"; 
import SignUp from "./SignUp.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/" element={<SignUp />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;