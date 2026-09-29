"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function HeroSection() {
  const [stats, setStats] = useState({ total: 0, brands: 0, movements: 0 });

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        const res = await fetch("/api/collection");
        if (!res.ok) return;
        const data = await res.json();
        
        if (data.success && data.data && isMounted) {
          const watches = data.data;
          const brands = new Set(watches.map(w => w.brand).filter(Boolean));
          const movements = new Set(watches.map(w => w.caliber || w.movement).filter(Boolean));
          
          const targetTotal = watches.length;
          const targetBrands = brands.size;
          const targetMovements = movements.size;
          
          // Basic count-up animation
          let step = 0;
          const totalSteps = 20;
          
          const timer = setInterval(() => {
            step++;
            if (step >= totalSteps) {
              clearInterval(timer);
              if (isMounted) {
                setStats({ total: targetTotal, brands: targetBrands, movements: targetMovements });
              }
            } else {
              if (isMounted) {
                setStats({
                  total: Math.floor((targetTotal * step) / totalSteps),
                  brands: Math.floor((targetBrands * step) / totalSteps),
                  movements: Math.floor((targetMovements * step) / totalSteps)
                });
              }
            }
          }, 40);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    }
    fetchStats();
    return () => { isMounted = false; };
  }, []);

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
