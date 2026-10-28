import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import coursesInfo from "../Assets/scripts/courseList.js";
import "../styleComp/checkout.css";

const lessonCount = (course) =>
  course.courseModules.reduce((sum, m) => sum + m.lessons, 0);

/*
  The white card on the "You're enrolled" screen.
  Lists every course the signed-in user owns, newest purchase first.
  Each row is a link to that course's page (/course/:id).
  Pass the user object from App (needs user.purchasedCourses = [courseId, ...]).
*/
export default function CheckoutCourseView({ user }) {
  const owned = useMemo(() => {
    const ids = user?.purchasedCourses || [];
    return [...ids]
      .reverse() // the course they just bought was pushed last -> show it first
      .map((id) => coursesInfo.find((c) => Number(c.id) === Number(id)))
      .filter(Boolean); // ignore ids that no longer match a course
  }, [user]);

  if (owned.length === 0) {
    return (
      <div className="enrolledCard enrolledEmpty">
        <p>No courses yet. Pick one and it will show up here.</p>
      </div>
    );
  }

  return (
    <div className="enrolledCard">
      {owned.map((course) => (
        <Link
          to={`/course/${course.id}`}
          className="enrolledItem"
          key={course.id}
          aria-label={`Open ${course.name}`}
        >
          <img className="enrolledThumb" src={course.imgPath} alt="" />
          <div className="enrolledInfo">
            <h3>{course.name}</h3>
            <p>
              {course.author} · {lessonCount(course)} lessons ·{" "}
              {course.banner.hours} h · lifetime access
            </p>
          </div>
          <svg
            className="enrolledArrow"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </Link>
      ))}
    </div>
  );
}