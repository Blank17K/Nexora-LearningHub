import React from "react";
import ReactDOM from "react-dom/client";  
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styleComp/courseSearch.css';

export default class CourseSearch extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            totalCourses: 0,
            active: ["active","","","","",""]
        };
        
    }

    render(){
        return(
            <div className="courseSearchComp">
                <span className="row align-items-end corseT">
                    <h1 className="col-3">All Courses: </h1>
                    <p className="col"><span>{this.state.totalCourses+" courses   "}</span>every one ends with something you built</p>
                </span>
                <div>
                    <button className={`btn catBtn ${this.state.active[0]}`}>All</button>
                    <button className={`btn catBtn ${this.state.active[1]}`}>Web Development</button>
                    <button className={`btn catBtn ${this.state.active[2]}`}>UI/UX Design</button>
                    <button className={`btn catBtn ${this.state.active[3]}`}>Javascript</button>
                    <button className={`btn catBtn ${this.state.active[4]}`}>3D</button>
                    <button className={`btn catBtn ${this.state.active[5]}`}>Cloud Computing</button>
                </div>
                <hr/>
                <div className="row inputSearch align-items-end">
                    <input className="col-8" type="text" placeholder="Search courses, topics or instructors…"/>
                    <p className="col-1 ms-2">{`${this.state.totalCourses} Results`}</p>
                    <select className="col-3 ms-4 form-select" >
                        <option selected>Sort: Most Popular</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                </div>
                <div className="row btnOrder justify-content-end">
                    <div className="col-3"></div>
                    <select className="col form-select" >
                        <option selected>Topic: All</option>
                        <option value="1"></option>
                        <option value="2"></option>
                        <option value="3"></option>
                    </select>
                    <select className="col form-select" >
                        <option selected>Video Duration: All</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                    <select className="col form-select" >
                        <option selected>Price: All</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                    <select className="col form-select" >
                        <option selected>Subcategory: All</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                </div>
            </div>
        );
    }
}

