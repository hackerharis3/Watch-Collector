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
    </Link>
  );
}
