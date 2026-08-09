import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styleComp/Login.css";
import logo from "../Assets/Images/Logo.png";
import loginHero from "../Assets/Images/LoginHero.png";
import { Link } from "react-router-dom";

export default class BackToSite extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
            <div className="navBar">
                <div className="loginNav">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                    <p>Nexora</p>
                </div>
                <div className="backBtn">
                    <Link to={"/"}>Back to site</Link></div>
                </div>
            </div>
            </>
        );
    }
}