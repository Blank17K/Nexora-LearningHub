import React from "react";
import "../styleComp/courseItem.css";

export default class CourseItem extends React.Component {
  render() {
    const { course, fav=false } = this.props;
    
    return (
      <div className="courseItem row">
        {/* like button — top right */}
        <button
          type="button"
          className="likeCourse"
          aria-label="Add to favourites"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            this.props.onToggleFavourite?.(course.id);
          }}
        >
          {fav = 'hrt' ? (
            <i className="lni lni-heart"></i>
          ) : '' }
          {fav = 'crt'?(
            <i className="lni lni-cart-1"></i>
          ):''}
          {fav = 'x'?(
            <i>x</i>
          ):''}
        </button>

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

          {/* price — bottom right */}
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