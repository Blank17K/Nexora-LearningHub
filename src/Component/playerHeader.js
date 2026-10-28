import React from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/Images/Logo.png";

export default function PlayerHeader({ courseName, pct = 0, done = 0, total = 0 }) {
  return (
    <header className="cpTop d-flex align-items-center">
      {/* Brand */}
      <Link to="/courses" className="d-flex align-items-center text-decoration-none me-4" style={{ color: 'inherit' }}>
        <img alt="Nexora" src={logo} style={{ width: '2rem', marginRight: '0.5rem' }} />
        <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0e1f1a' }}>Nexora</span>
      </Link>

      {/* Course Name */}
      <div className="cpCourseName me-auto" title={courseName}>
        {courseName}
      </div>

      {/* Progress */}
      <div className="d-flex align-items-center gap-3" style={{ width: '300px' }}>
        <div className="flex-grow-1">
          <div
            className="cpProgress"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="cpProgressFill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="text-nowrap">
          <span className="cpProgressPct">{pct}%</span>
          <span className="cpProgressCount ms-2">({done}/{total})</span>
        </div>
      </div>
    </header>
  );
}