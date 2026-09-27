"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const MOVEMENT_OPTIONS = ["Automatic", "Manual-Wind", "Quartz", "Tough Solar", "Kinetic", "Spring Drive", "Digital", "Eco-Drive"];
const TYPE_OPTIONS = ["Dress", "Sports", "Vintage", "Casual", "Fashion", "Diver", "Pilot", "Field", "Digital", "Retro", "Classic"];
const COMPLICATION_OPTIONS = ["Date", "Day", "Chronograph", "Moon Phase", "GMT", "Alarm", "World Time", "Timer", "Tachymeter", "Power Reserve"];
const FEATURE_OPTIONS = ["Lume", "Exhibition Back", "Rotating Bezel", "Bluetooth", "LED Backlight", "Sapphire Crystal", "Ceramic Bezel", "Quick-Release Strap"];
const OCCASION_OPTIONS = ["Formal", "Business Casual", "Casual", "Sports", "Outdoor", "Evening", "Travel"];
const CRYSTAL_OPTIONS = ["Sapphire", "Mineral", "Acrylic", "Hardlex", "Mineral (Domed)", "Sapphire (Domed)"];
const MATERIAL_OPTIONS = ["Stainless Steel", "Titanium", "Gold", "Rose Gold", "Ceramic", "Carbon/Resin", "Resin", "Bio-Sourced Plastic", "Aluminium"];

function MultiSelect({ options, value, onChange, label }) {
  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div style={{ marginBottom: "var(--space-md)" }}>
      <label style={{ display: "block", color: "var(--clr-muted)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              border: value.includes(opt) ? "1px solid var(--clr-gold)" : "1px solid rgba(255,255,255,0.12)",
              background: value.includes(opt) ? "rgba(197,160,89,0.18)" : "rgba(255,255,255,0.04)",
              color: value.includes(opt) ? "var(--clr-gold)" : "var(--clr-muted)",
              fontSize: "0.78rem",
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "inherit",
              fontWeight: value.includes(opt) ? 600 : 400,
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, type = "text", options }) {
  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(197,160,89,0.25)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "var(--clr-text)",
    fontSize: "0.92rem",
    fontFamily: "inherit",
    outline: "none",
    transition: "border 0.2s",
    boxSizing: "border-box",
  };
  return (
    <div style={{ marginBottom: "var(--space-md)" }}>
      <label style={{ display: "block", color: "var(--clr-muted)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>{label}</label>
      {options ? (
        <select name={name} value={value} onChange={onChange} style={{ ...inputStyle, cursor: "pointer" }}>
          <option value="">— Select —</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "var(--clr-gold)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(197,160,89,0.25)")}
        />
      )}
    </div>
  );
}

const EMPTY_FORM = {
  brand: "", model: "", movement: "", caliber: "",
  type: [], complications: [], features: [], occasions: [],
  in_collection: true, image: "",
  case_diameter: "", case_material: "", crystal: "",
  water_resistance: "", lug_width: "", year: "",
};

