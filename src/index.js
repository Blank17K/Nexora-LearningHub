import React from "react";
import ReactDOM from "react-dom/client";   
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Header } from "./Component/header.js";
import { Splash } from "./Component/splash.js";  
import { Footer } from "./Component/footer.js";

class IndexP extends React.Component{
    render(){
        return (
            <div>
                <Header />
                <Splash />
                <Footer />
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<IndexP />);