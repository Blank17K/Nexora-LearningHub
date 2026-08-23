import { useEffect, useState } from "react";
import "../styleComp/courseview.css";
import { useParams } from "react-router-dom";
import coursesInfo from "../Assets/scripts/courseList.js";
import CourseCard from "./CourseCard.js";

const seeds = ["Sophie", "Felix", "Aneka", "Milo", "Luna"];

const profileLink = "https://api.dicebear.com/10.x/lorelei/svg?seed=";

export default function CourseView() {
  const { name } = useParams();
  const [course, setCourse] = useState(null);
  const [openModule, setOpenModule] = useState(0);

  //   function getRandomCourses(courses, count, excludeName) {
  //     const pool = courses.filter((c) => c.name !== excludeName);
  //     const shuffled = [...pool].sort(() => Math.random() - 0.5);
  //     return shuffled.slice(0, count);
  //   }

  //   const relatedCourses = getRandomCourses(coursesInfo, 4, course.name);
  //   const instructorCourses = getRandomCourses(coursesInfo, 4, course.name);

  const scrollToTop = () => {
    window.scrollTo({
      top: 10,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const currentCourse = coursesInfo.find(
      (c) => c.name === decodeURIComponent(name),
    );
    setCourse(currentCourse);
  }, [name]);

  if (!course) {
    return <div>Loading or Course Not Found...</div>;
  }

  const totalLessons = course.courseModules.reduce(
    (sum, m) => sum + m.lessons,
    0,
  );

  return (
    <div className="CourseView">
      <div className="CourseViewDescr">
        <p>{course.banner.type}</p>
        <p>{course.banner.courseClass}</p>
        <p>Bestseller</p>
      </div>

      <div className="CourseViewColumn">
        <div className="leftColumn">
          <h1>{course.name}</h1>
          <p className="CourseViewSubtitle">{course.description}</p>

          <div className="CourseViewAuthorDescr">
            <span className="RatingBadge">{course.rating}</span>
            <span>({course.userNo})</span>
            <span>·</span>
            <span>{course.author}</span>
            <span>·</span>
            <span>Updated May 2026</span>
          </div>

          <img
            className="CourseBanner"
            src={course.imgPath}
            alt={course.name}
          />

          <div className="WhatYoullLearn">
            <h2>What you'll learn</h2>
            <div className="LearnGrid">
              {course.learningPoints.map((point, i) => (
                <p key={i}>
                  <span className="Check">-</span> {point}
                </p>
              ))}
            </div>
          </div>

          <div className="WhatYoullBuild">
            <div className="WhatYoullBuildIcon"></div>
            <div>
              <h4>What you'll build</h4>
              <p>
                A task tracker with add, edit, filters, and saved state —
                deployed at a public URL you can put on your CV.
              </p>
            </div>
          </div>

          <div className="CourseContent">
            <div className="CourseContentHeader">
              <h2>Course content</h2>
              <p>
                {course.courseModules.length} modules · {totalLessons} lessons ·{" "}
                {course.banner.hours}h total
              </p>
            </div>

            {course.courseModules.map((mod, i) => {
              const isOpen = openModule === i;
              return (
                <div className="CourseModule" key={i}>
                  <button
                    className="CourseModuleHeader"
                    onClick={() => setOpenModule(isOpen ? null : i)}
                  >
                    <span>
                      <span className={`Arrow ${isOpen ? "open" : ""}`}>▾</span>{" "}
                      {i + 1} · {mod.title}
                    </span>
                    <span>
                      {mod.lessons} lessons · {mod.duration}
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

            <div className="SeeAllContent">See all content</div>
          </div>

          <div className="CourseExtras">
            <div className="ForAndBefore">
              <div>
                <h3>Who it's for</h3>
                <ul>
                  <li>You've written some HTML, CSS and JS</li>
                  <li>You want your first real framework project</li>
                  <li>You learn by doing, not watching</li>
                </ul>
              </div>
              <div>
                <h3>Before you start</h3>
                <ul>
                  <li>JavaScript Foundations, or equivalent</li>
                  <li>A laptop that can run Node</li>
                  <li>No React experience needed</li>
                </ul>
              </div>
            </div>

            <div className="InstructorCard">
              <div className="InstructorAvatar">
                <img
                  src={profileLink + seeds[Math.floor(Math.random() * 5)]}
                  alt={seeds[Math.floor(Math.random() * 5)]}
                />
              </div>
              <div>
                <h4>{course.author}</h4>
                <p>
                  Frontend engineer, {Math.floor(Math.random() * 9)} years;
                  shipping React daily at a fintech.
                </p>
                <p className="InstructorStats">
                  {course.authorCourseCount} courses · 4.85 average · 12 000
                  learners.
                </p>
              </div>
            </div>

            <div className="RatingBreakdown">
              <div className="RatingBig">
                <h2>{course.rating}</h2>
                <p>{course.userNo.toLocaleString()} ratings</p>
              </div>
              <div className="RatingBars">
                {[
                  { stars: 5, pct: 78 },
                  { stars: 4, pct: 52 },
                  { stars: 3, pct: 58 },
                  { stars: 2, pct: 8 },
                  { stars: 1, pct: 4 },
                ].map((row) => (
                  <div className="RatingBarRow" key={row.stars}>
                    <span>{row.stars} ★</span>
                    <div className="RatingBarTrack">
                      <div
                        className="RatingBarFill"
                        style={{ width: `${row.pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ReviewsHeader">
              <h2>Reviews</h2>
              <a href="#">See All Reviews →</a>
            </div>

            <div className="ReviewsGrid">
              {[1, 2, 3, 4].map((i) => (
                <div className="ReviewCard" key={i}>
                  <div className="ReviewCardHeader">
                    <div className="ReviewAvatar"></div>
                    <div>
                      <h4>Sipho N.</h4>
                      <span className="ReviewStars">★★★★★</span>
                    </div>
                  </div>
                  <p>
                    "First course where I ended with something deployed. The
                    task tracker is on my CV now."
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rightColumn">
          <div className="StickyCard">
            <img src={course.imgPath} alt={course.imgPath} />
            <div className="StickyCardPrice">
              <h3>R{course.price} </h3>
              <p>once-off · lifetime access</p>
            </div>
            <div className="StickyCarDBtn">Enroll now</div>
            <div className="StickyCardBtn2">Try the first lesson free</div>
            <div className="StickyCardDescr">
              <div>
                <p>{course.banner.hours}h of project lessons</p>
                <p>{course.banner.courseClass}</p>
                <p>Source files included</p>
              </div>
              <div>
                <p>{Math.floor(Math.random() * 40)} lessons</p>
                <p>Certificate</p>
                <p>EN captions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="RelatedCoursesSection">
        <div className="SectionHeader">
          <h2>Related Courses</h2>
          <a href="#">See more Related Courses →</a>
        </div>
        <div className="CourseCardGrid">
          {coursesInfo
            .filter((c) => c.name !== course.name)
            .splice(0, 4)
            .map((c) => (
              <CourseCard key={c.name} course={c} scrollToTop={scrollToTop} />
            ))}
        </div>
      </div>

      <div className="OtherByInstructorSection">
        <div className="SectionHeader">
          <h2>Other Courses by Instructor</h2>
          <a href="#">See more by Instructor →</a>
        </div>
        <div className="CourseCardGrid">
          {coursesInfo
            .filter((c) => c.name !== course.name)
            .splice(5, 9)
            .map((c) => (
              <CourseCard key={c.name} course={c} scrollToTop={scrollToTop} />
            ))}
        </div>
      </div>
    </div>
  );
}
