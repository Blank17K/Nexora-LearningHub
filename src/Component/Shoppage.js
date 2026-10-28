import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import coursesInfo from "../Assets/scripts/courseList.js";
import "../styleComp/myCourses.css"; // shares the My Courses look
import "../styleComp/cartFav.css";

const SORTS = [
  { value: "recent", label: "Recently added" },
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Highest rated" },
  { value: "price", label: "Price, low to high" },
];

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

/*
  One page, two modes:
    mode="cart"        -> "My Cart" with an order summary + Checkout button
    mode="favourites"  -> "Favourites" with Add to cart / Remove buttons

  `shop` comes from App.js: { cart, favourites, addToCart, removeFromCart,
  toggleFavourite }. Nothing is copied into local state, so every change shows
  up instantly here, in the header badges and on the course pages.
*/
export default function ShopPage({ mode, user, shop }) {
  const isCart = mode === "cart";
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");

  const ownedIds = user.purchasedCourses || [];
  const savedIds = isCart ? shop.cart : shop.favourites;

  // Newest additions first; order = how recently it was added (0 = newest)
  const items = useMemo(
    () =>
      [...savedIds]
        .reverse()
        .map((id, order) => {
          const course = coursesInfo.find((c) => c.id === Number(id));
          return course ? { course, order } : null;
        })
        .filter(Boolean),
    [savedIds],
  );

  const total = items.reduce((sum, { course }) => sum + Number(course.price || 0), 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter(({ course }) => {
      if (!q) return true;
      return [course.name, course.description, course.author, course.banner.type]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    const sorters = {
      recent: (a, b) => a.order - b.order,
      popular: (a, b) => b.course.userNo - a.course.userNo,
      rating: (a, b) =>
        b.course.rating - a.course.rating || b.course.userNo - a.course.userNo,
      price: (a, b) => a.course.price - b.course.price,
    };
    return [...list].sort(sorters[sort]);
  }, [items, query, sort]);

  // "Move to favourites": save it, then take it out of the cart
  const moveToFavourites = (id) => {
    if (!shop.favourites.includes(id)) shop.toggleFavourite(id);
    shop.removeFromCart(id);
  };

  const renderActions = (course) => {
    if (isCart) {
      return (
        <>
          <button
            type="button"
            className="spBtn spBtnGhost"
            onClick={() => moveToFavourites(course.id)}
          >
            Move to favourites
          </button>
          <button
            type="button"
            className="spBtn spBtnDanger"
            onClick={() => shop.removeFromCart(course.id)}
          >
            Remove
          </button>
        </>
      );
    }

    const owned = ownedIds.includes(course.id);
    const inCart = shop.cart.includes(course.id);
    return (
      <>
        {owned ? (
          <Link to={`/courseplayer/${course.id}`} className="spBtn spBtnSolid">
            Go to course
          </Link>
        ) : inCart ? (
          <Link to="/cart" className="spBtn spBtnGhost">
            In cart · View
          </Link>
        ) : (
          <button
            type="button"
            className="spBtn spBtnSolid"
            onClick={() => shop.addToCart(course.id)}
          >
            Add to cart
          </button>
        )}
        <button
          type="button"
          className="spBtn spBtnDanger"
          onClick={() => shop.toggleFavourite(course.id)}
        >
          Remove
        </button>
      </>
    );
  };

  const list = (
    <ul className="mcList">
      {filtered.map(({ course }) => (
        <li className="mcRow" key={course.id}>
          <Link to={`/course/${course.id}`} className="mcThumb" aria-label={`Open ${course.name}`}>
            <img src={course.imgPath} alt="" />
          </Link>

          <div className="mcInfo">
            <h2>
              <Link to={`/course/${course.id}`}>{course.name}</Link>
            </h2>
            <p className="mcDesc">{course.description}</p>
            <div className="mcMeta">
              <span className="mcChip">{course.banner.type}</span>
              <span className="mcChip">{course.banner.courseClass}</span>
              <span className="mcChip">{course.banner.hours}h</span>
              <span className="mcDot" aria-hidden="true">•</span>
              <span className="mcAuthor">{course.author}</span>
              <span className="spRating">
                ★ {course.rating} ({course.userNo.toLocaleString()})
              </span>
            </div>
          </div>

          <div className="mcSide spSide">
            <strong className="spPrice">R{course.price}</strong>
            <div className="spActions">{renderActions(course)}</div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <main className="myCourses">
      <section className="mcHead">
        <div className="mcTitle">
          <h1>{isCart ? "My Cart" : "Favourites"}</h1>
          <p>
            <span>{plural(items.length, "course")}</span>
          </p>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="mcEmpty">
          <h2>{isCart ? "Your cart is empty" : "No favourites yet"}</h2>
          <p>
            {isCart
              ? "Add courses you like and they'll wait here until you're ready to check out."
              : "Tap the heart on a course and it will be saved here."}
          </p>
          <Link to="/courses" className="mcBtn">
            Browse courses
          </Link>
        </section>
      ) : (
        <>
          <div className="mcTools">
            <div className="mcSearch">
              <svg
                className="mcSearchIcon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, topics or instructors..."
                aria-label={isCart ? "Search my cart" : "Search my favourites"}
              />
              {query && (
                <button
                  type="button"
                  className="mcSearchClear"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                >
                  &times;
                </button>
              )}
            </div>

            <p className="mcCount" aria-live="polite">
              {plural(filtered.length, "Result")}
            </p>

            <select
              className="mcSort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort courses"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className={isCart ? "spLayout" : undefined}>
            <div>
              {filtered.length === 0 ? (
                <p className="mcNoMatch">No courses match your search.</p>
              ) : (
                list
              )}
            </div>

            {isCart && (
              <aside className="spSummary" aria-label="Order summary">
                <h2>Order summary</h2>
                <div className="spLine">
                  <span>{plural(items.length, "course")}</span>
                  <span>R{total}</span>
                </div>
                <div className="spLine spTotal">
                  <span>Total</span>
                  <span>R{total}</span>
                </div>
                <button
                  type="button"
                  className="mcBtn"
                  onClick={() => navigate("/checkout/cart")}
                >
                  Checkout
                </button>
                <p className="spNote">Once-off payment · lifetime access</p>
              </aside>
            )}
          </div>
        </>
      )}
    </main>
  );
}