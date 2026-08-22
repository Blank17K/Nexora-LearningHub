import React from "react";
import ReactDOM from "react-dom/client";  
import CourseSearch from './courseSearch.js';
import SideFilter from "./sideFilter.js";
import CourseItem from "./courseItem.js";
import coursesInfo from "../Assets/scripts/courseList.js";
export default class Course extends React.Component{
    constructor(props){
        super(props);
        this.courses = coursesInfo;
    }
    addCourses(){
        let courseReturn = this.courses.map((course,index)=>{
            return (<>
                <CourseItem key={index} course={course}/>
                <hr/>
            </>)
        });
        return courseReturn;
    }
    render(){
        return(
            <div className="courseSearchComp">
                <hr/>
                <CourseSearch/>
                <div className="row">
                    <SideFilter />
                    <div className="col courseList">
                        {this.addCourses()}
                    </div>
                </div>
            </div>
        );
    }
}