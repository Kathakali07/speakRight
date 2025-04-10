import React from "react";
import './navbar.css'; 
import LOGO from "./LOGO.png";

function Navbar({ onContactClick }) {
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                {/* Left-aligned logo and brand */}
                <div className="navbar-left d-flex align-items-center">
                    <img src={LOGO} alt="Logo" className="navbar-logo" />
                    <a className="navbar-brand fw-bold" href="/">Speak_Right</a>
                </div>

                {/* Right-aligned links */}
                <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <a className="nav-link active" href="#mission-vision">About</a>
                        {/* Trigger scroll to Contact Us section */}
                        <a className="nav-link" href="#contact-us" onClick={onContactClick}>Contact Us</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
