import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styleComp/courseSearch.css";

// CHANGED: removed the `searchQuery` and `onSearchChange` props.
// The search input now lives in the Header.
export default function CourseSearch({
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
            key={t}
            type="button"
            className={"btn catBtn" + (activeTopics.includes(t) ? " isOn" : "")}
            onClick={() => onPickTopic(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="inputSearch">
        {/* REMOVED: the <label className="searchBox"> block with the search
            icon, the text input and the clear (×) button. */}

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
  );
}