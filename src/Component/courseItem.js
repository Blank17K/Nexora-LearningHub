import React from "react";
import ReactDOM from "react-dom/client"; 
import jsImage from "../Assets/scripts/courseImages/js.png";
import "../styleComp/courseItem.css";

export default class CourseItem extends React.Component{
    constructor(props){
        super(props);
        const {course} = props;
        this.course = course;
    }


    render(){
        return(
            <div className="courseItem row">
                <img src={this.course.imgPath} className="col-3 align-self-center courseItemImage" alt="courseImg" />
                <div className="courseContent col row">
                    <div className="col-8">
                        <h6>{this.course.name}</h6>
                        <p className="descrip">{this.course.description.slice(0, 122)}...</p>
                        <p className="rating">{this.course.rating} <span>({this.course.userNo})</span></p>
                        <div className="banner row">
                            <p className="ban">{this.course.banner.type}</p>
                            <p className="ban ms-2 me-2">{this.course.banner.courseClass}</p>
                            <p className="ban">{this.course.banner.hours}h</p>
                            <p className="col auth">{this.course.author}</p>
                        </div>
                    </div>
                    <h4 className="col align-self-center priceItem">
                        R{this.course.price}.00 {">"}
                    </h4>
                </div>
            </div>
        );
    }
}