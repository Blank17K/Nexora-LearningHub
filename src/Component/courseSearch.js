import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styleComp/courseSearch.css";

export default class CourseSearch extends React.Component {
  // constructor(props){
  //     super(props);
  //     this.state = {
  //         totalCourses: 0,
  //         active: ["active","","","","",""]
  //     };

  // }

  render() {
    const { searchQuery, onSearchChange, totalResults } = this.props;
    return (
      <div className="">
        <span className="row align-items-end corseT">
          <h1 className="col-3">All Courses: </h1>
          <p className="col">
            <span>{`${totalResults} courses `}</span>
            every one ends with something you built
          </p>
        </span>
        <div>
          <button className={`btn catBtn active`}>All</button>
          <button className={`btn catBtn `}>Web Development</button>
          <button className={`btn catBtn `}>UI/UX Design</button>
          <button className={`btn catBtn `}>Javascript</button>
          <button className={`btn catBtn `}>3D</button>
          <button className={`btn catBtn `}>Cloud Computing</button>
        </div>
        <hr />
        <div className="row inputSearch align-items-end">
          <input
            className="col-8"
            type="text"
            placeholder="Search courses, topics or instructors…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <p className="col-1 ms-2">{`${totalResults} Results`}</p>
          <select className="col-3 ms-4 form-select">
            <option selected>Sort: Most Popular</option>
            <option value="high_rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        {/*<div className="row btnOrder justify-content-end">
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
                </div>*/}
      </div>
    );
  }
}
