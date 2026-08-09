import React from "react";
import ReactDOM from "react-dom/client";  
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styleComp/footer.css';
import { Link } from "react-router-dom";

export default class Footer extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="footer row">
                <div className="col-6">
                    <span className="row align-items-center"><img alt="logo" src="./media/imgs/logo.svg" className="col-2 logoFooter"/><p className="col">Nexora</p></span>
                    <p>Practical courses for people who'd rather build than watch.</p>
                    <h5>Sign up to our newsletter</h5>
                    <p>Email Address</p>
                    <div className="row inputs">
                        <input type="email" className="email col ms-1 me-3" placeholder="you@example.com"/>
                        <button className="btn col me-3 signNewsP">Sign up for free</button>
                    </div>
                </div>
                <div className="col-6 row align-items-end">
                    <div className="empty col-4"></div>
                    <div className="infoLink col-8 row row-cols-4">
                        <h6 className="headInfo col-4"><u><b>Learn</b></u></h6>
                        <h6 className="headInfo col-4"><u><b>Company</b></u></h6>
                        <h6 className="headInfo col-4"><u><b>Support</b></u></h6>
                        <p className="textHelp col-4">Browse</p>
                        <p className="textHelp col-4"><Link to={"/about"}>About</Link></p>
                        <p className="textHelp col-4">Help Center</p>
                        <p className="textHelp col-4">Categories</p>
                        <p className="textHelp col-4">Instructors</p>
                        <p className="textHelp col-4">Contact</p>
                        <p className="textHelp col-4">Free courses</p>
                        <p className="textHelp col-4">Careers</p>
                        <p className="textHelp col-4">Terms</p>
                    </div>
                    <p className="col-4"><b>&copy; Neroxa, Inc. 2026</b></p>
                    <p className="col"><b>Terms</b></p>
                    <p className="col"><b>Privacy</b></p>
                    <p className="col"><b>Help</b></p>
                    <p className="col"><b><i className="lni lni-globe-1"></i>English</b></p>
                </div>
            </div>
        );
    }
}