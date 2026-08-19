
import React from "react";
import ReactDOM from "react-dom/client";  
import CourseSearch from './courseSearch.js';
export default class Course extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
                <hr/>
                <CourseSearch/>
                <hr/>
            </>
        );
    }
}