import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import logo from "../Assets/Images/Logo.png";
import "../styleComp/receipt.css";

/* ───────────── helpers (Checkout.js uses the two exported ones) ───────────── */

// "DEMO-3ZQIH2" – simulated order reference
export const makeReference = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `DEMO-${out}`;
};

// Works out the card brand from the first digits. Only the brand + last 4
// digits are ever kept for the receipt, never the full number.
export const detectCardBrand = (digits) => {
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^(6011|65|64[4-9])/.test(digits)) return "Discover";
  return "";
};

const money = (n) =>
  `R${Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const lessonCount = (course) =>
  course.courseModules.reduce((sum, m) => sum + m.lessons, 0);

// "11 October 2026, 17:41"
const formatDate = (d) => {
  const day = d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${day}, ${time}`;
};

/*
  Payment receipt pop-up.

  receipt = {
    reference: "DEMO-3ZQIH2",
    paidAt: Date,
    courses: [course, ...],        // the course(s) bought in THIS payment
    discountPercent: 0,            // optional; the discount row only shows when > 0
    payment: { brand: "Visa", last4: "9033" },
  }
*/
export default function Receipt({ receipt, user, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  // Lock page scroll, close on Esc, and give focus back when the pop-up closes
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const { courses, reference, paidAt, payment } = receipt;
  const original = courses.reduce((sum, c) => sum + Number(c.price), 0);
  const percent = receipt.discountPercent || 0;
  const discount = (original * percent) / 100;
  const total = original - discount;

  const paymentText = payment
    ? `Card · ${payment.brand ? payment.brand + " " : ""}ending ${payment.last4}`
    : "Card";

  return createPortal(
    <div
      className="receiptOverlay"
      onMouseDown={(e) => {
        // only a click on the dimmed area itself closes it
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="receiptModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="receiptTitle"
        tabIndex={-1}
        ref={dialogRef}
      >
        {/* Header */}
        <div className="receiptHead">
          <img src={logo} alt="" className="receiptLogo" />
          <h2 id="receiptTitle">Payment receipt</h2>
          <button
            type="button"
            className="receiptX receiptNoPrint"
            onClick={onClose}
            aria-label="Close receipt"
          >
            X
          </button>
        </div>

        <div className="receiptBody">
          {/* Paid banner */}
          <div className="receiptPaid">
            <span className="receiptPaidIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <strong>
              Paid — payment received for {courses.length}{" "}
              {courses.length === 1 ? "course" : "courses"}
            </strong>
          </div>

          {/* Reference / date / billed to */}
          <dl className="receiptMeta">
            <dt>Reference</dt>
            <dd className="receiptRef">{reference}</dd>
            <dt>Date</dt>
            <dd>{formatDate(paidAt)}</dd>
            <dt>Billed to</dt>
            <dd>
              {user.name}
              {user.email ? ` · ${user.email}` : ""}
            </dd>
          </dl>

          {/* Courses in this payment */}
          <div className="receiptItems">
            {courses.map((c) => (
              <div className="receiptItem" key={c.id}>
                <img src={c.imgPath} alt={c.name} className="receiptThumb" />
                <div className="receiptItemInfo">
                  <div className="receiptItemTop">
                    <h3>{c.name}</h3>
                    <span className="receiptItemPrice">R{c.price}</span>
                  </div>
                  <p>
                    {c.author} · {lessonCount(c)} lessons · {c.banner.hours} h ·
                    lifetime access
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="receiptTotals">
            <div className="receiptLine">
              <span>Original Price:</span>
              <span>{money(original)}</span>
            </div>
            {percent > 0 && (
              <div className="receiptLine">
                <span>Discounts ({percent}% Off)</span>
                <span>-{money(discount)}</span>
              </div>
            )}
            <div className="receiptTotalRow">
              <span>Total paid</span>
              <strong>{money(total)}</strong>
            </div>
            <p className="receiptVat">Price includes VAT, as shown at checkout</p>
          </div>

          {/* Payment details */}
          <dl className="receiptMeta receiptPay">
            <dt>Payment</dt>
            <dd>{paymentText}</dd>
            <dt>Status</dt>
            <dd>Paid</dd>
          </dl>

          <div className="receiptThanks">
            <strong>Thank you for learning with Nexora.</strong>
            <p>
              This receipt is a record of your purchase. Prototype: the
              reference and timestamp were generated by a simulated checkout; no
              payment was processed.
            </p>
          </div>

          {/* Actions */}
          <div className="receiptActions receiptNoPrint">
            <button
              type="button"
              className="receiptBtn receiptBtnOutline"
              onClick={() => window.print()}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <path d="M7 9V3h10v6" />
                <rect x="3" y="9" width="18" height="8" rx="2" />
                <path d="M7 14h10v7H7z" />
              </svg>
              Print or save as PDF
            </button>
            <button type="button" className="receiptBtn receiptBtnSolid" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
