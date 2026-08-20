
import React from "react";
import ReactDOM from "react-dom/client";  
import CourseSearch from './courseSearch.js';
import SideFilter from "./sideFilter.js";
export default class Course extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="courseSearchComp">
                <hr/>
                <CourseSearch/>
                <div className="row">
                    <SideFilter className="col-3"/>

                </div>
            </div>
        );
    }
}