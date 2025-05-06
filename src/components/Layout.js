import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="header">
        <h1 className="logo">Sauna</h1>
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Setting</Link>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        </nav>
      </header>
      <main className="main-content">
        {children}
      </main>
    </>
  );
}

export default Layout;
