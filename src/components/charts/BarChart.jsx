"use client";
import React, { useState } from "react";

export default function BarChart({ data, color = "var(--clr-gold)" }) {
  const [hovered, setHovered] = useState(null);

  if (!data || data.length === 0) {
    return <div style={{ width: "100%", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--clr-text-muted)" }}>No data available</div>;
  }

  // Find max value to scale the bars
  const max = Math.max(...data.map(d => d.value));
  const rowHeight = 36;
  const gap = 12;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: `${gap}px` }}>
      {data.map((item, index) => {
        const widthPercent = (item.value / max) * 100;
        const isHovered = hovered === index;
        
        return (
          <div 
            key={item.label}
            style={{ display: "flex", alignItems: "center", gap: "16px", height: `${rowHeight}px`, cursor: "pointer" }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ width: "90px", textAlign: "right", fontSize: "0.85rem", color: isHovered ? "white" : "var(--clr-text-secondary)", transition: "color 0.2s" }}>
              {item.label}
            </div>
            <div style={{ flex: 1, height: "100%", background: "rgba(255,255,255,0.02)", borderRadius: "4px", position: "relative", overflow: "hidden" }}>
              <div 
                style={{ 
                  position: "absolute", top: 0, left: 0, height: "100%", width: `${widthPercent}%`, 
                  background: isHovered ? "var(--clr-gold-warm)" : color,
                  borderRadius: "4px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: hovered !== null && !isHovered ? 0.6 : 1
                }} 
              />
            </div>
            <div style={{ width: "30px", fontSize: "0.9rem", color: isHovered ? "var(--clr-gold)" : "white", fontWeight: "600", fontFamily: "var(--font-mono)", transition: "color 0.2s" }}>
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
