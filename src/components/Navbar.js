import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "../css/navbar.css"; // enthält das CSS unten

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    // Bei Seitenwechsel oder Breite ändern: Menü schließen
    useEffect(() => {
        const close = () => setIsOpen(false);
        window.addEventListener("resize", close);
        return () => window.removeEventListener("resize", close);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-title">Maiholz</div>
            <div className="navbar-links">
                <Link to="/">Dashboard</Link>
                <Link to="/server">Server</Link>
            </div>

            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <FaBars size={24} />
            </div>

            {isOpen && (
                <div className="mobile-menu">
                    <Link to="/" onClick={() => setIsOpen(false)}>Dashboard</Link>
                    <Link to="/server" onClick={() => setIsOpen(false)}>Server</Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
