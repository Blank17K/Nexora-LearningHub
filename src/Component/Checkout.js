import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CoursePayCard from "./CoursePayCard.js";
import coursesInfo from "../Assets/scripts/courseList.js";
import ticC from '../Assets/Images/tickC.svg';
import '../styleComp/checkout.css';

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
  const [slideRemove, setSlideR] = useState('');

  const course = useMemo(
    () => coursesInfo.find((c) => String(c.id) === String(id)),
    [id]
  );

  const handleBack = () => {
    navigate(`/course/${id}`);
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
        {props.checkOut(-1)}
        <h3>Please log in to continue</h3>
        <button className="btn btn-secondary mt-3" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mt-4">
        {props.checkOut(-1)}
        <button className="btn btn-secondary mb-3" onClick={handleBack}>
          Back to Site
        </button>
        <h3>Course not found</h3>
        <p>No course matches id: {id}</p>
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
      props.paycheck(props.user.id, course.id);
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

    // All valid — proceed
    console.log("Submitting:", Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.value])
    ));

    // Update App state + persist
    addPurchasedCourse();

    setSlideR('slideOut');
  };

  const paymentSuccess = () => {
    return (
      <>
        <div className={`container paidRec ${slideRemove === '' ? 'slideoutIn' : ''}`}>
          <div className="row">
            <img alt="tick circle" src={ticC} className="col imgTick" />
            <h3 className="col-8">{`Your Enrolled ${props.user.name}`}</h3>
          </div>
          <h1>Let's build the thing.</h1>
          <p>{`Lesson one takes ${course.courseModules[0].duration}. By the end of module one you'll know ${course.courseModules[0].title}.`}</p>
          <div className="buttons row">
            <button className="btn col solidBtn">Start Lesson <i className="lni lni-arrow-right"></i></button>
            <button className="btn outlineBtn col ms-4">View Recipt</button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={`payArea mt-4 checkoutBack ${slideRemove === "" ? '' : 'changeBack'}`}>
      {props.checkOut(-1)}
      <p className={`${slideRemove === '' ? 'back' : 'backInv'} mb-3`} onClick={handleBack}>
        <i className="lni lni-arrow-left"></i> Back to Site
      </p>
      <div className="row justify-content-center">
        {paymentSuccess()}
        <div className={`col cardPayment ${slideRemove}`}>
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
            {`Pay R${course.price} and start learning`}
          </button>
          <div id="CardNumber" className="form-text">
            30-day refund, no questions. You'll get access the moment this clears.
          </div>
        </div>
        <div className="col">
          <CoursePayCard course={course} paid={slideRemove === '' ? false : true} />
        </div>
      </div>
    </div>
  );
}

export default Checkout;