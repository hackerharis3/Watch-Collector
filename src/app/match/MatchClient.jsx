"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

/* ──────────────────────────────────────────────
   OCCASION DATA — Enhanced with outfit context,
   seasonal awareness, and weather suggestions
   ────────────────────────────────────────────── */
const occasions = [
  {
    id: "formal",
    name: "Formal",
    icon: "🎩",
    desc: "Black-tie events, galas, and formal dinners demand understated elegance.",
    keywords: ["Dress", "Classic", "Vintage"],
    outfitTips: ["Pair with a dark suit and leather strap", "Avoid sporty or oversized watches", "Stick to slim profiles (≤40mm)"],
    season: "all",
  },
  {
    id: "business",
    name: "Business Casual",
    icon: "💼",
    desc: "Office meetings and professional settings call for refined yet approachable timepieces.",
    keywords: ["Dress", "Classic", "Fashion"],
    outfitTips: ["Works with button-down shirts and chinos", "Metal bracelet or leather strap", "Chronographs are acceptable"],
    season: "all",
  },
  {
    id: "casual",
    name: "Casual",
    icon: "☕",
    desc: "Weekend outings, cafes, and relaxed gatherings—comfort meets style.",
    keywords: ["Casual", "Fashion", "Retro", "Digital"],
    outfitTips: ["Try NATO or rubber straps", "Mix colors — fun dials welcome", "Layer with bracelets for a relaxed look"],
    season: "all",
  },
  {
    id: "sports",
    name: "Sports & Active",
    icon: "🏃",
    desc: "Active pursuits and outdoor adventures demand rugged, water-resistant construction.",
    keywords: ["Sports", "Diver", "Digital", "Digital-Analog"],
    outfitTips: ["Ensure ≥100m water resistance for water sports", "Rubber or resin straps hold up best", "Consider shock resistance for hiking/running"],
    season: "all",
  },
  {
    id: "datenight",
    name: "Date Night",
    icon: "🌹",
    desc: "Romantic evenings call for conversation starters — unique dials, exhibition casebacks, or heritage pieces.",
    keywords: ["Dress", "Classic", "Fashion", "Vintage"],
    outfitTips: ["Choose something with visual interest", "Exhibition casebacks are great conversation starters", "Avoid overly sporty or bulky watches"],
    season: "all",
  },
  {
    id: "travel",
    name: "Travel",
    icon: "✈️",
    desc: "Traveling requires reliability, scratch resistance, and ideally GMT or world time functionality.",
    keywords: ["Sports", "Diver", "Digital-Analog", "Digital"],
    complicationMatch: ["World Time", "GMT", "Dual Time"],
    outfitTips: ["Prefer sapphire crystal for scratch resistance", "Luminous dials for reading time in dim cabins", "Consider water resistance for beach destinations"],
    season: "all",
  },
];

const seasonalSuggestions = [
  {
    id: "summer",
    name: "Summer Picks",
    icon: "☀️",
    desc: "Hot weather? Go for rubber/resin straps and water resistance.",
    filter: (w) => {
      const wr = parseInt(w.water_resistance) || 0;
      const strap = (w.strap_material || "").toLowerCase();
      return wr >= 100 || strap.includes("rubber") || strap.includes("resin") || strap.includes("silicone") ||
        (w.type || []).some(t => ["Diver", "Sports", "Digital"].includes(t));
    },
  },
  {
    id: "winter",
    name: "Winter Warmers",
    icon: "❄️",
    desc: "Cold weather calls for leather straps and warm-toned dials.",
    filter: (w) => {
      const strap = (w.strap_material || "").toLowerCase();
      const dial = (w.dial_color || "").toLowerCase();
      return strap.includes("leather") || dial.includes("cream") || dial.includes("brown") || dial.includes("gold") ||
        (w.type || []).some(t => ["Dress", "Classic", "Vintage"].includes(t));
    },
  },
  {
    id: "rainy",
    name: "Rainy Day Proof",
    icon: "🌧️",
    desc: "Water-resistant watches that can handle the rain.",
    filter: (w) => {
      const wr = parseInt(w.water_resistance) || 0;
      return wr >= 50;
    },
  },
];

function getMovementIcon(mov) {
  if (!mov) return "⏱️";
  const m = mov.toLowerCase();
  if (m.includes("manual")) return "⚙️";
  if (m.includes("auto")) return "🔄";
  if (m.includes("quartz")) return "⚡";
  if (m.includes("solar") || m.includes("eco")) return "☀️";
  return "⏱️";
}

function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

