import React from "react";
import ReactDOM from "react-dom/client";
import CourseSearch from "./courseSearch.js";
import SideFilter from "./sideFilter.js";
import CourseItem from "./courseItem.js";
import coursesInfo from "../Assets/scripts/courseList.js";
import { Link } from "react-router-dom";

export default class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      // filterArr: courseInfo,
    };
    this.courses = coursesInfo;
  }

  handleSearchChange = (query) => {
    this.setState({ searchQuery: query });
  };

  getFilteredCourses = () => {
    const { searchQuery } = this.state;
    if (!searchQuery.trim()) return this.courses;

    const query = searchQuery.toLowerCase();
    return this.courses.filter((course) => {
      return (
        course.name.toLowerCase().includes(query) ||
        course.author.toLowerCase().includes(query) ||
        course.description.toLocaleLowerCase().includes(query)
      );
    });
  };

  addCourses(filteredCourses) {
    return filteredCourses.map((course, index) => {
      return (
        <div className="individualCourse" key={course.id || index}>
          <Link to={`/course/${course.name}`}>
            <CourseItem course={course} />
            <hr />
          </Link>
        </div>
      );
    });
    // let courseReturn = this.courses.map((course, index) => {
    //   return (
    //     <>
    //       <Link to={`/course/${course.name}`}>
    //         <CourseItem key={index} course={course} />
    //         <hr />
    //       </Link>
    //     </>
    //   );
    // });
    // return courseReturn;
  }
  render() {
    const filteredCourses = this.getFilteredCourses();

    return (
      <div className="courseSearchComp">
        <hr />
        <CourseSearch
          searchQuery={this.state.searchQuery}
          onSearchChange={this.handleSearchChange}
          totalResults={filteredCourses.length}
        />
        <div className="row">
          <SideFilter />
          <div className="col courseList">
            {filteredCourses.length > 0 ? (
              this.addCourses(filteredCourses)
            ) : (
              <div>
                <h4>No courses found matching "{this.state.searchQuery}"</h4>
                <p>Try checking for typos </p>
                <button className="clearSearch" onClick={() => this.handleSearchChange("")}>
                  Clear Search
                </button>
              </div>
            )}
            {/* {this.addCourses()} */}
          </div>
        </div>
      </div>
    );
  }
}
