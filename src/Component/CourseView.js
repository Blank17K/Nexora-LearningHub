import { useEffect, useState } from "react";
import "../styleComp/courseview.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import coursesInfo from "../Assets/scripts/courseList.js";
import CourseCard from "./CourseCard.js";

const PROFILE_LINK = "https://api.dicebear.com/10.x/lorelei/svg?seed=";

export default function CourseView(props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [openModule, setOpenModule] = useState(0);
  const [showAllModules, setShowAllModules] = useState(false);

  // Find by id, not by array position — robust to reordering the JSON.
  const course =
    coursesInfo.find((c) => String(c.id) === String(id)) || null;

  useEffect(() => {
    setOpenModule(0);
    setShowAllModules(false);
  }, [id]);

  if (!course) {
    return (
      <div className="CourseView">
        <h1>Course not found</h1>
        <p>We couldn't find a course with id {id}.</p>
        <Link to="/courses" className="SeeAllContent" style={{ display: "inline-block" }}>
          Browse all courses
        </Link>
      </div>
    );
  }

  // Total lessons from the real lesson lists — never from a parallel field.
  const totalLessons = course.courseModules.reduce(
    (sum, m) => sum + m.lessonList.length,
    0
  );

  const numericId = Number(id);
  const alreadyOwned = props.user?.purchasedCourses?.includes(numericId) ?? false;

  const checkOutTime = () => {
    if (!props.user) {
      props.check(id);
      navigate("/login");
    } else if (alreadyOwned) {
      navigate(`/courseplayer/${id}`);
    } else {
      navigate(`/checkout/${id}`);
    }
  };

  const instructor = course.instructor || {};
  const breakdown = course.ratingBreakdown || [];
  const reviews = course.reviews || [];
  const whoItsFor = course.whoItsFor || [];
  const beforeYouStart = course.beforeYouStart || [];

  return (
    <div className="CourseView">
      <div className="CourseViewDescr">
        <p>{course.banner.type}</p>
        <p>{course.banner.courseClass}</p>
        <p>Bestseller</p>
      </div>

      <div className="CourseViewColumn">
        {/* ───────── Left ───────── */}
        <div className="leftColumn">
          <h1>{course.name}</h1>
          <p className="CourseViewSubtitle">{course.description}</p>

          <div className="CourseViewAuthorDescr">
            <span className="RatingBadge">{course.rating}</span>
            <span>({course.userNo.toLocaleString()})</span>
            <span>·</span>
            <span>{course.author}</span>
            <span>·</span>
            <span>Updated May 2026</span>
          </div>

          <img className="CourseBanner" src={course.imgPath} alt={course.name} />

          <div className="WhatYoullLearn">
            <h2>What you'll learn</h2>
            <div className="LearnGrid">
              {course.learningPoints.map((point, i) => (
                <p key={i}>
                  <span className="Check">✓</span> {point}
                </p>
              ))}
            </div>
          </div>

          {course.whatYouWillBuild && (
            <div className="WhatYoullBuild">
              <div className="WhatYoullBuildIcon" aria-hidden="true">🛠️</div>
              <div>
                <h4>What you'll build</h4>
                <p>{course.whatYouWillBuild}</p>
              </div>
            </div>
          )}

          {/* ───────── Course content ───────── */}
          <div className="CourseContent">
            <div className="CourseContentHeader">
              <h2>Course content</h2>
              <p>
                {course.courseModules.length} modules · {totalLessons} lessons ·{" "}
                {course.banner.hours}h total
              </p>
            </div>

            {course.courseModules.map((mod, i) => {
              const isOpen = showAllModules || openModule === i;
              return (
                <div className="CourseModule" key={i}>
                  <button
                    type="button"
                    className="CourseModuleHeader"
                    aria-expanded={isOpen}
                    onClick={() => {
                      if (showAllModules) return;
                      setOpenModule(isOpen ? null : i);
                    }}
                  >
                    <span>
                      <span className={`Arrow ${isOpen ? "open" : ""}`}>▾</span>{" "}
                      {i + 1} · {mod.title}
                    </span>
                    <span>
                      {mod.lessonList.length} lessons · {mod.duration}
                    </span>
                  </button>

                  {isOpen && mod.lessonList.length > 0 && (
                    <ul className="CourseModuleLessons">
                      {mod.lessonList.map((lesson, j) => (
                        <li key={j}>
                          <span>{lesson.name}</span>
                          <span>{lesson.time}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              className="SeeAllContent"
              onClick={() => setShowAllModules((v) => !v)}
            >
              {showAllModules ? "Collapse all content" : "See all content"}
            </button>
          </div>

          {/* ───────── Extras ───────── */}
          <div className="CourseExtras">
            {(whoItsFor.length > 0 || beforeYouStart.length > 0) && (
              <div className="ForAndBefore">
                {whoItsFor.length > 0 && (
                  <div>
                    <h3>Who it's for</h3>
                    <ul>
                      {whoItsFor.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {beforeYouStart.length > 0 && (
                  <div>
                    <h3>Before you start</h3>
                    <ul>
                      {beforeYouStart.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {(instructor.bio || instructor.yearsExperience || instructor.avatarSeed) && (
              <div className="InstructorCard">
                <div className="InstructorAvatar">
                  {instructor.avatarSeed && (
                    <img
                      src={PROFILE_LINK + instructor.avatarSeed}
                      alt={course.author}
                    />
                  )}
                </div>
                <div>
                  <h4>{course.author}</h4>
                  {instructor.bio && <p>{instructor.bio}</p>}
                  <p className="InstructorStats">
                    {course.authorCourseCount} courses · {course.rating.toFixed(2)}{" "}
                    average · {course.userNo.toLocaleString()} learners.
                  </p>
                </div>
              </div>
            )}

            {breakdown.length > 0 && (
              <div className="RatingBreakdown">
                <div className="RatingBig">
                  <h2>{course.rating}</h2>
                  <p>{course.userNo.toLocaleString()} ratings</p>
                </div>
                <div className="RatingBars">
                  {breakdown.map((row) => (
                    <div className="RatingBarRow" key={row.stars}>
                      <span>{row.stars} ★</span>
                      <div className="RatingBarTrack">
                        <div
                          className="RatingBarFill"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reviews.length > 0 && (
              <>
                <div className="ReviewsHeader">
                  <h2>Reviews</h2>
                  <span />
                </div>
                <div className="ReviewsGrid">
                  {reviews.map((r, i) => (
                    <div className="ReviewCard" key={i}>
                      <div className="ReviewCardHeader">
                        <div className="ReviewAvatar" />
                        <div>
                          <h4>{r.name}</h4>
                          <span className="ReviewStars">
                            {"★".repeat(r.stars)}
                            {"☆".repeat(5 - r.stars)}
                          </span>
                        </div>
                      </div>
                      <p>&ldquo;{r.quote}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ───────── Right (sticky buy card) ───────── */}
        <div className="rightColumn">
          <div className="StickyCard">
            <img src={course.imgPath} alt={course.name} />
            <div className="StickyCardPrice">
              <h3>R{course.price}</h3>
              <p>once-off · lifetime access</p>
            </div>

            <div className="StickyCarDBtn" onClick={checkOutTime}>
              {alreadyOwned ? "Go to Course" : "Enroll now"}
            </div>

            <div className="StickyCardBtn2">Try the first lesson free</div>

            <div className="StickyCardDescr">
              <div>
                <p>{course.banner.hours}h of project lessons</p>
                <p>{course.banner.courseClass}</p>
                <p>Source files included</p>
              </div>
              <div>
                <p>{totalLessons} lessons</p>
                <p>Certificate</p>
                <p>EN captions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── Related ───────── */}
      <div className="RelatedCoursesSection">
        <div className="SectionHeader">
          <h2>Related Courses</h2>
          <Link to="/courses">See more →</Link>
        </div>
        <div className="CourseCardGrid">
          {coursesInfo
            .filter((c) => c.id !== course.id)
            .slice(0, 4)
            .map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
        </div>
      </div>

      <div className="OtherByInstructorSection">
        <div className="SectionHeader">
          <h2>More from {course.author}</h2>
          <Link to="/courses">See more →</Link>
        </div>
        <div className="CourseCardGrid">
          {coursesInfo
            .filter((c) => c.id !== course.id)
            .slice(4, 8)
            .map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
        </div>
      </div>
    </div>
  );
}