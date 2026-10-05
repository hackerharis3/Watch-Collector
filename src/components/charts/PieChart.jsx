"use client";
import React, { useState } from "react";

export default function PieChart({ data, colors }) {
  const [hovered, setHovered] = useState(null);

  if (!data || data.length === 0) {
    return <div style={{ width: "100%", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--clr-text-muted)" }}>No data available</div>;
  }

  // Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // SVG parameters
  const size = 300;
  const radius = size / 2;
  const cx = radius;
  const cy = radius;

  // Generate path for each slice
  let currentAngle = -Math.PI / 2; // Start at top
  
  const slices = data.map((item, index) => {
    const angle = (item.value / total) * Math.PI * 2;
    
    // For a single full circle
    if (angle === Math.PI * 2) {
      return (
        <circle
          key={item.label}
          cx={cx} cy={cy} r={radius}
          fill={colors[index % colors.length]}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          style={{ transition: "opacity 0.2s", opacity: hovered === null || hovered === index ? 1 : 0.5, cursor: "pointer" }}
        />
      );
    }

    const x1 = cx + radius * Math.cos(currentAngle);
    const y1 = cy + radius * Math.sin(currentAngle);
    
    currentAngle += angle;
    
    const x2 = cx + radius * Math.cos(currentAngle);
    const y2 = cy + radius * Math.sin(currentAngle);
    
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    const pathData = `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;

    return (
      <path
        key={item.label}
        d={pathData}
        fill={colors[index % colors.length]}
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        style={{ 
          transition: "opacity 0.2s, transform 0.2s", 
          opacity: hovered === null || hovered === index ? 1 : 0.5, 
          transformOrigin: "center",
          transform: hovered === index ? "scale(1.03)" : "scale(1)",
          cursor: "pointer",
          stroke: "var(--clr-bg-deep)",
          strokeWidth: "2px"
        }}
      />
    );
  });

  return (
    <div style={{ display: "flex", gap: "var(--space-xl)", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
      <div style={{ width: "200px", height: "200px", position: "relative" }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
          {slices}
        </svg>
        {/* Inner circle for donut effect */}
        <div style={{ 
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "120px", height: "120px", borderRadius: "50%", background: "var(--clr-bg-primary)",
          display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
          boxShadow: "inset 0 4px 8px rgba(0,0,0,0.4)"
        }}>
          {hovered !== null ? (
            <>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white", fontFamily: "var(--font-heritage)" }}>
                {data[hovered].value}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--clr-text-muted)", textTransform: "uppercase" }}>
                {data[hovered].label}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--clr-gold)", fontFamily: "var(--font-heritage)" }}>
                {total}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--clr-text-muted)", textTransform: "uppercase" }}>
                Total
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "150px" }}>
        {data.map((item, index) => (
          <div 
            key={item.label}
            style={{ 
              display: "flex", alignItems: "center", gap: "8px", 
              opacity: hovered === null || hovered === index ? 1 : 0.5,
              transition: "opacity 0.2s",
              cursor: "pointer"
            }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: colors[index % colors.length] }} />
            <div style={{ fontSize: "0.85rem", color: "var(--clr-text-secondary)", flex: 1 }}>{item.label}</div>
            <div style={{ fontSize: "0.85rem", color: "white", fontWeight: "600", fontFamily: "var(--font-mono)" }}>
              {Math.round((item.value / total) * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
