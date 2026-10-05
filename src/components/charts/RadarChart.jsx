"use client";
import React from "react";

export default function RadarChart({ data }) {
  if (!data || data.length < 3) {
    return <div style={{ width: "100%", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--clr-text-muted)" }}>Not enough data for radar (needs at least 3 axes)</div>;
  }

  const size = 300;
  const center = size / 2;
  const radius = center - 40; // padding for labels
  const levels = 4;
  
  // Find max value to scale
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const angleStep = (Math.PI * 2) / data.length;

  // Generate background web
  const webPaths = [];
  for (let level = 1; level <= levels; level++) {
    const levelRadius = (radius / levels) * level;
    let path = "";
    for (let i = 0; i < data.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + levelRadius * Math.cos(angle);
      const y = center + levelRadius * Math.sin(angle);
      path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    path += " Z";
    webPaths.push(path);
  }

  // Generate data polygon
  let dataPath = "";
  const points = [];
  data.forEach((d, i) => {
    const valRadius = (d.value / maxValue) * radius;
    const angle = i * angleStep - Math.PI / 2;
    const x = center + valRadius * Math.cos(angle);
    const y = center + valRadius * Math.sin(angle);
    points.push({ x, y, value: d.value, label: d.label });
    dataPath += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });
  dataPath += " Z";

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: `${size}px`, margin: "0 auto", aspectRatio: "1/1" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        {/* Background Web */}
        {webPaths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        ))}

        {/* Axis Lines */}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line key={i} x1={center} y1={center} x2={x2} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          );
        })}

        {/* Data Polygon */}
        <path d={dataPath} fill="rgba(197, 160, 89, 0.3)" stroke="var(--clr-gold)" strokeWidth="2" style={{ filter: "drop-shadow(0 0 8px rgba(197, 160, 89, 0.4))" }} />

        {/* Data Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke="var(--clr-gold)" strokeWidth="2" />
        ))}

        {/* Labels */}
        {data.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          // Push labels slightly outside the radius
          const labelRadius = radius + 20;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          
          let textAnchor = "middle";
          if (x < center - 10) textAnchor = "end";
          else if (x > center + 10) textAnchor = "start";
          
          return (
            <text 
              key={i} x={x} y={y + 4} 
              fill="var(--clr-text-secondary)" 
              fontSize="10" 
              textAnchor={textAnchor}
              fontFamily="var(--font-mono)"
              letterSpacing="0.05em"
            >
              {d.label.toUpperCase()}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
