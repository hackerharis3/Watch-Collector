"use client";
import React, { useState, useEffect, useMemo } from "react";
import WatchCard from "./WatchCard";
import WatchModal from "./WatchModal";

const occasions = [
  {
    id: "formal",
    name: "Formal",
    icon: "🎩",
    desc: "Black-tie events, galas, and formal dinners demand understated elegance.",
    keywords: ["Dress", "Classic", "Vintage"]
  },
  {
    id: "business",
    name: "Business Casual",
    icon: "💼",
    desc: "Office meetings and professional settings call for refined yet approachable timepieces.",
    keywords: ["Dress", "Classic", "Fashion"]
  },
  {
    id: "casual",
    name: "Casual",
    icon: "☕",
    desc: "Weekend outings, cafes, and relaxed gatherings—comfort meets style.",
    keywords: ["Casual", "Fashion", "Retro", "Digital"]
  },
  {
    id: "sports",
    name: "Sports",
    icon: "🏃",
    desc: "Active pursuits and outdoor adventures demand rugged, water-resistant construction.",
    keywords: ["Sports", "Diver", "Digital", "Digital-Analog"]
  }
];

export default function OccasionsSection() {
  const [watches, setWatches] = useState([]);
  const [activeOccasion, setActiveOccasion] = useState(null);
  const [selectedWatch, setSelectedWatch] = useState(null);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem("vault_watches");
    if (saved) {
      try {
        setWatches(JSON.parse(saved));
      } catch (e) {
        setWatches([]);
      }
    }
  }, []);

  const getMatchesForOccasion = (occasion) => {
    return watches.filter(watch => {
      // Check direct occasion match
      const occasionsArray = Array.isArray(watch.occasions) ? watch.occasions : (typeof watch.occasions === 'string' ? [watch.occasions] : []);
      if (occasionsArray.some(o => o.toLowerCase() === occasion.name.toLowerCase())) return true;
      
      // Check type/keyword overlap
      const typeArray = Array.isArray(watch.type) ? watch.type : (typeof watch.type === 'string' ? [watch.type] : []);
      return typeArray.some(t => occasion.keywords.some(k => t.toLowerCase() === k.toLowerCase()));
    });
  };

  const handleOccasionClick = (id) => {
    if (activeOccasion === id) {
      setActiveOccasion(null);
    } else {
      setActiveOccasion(id);
    }
  };

  const activeOccasionData = occasions.find(o => o.id === activeOccasion);
  const matches = activeOccasionData ? getMatchesForOccasion(activeOccasionData) : [];

  return (
    <section className="section" id="occasions" style={{ background: "rgba(255, 255, 255, 0.02)" }}>
      <div className="container">
        <div className="section-header animate-in visible">
          <div className="section-tag">Utility</div>
          <h2 className="section-title">
            The <span className="gold">Occasion Matcher</span>
          </h2>
          <p className="section-desc">
            Select an upcoming event or daily setting to discover the perfect companion from your collection.
          </p>
        </div>

        <div className="occasion-grid animate-in visible" id="occasion-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-lg)", marginBottom: "var(--space-2xl)" }}>
          {occasions.map(occ => {
            const matchCount = getMatchesForOccasion(occ).length;
            const isActive = activeOccasion === occ.id;
            
            return (
              <div 
                key={occ.id} 
                className={`occasion-card ${isActive ? "active" : ""}`} 
                onClick={() => handleOccasionClick(occ.id)}
                style={{
                  background: isActive ? "var(--clr-gold-glow)" : "var(--glass-bg)",
                  borderColor: isActive ? "var(--clr-gold)" : "var(--clr-border)",
                  color: isActive ? "var(--clr-gold)" : "inherit",
                  position: "relative",
                  padding: "var(--space-xl)",
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  transition: "var(--transition-base)",
                  border: "1px solid",
                }}
              >
                <span className="occasion-count">{matchCount} match{matchCount !== 1 ? 'es' : ''}</span>
                <div className="occasion-icon" style={{ fontSize: "2.5rem", marginBottom: "var(--space-md)" }}>{occ.icon}</div>
                <div className="occasion-title" style={{ fontFamily: "var(--font-heritage)", fontSize: "1.2rem", fontWeight: "600", marginBottom: "var(--space-sm)" }}>{occ.name}</div>
                <div className="occasion-desc" style={{ fontSize: "0.85rem", color: isActive ? "inherit" : "var(--clr-text-secondary)", lineHeight: "1.5" }}>{occ.desc}</div>
              </div>
            );
          })}
        </div>

        {activeOccasionData && (
          <div id="occasion-results" className="occasion-results animate-in visible" style={{ marginTop: "var(--space-2xl)" }}>
            <div className="occasion-results-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-lg)" }}>
              <div className="occasion-results-title" style={{ fontFamily: "var(--font-heritage)", fontSize: "1.3rem", fontWeight: "600" }}>
                {activeOccasionData.icon} {activeOccasionData.name} — {matches.length} Recommended
              </div>
            </div>
            
            {matches.length > 0 ? (
              <div className="gallery-grid">
                {matches.map(watch => (
                  <WatchCard
                    key={watch.id}
                    watch={watch}
                    onClick={(w) => setSelectedWatch(w)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-text">No watches matched for {activeOccasionData.name}. Consider adding one!</div>
              </div>
            )}
          </div>
        )}
      </div>

      <WatchModal 
        watch={selectedWatch} 
        onClose={() => setSelectedWatch(null)} 
        onDelete={() => alert("Please use the Gallery to delete watches.")} 
      />
    </section>
  );
}