export default function AddWatchModal({ open, onClose, onAdd, onEdit, initialWatch }) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState(initialWatch || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      if (initialWatch) {
        setForm({
          ...initialWatch,
          type: Array.isArray(initialWatch.type) ? initialWatch.type : (initialWatch.type ? [initialWatch.type] : []),
          complications: Array.isArray(initialWatch.complications) ? initialWatch.complications : (initialWatch.complications ? [initialWatch.complications] : []),
          features: Array.isArray(initialWatch.features) ? initialWatch.features : (initialWatch.features ? [initialWatch.features] : []),
          occasions: Array.isArray(initialWatch.occasions) ? initialWatch.occasions : (initialWatch.occasions ? [initialWatch.occasions] : []),
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setError("");
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, initialWatch]);

  if (!open || !mounted) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const setMulti = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brand.trim() || !form.model.trim()) {
      setError("Brand and Model are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (initialWatch) {
        const res = await fetch(`/api/collection/${initialWatch.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to update");
        if (onEdit) onEdit(data.watch);
      } else {
        const res = await fetch("/api/collection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to save");
        if (onAdd) onAdd(data.watch);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const IMAGE_OPTIONS = [
    { label: "Dress / Classic", value: "images/watch_dress_classic.png" },
    { label: "Sports / G-Shock", value: "images/watch_sports_gshock.png" },
    { label: "Casual / Swatch", value: "images/watch_casual_swatch.png" },
    { label: "Orient / Bambino", value: "images/watch_orient_bambino.png" },
    { label: "Digital / Retro", value: "images/watch_digital_retro.png" },
    { label: "Diver / Automatic", value: "images/watch_automatic_diver.png" },
  ];

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 9000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, rgba(10,14,26,0.97) 0%, rgba(15,20,35,0.97) 100%)",
          border: "1px solid rgba(197,160,89,0.3)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(197,160,89,0.1)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: "1px solid rgba(197,160,89,0.15)",
          position: "sticky", top: 0,
          background: "rgba(10,14,26,0.97)",
          zIndex: 2,
          borderRadius: "16px 16px 0 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--clr-gold)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
                {initialWatch ? "✦ Edit Watch" : "✦ Add to Vault"}
              </div>
              <h2 style={{ margin: 0, fontSize: "1.4rem", fontFamily: "var(--font-serif, Georgia)", color: "var(--clr-text)" }}>
                {initialWatch ? "Update Timepiece" : "New Timepiece"}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer",
                color: "var(--clr-muted)", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", fontFamily: "inherit",
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,0,0,0.15)"; e.currentTarget.style.color = "#ff6b6b"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "var(--clr-muted)"; }}
            >✕</button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px 28px 28px" }}>
          {/* Basic */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <Field label="Brand *" name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Seiko" />
            <Field label="Model *" name="model" value={form.model} onChange={handleChange} placeholder="e.g. Presage" />
            <Field label="Movement" name="movement" value={form.movement} onChange={handleChange} options={MOVEMENT_OPTIONS} />
            <Field label="Caliber / Module" name="caliber" value={form.caliber} onChange={handleChange} placeholder="e.g. 4R35" />
            <Field label="Case Diameter" name="case_diameter" value={form.case_diameter} onChange={handleChange} placeholder="e.g. 40mm" />
            <Field label="Case Material" name="case_material" value={form.case_material} onChange={handleChange} options={MATERIAL_OPTIONS} />
            <Field label="Crystal" name="crystal" value={form.crystal} onChange={handleChange} options={CRYSTAL_OPTIONS} />
            <Field label="Water Resistance" name="water_resistance" value={form.water_resistance} onChange={handleChange} placeholder="e.g. 100m" />
            <Field label="Lug Width" name="lug_width" value={form.lug_width} onChange={handleChange} placeholder="e.g. 20mm" />
            <Field label="Year / Era" name="year" value={form.year} onChange={handleChange} placeholder="e.g. 2023" />
          </div>

          {/* Status */}
          <div style={{ marginBottom: "var(--space-md)", display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={{ color: "var(--clr-muted)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Status</label>
            <div style={{ display: "flex", gap: "10px" }}>
              {[{ label: "✅ Owned", val: true }, { label: "🕐 Wishlist", val: false }].map(({ label, val }) => (
                <button
                  key={label} type="button"
                  onClick={() => setForm((prev) => ({ ...prev, in_collection: val }))}
                  style={{
                    padding: "6px 16px", borderRadius: "20px",
                    border: form.in_collection === val ? "1px solid var(--clr-gold)" : "1px solid rgba(255,255,255,0.12)",
                    background: form.in_collection === val ? "rgba(197,160,89,0.18)" : "rgba(255,255,255,0.04)",
                    color: form.in_collection === val ? "var(--clr-gold)" : "var(--clr-muted)",
                    fontSize: "0.82rem", cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                    fontWeight: form.in_collection === val ? 600 : 400,
                  }}
                >{label}</button>
              ))}
            </div>
          </div>

          {/* Image picker */}
          <div style={{ marginBottom: "var(--space-md)" }}>
            <label style={{ display: "block", color: "var(--clr-muted)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Watch Photo</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {IMAGE_OPTIONS.map(({ label, value }) => (
                <div
                  key={value}
                  onClick={() => setForm((prev) => ({ ...prev, image: value }))}
                  style={{
                    borderRadius: "10px", overflow: "hidden", cursor: "pointer",
                    border: form.image === value ? "2px solid var(--clr-gold)" : "2px solid rgba(255,255,255,0.08)",
                    position: "relative", aspectRatio: "1",
                    transition: "border 0.2s",
                    boxShadow: form.image === value ? "0 0 12px rgba(197,160,89,0.3)" : "none",
                  }}
                >
                  <img src={value} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: form.image === value ? "rgba(197,160,89,0.1)" : "rgba(0,0,0,0.3)",
                    display: "flex", alignItems: "flex-end", justifyContent: "center",
                    padding: "6px",
                  }}>
                    <span style={{ fontSize: "0.65rem", color: "#fff", textAlign: "center", lineHeight: 1.2 }}>{label}</span>
                  </div>
                  {form.image === value && (
                    <div style={{ position: "absolute", top: "6px", right: "6px", background: "var(--clr-gold)", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", color: "black", fontWeight: "bold" }}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Multi selects */}
          <MultiSelect label="Watch Type" options={TYPE_OPTIONS} value={form.type} onChange={setMulti("type")} />
          <MultiSelect label="Complications" options={COMPLICATION_OPTIONS} value={form.complications} onChange={setMulti("complications")} />
          <MultiSelect label="Features" options={FEATURE_OPTIONS} value={form.features} onChange={setMulti("features")} />
          <MultiSelect label="Best For (Occasions)" options={OCCASION_OPTIONS} value={form.occasions} onChange={setMulti("occasions")} />

          {error && (
            <div style={{ color: "#ff6b6b", background: "rgba(255,0,0,0.08)", border: "1px solid rgba(255,0,0,0.2)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "0.88rem" }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              padding: "14px",
              background: saving ? "rgba(197,160,89,0.4)" : "linear-gradient(135deg, #c5a059 0%, #e8c97a 50%, #c5a059 100%)",
              color: "black",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: saving ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              letterSpacing: "0.04em",
              transition: "all 0.2s",
              boxShadow: saving ? "none" : "0 4px 20px rgba(197,160,89,0.4)",
            }}
            onMouseOver={(e) => { if (!saving) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "none"; }}
          >
            {saving ? "⏳ Saving..." : initialWatch ? "💾 Save Changes" : "⌚ Add to Vault"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}