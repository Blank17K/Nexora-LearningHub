import { Link } from "react-router-dom";
import "../styleComp/coursecard.css"

export default function CourseCard({ course }) {

  return (
    <Link
      to={`/course/${encodeURIComponent(course.name)}`}
      className="CourseCard"
    >
      <img className="CourseCardImg" src={course.imgPath} alt={course.name} />

      <div className="CourseCardBody">
        <div className="CourseCardBadges">
          <span className="BadgeBestseller">Bestseller</span>
          <span className="BadgeClass">{course.banner.courseClass}</span>
        </div>

        <h4>{course.name}</h4>
        <p className="CourseCardDescr">{course.description}</p>

        <p className="CourseCardAuthor">{course.author}</p>

        <div className="CourseCardFooter">
          <span className="CourseCardRating">
            {course.rating} ({course.userNo.toLocaleString()})
          </span>
          <span className="CourseCardPrice">R{course.price}</span>
        </div>
      </div>
    </Link>
  );
}
