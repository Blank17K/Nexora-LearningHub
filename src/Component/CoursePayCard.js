import { Link } from "react-router-dom";
import { Fragment } from "react";
import "../styleComp/coursecard.css";
import tick from "../Assets/Images/tick.svg";
import '../styleComp/checkout.css'

function CoursePayCard({ course, paid }) {
const courseInfo = ()=>{
    return(
        <>
        <div className="row">
          {course.learningPoints.map((learn, index) => (
            <Fragment key={index}>
              <img alt="tick" src={tick} className="col-2 imgTick" />
              <p className="col-10">{learn}</p>
            </Fragment>
          ))}
        </div>
        <div className="CourseCardFooter row">
          <div className="col">Total</div>
          <div className="col">
            <h3>R{course.price}</h3>
            <p>once-off · lifetime access</p>
          </div>
        </div>
        </>
    )
}
const contLess = ()=>{
    return course.courseModules.reduce((sum, item)=> sum += item.lessons,0)
}
const courseProg = ()=>{
    return(
        <>
            <div className="row CourseCardFooter footPayC">
                <div className="loader col-12"></div>
                <p className="col">{`0 of ${contLess()} Lessons`}</p>
                <p className="col justS">Just Started</p>
            </div>
        </>
    )
}

  return (
    <div className="CourseCard CoursePayCard">
      <img className="CourseCardImg" src={course.imgPath} alt={course.name} />

      <div className="CourseCardBody">
        <div className="CourseCardBadges">
          <span className="BadgeBestseller">{course.banner.type}</span>
          <span className="BadgeClass">{course.banner.courseClass}</span>
          <span className="BadgeClass">{course.banner.hours}</span>
        </div>

        <h4>{course.name}</h4>
        <p>
          {`${course.author} `} <span>{course.rating}</span> ({course.userNo})
        </p>
        <p className="CourseCardDescr">{course.description}</p>
        <hr />
        {paid?courseProg():courseInfo()}
      </div>
    </div>
  );
}

export default CoursePayCard;