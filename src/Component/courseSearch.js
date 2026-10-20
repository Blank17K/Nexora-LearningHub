import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styleComp/courseSearch.css";

export default function CourseSearch({
  searchQuery,
  onSearchChange,
  totalResults,
  sortValue,
  onSort,
  topics = [],
  activeTopics = [],
  onPickTopic,
}) {
  return (
    <div className="courseSearchHead">
      <div className="corseT">
        <h1>All Courses</h1>
        <p>
          <span>{`${totalResults} ${totalResults === 1 ? "course" : "courses"}`}</span>
          every one ends with something you built
        </p>
      </div>

      <div className="pillRow" role="group" aria-label="Filter by topic">
        <button
          type="button"
          className={"btn catBtn" + (activeTopics.length === 0 ? " isOn" : "")}
          onClick={() => onPickTopic(null)}
        >
          All
        </button>
        {topics.map((t) => (
          <button
            type="button"
            key={t}
            className={"btn catBtn" + (activeTopics.includes(t) ? " isOn" : "")}
            onClick={() => onPickTopic(t)}
          >
            {t}
          </button>
        ))}
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
        <p className="resultCount">{`${totalResults} ${totalResults === 1 ? "Result" : "Results"}`}</p>
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
  );
}