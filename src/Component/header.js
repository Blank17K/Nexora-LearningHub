import React from "react";
import ReactDOM from "react-dom/client";  
import 'bootstrap/dist/css/bootstrap.min.css';

export class Header extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="row">
                <div className="col-1"><img alt="logo" /></div>
                <div className="col-2">Nexora</div>
                <div className ="col-6">Browse</div>
                <button className="btn LoginButt col-1 me-2">Login</button>
                <button className="btn RegisterButt col-1">Register</button>
            </div>
        );
    }
}