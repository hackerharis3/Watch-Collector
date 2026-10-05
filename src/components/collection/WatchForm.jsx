"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// -- Options (Imported or defined here)
const MOVEMENT_OPTIONS = ["Automatic", "Manual-Wind", "Quartz", "Tough Solar", "Kinetic", "Spring Drive", "Digital", "Eco-Drive"];
const TYPE_OPTIONS = ["Dress", "Sports", "Vintage", "Casual", "Fashion", "Diver", "Pilot", "Field", "Digital", "Retro", "Classic"];
const COMPLICATION_OPTIONS = ["None", "Date", "Day", "Chronograph", "Moon Phase", "Earth Phase", "24-Hour Display", "GMT", "Alarm", "World Time", "Timer", "Tachymeter", "Power Reserve"];
const FEATURE_OPTIONS = ["Lume", "Exhibition Back", "Rotating Bezel", "Bluetooth", "LED Backlight", "Sapphire Crystal", "Ceramic Bezel", "Quick-Release Strap"];
const OCCASION_OPTIONS = ["Formal", "Business Casual", "Casual", "Sports", "Outdoor", "Evening", "Travel"];
const CRYSTAL_OPTIONS = ["Sapphire", "Mineral", "Acrylic", "Hardlex", "Mineral (Domed)", "Sapphire (Domed)", "Bio-Sourced Glass"];
const MATERIAL_OPTIONS = ["Stainless Steel", "Titanium", "Gold", "Rose Gold", "Ceramic", "Carbon/Resin", "Resin", "Bio-Sourced Plastic", "Aluminium"];
const STATUS_OPTIONS = ["active", "sold", "gifted", "lost", "retired"];

const EMPTY_FORM = {
  // Basic
  brand: "", model: "", image: "", in_collection: true,
  // Categorization
  movement: "", caliber: "", type: [], complications: [], features: [], occasions: [],
  // Extended Specs
  case_diameter: "", case_material: "", crystal: "", water_resistance: "", lug_width: "", year: "",
  dial_color: "", strap_material: "", strap_color: "", case_back: "", case_shape: "", case_thickness: "", power_reserve: "", frequency: "", jewels: "", lug_to_lug: "",
  // Provenance
  purchase_price: "", purchase_date: "", purchase_from: "", current_value: "", serial_number: "", reference_number: "", condition: "", box_papers: "",
  // Rich Content
  notes: "", rating: 0, status: "active", sold_date: "", sold_price: "", photos: []
};

