import React from "react";
import logo from "../Assets/Images/Logo.png";

function PlayerHeader() {
  return (
    <div className="row align-items-center header">
      <div className="col-1">
        <img alt="logo" src={logo} className="logoHead" />
      </div>
      <div className="col-2">
        <b>Nexora</b>
      </div>
      <div className="col-3"></div>
      <div className="col-6 browseTxt row align-items-center">
        <div className="loaderN col-6"></div>
        <p className="col">{`22%`}</p>
        <p className="col-4">{`7 of 32 lessons`}</p>
      </div>
      <hr className="mt-3"/>
    </div>
  );
}

export default PlayerHeader;