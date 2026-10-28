import React from "react";
import "../styleComp/courseItem.css";
import "../styleComp/cartFav.css";

/*
  One row in the /courses list.

  Optional round button in the top-right corner of the row:
    mode="hrt"  heart  (add / remove favourite)   <- used on /courses
    mode="crt"  cart   (add to cart)
    mode="x"    cross  (remove)
  `active` fills the icon (e.g. already a favourite).
  `onAction` is what happens on click. With no onAction, no button is drawn,
  so signed-out visitors simply don't see it.
*/
const ICONS = {
  hrt: (filled) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  ),
  crt: (filled) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  x: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
      stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
};

const LABELS = {
  hrt: ["Add to favourites", "Remove from favourites"],
  crt: ["Add to cart", "Remove from cart"],
  x: ["Remove", "Remove"],
};

export default class CourseItem extends React.Component {
  render() {
    const { course, mode = "hrt", active = false, onAction } = this.props;
    const kind = ICONS[mode] ? mode : "hrt";

    return (
      <div className="courseItem row">
        {/* like / cart / remove button, top right */}
        {onAction && (
          <button
            type="button"
            className={"likeCourse" + (active ? " isOn" : "")}
            aria-label={LABELS[kind][active ? 1 : 0]}
            aria-pressed={active}
            title={LABELS[kind][active ? 1 : 0]}
            onClick={(e) => {
              // The whole row is a link to the course page: don't follow it
              e.preventDefault();
              e.stopPropagation();
              onAction(course.id);
            }}
          >
            {ICONS[kind](active)}
          </button>
        )}

        <div className="col-12 col-sm-3 courseThumb">
          <img src={course.imgPath} className="align-self-center" alt={course.name} />
        </div>
        <div className="courseContent col row">
          <div className="col-12 col-md-8">
            <h6>{course.name}</h6>
            <p className="descrip">{course.description.slice(0, 122)}...</p>
            <p className="rating">
              {course.rating} <span>({course.userNo.toLocaleString()})</span>
            </p>
            <div className="banner">
              <p className="ban">{course.banner.type}</p>
              <p className="ban">{course.banner.courseClass}</p>
              <p className="ban">{course.banner.hours}h</p>
              <p className="auth">{course.author}</p>
            </div>
          </div>

          {/* price, bottom right */}
          <h4 className="col-12 col-md-4 align-self-end priceItem">
            <span>R{course.price}.00</span>
            <svg
              className="priceArrow"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </h4>
        </div>
      </div>
    );
  }
}