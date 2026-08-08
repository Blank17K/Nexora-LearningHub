import React from "react";
import ReactDOM from "react-dom/client";   

class Greeting extends React.Component{
    render(){
        return (
            <div>
                Hey React
            </div>
        );
    }
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Greeting />);