import { Link } from "react-router-dom";
import "../styleComp/header.css";

export default function Header() {
  return (
    <div className="HeaderDiv">
      <div className="Logo">
        <Link to="/" >
          <img alt="logo" src="/media/imgs/logo.svg" />
        </Link>
        <p>Nexora</p>
      </div>

      <div className="HeaderButtonDiv">
        <Link to="/courses">Browse</Link>
      </div>

      <div className="HeaderAuthDiv">
        <button className="SignUpButt">
          <Link to="/signup">Sign up</Link>
        </button>
        <button className="LoginButt">
          <Link to="/login">Log in</Link>
        </button>
      </div>
    </div>
  );
}