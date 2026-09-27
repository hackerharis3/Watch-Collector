"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function HeroSection() {
  // We'll replace these with actual counts from state/API later
  const [stats, setStats] = useState({ total: 0, brands: 0, movements: 0 });

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="dot"></span>
          Collection Active
        </div>
        <h1 className="hero-title">
          The <span className="gold">Horological</span> Vault
        </h1>
        <p className="hero-subtitle">
          A curated sanctum for the discerning collector. Catalog your timepieces,
          match them to every occasion, analyze your collection&apos;s DNA, and discover
          your next acquisition.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">{stats.total}</div>
            <div className="hero-stat-label">Timepieces</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{stats.brands}</div>
            <div className="hero-stat-label">Maisons</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{stats.movements}</div>
            <div className="hero-stat-label">Calibers</div>
          </div>
        </div>
        <div className="hero-cta">
          <Link href="#gallery" className="btn btn-primary">
            Enter the Vault
          </Link>
          <Link href="#discovery" className="btn btn-secondary">
            Discover Watches
          </Link>
        </div>
      </div>
    </section>
  );
}
