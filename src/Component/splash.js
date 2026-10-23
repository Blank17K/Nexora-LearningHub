import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styleComp/splash.css";

const popularCourses = [
  { id: 1, title: "RIZZ Masterclass 101", author: "Thabo Seripe", rating: "1.8", reviews: "1 204", price: "R3.50" },
  { id: 2, title: "RIZZ Masterclass 101", author: "Thabo Seripe", rating: "1.8", reviews: "1 204", price: "R3.50" },
  { id: 3, title: "RIZZ Masterclass 101", author: "Thabo Seripe", rating: "1.8", reviews: "1 204", price: "R3.50" },
];

const testimonials = [
  {
    id: 1,
    quote:
      "Nexora gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role.",
    name: "Thabo Syrup",
    role: "Prompt engineer at UP",
  },
  {
    id: 2,
    quote:
      "Nexora gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role.",
    name: "Thabo Syrup",
    role: "Prompt engineer at UP",
  },
  {
    id: 3,
    quote:
      "Nexora gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role.",
    name: "Thabo Syrup",
    role: "Prompt engineer at UP",
  },
];

const ArrowIcon = () => (
  <svg
    className="arrowIcon"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const StarIcon = () => (
  <svg className="starIcon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"
    />
  </svg>
);

export default class Splash extends React.Component {
  componentDidMount() {
    const targets = document.querySelectorAll(".splashSec [data-reveal]");

    // Fallback: no observer support -> just show everything
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in"));
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((el) => this.observer.observe(el));
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect();
  }

  render() {
    return (
      <>
        <div className="splashSec">
          {/* ───────── Hero ───────── */}
          <div className="intro row align-items-center">
            <div className="text col-12 col-lg-6 introText">
              <h1 className="heroItem" style={{ "--d": "60ms" }}>
                Learn by building <span className="heroAccent">things that work.</span>
              </h1>
              <p className="heroItem heroLead" style={{ "--d": "200ms" }}>
                Short, practical courses in design, code and 3D — taught by people who ship. Start free, finish something real.
              </p>
              <div className="heroActions heroItem" style={{ "--d": "340ms" }}>
                <Link to="/signup" className="btn strtBtn">
                  Get Started for free
                </Link>
                <Link to="/courses" className="btn catBtn">
                  <b>
                    Browse Categories <ArrowIcon />
                  </b>
                </Link>
              </div>
            </div>
            <div className="col-12 col-lg-6 heroVisual heroVisualIn">
              <img className="adImg" alt="advert Image" src="./media/imgs/Img1.svg" />
            </div>
          </div>

          <div className="banner" data-reveal>
            <img alt="banner" src="./media/imgs/banner1.svg" />
          </div>

          {/* ───────── Popular ───────── */}
          <div className="popularClass">
            <h3 className="sectionTitle" data-reveal>
              Popular right now
            </h3>
            <div className="popCards row g-4">
              {popularCourses.map((c, i) => (
                <div className="col-12 col-md-4" key={c.id} data-reveal style={{ "--d": `${i * 110}ms` }}>
                  <div className="card popCard h-100">
                    <div className="cardMedia">
                      <img className="card-img-top" alt="class picture" src="./media/imgs/card-img.svg" />
                    </div>
                    <div className="card-body">
                      <div className="courseCat">
                        <h6 className="card-subtitle best">Bestseller</h6>
                        <h6 className="card-subtitle begn">Beginner</h6>
                      </div>
                      <h5 className="card-title">{c.title}</h5>
                      <p className="card-text">{c.author}</p>
                    </div>
                    <div className="bottomText card-footer">
                      <p className="rating">
                        <StarIcon />
                        <b>{c.rating}</b> ({c.reviews})
                      </p>
                      <p className="price">{c.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="banner" data-reveal>
            <img alt="banner" src="./media/imgs/banner2.svg" />
          </div>

          {/* ───────── Testimonials ───────── */}
          <div className="row theMovement">
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

          {/* ───────── Free course CTA ───────── */}
          <div className="row freeTrail align-items-center justify-content-center">
            <div className="col-12 col-md-4 freeImg" data-reveal>
              <img alt="freeTrail" src="./media/imgs/free_course.svg" />
            </div>
            <center className="col-12 col-md-5 freeCopy" data-reveal style={{ "--d": "140ms" }}>
              <h2>Start with one free course.</h2>
              <p>Create an account in under thirty seconds.</p>
              <Link to="/signup" className="btn freeTrailBtn">
                Get Started for free <ArrowIcon />
              </Link>
            </center>
          </div>
        </div>
      </>
    );
  }
}