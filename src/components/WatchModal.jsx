import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function WatchModal({ watch, onClose, onDelete, onEdit }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (watch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [watch]);

  if (!watch || !mounted) return null;

  return createPortal(
    <div
      className="modal-overlay open"
      onClick={onClose}
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div
        className="modal open"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <button 
          className="modal-edit-btn" 
          onClick={() => {
            if (onEdit) {
              onEdit(watch);
              onClose();
            }
          }} 
          style={{ 
            position: "absolute", 
            top: "var(--space-md)", 
            right: "70px", 
            background: "rgba(3, 7, 18, 0.85)", 
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(197, 160, 89, 0.4)", 
            color: "var(--clr-gold)", 
            padding: "6px 14px",
            borderRadius: "var(--radius-full)",
            cursor: "pointer", 
            fontSize: "0.8rem", 
            fontWeight: "600",
            fontFamily: "inherit",
            zIndex: 10,
            transition: "all 0.2s",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
          onMouseOver={(e) => {
            e.target.style.background = "rgba(197, 160, 89, 0.15)";
            e.target.style.borderColor = "var(--clr-gold)";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(3, 7, 18, 0.85)";
            e.target.style.borderColor = "rgba(197, 160, 89, 0.4)";
            e.target.style.transform = "none";
          }}
        >
          ✎ Edit
        </button>

        <div className="modal-image">
          <img src={watch.image || "images/watch_sports_gshock.png"} alt={`${watch.brand} ${watch.model}`} />
        </div>
        
        <div className="modal-body">
          <div className="modal-brand">{watch.brand}</div>
          <div className="modal-model">{watch.model}</div>

          <div className="modal-specs-grid">
            <div className="modal-spec">
              <div className="modal-spec-label">Movement</div>
              <div className="modal-spec-value">{watch.movement}</div>
            </div>
            <div className="modal-spec">
              <div className="modal-spec-label">Caliber</div>
              <div className="modal-spec-value">{watch.caliber}</div>
            </div>
            <div className="modal-spec">
              <div className="modal-spec-label">Case</div>
              <div className="modal-spec-value">{watch.case_diameter}</div>
            </div>
            <div className="modal-spec">
              <div className="modal-spec-label">Material</div>
              <div className="modal-spec-value">{watch.case_material}</div>
            </div>
            <div className="modal-spec">
              <div className="modal-spec-label">Crystal</div>
              <div className="modal-spec-value">{watch.crystal}</div>
            </div>
            <div className="modal-spec">
              <div className="modal-spec-label">Water Res.</div>
              <div className="modal-spec-value">{watch.water_resistance}</div>
            </div>
            <div className="modal-spec">
              <div className="modal-spec-label">Lug Width</div>
              <div className="modal-spec-value">{watch.lug_width}</div>
            </div>
            <div className="modal-spec">
              <div className="modal-spec-label">Year</div>
              <div className="modal-spec-value">{watch.year}</div>
            </div>
            <div className="modal-spec">
              <div className="modal-spec-label">Status</div>
              <div
                className="modal-spec-value"
                style={{
                  color: watch.in_collection ? "var(--clr-success)" : "var(--clr-warning)",
                }}
              >
                {watch.in_collection ? "● Owned" : "○ Wishlist"}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "var(--space-lg)" }}>
            <div className="spec-label" style={{ marginBottom: "var(--space-sm)" }}>
              Complications
            </div>
            <div className="watch-card-tags">
              {watch.complications && (Array.isArray(watch.complications) ? watch.complications : [watch.complications]).length > 0 ? (
                (Array.isArray(watch.complications) ? watch.complications : [watch.complications]).map((c, idx) => (
                  <span key={idx} className="tag">
                    {c}
                  </span>
                ))
              ) : (
                <span className="tag">None</span>
              )}
            </div>
          </div>

          <div style={{ marginTop: "var(--space-md)" }}>
            <div className="spec-label" style={{ marginBottom: "var(--space-sm)" }}>
              Features
            </div>
            <div className="watch-card-tags">
              {watch.features && (Array.isArray(watch.features) ? watch.features : [watch.features]).map((f, idx) => (
                <span key={idx} className="tag gold">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "var(--space-md)" }}>
            <div className="spec-label" style={{ marginBottom: "var(--space-sm)" }}>
              Best For
            </div>
            <div className="watch-card-tags">
              {watch.occasions && (Array.isArray(watch.occasions) ? watch.occasions : [watch.occasions]).map((o, idx) => (
                <span key={idx} className="tag">
                  {o}
                </span>
              ))}
            </div>
          </div>

          {/* Delete Button */}
          <div style={{ marginTop: "var(--space-xl)", textAlign: "center", borderTop: "1px solid var(--clr-border)", paddingTop: "var(--space-md)" }}>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to permanently delete this watch?")) {
                  onDelete(watch.id);
                  onClose();
                }
              }}
              style={{
                background: "rgba(255, 0, 0, 0.1)",
                color: "#ff4d4d",
                border: "1px solid rgba(255, 0, 0, 0.3)",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => (e.target.style.background = "rgba(255, 0, 0, 0.2)")}
              onMouseOut={(e) => (e.target.style.background = "rgba(255, 0, 0, 0.1)")}
            >
              🗑️ Delete Permanently
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
