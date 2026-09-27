"use client";
import React, { useState, useEffect, useMemo } from "react";
import WatchCard from "./WatchCard";
import WatchModal from "./WatchModal";
import AddWatchModal from "./AddWatchModal";

export default function GallerySection() {
  const [watches, setWatches] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState(""); // "synced" | "error" | ""

  // Fetch watches from MongoDB (works on ALL devices)
  useEffect(() => {
    const fetchWatches = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/collection");
        const data = await res.json();
        if (data.success) {
          setWatches(data.watches);
          setSyncStatus("synced");
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        console.error("Failed to load watches:", err);
        setSyncStatus("error");
      } finally {
        setLoading(false);
      }
    };
    fetchWatches();
  }, []);

  // Add a watch (received from AddWatchModal after API call succeeds)
  const handleAdd = (newWatch) => {
    setWatches((prev) => [...prev, newWatch]);
    setSyncStatus("synced");
  };

  // Delete via API
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/collection/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setWatches((prev) => prev.filter((w) => w.id !== id));
      } else {
        alert("Failed to delete: " + data.error);
      }
    } catch (err) {
      alert("Failed to delete watch: " + err.message);
    }
  };

  const filteredWatches = useMemo(() => {
    if (!watches) return [];
    if (filter === "all") return watches;
    if (filter === "owned") return watches.filter((w) => w.in_collection);
    if (filter === "wishlist") return watches.filter((w) => !w.in_collection);

    return watches.filter((w) => {
      let typeMatch = false;
      if (Array.isArray(w.type)) {
        typeMatch = w.type.some((t) => t && typeof t === "string" && t.toLowerCase().includes(filter.toLowerCase()));
      } else if (typeof w.type === "string") {
        typeMatch = w.type.toLowerCase().includes(filter.toLowerCase());
      }
      const movementMatch = w.movement && typeof w.movement === "string" && w.movement.toLowerCase().includes(filter.toLowerCase());
      return typeMatch || movementMatch;
    });
  }, [watches, filter]);

  const stats = useMemo(() => {
    const total = watches.filter((w) => w.in_collection).length;
    const wishlist = watches.filter((w) => !w.in_collection).length;
    const brands = new Set(watches.map((w) => w.brand)).size;
    const movements = new Set(watches.map((w) => w.movement)).size;
    return { total, wishlist, brands, movements };
  }, [watches]);

  return (
    <section className="section" id="gallery">
      <div className="container">
        <div className="section-header animate-in visible">
          <div className="section-tag">Collection</div>
          <h2 className="section-title">
            The Digital <span className="gold">Vault Gallery</span>
          </h2>
          <p className="section-desc">
            High-resolution showcase of every timepiece with precise horological specifications.
            {syncStatus === "synced" && (
              <span style={{ marginLeft: "10px", color: "#4ade80", fontSize: "0.8rem", fontWeight: 600 }}>
                ☁️ Synced across all your devices
              </span>
            )}
            {syncStatus === "error" && (
              <span style={{ marginLeft: "10px", color: "#f87171", fontSize: "0.8rem" }}>
                ⚠️ Could not connect to database
              </span>
            )}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar animate-in visible">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">In Collection</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.wishlist}</div>
            <div className="stat-label">Wishlist</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.brands}</div>
            <div className="stat-label">Brands</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.movements}</div>
            <div className="stat-label">Movements</div>
          </div>
        </div>

        {/* Filters */}
        <div className="gallery-filters animate-in visible">
          {[
            { id: "all", label: "All Pieces" },
            { id: "owned", label: "Owned" },
            { id: "wishlist", label: "Wishlist" },
            { id: "dress", label: "Dress" },
            { id: "sports", label: "Sports" },
            { id: "vintage", label: "Vintage" },
            { id: "automatic", label: "Automatic" },
            { id: "quartz", label: "Quartz" },
          ].map((f) => (
            <button
              key={f.id}
              className={`filter-btn ${filter === f.id ? "active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
          <button
            className="filter-btn"
            style={{ background: "var(--clr-gold)", color: "black", fontWeight: "bold" }}
            onClick={() => setShowAddModal(true)}
          >
            + Add Watch
          </button>
        </div>

        {/* Watch Grid */}
        <div className="gallery-grid" id="gallery-grid">
          {loading ? (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
              <div className="empty-state-icon" style={{ animation: "spin 1.2s linear infinite", display: "inline-block" }}>⌚</div>
              <div className="empty-state-text">Loading your vault...</div>
            </div>
          ) : filteredWatches.length > 0 ? (
            filteredWatches.map((watch) => (
              <WatchCard
                key={watch.id}
                watch={watch}
                onClick={(w) => setSelectedWatch(w)}
              />
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
              <div className="empty-state-icon">⌚</div>
              <div className="empty-state-text">No watches match this filter</div>
            </div>
          )}
        </div>
      </div>

      {/* Watch Detail Modal */}
      <WatchModal
        watch={selectedWatch}
        onClose={() => setSelectedWatch(null)}
        onDelete={handleDelete}
      />

      {/* Add Watch Modal */}
      <AddWatchModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />
    </section>
  );
}