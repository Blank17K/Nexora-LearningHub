import React from "react";
import { Link } from "react-router-dom";
import CourseSearch from "./courseSearch.js";
import SideFilter from "./sideFilter.js";
import CourseItem from "./courseItem.js";
import coursesInfo from "../Assets/scripts/courseList.js";

// ───────── Filter rules (derived only from fields every course really has:
// rating, banner.hours, banner.type, banner.courseClass) ─────────
const RATING_STEPS = [4.8, 4.5, 4.0];

const DURATION_BUCKETS = [
  { id: "lt35", label: "Under 35 hours", test: (h) => h < 35 },
  { id: "35to45", label: "35 – 45 hours", test: (h) => h >= 35 && h < 45 },
  { id: "45plus", label: "45+ hours", test: (h) => h >= 45 },
];

const LEVEL_ORDER = ["Beginner", "Intermediate", "Advanced"];

const EMPTY_FILTERS = {
  rating: 0, // 0 = any rating
  durations: [], // bucket ids
  topics: [], // banner.type values
  levels: [], // banner.courseClass values
};

// An empty group means "no restriction" for that group.
const groupTests = {
  rating: (c, f) => !f.rating || c.rating >= f.rating,
  durations: (c, f) =>
    f.durations.length === 0 ||
    DURATION_BUCKETS.some(
      (b) => f.durations.includes(b.id) && b.test(c.banner.hours)
    ),
  topics: (c, f) => f.topics.length === 0 || f.topics.includes(c.banner.type),
  levels: (c, f) =>
    f.levels.length === 0 || f.levels.includes(c.banner.courseClass),
};

function matchesFilters(course, filters) {
  return Object.keys(groupTests).every((g) => groupTests[g](course, filters));
}

function countActiveFilters(f) {
  return (f.rating ? 1 : 0) + f.durations.length + f.topics.length + f.levels.length;
}

function getTopicList(courses) {
  return [...new Set(courses.map((c) => c.banner.type))].sort((a, b) =>
    a.localeCompare(b)
  );
}

function getLevelList(courses) {
  const present = new Set(courses.map((c) => c.banner.courseClass));
  const known = LEVEL_ORDER.filter((l) => present.has(l));
  const extra = [...present].filter((l) => !LEVEL_ORDER.includes(l));
  return [...known, ...extra];
}

// "How many courses would I see if I picked this option?" — respects every
// other filter that is already active, so the numbers never lie.
function getFilterCounts(courses, filters) {
  const count = (group, value) =>
    courses.filter((c) => matchesFilters(c, { ...filters, [group]: value })).length;

  return {
    rating: Object.fromEntries([
      [0, count("rating", 0)],
      ...RATING_STEPS.map((s) => [s, count("rating", s)]),
    ]),
    durations: Object.fromEntries(
      DURATION_BUCKETS.map((b) => [b.id, count("durations", [b.id])])
    ),
    topics: Object.fromEntries(
      getTopicList(courses).map((t) => [t, count("topics", [t])])
    ),
    levels: Object.fromEntries(
      getLevelList(courses).map((l) => [l, count("levels", [l])])
    ),
  };
}


const PAGE_SIZE = 5;

export default class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      showAll: false,
      sortC: "MP", // MP -> Most Popular, HR -> Highest Rated, P -> Price (low to high)
      filters: EMPTY_FILTERS,
    };
    this.courses = coursesInfo;
    this.topics = getTopicList(this.courses);
    this.levels = getLevelList(this.courses);
  }

  handleSearchChange = (query) => {
    this.setState({ searchQuery: query, showAll: false });
  };

  changeSort = (sortVal) => {
    this.setState({ sortC: sortVal });
  };

  setRating = (rating) => {
    this.setState((s) => ({ filters: { ...s.filters, rating }, showAll: false }));
  };

  // Toggle a value inside one of the array-based filter groups
  toggleFilter = (group, value) => {
    this.setState((s) => {
      const current = s.filters[group];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { filters: { ...s.filters, [group]: next }, showAll: false };
    });
  };

  // Category pills: pick exactly one topic, or null for "All"
  pickTopic = (topic) => {
    this.setState((s) => ({
      filters: { ...s.filters, topics: topic ? [topic] : [] },
      showAll: false,
    }));
  };

  clearFilters = () => {
    this.setState({ filters: EMPTY_FILTERS, showAll: false });
  };

  clearAll = () => {
    this.setState({ filters: EMPTY_FILTERS, searchQuery: "", showAll: false });
  };

  getFilteredCourses = () => {
    const { searchQuery, sortC, filters } = this.state;

    // Start from the source list (never mutate state/source)
    let result = this.courses.filter((course) => matchesFilters(course, filters));

    // Search across name, instructor, topic and description
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.author.toLowerCase().includes(query) ||
          course.banner.type.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)
      );
    }

    switch (sortC) {
      case "MP":
        result.sort((a, b) => b.userNo - a.userNo);
        break;
      case "HR":
        result.sort((a, b) => b.rating - a.rating || b.userNo - a.userNo);
        break;
      case "P":
        result.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }
    return result;
  };

  renderCourses(list) {
    return list.map((course, index) => (
      <div
        className="courseRow"
        key={course.id ?? index}
        style={{ "--i": index }}
      >
        <Link to={`/course/${course.id}`} className="courseLink">
          <CourseItem course={course} addToFavourites={this.props.addToFavourites} />
        </Link>
        <hr />
      </div>
    ));
  }

  render() {
    const { searchQuery, sortC, filters, showAll } = this.state;
    const filteredCourses = this.getFilteredCourses();
    const visible = showAll ? filteredCourses : filteredCourses.slice(0, PAGE_SIZE);
    const activeCount = countActiveFilters(filters);
    const counts = getFilterCounts(this.courses, filters);

    return (
      <div className="courseSearchComp">
        <CourseSearch
          searchQuery={searchQuery}
          onSearchChange={this.handleSearchChange}
          totalResults={filteredCourses.length}
          sortValue={sortC}
          onSort={this.changeSort}
          topics={this.topics}
          activeTopics={filters.topics}
          onPickTopic={this.pickTopic}
        />
        <div className="row g-4 courseBody">
          <div className="col-12 col-lg-3">
            <SideFilter
              ratingSteps={RATING_STEPS}
              durationBuckets={DURATION_BUCKETS}
              filters={filters}
              counts={counts}
              topics={this.topics}
              levels={this.levels}
              activeCount={activeCount}
              onRating={this.setRating}
              onToggle={this.toggleFilter}
              onClear={this.clearFilters}
            />
          </div>
          <div className="col-12 col-lg-9 courseList">
            {filteredCourses.length > 0 ? (
              this.renderCourses(visible)
            ) : (
              <div className="noResults">
                <h5>No courses match that</h5>
                <p>Try removing a filter or searching for something else.</p>
                <button type="button" className="btn showAll" onClick={this.clearAll}>
                  Clear search &amp; filters
                </button>
              </div>
            )}
            {!showAll && filteredCourses.length > PAGE_SIZE && (
              <div className="showAllWrap">
                <button
                  type="button"
                  className="btn showAll"
                  onClick={() => this.setState({ showAll: true })}
                >
                  Show all {filteredCourses.length} courses
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}