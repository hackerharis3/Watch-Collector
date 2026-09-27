"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`} id="header">
      <div className="container header-inner">
        <Link href="#hero" className="logo">
          <div className="logo-icon">⌚</div>
          <div className="logo-text">
            Horological <span>Vault</span>
          </div>
        </Link>
        <nav className={`nav ${menuOpen ? "open" : ""}`} id="main-nav">
          <a href="#gallery" className="nav-link" onClick={(e) => {
            e.preventDefault();
            setMenuOpen(false);
            document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', '#gallery');
          }}>
            Gallery
          </a>
          <a href="#occasions" className="nav-link" onClick={(e) => {
            e.preventDefault();
            setMenuOpen(false);
            document.getElementById('occasions')?.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', '#occasions');
          }}>
            Occasions
          </a>
          <a href="#analyzer" className="nav-link" onClick={(e) => {
            e.preventDefault();
            setMenuOpen(false);
            document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', '#analyzer');
          }}>
            Analyzer
          </a>
          <a href="#discovery" className="nav-link" onClick={(e) => {
            e.preventDefault();
            setMenuOpen(false);
            document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', '#discovery');
          }}>
            Discovery
          </a>
        </nav>
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .header-inner {
          position: relative;
        }
        .mobile-menu-btn {
          display: none;
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 10px;
          flex-direction: column;
          gap: 5px;
          z-index: 100;
        }
        .mobile-menu-btn span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--clr-text-secondary, #94a3b8);
          border-radius: 2px;
          transition: all 0.2s ease;
        }
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}} />
    </header>
  );
}
