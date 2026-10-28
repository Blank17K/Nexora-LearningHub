import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import coursesInfo from "../Assets/scripts/courseList.js";
import CourseItem from "./courseItem.js"; // adjust path if needed

export default function Favourites({ user, moveToCart }) {
  const navigate = useNavigate();

  const [userFavourites, setFavourites] = useState(
    coursesInfo.filter((course) => user.favourites.includes(course.id))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("MP");
  const [showAll, setShowAll] = useState(false);

  const onSearchChange = (query) => setSearchQuery(query);
  const onSort = (value) => setSortValue(value);

  const removeFavourite = (courseId) => {
    setFavourites((prev) => prev.filter((c) => c.id !== courseId));
    user.favourites = user.favourites.filter((id) => id !== courseId);
  };

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let result = userFavourites.filter((course) => {
      if (!q) return true;
      return (
        course.title?.toLowerCase().includes(q) ||
        course.instructor?.toLowerCase().includes(q) ||
        course.topic?.toLowerCase().includes(q) ||
        course.description?.toLowerCase().includes(q)
      );
    });

    switch (sortValue) {
      case "HR":
        result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "P":
        result = [...result].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "MP":
      default:
        result = [...result].sort(
          (a, b) => (b.students ?? 0) - (a.students ?? 0)
        );
        break;
    }

    return result;
  }, [userFavourites, searchQuery, sortValue]);

  const totalResults = filteredCourses.length;
  const visibleCourses = showAll ? filteredCourses : filteredCourses.slice(0, 6);
  
  const renderCourses = (list) => {
    return list.map((course, index) => (
      <div
        className="courseRow"
        key={course.id ?? index}
        style={{ "--i": index }}
      >
        <Link to={`/course/${course.id}`} className="courseLink">
          <CourseItem course={course} fav={'crt'} handleCourse={moveToCart}/>
        </Link>
        <hr />
      </div>
    ));
  };

  return (
    <div className="favourites">
      <div className="courseSearchHead">
        <div className="corseT">
          <h1>Favourites</h1>
          <p>
            <span>{`${userFavourites.length} ${
              userFavourites.length === 1 ? "course" : "courses"
            }`}</span>
          </p>
        </div>

        <div className="inputSearch">
          <label className="searchBox">
            <svg
              className="searchIcon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search courses, topics or instructors…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search courses"
            />
            {searchQuery && (
              <button
                type="button"
                className="searchClear"
                aria-label="Clear search"
                onClick={() => onSearchChange("")}
              >
                ×
              </button>
            )}
          </label>

          <p className="resultCount">
            {`${totalResults} ${totalResults === 1 ? "Result" : "Results"}`}
          </p>

          <select
            className="form-select sortSelect"
            value={sortValue}
            onChange={(e) => onSort(e.target.value)}
            aria-label="Sort courses"
          >
            <option value="MP">Sort: Most Popular</option>
            <option value="HR">Sort: Highest Rated</option>
            <option value="P">Sort: Price, low to high</option>
          </select>
        </div>
      </div>

      {/* ---------- Display via renderCourses ---------- */}
      <div className="courseList">
        {visibleCourses.length === 0 ? (
          <div className="emptyState">
            <p>No favourite courses found.</p>
            {userFavourites.length === 0 && (
              <Link to="/courses" className="browseBtn">
                Browse courses
              </Link>
            )}
          </div>
        ) : (
          renderCourses(visibleCourses)
        )}
      </div>

      {filteredCourses.length > 6 && (
        <button
          type="button"
          className="showAllBtn"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "Show less" : `Show all (${filteredCourses.length})`}
        </button>
      )}
    </div>
  );
}