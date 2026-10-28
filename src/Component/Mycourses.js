import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styleComp/myCourses.css";
import coursesInfo from "../Assets/scripts/courseList.js";
import { loadProgressFor } from "../Assets/scripts/usersList.js";
import {
  loadRatings,
  saveRating,
  totalLessonsOf,
  getStreakWeeks,
} from "../Assets/scripts/progress.js";

const INITIAL_VISIBLE = 4;

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" },
  { value: "progress", label: "Progress" },
];

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

function Stars({ value, onRate, courseName }) {
  return (
    <div className="mcRating">
      <div className="mcStars" role="group" aria-label={`Rate ${courseName}`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={"mcStar" + (n <= value ? " on" : "")}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            aria-pressed={n === value}
            // Clicking your current rating again clears it
            onClick={() => onRate(n === value ? 0 : n)}
          >
            {n <= value ? "★" : "☆"}
          </button>
        ))}
      </div>
      <span className="mcRatingLabel">
        {value ? "Your rating" : "Leave a rating"}
      </span>
    </div>
  );
}

export default function MyCourses({ user }) {
  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [showAll, setShowAll] = useState(false);
  const [ratings, setRatings] = useState(() => loadRatings(user.id));

  const streak = useMemo(() => getStreakWeeks(user.id), [user.id]);

  // Every course this user has bought, in purchase order.
  // Progress comes from the course player (saved through usersList.js).
  const owned = useMemo(
    () =>
      (user.purchasedCourses || [])
        .map((id, order) => {
          const course = coursesInfo.find((c) => c.id === Number(id));
          if (!course) return null;
          const total = totalLessonsOf(course);
          const saved = loadProgressFor(user.id, course.id);
          const done = Math.min((saved?.completed || []).length, total);
          return {
            course,
            order,
            total,
            done,
            pct: total ? Math.round((done / total) * 100) : 0,
          };
        })
        .filter(Boolean),
    [user.id, user.purchasedCourses],
  );

  const categories = useMemo(
    () => ["All", ...new Set(owned.map((o) => o.course.banner.type))],
    [owned],
  );

  const completed = owned.filter((o) => o.total > 0 && o.done >= o.total).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = owned.filter(({ course }) => {
      if (activeCat !== "All" && course.banner.type !== activeCat) return false;
      if (!q) return true;
      return [course.name, course.description, course.author, course.banner.type]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    const sorters = {
      newest: (a, b) => b.order - a.order,
      oldest: (a, b) => a.order - b.order,
      title: (a, b) => a.course.name.localeCompare(b.course.name),
      progress: (a, b) => b.pct - a.pct,
    };
    return [...list].sort(sorters[sort]);
  }, [owned, activeCat, query, sort]);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);

  const rate = (courseId, stars) => {
    setRatings((r) => {
      const next = { ...r };
      if (stars > 0) next[courseId] = stars;
      else delete next[courseId];
      return next;
    });
    saveRating(user.id, courseId, stars);
  };

  return (
    <main className="myCourses">
      {/* ───────── Title + stats ───────── */}
      <section className="mcHead">
        <div className="mcTitle">
          <h1>My Courses</h1>
          <p>
            <span>{plural(owned.length, "course")}</span>
          </p>
        </div>

        <div className="mcStats">
          <div className="mcStreak">
            <svg
              viewBox="0 0 24 24"
              width="40"
              height="40"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.8 2.2c.3 2.6-.7 4.3-2.1 6-1.3 1.6-2.7 3.2-2.7 5.6 0 1.3.5 2.4 1.2 3.2-2-.4-3.6-2.1-3.6-4.8 0-1 .3-2 .8-2.8C3.9 11 3 13.2 3 15.3 3 19.5 6.6 22 10.5 22h3C17.6 22 21 19.4 21 15c0-3.6-2.2-6.3-4.5-8.3-.3 1.2-.9 2.1-1.8 2.8.5-2.3.1-5.3-1.9-7.3zM12 20c-1.7 0-3-1.1-3-2.8 0-1.9 1.4-2.8 2.4-4 .5.9 1.1 1.4 1.8 2 .6.5 1.8 1.2 1.8 2.8 0 1.6-1.3 2-3 2z" />
            </svg>
            <div>
              <small>Current learning streak:</small>
              <strong>{streak > 0 ? plural(streak, "week") : "Not started"}</strong>
            </div>
          </div>

          <ul className="mcAchievements">
            <li>
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="14" rx="2" />
                <path d="M7 8h10M7 12h5" />
                <path d="M15 17l-1 4 3-1.5L20 21l-1-4" />
              </svg>
              <span>{plural(completed, "Certificate")}</span>
            </li>
            <li>
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span>{completed} completed</span>
            </li>
          </ul>
        </div>
      </section>

      {owned.length === 0 ? (
        <section className="mcEmpty">
          <h2>You haven't enrolled in any courses yet</h2>
          <p>Browse the catalogue and your courses will show up here.</p>
          <Link to="/courses" className="mcBtn">
            Browse courses
          </Link>
        </section>
      ) : (
        <>
          {/* ───────── Topic pills ───────── */}
          <div className="mcPills" role="tablist" aria-label="Filter by topic">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCat === cat}
                className={"mcPill" + (activeCat === cat ? " isOn" : "")}
                onClick={() => {
                  setActiveCat(cat);
                  setShowAll(false);
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ───────── Search + sort ───────── */}
          <div className="mcTools">
            <div className="mcSearch">
              <svg
                className="mcSearchIcon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowAll(false);
                }}
                placeholder="Search courses, topics or instructors..."
                aria-label="Search my courses"
              />
              {query && (
                <button
                  type="button"
                  className="mcSearchClear"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                >
                  &times;
                </button>
              )}
            </div>

            <p className="mcCount" aria-live="polite">
              {plural(filtered.length, "Result")}
            </p>

            <select
              className="mcSort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort courses"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* ───────── Course rows ───────── */}
          {filtered.length === 0 ? (
            <p className="mcNoMatch">No courses match your search.</p>
          ) : (
            <ul className="mcList">
              {visible.map(({ course, total, done, pct }) => (
                <li className="mcRow" key={course.id}>
                  <Link
                    to={`/courseplayer/${course.id}`}
                    className="mcThumb"
                    aria-label={`Open ${course.name}`}
                  >
                    <img src={course.imgPath} alt="" />
                  </Link>

                  <div className="mcInfo">
                    <h2>
                      <Link to={`/courseplayer/${course.id}`}>{course.name}</Link>
                    </h2>
                    <p className="mcDesc">{course.description}</p>
                    <div className="mcMeta">
                      {course.rating >= 4.7 && (
                        <span className="mcChip mcChipGreen">Bestseller</span>
                      )}
                      <span className="mcChip">{course.banner.type}</span>
                      <span className="mcChip">{course.banner.hours}h</span>
                      <span className="mcDot" aria-hidden="true">•</span>
                      <span className="mcAuthor">{course.author}</span>
                    </div>
                  </div>

                  <div className="mcSide">
                    <div className="mcProgress">
                      <div
                        className="mcBar"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={pct}
                        aria-label={`${course.name} progress`}
                      >
                        <span style={{ width: `${pct}%` }} />
                      </div>
                      <strong className="mcPct">{pct}%</strong>
                      <span className="mcLessons">
                        {done} of {total} lessons
                      </span>
                    </div>

                    <Stars
                      value={ratings[course.id] || 0}
                      onRate={(n) => rate(course.id, n)}
                      courseName={course.name}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {filtered.length > INITIAL_VISIBLE && (
            <div className="mcMore">
              <button
                type="button"
                className="mcBtn"
                onClick={() => setShowAll((s) => !s)}
              >
                {showAll ? "Show less" : `Show All ${filtered.length} Courses`}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}