import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styleComp/sideFilter.css";

const Stars = ({ n }) => (
  <span className="stars" aria-hidden="true">
    {Array.from({ length: 5 }, (_, i) => (
      <svg key={i} viewBox="0 0 24 24" width="14" height="14" className={i < n ? "on" : "off"}>
        <path
          fill="currentColor"
          d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"
        />
      </svg>
    ))}
  </span>
);

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-");

// One checkbox row. Options that would return 0 courses are dimmed (but a
// ticked option can always be un-ticked).
function CheckRow({ id, label, count, checked, onChange }) {
  const disabled = count === 0 && !checked;
  return (
    <div className={"form-check filterRow" + (disabled ? " isEmpty" : "")}>
      <input
        className="form-check-input"
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={id}>
        {label} <sub>({count})</sub>
      </label>
    </div>
  );
}

export default function SideFilter({
  ratingSteps,
  durationBuckets,
  filters,
  counts,
  topics,
  levels,
  activeCount,
  onRating,
  onToggle,
  onClear,
}) {
  return (
    <aside className="Filter" aria-label="Course filters">
      <div className="filterTop">
        <h5>Filters</h5>
        {activeCount > 0 && (
          <button type="button" className="clearBtn" onClick={onClear}>
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <div className="Ratings fill">
        <h6>Rating</h6>
        <div className="form-check filterRow">
          <input
            className="form-check-input"
            type="radio"
            name="rating"
            id="rate-any"
            checked={!filters.rating}
            onChange={() => onRating(0)}
          />
          <label className="form-check-label" htmlFor="rate-any">
            Any rating <sub>({counts.rating[0]})</sub>
          </label>
        </div>
        {ratingSteps.map((step) => {
          const count = counts.rating[step];
          const disabled = count === 0 && filters.rating !== step;
          return (
            <div
              className={"form-check filterRow" + (disabled ? " isEmpty" : "")}
              key={step}
            >
              <input
                className="form-check-input"
                type="radio"
                name="rating"
                id={`rate-${step}`}
                checked={filters.rating === step}
                disabled={disabled}
                onChange={() => onRating(step)}
              />
              <label className="form-check-label" htmlFor={`rate-${step}`}>
                <Stars n={Math.floor(step)} />
                <span className="rateText">{step.toFixed(1)} &amp; up</span>
                <sub>({count})</sub>
              </label>
            </div>
          );
        })}
      </div>

      <div className="video_duration fill">
        <h6>Course duration</h6>
        {durationBuckets.map((b) => (
          <CheckRow
            key={b.id}
            id={`dur-${b.id}`}
            label={b.label}
            count={counts.durations[b.id]}
            checked={filters.durations.includes(b.id)}
            onChange={() => onToggle("durations", b.id)}
          />
        ))}
      </div>

      <div className="topics fill">
        <h6>Topic</h6>
        {topics.map((t) => (
          <CheckRow
            key={t}
            id={`topic-${slug(t)}`}
            label={t}
            count={counts.topics[t]}
            checked={filters.topics.includes(t)}
            onChange={() => onToggle("topics", t)}
          />
        ))}
      </div>

      <div className="levels fill">
        <h6>Level</h6>
        {levels.map((l) => (
          <CheckRow
            key={l}
            id={`level-${slug(l)}`}
            label={l}
            count={counts.levels[l]}
            checked={filters.levels.includes(l)}
            onChange={() => onToggle("levels", l)}
          />
        ))}
      </div>
    </aside>
  );
}