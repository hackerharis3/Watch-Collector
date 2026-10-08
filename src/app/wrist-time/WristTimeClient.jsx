"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";

/* ──────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────── */
const OCCASIONS = ["Work", "Date Night", "Travel", "Workout", "Casual Outing", "Formal Event", "Weekend", "Special Occasion"];
const WEATHER_OPTIONS = ["☀️ Sunny", "🌤️ Partly Cloudy", "☁️ Overcast", "🌧️ Rainy", "❄️ Cold", "🌡️ Hot", "🌬️ Windy", "🌈 Mild"];

function toDateKey(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

function getMonthDays(year, month) {
  const days = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Pad start to align to Monday
  const startPad = (firstDay.getDay() + 6) % 7; // Mon=0 ... Sun=6
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, isCurrentMonth: false });
  }
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push({ date: new Date(year, month, day), isCurrentMonth: true });
  }
  // Pad end to fill grid row
  const endPad = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= endPad; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }
  return days;
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getMovementIcon(mov) {
  if (!mov) return "⏱️";
  const m = mov.toLowerCase();
  if (m.includes("manual")) return "⚙️";
  if (m.includes("auto")) return "🔄";
  if (m.includes("quartz")) return "⚡";
  if (m.includes("solar") || m.includes("eco")) return "☀️";
  return "⏱️";
}

