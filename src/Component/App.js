import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./splash.js"; 
import Login from "./Login.js"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;