"use client";
import React, { useMemo } from "react";
import PieChart from "@/components/charts/PieChart";
import BarChart from "@/components/charts/BarChart";
import RadarChart from "@/components/charts/RadarChart";

export default function AnalyticsClient({ watches }) {
  
  // Calculate Brand Distribution
  const brandData = useMemo(() => {
    const counts = {};
    watches.forEach(w => {
      const b = w.brand || "Unknown";
      counts[b] = (counts[b] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [watches]);

  // Calculate Movement Distribution
  const movementData = useMemo(() => {
    const counts = {};
    watches.forEach(w => {
      const m = w.movement || "Unknown";
      counts[m] = (counts[m] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [watches]);

  // Calculate Category DNA (for Radar Chart)
  const categoryData = useMemo(() => {
    const categories = ["Dress", "Sports", "Casual", "Diver", "Chronograph", "Field", "Vintage"];
    const counts = {};
    categories.forEach(c => counts[c] = 0);
    
    watches.forEach(w => {
      if (w.type && Array.isArray(w.type)) {
        w.type.forEach(t => {
          if (counts[t] !== undefined) counts[t]++;
        });
      }
    });
    return categories.map(label => ({ label, value: counts[label] }));
  }, [watches]);

  // Calculate Complication Coverage
  const complicationData = useMemo(() => {
    const counts = {};
    watches.forEach(w => {
      if (w.complications && Array.isArray(w.complications)) {
        w.complications.forEach(c => {
          if (c !== "None") {
            counts[c] = (counts[c] || 0) + 1;
          }
        });
      }
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // top 8
  }, [watches]);

  // General Stats
  const totalWatches = watches.length;
  const uniqueBrands = new Set(watches.map(w => w.brand)).size;
  const avgDiameter = (watches.reduce((acc, w) => {
    const match = (w.case_diameter || "").match(/(\d+)/);
    return acc + (match ? parseInt(match[1]) : 0);
  }, 0) / (totalWatches || 1)).toFixed(1);

  // Deep space palette for charts
  const palette = [
    "#C5A059", // Gold
    "#3B82F6", // Blue
    "#10B981", // Green
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#F59E0B", // Amber
    "#64748B", // Slate
  ];

  return (
    <div className="container" style={{ paddingTop: "var(--space-2xl)", paddingBottom: "var(--space-4xl)" }}>
      <div className="section-header animate-in visible">
        <div className="section-tag">Insights</div>
        <h1 className="section-title">Collection <span className="gold">Analytics</span></h1>
        <p className="section-desc">Visual breakdown of your personal horological vault.</p>
      </div>

      {/* High-Level Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-lg)", marginBottom: "var(--space-3xl)", animationDelay: "0.1s" }} className="animate-in visible">
        <div className="stat-card">
          <div className="stat-value">{totalWatches}</div>
          <div className="stat-label">Total Timepieces</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{uniqueBrands}</div>
          <div className="stat-label">Unique Brands</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgDiameter}mm</div>
          <div className="stat-label">Avg Case Size</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{brandData[0]?.label || "—"}</div>
          <div className="stat-label">Top Brand</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "var(--space-2xl)" }}>
        {/* Brand Distribution (Pie Chart) */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-xl)", animationDelay: "0.2s" }} className="animate-in visible">
          <h3 style={{ fontFamily: "var(--font-heritage)", fontSize: "1.2rem", color: "white", marginBottom: "var(--space-xl)", textAlign: "center" }}>Brand Distribution</h3>
          <PieChart data={brandData} colors={palette} />
        </div>

        {/* Movement Breakdown (Bar Chart) */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-xl)", animationDelay: "0.3s" }} className="animate-in visible">
          <h3 style={{ fontFamily: "var(--font-heritage)", fontSize: "1.2rem", color: "white", marginBottom: "var(--space-xl)" }}>Movement Profile</h3>
          <BarChart data={movementData} color="var(--clr-gold)" />
        </div>

        {/* Complications Coverage */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-xl)", gridColumn: "1 / -1", animationDelay: "0.4s" }} className="animate-in visible">
          <h3 style={{ fontFamily: "var(--font-heritage)", fontSize: "1.2rem", color: "white", marginBottom: "var(--space-xl)" }}>Top Complications</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-xl)" }}>
             <BarChart data={complicationData} color="rgba(59, 130, 246, 0.8)" />
             <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "var(--space-lg)" }}>
                <p style={{ color: "var(--clr-text-secondary)", lineHeight: 1.6 }}>
                  Your collection features <strong>{complicationData.length}</strong> distinct complications. 
                  {complicationData.length > 0 && ` The most common feature is a ${complicationData[0].label}, appearing on ${complicationData[0].value} timepieces.`}
                </p>
                <div style={{ marginTop: "var(--space-lg)", display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
                  {complicationData.map(c => (
                    <span key={c.label} style={{ padding: "4px 10px", background: "rgba(255,255,255,0.05)", borderRadius: "999px", fontSize: "0.8rem", color: "var(--clr-text-primary)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {c.label} <span style={{ color: "var(--clr-gold)", marginLeft: "4px" }}>{c.value}</span>
                    </span>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* Collection DNA (Radar Chart) */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-xl)", gridColumn: "1 / -1", animationDelay: "0.5s" }} className="animate-in visible">
          <h3 style={{ fontFamily: "var(--font-heritage)", fontSize: "1.2rem", color: "white", marginBottom: "var(--space-xl)", textAlign: "center" }}>Collection DNA</h3>
          <RadarChart data={categoryData} />
        </div>
      </div>
    </div>
  );
}