/* ──────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────── */
export default function WristTimeClient() {
  const [watches, setWatches] = useState([]);
  const [wearLogs, setWearLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calendar state
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  // Quick-log modal
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({
    watch_id: "",
    date: toDateKey(new Date()),
    occasion: "",
    outfit_notes: "",
    weather: "",
    rating: null,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState("calendar"); // calendar | timeline | analytics

  /* ── Fetch Data ── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [watchRes, logRes] = await Promise.all([
        fetch("/api/collection"),
        fetch("/api/wear-log?limit=500"),
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
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Derived data ── */
  const logsByDate = useMemo(() => {
    const map = {};
    wearLogs.forEach((log) => {
      const key = toDateKey(log.date);
      if (!map[key]) map[key] = [];
      map[key].push(log);
    });
    return map;
  }, [wearLogs]);

  const watchMap = useMemo(() => {
    const map = {};
    watches.forEach((w) => { map[w.id] = w; });
    return map;
  }, [watches]);

  const calendarDays = useMemo(
    () => getMonthDays(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  /* ── Analytics computations ── */
  const analytics = useMemo(() => {
    if (wearLogs.length === 0) return null;

    // Total wears
    const totalWears = wearLogs.length;

    // Wear count per watch
    const wearCountMap = {};
    const occasionCountMap = {};
    const weatherCountMap = {};
    const monthlyWears = {};

    wearLogs.forEach((log) => {
      wearCountMap[log.watch_id] = (wearCountMap[log.watch_id] || 0) + 1;
      if (log.occasion) occasionCountMap[log.occasion] = (occasionCountMap[log.occasion] || 0) + 1;
      if (log.weather) weatherCountMap[log.weather] = (weatherCountMap[log.weather] || 0) + 1;
      const monthKey = toDateKey(log.date).substring(0, 7);
      monthlyWears[monthKey] = (monthlyWears[monthKey] || 0) + 1;
    });

    // Most worn
    const sortedByWear = Object.entries(wearCountMap)
      .sort((a, b) => b[1] - a[1]);
    const mostWorn = sortedByWear[0] ? { watchId: sortedByWear[0][0], count: sortedByWear[0][1] } : null;
    const leastWorn = sortedByWear[sortedByWear.length - 1] ? { watchId: sortedByWear[sortedByWear.length - 1][0], count: sortedByWear[sortedByWear.length - 1][1] } : null;

    // Unique days worn
    const uniqueDays = new Set(wearLogs.map((l) => toDateKey(l.date))).size;

    // Current streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = toDateKey(d);
      if (logsByDate[key] && logsByDate[key].length > 0) {
        streak++;
      } else {
        break;
      }
    }

    // Unworn watches
    const wornWatchIds = new Set(Object.keys(wearCountMap));
    const unwornWatches = watches.filter((w) => !wornWatchIds.has(w.id));

    // Top occasions
    const topOccasions = Object.entries(occasionCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Average rating
    const ratedLogs = wearLogs.filter((l) => l.rating != null);
    const avgRating = ratedLogs.length > 0
      ? (ratedLogs.reduce((sum, l) => sum + l.rating, 0) / ratedLogs.length).toFixed(1)
      : null;

    return {
      totalWears,
      uniqueDays,
      streak,
      mostWorn,
      leastWorn,
      unwornWatches,
      wearCountMap,
      topOccasions,
      weatherCountMap,
      avgRating,
      sortedByWear,
      monthlyWears,
    };
  }, [wearLogs, watches, logsByDate]);

  /* ── Handlers ── */
  const handleDateClick = (date) => {
    const key = toDateKey(date);
    setSelectedDate(key === selectedDate ? null : key);
  };

  const openLogModal = (dateKeyOrLog) => {
    if (typeof dateKeyOrLog === "object" && dateKeyOrLog !== null) {
      // Edit mode
      setLogForm({
        id: dateKeyOrLog.id,
        watch_id: dateKeyOrLog.watch_id,
        date: toDateKey(dateKeyOrLog.date),
        occasion: dateKeyOrLog.occasion || "",
        outfit_notes: dateKeyOrLog.outfit_notes || "",
        weather: dateKeyOrLog.weather || "",
        rating: dateKeyOrLog.rating || null,
        notes: dateKeyOrLog.notes || "",
      });
    } else {
      // Create mode
      setLogForm({
        watch_id: watches.length > 0 ? watches[0].id : "",
        date: dateKeyOrLog || toDateKey(new Date()),
        occasion: "",
        outfit_notes: "",
        weather: "",
        rating: null,
        notes: "",
      });
    }
    setShowLogModal(true);
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!logForm.watch_id) return;
    setSubmitting(true);
    try {
      const isEdit = !!logForm.id;
      const url = isEdit ? `/api/wear-log/${logForm.id}` : "/api/wear-log";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...logForm,
          date: logForm.date + "T12:00:00Z",
          rating: logForm.rating || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (isEdit) {
          setWearLogs((prev) => prev.map((l) => (l.id === data.log.id ? data.log : l)));
        } else {
          setWearLogs((prev) => [data.log, ...prev]);
        }
        setShowLogModal(false);
      }
    } catch (err) {
      console.error("Failed to log wear:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLog = async (logId) => {
    try {
      const res = await fetch(`/api/wear-log/${logId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setWearLogs((prev) => prev.filter((l) => l.id !== logId));
      }
    } catch (err) {
      console.error("Failed to delete log:", err);
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  /* ── Render helpers ── */
  const getHeatLevel = (dateKey) => {
    const logs = logsByDate[dateKey];
    if (!logs || logs.length === 0) return 0;
    if (logs.length === 1) return 1;
    if (logs.length === 2) return 2;
    return 3;
  };

  const getWatchName = (watchId) => {
    const w = watchMap[watchId];
    return w ? `${w.brand} ${w.model}` : "Unknown Watch";
  };

  const isToday = (dateKey) => dateKey === toDateKey(new Date());

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="discovery-loading">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading wrist-time data...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="wrist-time">
      <div className="container">
        {/* Header */}
        <div className="section-header animate-in visible">
          <div className="section-tag">Tracking</div>
          <h2 className="section-title">
            <span className="gold">Wrist-Time</span> Tracker
          </h2>
          <p className="section-desc">
            Log which watch you wear each day. Build streaks, discover patterns, and ensure every piece gets its time on the wrist.
          </p>
        </div>

        {/* Quick Action Bar */}
        <div className="wt-action-bar">
          <button className="wt-log-btn" onClick={() => openLogModal(toDateKey(new Date()))}>
            <span className="wt-log-btn-icon">⌚</span>
            <span>Log Today&apos;s Watch</span>
          </button>
          <div className="wt-tabs">
            {["calendar", "timeline", "analytics"].map((tab) => (
              <button
                key={tab}
                className={`wt-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "calendar" ? "📅" : tab === "timeline" ? "📜" : "📊"}{" "}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── CALENDAR VIEW ── */}
        {activeTab === "calendar" && (
          <div className="wt-calendar-section">
            {/* Calendar Navigation */}
            <div className="wt-calendar-nav">
              <button className="wt-nav-btn" onClick={prevMonth}>←</button>
              <h3 className="wt-calendar-title">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </h3>
              <button className="wt-nav-btn" onClick={nextMonth}>→</button>
            </div>

            {/* Day headers */}
            <div className="wt-calendar-grid">
              {DAY_LABELS.map((d) => (
                <div key={d} className="wt-cal-header">{d}</div>
              ))}

              {/* Day cells */}
              {calendarDays.map(({ date, isCurrentMonth }, i) => {
                const key = toDateKey(date);
                const heat = getHeatLevel(key);
                const today = isToday(key);
                const selected = selectedDate === key;
                const dayLogs = logsByDate[key] || [];

                return (
                  <div
                    key={i}
                    className={`wt-cal-day ${!isCurrentMonth ? "other-month" : ""} ${today ? "today" : ""} ${selected ? "selected" : ""} heat-${heat}`}
                    onClick={() => handleDateClick(date)}
                  >
                    <span className="wt-cal-day-num">{date.getDate()}</span>
                    {dayLogs.length > 0 && (
                      <div className="wt-cal-day-dots">
                        {dayLogs.slice(0, 3).map((log, j) => {
                          const w = watchMap[log.watch_id];
                          return (
                            <span key={j} className="wt-cal-dot" title={w ? `${w.brand} ${w.model}` : "Watch"}>
                              {getMovementIcon(w?.movement)}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Heat legend */}
            <div className="wt-heat-legend">
              <span className="wt-heat-label">Activity:</span>
              <span className="wt-heat-item heat-0">None</span>
              <span className="wt-heat-item heat-1">1 Watch</span>
              <span className="wt-heat-item heat-2">2 Watches</span>
              <span className="wt-heat-item heat-3">3+ Watches</span>
            </div>

            {/* Selected date detail */}
            {selectedDate && (
              <div className="wt-day-detail">
                <div className="wt-day-detail-header">
                  <h4>{new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</h4>
                  <button className="wt-add-entry-btn" onClick={() => openLogModal(selectedDate)}>
                    + Log Wear
                  </button>
                </div>
                {(logsByDate[selectedDate] || []).length > 0 ? (
                  <div className="wt-day-entries">
                    {(logsByDate[selectedDate] || []).map((log) => {
                      const w = watchMap[log.watch_id];
                      return (
                        <div key={log.id} className="wt-entry-card">
                          <div className="wt-entry-watch">
                            {w && w.image && (
                              <img src={w.image} alt={`${w?.brand} ${w?.model}`} className="wt-entry-img" />
                            )}
                            <div className="wt-entry-info">
                              <div className="wt-entry-name">{getWatchName(log.watch_id)}</div>
                              <div className="wt-entry-meta">
                                {log.occasion && <span className="wt-entry-tag">{log.occasion}</span>}
                                {log.weather && <span className="wt-entry-tag">{log.weather}</span>}
                                {log.rating && <span className="wt-entry-rating">{"★".repeat(log.rating)}{"☆".repeat(5 - log.rating)}</span>}
                              </div>
                              {log.outfit_notes && <div className="wt-entry-outfit">{log.outfit_notes}</div>}
                              {log.notes && <div className="wt-entry-notes">{log.notes}</div>}
                            </div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", padding: "0 var(--space-sm)" }}>
                            <button className="wt-entry-delete" onClick={() => openLogModal(log)} title="Edit entry" style={{ fontSize: "1.1rem" }}>✎</button>
                            <button className="wt-entry-delete" onClick={() => handleDeleteLog(log.id)} title="Remove entry">×</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="wt-empty-day">
                    <span>No watches logged for this day.</span>
                    <button className="wt-add-entry-btn small" onClick={() => openLogModal(selectedDate)}>Log a Wear</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TIMELINE VIEW ── */}
        {activeTab === "timeline" && (
          <div className="wt-timeline-section">
            {wearLogs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <div className="empty-state-text">No wear logs yet. Start by logging today&apos;s watch!</div>
              </div>
            ) : (
              <div className="wt-timeline">
                {wearLogs.slice(0, 50).map((log) => {
                  const w = watchMap[log.watch_id];
                  const logDate = new Date(log.date);
                  return (
                    <div key={log.id} className="wt-timeline-item">
                      <div className="wt-timeline-dot"></div>
                      <div className="wt-timeline-card">
                        <div className="wt-timeline-date">
                          {logDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                        </div>
                        <div className="wt-timeline-watch">
                          {w && w.image && <img src={w.image} alt="" className="wt-timeline-img" />}
                          <div>
                            <div className="wt-timeline-name">{getWatchName(log.watch_id)}</div>
                            <div className="wt-timeline-tags">
                              {log.occasion && <span className="wt-entry-tag">{log.occasion}</span>}
                              {log.weather && <span className="wt-entry-tag">{log.weather}</span>}
                              {log.rating && <span className="wt-entry-rating">{"★".repeat(log.rating)}</span>}
                            </div>
                          </div>
                        </div>
                        {(log.outfit_notes || log.notes) && (
                          <div className="wt-timeline-notes">
                            {log.outfit_notes && <span>👔 {log.outfit_notes}</span>}
                            {log.notes && <span>📝 {log.notes}</span>}
                          </div>
                        )}
                        <div style={{ position: "absolute", top: "15px", right: "15px", display: "flex", gap: "10px" }}>
                          <button className="wt-entry-delete" onClick={() => openLogModal(log)} title="Edit entry" style={{ fontSize: "1.1rem" }}>✎</button>
                          <button className="wt-entry-delete" onClick={() => handleDeleteLog(log.id)} title="Remove entry">×</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ANALYTICS VIEW ── */}
        {activeTab === "analytics" && (
          <div className="wt-analytics-section">
            {!analytics ? (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <div className="empty-state-text">Start logging wears to see analytics!</div>
              </div>
            ) : (
              <>
                {/* Stats Row */}
                <div className="wt-stats-grid">
                  <div className="wt-stat-card">
                    <div className="wt-stat-icon">📊</div>
                    <div className="wt-stat-value">{analytics.totalWears}</div>
                    <div className="wt-stat-label">Total Wears</div>
                  </div>
                  <div className="wt-stat-card">
                    <div className="wt-stat-icon">📅</div>
                    <div className="wt-stat-value">{analytics.uniqueDays}</div>
                    <div className="wt-stat-label">Days Logged</div>
                  </div>
                  <div className="wt-stat-card streak">
                    <div className="wt-stat-icon">🔥</div>
                    <div className="wt-stat-value">{analytics.streak}</div>
                    <div className="wt-stat-label">Day Streak</div>
                  </div>
                  <div className="wt-stat-card">
                    <div className="wt-stat-icon">⭐</div>
                    <div className="wt-stat-value">{analytics.avgRating || "—"}</div>
                    <div className="wt-stat-label">Avg Rating</div>
                  </div>
                </div>

                {/* Most/Least Worn + Unworn */}
                <div className="wt-analytics-grid">
                  {/* Wear frequency bar chart */}
                  <div className="wt-analytics-card">
                    <h4 className="wt-analytics-card-title">⌚ Wear Frequency</h4>
                    <div className="wt-frequency-list">
                      {analytics.sortedByWear.map(([watchId, count]) => {
                        const w = watchMap[watchId];
                        if (!w) return null;
                        const maxCount = analytics.sortedByWear[0]?.[1] || 1;
                        const pct = Math.round((count / maxCount) * 100);
                        return (
                          <div key={watchId} className="wt-freq-item">
                            <div className="wt-freq-label">
                              <span className="wt-freq-name">{w.brand} {w.model}</span>
                              <span className="wt-freq-count">{count}×</span>
                            </div>
                            <div className="wt-freq-bar-track">
                              <div className="wt-freq-bar-fill" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top occasions */}
                  <div className="wt-analytics-card">
                    <h4 className="wt-analytics-card-title">🎯 Top Occasions</h4>
                    {analytics.topOccasions.length > 0 ? (
                      <div className="wt-occasion-list">
                        {analytics.topOccasions.map(([occasion, count]) => (
                          <div key={occasion} className="wt-occasion-item">
                            <span className="wt-occasion-name">{occasion}</span>
                            <span className="wt-occasion-count">{count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="wt-empty-inline">Add occasions to your wear logs to see patterns.</div>
                    )}

                    <h4 className="wt-analytics-card-title" style={{ marginTop: "var(--space-xl)" }}>☁️ Weather Distribution</h4>
                    {Object.keys(analytics.weatherCountMap).length > 0 ? (
                      <div className="wt-occasion-list">
                        {Object.entries(analytics.weatherCountMap)
                          .sort((a, b) => b[1] - a[1])
                          .map(([weather, count]) => (
                            <div key={weather} className="wt-occasion-item">
                              <span className="wt-occasion-name">{weather}</span>
                              <span className="wt-occasion-count">{count}</span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="wt-empty-inline">Log weather to see distribution.</div>
                    )}
                  </div>

                  {/* Unworn watches */}
                  {analytics.unwornWatches.length > 0 && (
                    <div className="wt-analytics-card warning">
                      <h4 className="wt-analytics-card-title">😴 Neglected Pieces</h4>
                      <p className="wt-analytics-card-desc">These watches haven&apos;t been worn yet. Give them some wrist time!</p>
                      <div className="wt-unworn-list">
                        {analytics.unwornWatches.map((w) => (
                          <div key={w.id} className="wt-unworn-item">
                            {w.image && <img src={w.image} alt="" className="wt-unworn-img" />}
                            <div>
                              <div className="wt-unworn-name">{w.brand} {w.model}</div>
                              <div className="wt-unworn-movement">{getMovementIcon(w.movement)} {w.movement}</div>
                            </div>
                            <button
                              className="wt-wear-now-btn"
                              onClick={() => {
                                setLogForm((f) => ({ ...f, watch_id: w.id, date: toDateKey(new Date()) }));
                                setShowLogModal(true);
                              }}
                            >
                              Wear Today
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── LOG MODAL ── */}
      {showLogModal && (
        <div className="wt-modal-overlay" onClick={() => setShowLogModal(false)}>
          <div className="wt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wt-modal-header">
              <h3>⌚ Log a Wear</h3>
              <button className="wt-modal-close" onClick={() => setShowLogModal(false)}>×</button>
            </div>
            <form onSubmit={handleLogSubmit} className="wt-modal-form">
              {/* Watch selector */}
              <div className="wt-form-group">
                <label className="wt-form-label">Which watch?</label>
                <div className="wt-watch-selector">
                  {watches.map((w) => (
                    <div
                      key={w.id}
                      className={`wt-watch-option ${logForm.watch_id === w.id ? "selected" : ""}`}
                      onClick={() => setLogForm((f) => ({ ...f, watch_id: w.id }))}
                    >
                      {w.image && <img src={w.image} alt="" className="wt-watch-option-img" />}
                      <div className="wt-watch-option-text">
                        <span className="wt-watch-option-brand">{w.brand}</span>
                        <span className="wt-watch-option-model">{w.model}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="wt-form-group">
                <label className="wt-form-label">Date</label>
                <input
                  type="date"
                  className="wt-form-input"
                  value={logForm.date}
                  onChange={(e) => setLogForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>

              {/* Occasion pills */}
              <div className="wt-form-group">
                <label className="wt-form-label">Occasion</label>
                <div className="wt-pill-grid">
                  {OCCASIONS.map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      className={`wt-pill ${logForm.occasion === occ ? "active" : ""}`}
                      onClick={() => setLogForm((f) => ({ ...f, occasion: f.occasion === occ ? "" : occ }))}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather pills */}
              <div className="wt-form-group">
                <label className="wt-form-label">Weather</label>
                <div className="wt-pill-grid">
                  {WEATHER_OPTIONS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      className={`wt-pill ${logForm.weather === w ? "active" : ""}`}
                      onClick={() => setLogForm((f) => ({ ...f, weather: f.weather === w ? "" : w }))}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="wt-form-group">
                <label className="wt-form-label">How did it feel today?</label>
                <div className="wt-rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`wt-star ${(logForm.rating || 0) >= star ? "filled" : ""}`}
                      onClick={() => setLogForm((f) => ({ ...f, rating: f.rating === star ? null : star }))}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Outfit notes */}
              <div className="wt-form-group">
                <label className="wt-form-label">Outfit Notes <span className="wt-optional">(optional)</span></label>
                <input
                  type="text"
                  className="wt-form-input"
                  placeholder="e.g., Navy suit with brown shoes"
                  value={logForm.outfit_notes}
                  onChange={(e) => setLogForm((f) => ({ ...f, outfit_notes: e.target.value }))}
                />
              </div>

              {/* Notes */}
              <div className="wt-form-group">
                <label className="wt-form-label">Notes <span className="wt-optional">(optional)</span></label>
                <textarea
                  className="wt-form-textarea"
                  placeholder="Any thoughts on wearing this watch today?"
                  value={logForm.notes}
                  onChange={(e) => setLogForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              <button type="submit" className="wt-submit-btn" disabled={submitting || !logForm.watch_id}>
                {submitting ? "Logging..." : "⌚ Log This Wear"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
