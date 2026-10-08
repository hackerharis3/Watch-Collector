import Link from "next/link";

export default function WatchCard({ watch, onClick }) {
  // Extract fields gracefully
  const {
    id,
    brand,
    model,
    movement,
    image,
    year,
    case_diameter,
    water_resistance,
    crystal,
    caliber,
    in_collection,
    type = [],
    complications = [],
  } = watch;

  // Use dummy image if none is provided
  const imageUrl = image || "/images/watch_sports_gshock.png"; // Ensure absolute path for next/image/link stability
  
  // Icon helper
  const getMovementIcon = (mov) => {
    if (!mov) return "⏱️";
    const m = mov.toLowerCase();
    if (m.includes("manual")) return "⚙️";
    if (m.includes("auto")) return "🔄";
    if (m.includes("quartz")) return "⚡";
    if (m.includes("solar") || m.includes("eco")) return "☀️";
    return "⏱️";
  };

  // We wrap in Link but keep onClick for backward compatibility if needed, 
  // but preferably just use Link.
  return (
    <Link 
      href={`/collection/${id}`}
      className="watch-card animate-in visible"
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <div className="watch-card-image">
        {/* We use a standard img tag for simplicity, mapping to vanilla CSS */}
        <img src={imageUrl} alt={`${brand} ${model}`} loading="lazy" />
        <span className="watch-card-badge">{movement || "Unknown"}</span>
        <span
          className={`watch-card-status ${in_collection ? "owned" : "wishlist"}`}
          title={in_collection ? "In Collection" : "Wishlist"}
        ></span>
      </div>
      <div className="watch-card-body">
        <div className="watch-card-brand">{brand}</div>
        <div className="watch-card-model">{model}</div>
        <div className="watch-card-movement">
          <span className="icon">{getMovementIcon(movement)}</span>
          {movement} · {year || "Unknown Year"}
        </div>
        <div className="watch-card-specs">
          <div className="spec-item">
            <span className="spec-label">Case</span>
            <span className="spec-value">{case_diameter || "-"}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Water Res.</span>
            <span className="spec-value">{water_resistance || "-"}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Crystal</span>
            <span className="spec-value">{crystal || "-"}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Caliber</span>
            <span className="spec-value">{caliber || "-"}</span>
          </div>
        </div>
        <div className="watch-card-tags">
          {(Array.isArray(type) ? type : typeof type === 'string' ? [type] : []).map((t, idx) => (
            <span key={idx} className="tag gold">
              {t}
            </span>
          ))}
          {(Array.isArray(complications) ? complications : typeof complications === 'string' ? [complications] : []).slice(0, 2).map((c, idx) => (
            <span key={`comp-${idx}`} className="tag">
              {c}
            </span>
          ))}
        </div>
      </div>
      
      {in_collection && (
        <div style={{ padding: "0 var(--space-lg) var(--space-lg)" }}>
          <button
            onClick={async (e) => {
              e.preventDefault(); // Prevent link navigation
              const btn = e.target;
              const originalText = btn.innerHTML;
              btn.innerHTML = "Logging...";
              btn.disabled = true;
              try {
                const res = await fetch("/api/wear-log", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    watch_id: id,
                    date: new Date().toISOString(),
                  }),
                });
                if (res.ok) {
                  btn.innerHTML = "✅ Logged";
                  btn.style.borderColor = "var(--clr-success)";
                  btn.style.color = "var(--clr-success)";
                  setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.borderColor = "";
                    btn.style.color = "";
                  }, 2000);
                } else {
                  btn.innerHTML = "❌ Failed";
                  btn.disabled = false;
                }
              } catch (err) {
                btn.innerHTML = "❌ Error";
                btn.disabled = false;
              }
            }}
            className="watch-card-wear-btn"
            style={{
              width: "100%",
              padding: "8px",
              background: "rgba(197, 160, 89, 0.1)",
              border: "1px solid rgba(197, 160, 89, 0.3)",
              borderRadius: "4px",
              color: "var(--clr-gold)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              cursor: "pointer",
              transition: "var(--transition-fast)",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "var(--clr-gold-glow)";
              e.target.style.borderColor = "var(--clr-gold)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "rgba(197, 160, 89, 0.1)";
              e.target.style.borderColor = "rgba(197, 160, 89, 0.3)";
            }}
          >
            ⌚ Wear Today
          </button>
        </div>
      )}
    </Link>
  );
}
