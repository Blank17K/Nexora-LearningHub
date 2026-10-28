import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlayerHeader from "./playerHeader.js";
import coursesInfo from "../Assets/scripts/courseList.js";
import { saveProgress, loadProgressFor } from "../Assets/scripts/usersList.js";
import player from "../Assets/Images/player.png";
import cert from "../Assets/Images/certificate.png";
import "../styleComp/coursePlayer.css";

// Flatten modules -> [{ ...lesson, moduleIndex, lessonIndex }]
function flattenLessons(course) {
  const out = [];
  course.courseModules.forEach((mod, mi) => {
    mod.lessonList.forEach((lesson, li) => {
      out.push({ ...lesson, moduleIndex: mi, lessonIndex: li, moduleTitle: mod.title });
    });
  });
  return out;
}

// Stable (non-random) instructor avatar seed
const AVATAR_SEEDS = ["Sophie", "Felix", "Aneka", "Milo", "Luna"];
const avatarFor = (name = "") => {
  const h = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return `https://api.dicebear.com/10.x/lorelei/svg?seed=${AVATAR_SEEDS[h % AVATAR_SEEDS.length]}`;
};

export default function CoursePlayer({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const course = useMemo(
    () => coursesInfo.find((c) => String(c.id) === String(id)),
    [id]
  );

  const ownsCourse =
    !!user && !!course && (user.purchasedCourses || []).includes(Number(course?.id));

  // ── Guards: redirect instead of rendering a broken page ──
  useEffect(() => {
    if (!course) return navigate("/courses", { replace: true });
    if (!user) return navigate("/login", { replace: true });
    if (!ownsCourse) return navigate(`/course/${course.id}`, { replace: true });
  }, [course, user, ownsCourse, navigate]);

  const lessons = useMemo(() => (course ? flattenLessons(course) : []), [course]);
  const total = lessons.length;

  // ── State ─────────────────────────────────────────────────
  const [completed, setCompleted] = useState(() => new Set());
  const [active, setActive] = useState(0);
  const [openModule, setOpenModule] = useState(0);
  const [showCert, setShowCert] = useState(false);

  // Restore saved progress on mount / course change
  useEffect(() => {
    if (!user || !course) return;
    const saved = loadProgressFor(user.id, course.id) || user.progress?.[course.id];
    if (saved) {
      setCompleted(new Set(saved.completed || []));
      if (typeof saved.lastLesson === "number") setActive(saved.lastLesson);
      if (typeof saved.lastLesson === "number" && lessons[saved.lastLesson]) {
        setOpenModule(lessons[saved.lastLesson].moduleIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, course?.id]);

  // Persist on every change (completed set / active pointer)
  const persist = (nextCompleted, nextActive) => {
    if (!user || !course) return;
    saveProgress(user.id, course.id, {
      completed: [...nextCompleted],
      lastLesson: nextActive,
    });
  };

  // Esc closes the certificate overlay
  useEffect(() => {
    if (!showCert) return;
    const onKey = (e) => e.key === "Escape" && setShowCert(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showCert]);

  // Guard render — effects above run first on the first pass
  if (!course || !user || !ownsCourse || total === 0) return null;

  // ── Derived ───────────────────────────────────────────────
  const doneCount = completed.size;
  const pct = Math.round((doneCount / total) * 100);
  const current = lessons[Math.min(active, total - 1)];
  const prevIdx = active > 0 ? active - 1 : null;
  const nextIdx = active < total - 1 ? active + 1 : null;
  const finished = pct === 100;
  const nextLesson = nextIdx != null ? lessons[nextIdx] : null;

  // ── Handlers ──────────────────────────────────────────────
  const goTo = (idx) => {
    if (idx == null || idx < 0 || idx >= total) return;
    setActive(idx);
    setOpenModule(lessons[idx].moduleIndex);
    persist(completed, idx);
  };

  const markComplete = () => {
    const next = new Set(completed);
    next.add(active);
    setCompleted(next);
    const target = nextIdx != null ? nextIdx : active;
    if (nextIdx != null) {
      setActive(target);
      setOpenModule(lessons[target].moduleIndex);
    }
    persist(next, target);
  };

  const markIncomplete = (idx) => {
    const next = new Set(completed);
    next.delete(idx);
    setCompleted(next);
    persist(next, active);
  };

  const toggleModule = (mi) =>
    setOpenModule((cur) => (cur === mi ? null : mi));

  // ── Player panel ──────────────────────────────────────────
  const playerPanel = (
    <div className="cpPlayerInfo">
      <div className="cpPlayerMedia">
        <img
          className="player"
          src={course.imgPath || player}
          alt={`${course.name} preview`}
        />
        <div className="cpPlayBadge" aria-hidden="true">▶</div>
      </div>

      <div className="cpPlayerMeta">
        <p className="cpEyebrow">
          Module {current.moduleIndex + 1} · Lesson {current.lessonIndex + 1}
        </p>
        <h3 className="cpLessonTitle">{current.name}</h3>
        <p className="cpLessonBlurb">
          {course.description.slice(0, 200)}
          {course.description.length > 200 ? "…" : ""}
        </p>

        <div className="cpActions row">
          <button className="btn btnSol col" type="button">Lesson notes</button>
          <button className="btn btnSol col ms-2 me-2" type="button">Starter files</button>
          <button className="btn btnSol col" type="button">Ask a question</button>
          <div className="col-3" />
        </div>
      </div>

      <hr className="cpRule" />

      <div className="cpNavRow">
        <button
          className="btn btnSol"
          type="button"
          disabled={prevIdx == null}
          onClick={() => goTo(prevIdx)}
        >
          ← Previous
        </button>

        {nextIdx != null ? (
          <button className="btn cpPrimary" type="button" onClick={markComplete}>
            {completed.has(active) ? "Next lesson →" : "Mark complete & next →"}
          </button>
        ) : (
          <button
            className="btn cpPrimary"
            type="button"
            onClick={finished ? () => setShowCert(true) : markComplete}
          >
            {finished ? "Get your certificate" : "Finish course"}
          </button>
        )}

        <p className="cpUpNext">
          {nextLesson ? (
            <>Next: <b>{nextLesson.name}</b></>
          ) : (
            "You're on the last lesson."
          )}
        </p>
      </div>
    </div>
  );

  // ── Sidebar ───────────────────────────────────────────────
  const sidebar = (
    <nav className="cpPlayerNav" aria-label="Course content">
      {course.courseModules.map((mod, mi) => {
        const isOpen = openModule === mi;
        const moduleIndices = lessons
          .map((l, i) => (l.moduleIndex === mi ? i : -1))
          .filter((i) => i >= 0);
        const moduleDone =
          moduleIndices.length > 0 &&
          moduleIndices.every((i) => completed.has(i));

        return (
          <div className="cpModule" key={mi}>
            <button
              type="button"
              className={`CourseModuleHeader cpModuleHeader ${moduleDone ? "isDone" : ""}`}
              aria-expanded={isOpen}
              onClick={() => toggleModule(mi)}
            >
              <span>
                <span className={`Arrow ${isOpen ? "open" : ""}`}>▾</span>{" "}
                {mi + 1} · {mod.title}
              </span>
              <span className="cpModuleMeta">
                {mod.lessons} lessons · {mod.duration}
              </span>
            </button>

            {isOpen && (
              <ul className="CourseModuleLessons cpLessons">
                {moduleIndices.map((flat) => {
                  const lesson = lessons[flat];
                  const isActive = flat === active;
                  const isDone = completed.has(flat);
                  return (
                    <li key={flat}>
                      <button
                        type="button"
                        className={
                          "cpLessonRow" +
                          (isActive ? " isActive" : "") +
                          (isDone ? " isDone" : "")
                        }
                        aria-current={isActive ? "true" : undefined}
                        onClick={() => goTo(flat)}
                      >
                        <span className="cpLessonCheck" aria-hidden="true">
                          {isDone ? "✓" : ""}
                        </span>
                        <span className="cpLessonName">{lesson.name}</span>
                        <span className="cpLessonTime">{lesson.time}</span>
                      </button>
                      {isDone && !isActive && (
                        <button
                          type="button"
                          className="cpUndo"
                          onClick={() => markIncomplete(flat)}
                          aria-label={`Mark "${lesson.name}" as not complete`}
                        >
                          undo
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}

      <button
        className="btn courseComp cpCertBtn mt-4"
        type="button"
        disabled={!finished}
        onClick={() => setShowCert(true)}
        title={finished ? "View your certificate" : `${100 - pct}% to go`}
      >
        {finished ? "View certificate" : `Certificate · ${pct}%`}
      </button>
    </nav>
  );

  // ── Certificate overlay ───────────────────────────────────
  const certificateOverlay = (
    <div
      className={`cpCertOverlay ${showCert ? "isOpen" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!showCert}
      aria-label="Course certificate"
      onClick={(e) => e.target === e.currentTarget && setShowCert(false)}
    >
      <div className="cpCertCard">
        <button
          type="button"
          className="cpCertClose"
          onClick={() => setShowCert(false)}
          aria-label="Close certificate"
        >
          ×
        </button>
        <img src={cert} alt={`Certificate for ${user.name}`} className="cpCertImg" />
        <h4>Nice work, {user.name.split(" ")[0]}.</h4>
        <p>
          You finished {course.name} — {total} lessons, {course.banner.hours}h.
        </p>
        <button
          className="btn cpPrimary"
          type="button"
          onClick={() => setShowCert(false)}
        >
          Back to course
        </button>
      </div>
    </div>
  );

  // ── Layout ────────────────────────────────────────────────
  return (
    <div className="cpShell">
      <PlayerHeader
        courseName={course.name}
        pct={pct}
        done={doneCount}
        total={total}
        userName={user.name}
        instructor={course.author}
        avatarSrc={avatarFor(course.author)}
      />

      <div className="row cpHolder">
        <div className="col-12 col-lg-8">{playerPanel}</div>
        <div className="col-12 col-lg-4">{sidebar}</div>
      </div>

      {certificateOverlay}
    </div>
  );
}