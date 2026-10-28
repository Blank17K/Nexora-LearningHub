import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CoursePayCard from "./CoursePayCard.js";
import CheckoutCourseView from "./CheckoutCourseView.js";
import Receipt, { makeReference, detectCardBrand } from "./Receipt.js";
import coursesInfo from "../Assets/scripts/courseList.js";
import ticC from "../Assets/Images/tickC.svg";
import "../styleComp/checkout.css";
import "../styleComp/cartFav.css";

function Checkout(props) {
  const [form, setForm] = useState({
    email:  { value: "", error: "", touched: false },
    card:   { value: "", error: "", touched: false },
    expiry: { value: "", error: "", touched: false },
    cvc:    { value: "", error: "", touched: false },
    postal: { value: "", error: "", touched: false },
    name:   { value: "", error: "", touched: false },
  });
  const navigate = useNavigate();
  const { id } = useParams();

  // true once the payment has gone through -> shows the "enrolled" screen
  const [paid, setPaid] = useState(false);

  // The receipt for the payment that was just made, and whether its pop-up is open
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // /checkout/cart buys everything in the cart, /checkout/5 buys course 5
  const isCart = id === "cart";

  const payCourses = useMemo(() => {
    if (isCart) {
      const owned = props.user?.purchasedCourses || [];
      return (props.user?.cart || [])
        .filter((cid) => !owned.includes(cid))
        .map((cid) => coursesInfo.find((c) => c.id === Number(cid)))
        .filter(Boolean);
    }
    const one = coursesInfo.find((c) => String(c.id) === String(id));
    return one ? [one] : [];
  }, [id, isCart, props.user]);

  const total = payCourses.reduce((sum, c) => sum + Number(c.price || 0), 0);

  // Tell App we're no longer "waiting to check out". This used to be called
  // during render, which makes React warn; an effect does the same job cleanly.
  useEffect(() => {
    if (typeof props.checkOut === "function") props.checkOut(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => {
    navigate(isCart ? "/cart" : `/course/${id}`);
  };

  const validators = {
    email: (v) => {
      if (!v.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email";
      return "";
    },
    card: (v) => {
      const digits = v.replace(/\D/g, "");
      if (!digits) return "Card number is required";
      if (digits.length < 13 || digits.length > 19) return "Card must be 13–19 digits";
      if (!luhnCheck(digits)) return "Invalid card number";
      return "";
    },
    expiry: (v) => {
      if (!v) return "Expiry is required";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(v)) return "Use MM/YY format";
      const [mm, yy] = v.split("/").map(Number);
      const now = new Date();
      const exp = new Date(2000 + yy, mm);
      if (exp <= now) return "Card has expired";
      return "";
    },
    cvc: (v) => {
      if (!v) return "CVC is required";
      if (!/^\d{3,4}$/.test(v)) return "CVC must be 3 or 4 digits";
      return "";
    },
    postal: (v) => {
      if (!v.trim()) return "Postal code is required";
      if (!/^\d{4,6}$/.test(v.trim())) return "Enter a valid postal code";
      return "";
    },
    name: (v) => {
      if (!v.trim()) return "Name is required";
      if (v.trim().length < 2) return "Name is too short";
      return "";
    },
  };

  function luhnCheck(num) {
    let sum = 0;
    let alt = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let n = parseInt(num[i], 10);
      if (alt) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }

  // Guard: must be logged in to check out
  if (!props.user) {
    return (
      <div className="container mt-4">
        <h3>Please log in to continue</h3>
        <button className="btn btn-secondary mt-3" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  const handleChange = (field) => (e) => {
    let value = e.target.value;

    if (field === "card") {
      value = value.replace(/\D/g, "").slice(0, 19);
      value = value.replace(/(.{4})/g, "$1 ").trim();
    }
    if (field === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 3) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    if (field === "cvc" || field === "postal") {
      value = value.replace(/\D/g, "");
    }

    const error = validators[field](value);

    setForm((prev) => ({
      ...prev,
      [field]: { value, error, touched: true },
    }));
  };

  // Notifies App to update the user's purchasedCourses list.
  const addPurchasedCourse = () => {
    if (typeof props.paycheck === "function") {
      payCourses.forEach((c) => props.paycheck(props.user.id, c.id));
    }
  };

  const onPayment = () => {
    // Validate every field
    const next = { ...form };
    let hasError = false;

    Object.keys(form).forEach((field) => {
      const error = validators[field](form[field].value);
      next[field] = { ...form[field], error, touched: true };
      if (error) hasError = true;
    });

    setForm(next);

    if (hasError) {
      const firstBad = Object.keys(next).find((k) => next[k].error);
      document.getElementById(firstBad)?.focus();
      return;
    }

    // Update App state + persist
    addPurchasedCourse();

    // Build the receipt now (only the card brand + last 4 digits are kept)
    const cardDigits = form.card.value.replace(/\D/g, "");
    setReceipt({
      reference: makeReference(),
      paidAt: new Date(),
      courses: payCourses,
      discountPercent: 0,
      payment: { brand: detectCardBrand(cardDigits), last4: cardDigits.slice(-4) },
    });

    setPaid(true);
    window.scrollTo({ top: 0 });
  };

  // ───────────────────────── "You're enrolled" screen ─────────────────────────
  if (paid) {
    // Greet the signed-in user by their own name (first name only)
    const firstName = (props.user.name || "").trim().split(" ")[0] || "there";

    return (
      <section className="enrolled">
        <div className="enrolledLeft">
          <div className="enrolledBadge">
            <img alt="" src={ticC} className="enrolledTick" />
            <span>You're enrolled, {firstName}</span>
          </div>

          <h1>Let's jump in!!</h1>

          <p className="enrolledText">
            Your transaction has been completed successfully.
            <br />
            We have emailed you the details of your order.
          </p>

          <div className="enrolledButtons">
            <button
              type="button"
              className="enrolledBtn enrolledBtnSolid"
              onClick={() => navigate("/courses")}
            >
              See courses <i className="lni lni-arrow-right"></i>
            </button>
            <button
              type="button"
              className="enrolledBtn enrolledBtnOutline"
              onClick={() => setShowReceipt(true)}
            >
              View Receipt
            </button>
          </div>
        </div>

        {/* White card: every course this user owns (newest first) */}
        <CheckoutCourseView user={props.user} />

        {showReceipt && receipt && (
          <Receipt
            receipt={receipt}
            user={props.user}
            onClose={() => setShowReceipt(false)}
          />
        )}
      </section>
    );
  }

  // Nothing to pay for (bad link, or an empty cart)
  if (payCourses.length === 0) {
    return (
      <div className="container mt-4">
        <button className="btn btn-secondary mb-3" onClick={handleBack}>
          {isCart ? "Back to cart" : "Back to Site"}
        </button>
        <h3>{isCart ? "Your cart is empty" : "Course not found"}</h3>
        <p>
          {isCart
            ? "Add a course to your cart and it will show up here."
            : `No course matches id: ${id}`}
        </p>
        <button className="btn submitBtn" onClick={() => navigate("/courses")}>
          Browse courses
        </button>
      </div>
    );
  }

  // ───────────────────────────── Payment form ─────────────────────────────
  return (
    <div className="payArea mt-4">
      <p className="back mb-3" onClick={handleBack}>
        <i className="lni lni-arrow-left"></i> {isCart ? "Back to cart" : "Back to Site"}
      </p>
      <div className="row justify-content-center">
        <div className="col cardPayment">
          <h2>You're one step from building it</h2>
          <p>Lifetime access, source files, and a certificate when you finish.</p>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              id="email"
              type="email"
              className={`form-control input ${form.email.touched && form.email.error ? "is-invalid" : ""}`}
              value={form.email.value}
              onChange={handleChange("email")}
              aria-describedby="emailHelp"
            />
            <div className="invalid-feedback">{form.email.error}</div>
          </div>

          {/* Card Number */}
          <div className="mb-3">
            <label htmlFor="card" className="form-label">Card Number</label>
            <input
              id="card"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              maxLength={23}
              className={`form-control input ${form.card.touched && form.card.error ? "is-invalid" : ""}`}
              value={form.card.value}
              onChange={handleChange("card")}
            />
            <div className="invalid-feedback">{form.card.error}</div>
          </div>

          <div className="row mb-3">
            {/* Expiry */}
            <div className="col">
              <label htmlFor="expiry" className="form-label">Expiry</label>
              <input
                id="expiry"
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                maxLength={5}
                className={`form-control input ${form.expiry.touched && form.expiry.error ? "is-invalid" : ""}`}
                value={form.expiry.value}
                onChange={handleChange("expiry")}
              />
              <div className="invalid-feedback">{form.expiry.error}</div>
            </div>

            {/* CVC */}
            <div className="col">
              <label htmlFor="cvc" className="form-label">CVC</label>
              <input
                id="cvc"
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="***"
                maxLength={4}
                className={`form-control input ${form.cvc.touched && form.cvc.error ? "is-invalid" : ""}`}
                value={form.cvc.value}
                onChange={handleChange("cvc")}
              />
              <div className="invalid-feedback">{form.cvc.error}</div>
            </div>

            {/* Postal */}
            <div className="col">
              <label htmlFor="postal" className="form-label">Postal Code</label>
              <input
                id="postal"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="_ _ _ _"
                maxLength={6}
                className={`form-control input ${form.postal.touched && form.postal.error ? "is-invalid" : ""}`}
                value={form.postal.value}
                onChange={handleChange("postal")}
              />
              <div className="invalid-feedback">{form.postal.error}</div>
            </div>
          </div>

          {/* Name on card */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name on Card</label>
            <input
              id="name"
              type="text"
              autoComplete="cc-name"
              className={`form-control input ${form.name.touched && form.name.error ? "is-invalid" : ""}`}
              value={form.name.value}
              onChange={handleChange("name")}
            />
            <div className="invalid-feedback">{form.name.error}</div>
          </div>

          <button className="btn submitBtn" onClick={onPayment}>
            {`Pay R${total} and start learning`}
          </button>
          <div id="CardNumber" className="form-text">
            30-day refund, no questions. You'll get access the moment this clears.
          </div>
        </div>
        <div className="col">
          {isCart ? (
            <div className="spPaySummary">
              <h4>Your order · {payCourses.length} {payCourses.length === 1 ? "course" : "courses"}</h4>
              {payCourses.map((c) => (
                <div className="spPayRow" key={c.id}>
                  <img src={c.imgPath} alt="" />
                  <div>
                    <strong>{c.name}</strong>
                    <small>{c.author}</small>
                  </div>
                  <span>R{c.price}</span>
                </div>
              ))}
              <div className="spPayTotal">
                <span>Total</span>
                <span>R{total}</span>
              </div>
              <p className="spPayNote">once-off · lifetime access</p>
            </div>
          ) : (
            <CoursePayCard course={payCourses[0]} paid={false} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;