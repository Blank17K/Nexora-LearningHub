import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import coursesInfo from "../Assets/scripts/courseList.js";
import CourseItem from "./courseItem.js"; // adjust path if needed
import "../styleComp/cart.css";

export default function Cart({ user }) {
  const navigate = useNavigate();
  // cart course objects
  const cartCourses = coursesInfo.filter(c => user.cart.includes(c.id));

  // total
  const totalCost = cartCourses.reduce((sum, c) => sum + c.price, 0);
  const [userCart, setFavourites] = useState(
    coursesInfo.filter((course) => user.cart.includes(course.id))
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

  const removeFromCart = (courseId) => {
    setFavourites((prev) => prev.filter((c) => c.id !== courseId));
    user.cart = user.cart.filter((id) => id !== courseId);
  }
  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let result = userCart.filter((course) => {
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
  }, [userCart, searchQuery, sortValue]);

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
          <CourseItem course={course} fav={'x'} handleCourse={removeFromCart}/>
        </Link>
        <hr />
      </div>
    ));
  };

  return (
    <div className="favourites">
      <div className="courseSearchHead">
        <div className="corseT">
          <h1>My Cart</h1>
          <p>
            <span>{`${userCart.length} ${
              userCart.length === 1 ? "course" : "courses"
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
      <div className="courseList row">
        <div className="col-8">
        {visibleCourses.length === 0 ? (
          <div className="emptyState">
            <p>No courses in your cart.</p>
            {userCart.length === 0 && (
              <Link to="/courses" className="browseBtn">
                Browse courses
              </Link>
            )}
          </div>
        ) : (
          renderCourses(visibleCourses)
        )}
        </div>
        <div className="TotalCost col-4">
          <div className="StickyCard CartTotal">
            <h3 className="CartTotalTitle">Order Summary</h3>

            <div className="CartTotalItems">
              {cartCourses.length === 0 ? (
                <p className="CartTotalEmpty">No items in cart.</p>
              ) : (
                cartCourses.map(course => (
                  <div className="CartTotalRow" key={course.id}>
                    <span className="CartTotalName">{course.name}</span>
                    <span className="CartTotalPrice">R{course.price}</span>
                  </div>
                ))
              )}
            </div>

            <div className="StickyCardDescr CartTotalFooter">
              <div>
                <p>Subtotal</p>
                <p>Items</p>
              </div>
              <div>
                <p>R{totalCost}</p>
                <p>{cartCourses.length}</p>
              </div>
            </div>

            <div className="StickyCardPrice CartTotalGrand">
              <h3>R{totalCost}</h3>
              <p>total · once-off</p>
            </div>

            <div className="StickyCarDBtn">Checkout</div>
          </div>
        </div>
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