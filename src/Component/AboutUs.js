import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styleComp/splash.css"; // shared testimonial card styles (.moveCard, .sectionTitle)
import "../styleComp/about.css";

/* ───────── Content ───────── */
const stats = [
  { end: 40, suffix: "+", label: "Project-based courses" },
  { end: 18, suffix: "k", label: "Learners building right now" },
  { end: 92, suffix: "%", label: "Finish what they start" },
];

const iconProps = {
  viewBox: "0 0 24 24",
  width: 26,
  height: 26,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const values = [
  {
    title: "Expert-Led Courses",
    text: "Learn from experienced professionals and passionate educators.",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
  {
    title: "Learn Anywhere",
    text: "Access your courses on desktop, tablet, or mobile whenever it suits you.",
    icon: (
      <svg {...iconProps}>
        <rect x="5" y="5" width="14" height="11" rx="1.5" />
        <path d="M2.5 19.5h19" />
      </svg>
    ),
  },
  {
    title: "Track Your Progress",
    text: "Monitor your learning journey with clear progress tracking and achievement milestones.",
    icon: (
      <svg {...iconProps}>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </svg>
    ),
  },
];

// Add a `role` (and a `photo` path) to any member to show it on their card.
const team = [
  { name: "Lerato M", role: "" },
  { name: "Njabulo N", role: "" },
  { name: "Thabo S", role: "" },
  { name: "Boikanyo T", role: "" },
  { name: "Tadi C", role: "" },
];

const testimonials = [1, 2, 3].map((id) => ({
  id,
  quote:
    "Nexora gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role.",
  name: "Thabo Syrup",
  role: "Prompt engineer at UP",
}));

const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/* ───────── Count-up stat ───────── */
function Stat({ end, suffix, label, delay }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setVal(end);
      return undefined;
    }
    let raf;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now() + delay;
        const dur = 1500;
        const tick = (now) => {
          const p = Math.min(Math.max((now - start) / dur, 0), 1);
          setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end, delay]);

  return (
    <div className="stat col-12 col-md-4" ref={ref} data-reveal style={{ "--d": `${delay}ms` }}>
      <strong>
        {val}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

/* ───────── Page ───────── */
export default function AboutUs() {
  // Scroll-reveal for everything marked with data-reveal
  useEffect(() => {
    const targets = document.querySelectorAll(".aboutUsSec [data-reveal]");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in"));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="aboutUsSec">
      {/* ───────── Hero ───────── */}
      <div className="row aboutIntro align-items-center">
        <div className="col-12 col-lg-6 aboutText">
          <span className="aboutEyebrow aboutItem" style={{ "--d": "0ms" }}>
            About Nexora
          </span>
          <h1 className="aboutItem" style={{ "--d": "80ms" }}>
            We think you learn a craft by <span>making things</span>, not by watching someone else
            make them.
          </h1>
          <p className="aboutItem aboutLead" style={{ "--d": "220ms" }}>
            Nexora started as a study group of four people who were tired of finishing courses with
            nothing to show. Every course here ends with something on your screen that you built.
          </p>
        </div>
        <div className="col-12 col-lg-6 aboutVisual aboutVisualIn">
          <img className="aboutFloat" alt="Two learners working on laptops" src="./media/imgs/about1.svg" />
        </div>
      </div>

      {/* ───────── Owen's story ───────── */}
      <div className="row aboutIntro align-items-center">
        <div className="col-12 col-lg-6 aboutPhoto" data-reveal="left">
          <img alt="Owen Julies" src="./media/imgs/about2.svg" />
        </div>
        <div className="col-12 col-lg-6 aboutText" data-reveal="right" style={{ "--d": "120ms" }}>
          <span className="bigQuote" aria-hidden="true">
            &ldquo;
          </span>
          <h5>Two years ago, I had no experience in Web Development.</h5>
          <p>
            &ldquo;Today, I'm designing products used by thousands of people every day. Nexora gave
            me the confidence to believe I could build a new career.&rdquo;
          </p>
          <p className="aboutEngTxt">Owen Julies - Full Stack Developer &amp; Nexora teacher</p>
          <div className="aboutBtnRow">
            <button type="button" className="aBtn aBtnSolid owenStr">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="currentColor" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
              </svg>
              Watch Owen's Story
            </button>
          </div>
        </div>
      </div>

      {/* ───────── Stats ───────── */}
      <div className="statsWrap">
        <div className="row statsRow">
          {stats.map((s, i) => (
            <Stat key={s.label} {...s} delay={i * 120} />
          ))}
        </div>
      </div>

      {/* ───────── Values ───────── */}
      <div className="whatWeHold">
        <h3 className="sectionTitle" data-reveal>
          What we hold to:
        </h3>
        <div className="row g-4">
          {values.map((v, i) => (
            <div className="col-12 col-md-4" key={v.title} data-reveal style={{ "--d": `${i * 110}ms` }}>
              <div className="valueCard h-100">
                <span className="valueIcon">{v.icon}</span>
                <h5>{v.title}</h5>
                <p>{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────── Team ───────── */}
      <div className="theTeamWrap">
        <h3 className="sectionTitle" data-reveal>
          Meet the team
        </h3>
        <div className="row theTeam g-4 justify-content-center">
          {team.map((m, i) => (
            <div className="col-6 col-md-4 col-lg teamObj" key={m.name} data-reveal style={{ "--d": `${i * 90}ms` }}>
              {m.photo ? (
                <img className="teamAvatar" alt={m.name} src={m.photo} />
              ) : (
                <span className="teamAvatar teamInitials" aria-hidden="true">
                  {initials(m.name)}
                </span>
              )}
              <h6>{m.name}</h6>
              {m.role && <p>{m.role}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* ───────── Free course CTA ───────── */}
      <div className="freeCourse row align-items-center" data-reveal>
        <div className="txtCourse col-12 col-md-7">
          <h3>Start with one free course.</h3>
          <p>Create an account in under thirty seconds.</p>
        </div>
        <div className="btnCourse col-12 col-md-5">
          <Link to="/signup" className="aBtn aBtnLight">
            Get Started for free
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="aArrow">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ───────── Testimonials ───────── */}
      <div className="row theMovement g-4">
        <div className="col-12">
          <h3 className="sectionTitle" data-reveal>
            Be part of a movement of learners changing their lives every day.
          </h3>
        </div>
        {testimonials.map((t, i) => (
          <div className="col-12 col-md-4" key={t.id} data-reveal style={{ "--d": `${i * 110}ms` }}>
            <div className="card moveCard h-100">
              <div className="card-body">
                <p>{t.quote}</p>
                <div className="moveAuthor">
                  <img alt="user" src="./media/imgs/engLogo.svg" />
                  <div className="txtCardMove">
                    <p>
                      <b>{t.name}</b>
                    </p>
                    <p>
                      <sub>
                        <i>{t.role}</i>
                      </sub>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ───────── Mission & vision ───────── */}
      <div className="vision row g-4">
        <div className="col-12 col-md-6" data-reveal>
          <div className="text visionCard h-100">
            <h6>Our Mission</h6>
            <p>
              Our mission is to empower people through education by providing accessible, practical,
              and engaging online learning experiences that help learners achieve their personal and
              professional goals.
            </p>
          </div>
        </div>
        <div className="col-12 col-md-6" data-reveal style={{ "--d": "110ms" }}>
          <div className="text visionCard h-100">
            <h6>Our Vision</h6>
            <p>
              To become one of the world’s most trusted learning platforms where anyone can discover
              new passions, develop valuable skills, and build a brighter future through continuous
              learning.
            </p>
          </div>
        </div>
      </div>

      <div className="aboutLogos" data-reveal>
        <img alt="banner" src="./media/imgs/banner1.svg" />
      </div>
    </div>
  );
}