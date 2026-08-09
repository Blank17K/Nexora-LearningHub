import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styleComp/header.css";
import { Link } from "react-router-dom";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row align-items-center header">
        <div className="col-1">
          <img alt="logo" src="./media/imgs/logo.svg" />
        </div>
        <div className="col-2">
          <b>Nexora</b>
        </div>
        <div className="col-6 browseTxt"><Link to={"/aboutus"}>About us</Link></div>
        {/* <div className="col-6 browseTxt">Browse</div> */}
        <button className="btn SignUpButt col-1 me-2">
          <Link to={"/signup"}>Sign Up</Link>
        </button>
        <button className="btn LoginButt col-1 ">
          <Link to={"/login"}>Login</Link>
        </button>
      </div>
    );
  }
}
