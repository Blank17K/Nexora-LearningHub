import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styleComp/header.css";
import { Link } from "react-router-dom";

export default class Header extends React.Component {
  constructor(props) {
    super(props);

  }
  getIfLoggedIn(){
    if(this.props.user == null){
      return (
        <>  
          <button className="btn SignUpButt col-1 me-2">
            <Link to={"/signup"}>Sign Up</Link>
          </button>
          <button className="btn LoginButt col-1 ">
            <Link to={"/login"}>Login</Link>
          </button>
        </>
      );
    }
    else{
      return(
        <>
          <div className="user col row align-items-center">
            <p className="col-6 userName">{this.props.user.name}</p>
            <div className="userImg col"></div>
            <button className="btn logout col ms-2" onClick={this.props.logout}>Logout</button>
          </div>
        </>
      );
    }
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
        <div className="col-6 browseTxt"><Link to={"/courses"}>Browse</Link></div>
        {/* <div className="col-6 browseTxt">Browse</div> */}
        
        {this.getIfLoggedIn()}
      </div>
    );
  }
}