// Reusable Components
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
              fontFamily: "inherit"
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function CustomSelect({ options, value, onChange, name, placeholder = "— Select —" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt) => {
    // Mimic the event object for the parent's handleChange
    onChange({ target: { name, value: opt } });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%", background: "rgba(255,255,255,0.05)", border: isOpen ? "1px solid var(--clr-gold)" : "1px solid rgba(197,160,89,0.25)",
          borderRadius: "8px", padding: "10px 14px", color: value ? "var(--clr-text-primary)" : "var(--clr-text-muted)", fontSize: "0.92rem",
          outline: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.2s ease"
        }}
      >
        <span>{value || placeholder}</span>
        <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", color: "var(--clr-gold)", fontSize: "0.8rem" }}>▼</span>
      </button>

      {isOpen && (
        <div 
          style={{
            position: "absolute", top: "calc(100% + 8px)", left: 0, width: "100%", zIndex: 9999,
            background: "rgba(15, 20, 30, 0.4)", backdropFilter: "blur(32px) saturate(180%)", WebkitBackdropFilter: "blur(32px) saturate(180%)",
            border: "1px solid rgba(197, 160, 89, 0.2)", borderRadius: "12px", boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
            maxHeight: "220px", overflowY: "auto", overflowX: "hidden", padding: "8px", display: "flex", flexDirection: "column", gap: "4px"
          }}
          className="liquid-scrollbar"
        >
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              style={{
                width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: "8px", border: "none",
                background: value === opt ? "rgba(197, 160, 89, 0.2)" : "transparent",
                color: value === opt ? "var(--clr-gold)" : "var(--clr-text-primary)",
                fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (value !== opt) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (value !== opt) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", options }) {
  return (
    <div style={{ marginBottom: "var(--space-md)" }}>
      <label style={{ display: "block", color: "var(--clr-muted)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>{label}</label>
      {options ? (
        <CustomSelect name={name} value={value} onChange={onChange} options={options} />
      ) : (
        <input
          type={type} name={name} value={value || ""} onChange={onChange}
          style={{
            width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px", padding: "10px 14px", color: "var(--clr-text-primary)", fontSize: "0.92rem", outline: "none"
          }}
        />
      )}
    </div>
  );
}

function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: "var(--space-lg)", background: "rgba(255,255,255,0.02)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-lg)", overflow: "visible" }}>
      <button 
        type="button" 
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-md) var(--space-lg)", background: "rgba(255,255,255,0.02)", borderBottom: open ? "1px solid var(--clr-border)" : "none", borderTopLeftRadius: "var(--radius-lg)", borderTopRightRadius: "var(--radius-lg)", cursor: "pointer", border: "none" }}
      >
        <span style={{ fontFamily: "var(--font-heritage)", fontSize: "1.1rem", fontWeight: 600, color: "var(--clr-gold)" }}>{title}</span>
        <span style={{ color: "var(--clr-gold)", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>▼</span>
      </button>
      {open && <div style={{ padding: "var(--space-lg)" }}>{children}</div>}
    </div>
  );
}

function ImageGalleryUpload({ photos, onChange }) {
  const [newUrl, setNewUrl] = useState("");

  const handleAdd = () => {
    if (newUrl.trim() && !photos.includes(newUrl.trim())) {
      onChange([...photos, newUrl.trim()]);
      setNewUrl("");
    }
  };

  const handleRemove = (index) => {
    const updated = [...photos];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div style={{ marginTop: "var(--space-lg)", background: "rgba(255,255,255,0.02)", padding: "var(--space-md)", borderRadius: "8px", border: "1px solid var(--clr-border)" }}>
      <label style={{ display: "block", color: "var(--clr-muted)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Gallery Photos</label>
      <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "12px" }}>
        <input 
          type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)}
          placeholder="https://... (Add additional photo URLs)"
          style={{ flex: 1, minWidth: 0, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 12px", color: "var(--clr-text-primary)", fontSize: "0.85rem", outline: "none" }}
        />
        <button type="button" onClick={handleAdd} className="btn btn-primary" style={{ flexShrink: 0, whiteSpace: "nowrap", padding: "8px 16px", fontSize: "0.85rem" }}>Add</button>
      </div>
      
      {photos.length > 0 && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
          {photos.map((url, i) => (
            <div key={i} style={{ position: "relative", width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--clr-border)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Gallery ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button 
                type="button" 
                onClick={() => handleRemove(i)}
                style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WatchForm({ initialWatch, onSuccess, onCancel }) {
  const [form, setForm] = useState(() => {
    if (initialWatch) return { ...EMPTY_FORM, ...initialWatch };
    return EMPTY_FORM;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brand || !form.model) {
      setError("Brand and Model are required.");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const url = form._id || form.id ? `/api/collection/${form._id || form.id}` : "/api/collection";
      const method = form._id || form.id ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to save watch");
      if (onSuccess) onSuccess(data.watch);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "800px", margin: "0 auto", padding: "var(--space-xl) 0" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontFamily: "var(--font-heritage)", fontSize: "clamp(1.5rem, 5vw, 2rem)", color: "var(--clr-text-primary)", margin: 0 }}>
          {initialWatch ? "Edit Watch Passport" : "Add to Vault"}
        </h1>
        <div style={{ display: "flex", gap: "var(--space-md)" }}>
          <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Watch"}
          </button>
        </div>
      </div>

      {error && <div style={{ color: "var(--clr-danger)", marginBottom: "var(--space-md)", background: "rgba(248,113,113,0.1)", padding: "12px", borderRadius: "8px" }}>{error}</div>}

      <CollapsibleSection title="Core Information" defaultOpen={true}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-md)" }}>
          <Field label="Brand *" name="brand" value={form.brand} onChange={handleChange} />
          <Field label="Model *" name="model" value={form.model} onChange={handleChange} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-md)" }}>
          <Field label="Image URL (Primary Cover)" name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
          <Field label="Status" name="status" value={form.status} onChange={handleChange} options={STATUS_OPTIONS} />
        </div>
        
        <ImageGalleryUpload photos={form.photos || []} onChange={handleArrayChange("photos")} />

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginTop: "var(--space-md)", flexWrap: "wrap" }}>
          <input type="checkbox" id="in_collection" name="in_collection" checked={form.in_collection} onChange={e => setForm(prev => ({...prev, in_collection: e.target.checked}))} style={{ width: "16px", height: "16px", accentColor: "var(--clr-gold)" }} />
          <label htmlFor="in_collection" style={{ color: "var(--clr-text-primary)", fontSize: "0.9rem" }}>I currently own this watch (uncheck for Wishlist)</label>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Horological Identity" defaultOpen={true}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "var(--space-md)" }}>
          <Field label="Movement" name="movement" value={form.movement} onChange={handleChange} options={MOVEMENT_OPTIONS} />
          <Field label="Caliber" name="caliber" value={form.caliber} onChange={handleChange} />
          <Field label="Year" name="year" value={form.year} onChange={handleChange} placeholder="e.g. 2024 or 1990s" />
        </div>
        <MultiSelect label="Watch Types" options={TYPE_OPTIONS} value={form.type} onChange={handleArrayChange("type")} />
        <MultiSelect label="Complications" options={COMPLICATION_OPTIONS} value={form.complications} onChange={handleArrayChange("complications")} />
        <MultiSelect label="Ideal Occasions" options={OCCASION_OPTIONS} value={form.occasions} onChange={handleArrayChange("occasions")} />
      </CollapsibleSection>

      <CollapsibleSection title="Technical Specifications">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-md)" }}>
          <Field label="Case Diameter" name="case_diameter" value={form.case_diameter} onChange={handleChange} placeholder="e.g. 40mm" />
          <Field label="Case Material" name="case_material" value={form.case_material} onChange={handleChange} options={MATERIAL_OPTIONS} />
          <Field label="Crystal" name="crystal" value={form.crystal} onChange={handleChange} options={CRYSTAL_OPTIONS} />
          
          <Field label="Case Thickness" name="case_thickness" value={form.case_thickness} onChange={handleChange} placeholder="e.g. 12mm" />
          <Field label="Lug-to-Lug" name="lug_to_lug" value={form.lug_to_lug} onChange={handleChange} placeholder="e.g. 48mm" />
          <Field label="Lug Width" name="lug_width" value={form.lug_width} onChange={handleChange} placeholder="e.g. 20mm" />
          
          <Field label="Dial Color" name="dial_color" value={form.dial_color} onChange={handleChange} />
          <Field label="Water Resistance" name="water_resistance" value={form.water_resistance} onChange={handleChange} placeholder="e.g. 200m" />
          <Field label="Power Reserve" name="power_reserve" value={form.power_reserve} onChange={handleChange} placeholder="e.g. 72h" />
          
          <Field label="Strap Material" name="strap_material" value={form.strap_material} onChange={handleChange} />
          <Field label="Strap Color" name="strap_color" value={form.strap_color} onChange={handleChange} />
        </div>
        <MultiSelect label="Special Features" options={FEATURE_OPTIONS} value={form.features} onChange={handleArrayChange("features")} />
      </CollapsibleSection>

      <CollapsibleSection title="Provenance & Value">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-md)" }}>
          <Field label="Reference Number" name="reference_number" value={form.reference_number} onChange={handleChange} />
          <Field label="Serial Number" name="serial_number" value={form.serial_number} onChange={handleChange} />
          
          <Field label="Purchase Price" name="purchase_price" value={form.purchase_price} type="number" onChange={handleChange} />
          <Field label="Current Value" name="current_value" value={form.current_value} type="number" onChange={handleChange} />
          
          <Field label="Purchase Date" name="purchase_date" value={form.purchase_date} type="date" onChange={handleChange} />
          <Field label="Purchased From" name="purchase_from" value={form.purchase_from} onChange={handleChange} />
          
          <Field label="Condition" name="condition" value={form.condition} onChange={handleChange} options={["Mint", "Excellent", "Good", "Fair", "Poor"]} />
          <Field label="Box & Papers" name="box_papers" value={form.box_papers} onChange={handleChange} options={["Full Set", "Box Only", "Papers Only", "None"]} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Personal Notes & Journal">
        <div style={{ marginBottom: "var(--space-md)" }}>
          <label style={{ display: "block", color: "var(--clr-muted)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Personal Notes</label>
          <textarea 
            name="notes" value={form.notes} onChange={handleChange} rows={4}
            style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px", color: "var(--clr-text-primary)", fontSize: "0.92rem", outline: "none", resize: "vertical" }}
            placeholder="Write the story of this watch..."
          />
        </div>
        <div style={{ marginBottom: "var(--space-md)" }}>
          <label style={{ display: "block", color: "var(--clr-muted)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Personal Rating (1-5)</label>
          <input 
            type="number" name="rating" min="1" max="5" value={form.rating || ""} onChange={handleChange}
            style={{ width: "100px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px", color: "var(--clr-text-primary)", fontSize: "0.92rem", outline: "none" }}
          />
        </div>
      </CollapsibleSection>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-md)", marginTop: "var(--space-2xl)" }}>
        <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Watch"}
        </button>
      </div>
    </form>
  );
}