export default function MatchClient() {
  const [watches, setWatches] = useState([]);
  const [wearLogs, setWearLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOccasion, setActiveOccasion] = useState(null);
  const [activeSeason, setActiveSeason] = useState(null);
  const [showOutfitTips, setShowOutfitTips] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [watchRes, logRes] = await Promise.all([
          fetch("/api/collection"),
          fetch("/api/wear-log?limit=200"),
        ]);
        const watchData = await watchRes.json();
        const logData = await logRes.json();
        if (watchData.success) setWatches(watchData.watches.filter(w => w.in_collection));
        if (logData.success) setWearLogs(logData.logs);
      } catch (e) {
        console.error("Failed to fetch:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Build wear count map for "recently worn" insight
  const wearCountMap = useMemo(() => {
    const map = {};
    wearLogs.forEach(l => { map[l.watch_id] = (map[l.watch_id] || 0) + 1; });
    return map;
  }, [wearLogs]);

  // Last worn map
  const lastWornMap = useMemo(() => {
    const map = {};
    wearLogs.forEach(l => {
      if (!map[l.watch_id] || new Date(l.date) > new Date(map[l.watch_id])) {
        map[l.watch_id] = l.date;
      }
    });
    return map;
  }, [wearLogs]);

  const getMatchesForOccasion = (occasion) => {
    return watches.filter(watch => {
      const occasionsArray = Array.isArray(watch.occasions) ? watch.occasions : [];
      if (occasionsArray.some(o => o.toLowerCase() === occasion.name.toLowerCase())) return true;

      const typeArray = Array.isArray(watch.type) ? watch.type : [];
      if (typeArray.some(t => occasion.keywords.some(k => t.toLowerCase() === k.toLowerCase()))) return true;

      // Check complication match (e.g., Travel -> GMT/World Time)
      if (occasion.complicationMatch) {
        const complications = Array.isArray(watch.complications) ? watch.complications : [];
        if (complications.some(c => occasion.complicationMatch.some(cm => c.toLowerCase().includes(cm.toLowerCase())))) return true;
      }

      return false;
    }).sort((a, b) => {
      // Sort by least-recently-worn first (prioritize neglected pieces)
      const lastA = lastWornMap[a.id] ? new Date(lastWornMap[a.id]).getTime() : 0;
      const lastB = lastWornMap[b.id] ? new Date(lastWornMap[b.id]).getTime() : 0;
      return lastA - lastB;
    });
  };

  const getSeasonalMatches = (seasonFilter) => {
    return watches.filter(seasonFilter.filter);
  };

  const handleOccasionClick = (id) => {
    setActiveSeason(null);
    setActiveOccasion(activeOccasion === id ? null : id);
    setShowOutfitTips(false);
  };

  const handleSeasonClick = (id) => {
    setActiveOccasion(null);
    setActiveSeason(activeSeason === id ? null : id);
  };

  const activeOccasionData = occasions.find(o => o.id === activeOccasion);
  const activeSeasonData = seasonalSuggestions.find(s => s.id === activeSeason);
  const matches = activeOccasionData ? getMatchesForOccasion(activeOccasionData) : [];
  const seasonMatches = activeSeasonData ? getSeasonalMatches(activeSeasonData) : [];
  const currentSeason = getCurrentSeason();

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="discovery-loading">
            <div className="loading-spinner"></div>
            <div className="loading-text">Matching watches to occasions...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="match" style={{ background: "rgba(255, 255, 255, 0.02)" }}>
      <div className="container">
        {/* Header */}
        <div className="section-header animate-in visible">
          <div className="section-tag">Utility</div>
          <h2 className="section-title">
            Watch <span className="gold">Match</span>
          </h2>
          <p className="section-desc">
            Find the perfect watch for any occasion, outfit, or weather. Smart suggestions based on your collection and wear history.
          </p>
        </div>

        {/* Occasion Grid */}
        <div className="match-occasions-grid animate-in visible">
          {occasions.map(occ => {
            const matchCount = getMatchesForOccasion(occ).length;
            const isActive = activeOccasion === occ.id;

            return (
              <div
                key={occ.id}
                className={`match-occasion-card ${isActive ? "active" : ""}`}
                onClick={() => handleOccasionClick(occ.id)}
              >
                <span className="occasion-count">{matchCount} match{matchCount !== 1 ? 'es' : ''}</span>
                <div className="match-occasion-icon">{occ.icon}</div>
                <div className="match-occasion-title">{occ.name}</div>
                <div className="match-occasion-desc">{occ.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Seasonal / Weather Suggestions */}
        <div className="match-seasonal-section">
          <h3 className="match-sub-title">
            🌤️ Seasonal & Weather Suggestions
            <span className="match-current-season">Current: {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}</span>
          </h3>
          <div className="match-seasonal-grid">
            {seasonalSuggestions.map(s => {
              const count = getSeasonalMatches(s).length;
              const isActive = activeSeason === s.id;
              return (
                <div
                  key={s.id}
                  className={`match-seasonal-card ${isActive ? "active" : ""}`}
                  onClick={() => handleSeasonClick(s.id)}
                >
                  <div className="match-seasonal-icon">{s.icon}</div>
                  <div className="match-seasonal-info">
                    <div className="match-seasonal-name">{s.name}</div>
                    <div className="match-seasonal-desc">{s.desc}</div>
                  </div>
                  <div className="match-seasonal-count">{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Occasion Results */}
        {activeOccasionData && (
          <div className="match-results animate-in visible">
            <div className="match-results-header">
              <div className="match-results-title">
                {activeOccasionData.icon} {activeOccasionData.name} — {matches.length} Recommended
              </div>
              <button
                className={`match-tips-toggle ${showOutfitTips ? "active" : ""}`}
                onClick={() => setShowOutfitTips(!showOutfitTips)}
              >
                👔 {showOutfitTips ? "Hide" : "Show"} Outfit Tips
              </button>
            </div>

            {/* Outfit Tips Panel */}
            {showOutfitTips && (
              <div className="match-outfit-tips">
                <h4>👔 Outfit Tips for {activeOccasionData.name}</h4>
                <ul>
                  {activeOccasionData.outfitTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {matches.length > 0 ? (
              <div className="match-results-grid">
                {matches.map(watch => {
                  const wearCount = wearCountMap[watch.id] || 0;
                  const lastWorn = lastWornMap[watch.id];
                  const daysSinceWorn = lastWorn
                    ? Math.floor((Date.now() - new Date(lastWorn).getTime()) / (1000 * 60 * 60 * 24))
                    : null;

                  return (
                    <Link href={`/collection/${watch.id}`} key={watch.id} className="match-watch-card">
                      <div className="match-watch-image">
                        <img src={watch.image || "/images/watch_sports_gshock.png"} alt={`${watch.brand} ${watch.model}`} />
                        <span className="match-watch-badge">{watch.movement}</span>
                      </div>
                      <div className="match-watch-body">
                        <div className="match-watch-brand">{watch.brand}</div>
                        <div className="match-watch-model">{watch.model}</div>
                        <div className="match-watch-meta">
                          <span>{getMovementIcon(watch.movement)} {watch.movement}</span>
                          {watch.case_diameter && <span>⌀ {watch.case_diameter}</span>}
                        </div>
                        <div className="match-watch-wear-info">
                          <span className="match-wear-count">Worn {wearCount}×</span>
                          {daysSinceWorn !== null ? (
                            <span className={`match-last-worn ${daysSinceWorn > 14 ? "stale" : ""}`}>
                              {daysSinceWorn === 0 ? "Worn today" : `${daysSinceWorn}d ago`}
                            </span>
                          ) : (
                            <span className="match-last-worn stale">Never worn</span>
                          )}
                        </div>
                        <div className="match-watch-tags">
                          {(watch.type || []).map((t, i) => (
                            <span key={i} className="tag gold">{t}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-text">No watches matched for {activeOccasionData.name}. Consider adding one!</div>
              </div>
            )}
          </div>
        )}

        {/* Seasonal Results */}
        {activeSeasonData && (
          <div className="match-results animate-in visible">
            <div className="match-results-header">
              <div className="match-results-title">
                {activeSeasonData.icon} {activeSeasonData.name} — {seasonMatches.length} Matches
              </div>
            </div>

            {seasonMatches.length > 0 ? (
              <div className="match-results-grid">
                {seasonMatches.map(watch => (
                  <Link href={`/collection/${watch.id}`} key={watch.id} className="match-watch-card">
                    <div className="match-watch-image">
                      <img src={watch.image || "/images/watch_sports_gshock.png"} alt={`${watch.brand} ${watch.model}`} />
                      <span className="match-watch-badge">{watch.movement}</span>
                    </div>
                    <div className="match-watch-body">
                      <div className="match-watch-brand">{watch.brand}</div>
                      <div className="match-watch-model">{watch.model}</div>
                      <div className="match-watch-meta">
                        <span>{getMovementIcon(watch.movement)} {watch.movement}</span>
                        {watch.water_resistance && <span>💧 {watch.water_resistance}</span>}
                      </div>
                      <div className="match-watch-tags">
                        {(watch.type || []).map((t, i) => (
                          <span key={i} className="tag gold">{t}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-text">No watches match this seasonal filter.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
