import React from "react";
import ReactDOM from "react-dom/client";  
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styleComp/footer.css';

export class Footer extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="footer row">
                <div className="col-6">
                    <span><img alt="logo"/><p>Nexora</p></span>
                    <p>Practical courses for people who'd rather build than watch.</p>
                    <h5>Sign up to our newsletter</h5>
                    <p>Email Address</p>
                    <div className="row inputs">
                        <input type="email" className="email col me-3" placeholder="you@example.com"/>
                        <button className="btn col me-3 signNewsP">Sign up for free</button>
                    </div>
                </div>
                <div className="col-6 row">
                    <div className="empty col-4"></div>
                    <div className="infoLink col-8 row row-cols-4">
                        <h6 className="headInfo col-4"><u><b>Learn</b></u></h6>
                        <h6 className="headInfo col-4"><u><b>Company</b></u></h6>
                        <h6 className="headInfo col-4"><u><b>Support</b></u></h6>
                        <p className="textHelp col-4">Browse</p>
                        <p className="textHelp col-4">About</p>
                        <p className="textHelp col-4">Help Center</p>
                        <p className="textHelp col-4">Categories</p>
                        <p className="textHelp col-4">Instructors</p>
                        <p className="textHelp col-4">Contact</p>
                        <p className="textHelp col-4">Free courses</p>
                        <p className="textHelp col-4">Careers</p>
                        <p className="textHelp col-4">Terms</p>
                    </div>
                </div>
            </div>
        );
    }
}