import React from "react";
import ReactDOM from "react-dom/client";  
import 'bootstrap/dist/css/bootstrap.min.css';


class AboutUs extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="aboutUsSec">
                <div className ="row aboutIntro">
                    <div className="col-6 aboutText">

                    </div>
                    <img className="col-6" alt="About Us" src="./media/imgs/about1.svg"/>
                </div>
            </div>
        );
    }
}