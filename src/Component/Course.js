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
      showAll: false,
      sortC: "MP" // MP -> Most Pop, HR -> Highrated, N -> Newest (price)
    };
    this.courses = coursesInfo;
    this.changeSort = this.changeSort.bind(this);
  }

  handleSearchChange = (query) => {
    this.setState({ searchQuery: query, showAll: false });
  };

  changeSort(sortVal) {
    this.setState({ sortC: sortVal });
  }

  getFilteredCourses = () => {
    const { searchQuery, sortC } = this.state;

    // Start from the source list (never mutate state/source)
    let result = [...this.courses];

    // 1. Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((course) => {
        return (
          course.name.toLowerCase().includes(query) ||
          course.author.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)
        );
      });
    }

    // 2. Apply sorting on the filtered result
    switch (sortC) {
      case "MP":
        result.sort((a, b) => b.userNo - a.userNo);
        break;
      case "HR":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "P":
        result.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }
    console.log(result.map((res)=>{
      return res.price;
    }));
    return result;
  };

  addCourses(filteredCourses) {
    const list = this.state.showAll
      ? filteredCourses
      : filteredCourses.slice(0, Math.ceil(filteredCourses.length / 2));

    return list.map((course, index) => (
      <div key={course.id ?? index}>
        <Link to={`/course/${course.id}`}>
          <CourseItem course={course} />
          <hr />
        </Link>
      </div>
    ));
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
          onSort={this.changeSort}
        />
        <div className="row">
          <SideFilter />
          <div className="col courseList">
            {filteredCourses.length > 0 ? this.addCourses(filteredCourses) : ""}
          </div>
          {this.state.showAll === false ? (
            <center>
              <button
                className="btn showAll"
                onClick={() => {
                  this.setState({ showAll: true });
                }}
              >
                Show All: {filteredCourses.length}
              </button>
            </center>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}