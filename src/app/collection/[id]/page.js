import React from "react";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import { CollectionWatch } from "@/models/CollectionWatch";
import DeleteButton from "@/components/DeleteButton";
import PhotoGallery from "@/components/collection/PhotoGallery";

import mongoose from "mongoose";

// Fetch watch directly via Mongoose since this is a server component
async function getWatch(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await dbConnect();
  const watch = await CollectionWatch.findById(id).lean();
  if (!watch) return null;
  const { _id, __v, ...rest } = watch;
  return { ...rest, id: _id.toString() };
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const watch = await getWatch(id);
  if (!watch) return { title: "Watch Not Found" };
  return {
    title: `${watch.brand} ${watch.model} | Horological Vault`,
  };
}

export default async function WatchPassportPage({ params }) {
  const { id } = await params;
  const watch = await getWatch(id);

  if (!watch) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: "center", paddingTop: "5rem" }}>
          <h2>Watch Not Found</h2>
          <Link href="/collection" className="btn btn-primary" style={{ marginTop: "1rem" }}>Return to Vault</Link>
        </div>
      </div>
    );
  }

  // Format helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="passport-page">
      <div className="passport-hero" style={{ 
        position: "relative", 
        width: "100%", 
        minHeight: "40vh",
        display: "flex",
        alignItems: "flex-end",
        padding: "3rem",
        background: `linear-gradient(to top, var(--clr-bg-deep) 10%, transparent 100%), url(${watch.image || '/images/default_watch_bg.jpg'}) center/cover no-repeat`
      }}>
        <Link href="/collection" className="btn-back">← Back to Vault</Link>
        <div className="passport-header-content">
          <div className="section-tag" style={{ marginBottom: "0.5rem" }}>{watch.in_collection ? 'In Vault' : 'Wishlist'}</div>
          <h1 className="passport-title" style={{ fontFamily: "var(--font-heritage)", fontSize: "3rem", fontWeight: 700, margin: 0 }}>
            {watch.brand} <span className="gold">{watch.model}</span>
          </h1>
          <p className="passport-subtitle" style={{ fontSize: "1.2rem", color: "var(--clr-text-secondary)", marginTop: "0.5rem" }}>
            {watch.year && `${watch.year} • `} {watch.movement} {watch.caliber && `(${watch.caliber})`}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "3rem 1rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="passport-grid" style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          alignItems: "start"
        }}>
          
          {/* Left Column: Details & Specs */}
          <div className="passport-main">
            <PhotoGallery photos={watch.photos} />
            
            {/* Core Specifications */}
            <section className="passport-section animate-in visible">
              <h2 className="section-title" style={{ fontSize: "1.5rem", borderBottom: "1px solid var(--clr-border)", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
                Horological Specifications
              </h2>
              <div className="specs-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "1.5rem"
              }}>
                <SpecItem label="Case Diameter" value={watch.case_diameter} />
                <SpecItem label="Case Thickness" value={watch.case_thickness} />
                <SpecItem label="Lug-to-Lug" value={watch.lug_to_lug} />
                <SpecItem label="Lug Width" value={watch.lug_width} />
                <SpecItem label="Case Material" value={watch.case_material} />
                <SpecItem label="Dial Color" value={watch.dial_color} />
                <SpecItem label="Crystal" value={watch.crystal} />
                <SpecItem label="Water Resistance" value={watch.water_resistance} />
                <SpecItem label="Movement Type" value={watch.movement} />
                <SpecItem label="Caliber" value={watch.caliber} />
                <SpecItem label="Power Reserve" value={watch.power_reserve} />
                <SpecItem label="Strap Material" value={watch.strap_material} />
              </div>
            </section>

            {/* Passport & Provenance */}
            <section className="passport-section animate-in visible" style={{ marginTop: "3rem" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", borderBottom: "1px solid var(--clr-border)", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
                Provenance & History
              </h2>
              <div className="specs-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "1.5rem"
              }}>
                <SpecItem label="Reference No." value={watch.reference_number} />
                <SpecItem label="Serial No." value={watch.serial_number} />
                <SpecItem label="Acquisition Date" value={formatDate(watch.purchase_date)} />
                <SpecItem label="Purchased From" value={watch.purchase_from} />
                <SpecItem label="Purchase Price" value={watch.purchase_price ? `$${watch.purchase_price.toLocaleString()}` : "—"} />
                <SpecItem label="Current Value" value={watch.current_value ? `$${watch.current_value.toLocaleString()}` : "—"} />
                <SpecItem label="Condition" value={watch.condition} />
                <SpecItem label="Box & Papers" value={watch.box_papers} />
              </div>

              {/* Service History */}
              <div style={{ marginTop: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontFamily: "var(--font-mono)", color: "var(--clr-text-secondary)", marginBottom: "1rem" }}>Service Log</h3>
                {watch.service_history && watch.service_history.length > 0 ? (
                  <ul className="service-log">
                    {watch.service_history.map((srv, idx) => (
                      <li key={idx} style={{ 
                        padding: "1rem", 
                        background: "var(--glass-bg)", 
                        borderLeft: "2px solid var(--clr-gold)",
                        marginBottom: "0.5rem",
                        borderRadius: "0 8px 8px 0"
                      }}>
                        <div style={{ fontSize: "0.85rem", color: "var(--clr-gold)", marginBottom: "0.25rem" }}>{formatDate(srv.date)}</div>
                        <div style={{ fontSize: "1rem" }}>{srv.notes}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ padding: "1rem", background: "var(--glass-bg)", borderRadius: "8px", color: "var(--clr-text-muted)", fontStyle: "italic" }}>
                    No service history recorded.
                  </div>
                )}
              </div>
              {/* Personal Notes */}
              <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid var(--clr-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontFamily: "var(--font-mono)", color: "var(--clr-text-secondary)" }}>Personal Notes</h3>
                  {watch.rating ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--clr-gold)" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ opacity: i < watch.rating ? 1 : 0.3 }}>★</span>
                      ))}
                    </div>
                  ) : null}
                </div>
                {watch.notes ? (
                  <p style={{ lineHeight: 1.6, color: "var(--clr-text-primary)", background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--clr-border)", whiteSpace: "pre-wrap" }}>
                    {watch.notes}
                  </p>
                ) : (
                  <div style={{ padding: "1rem", background: "var(--glass-bg)", borderRadius: "8px", color: "var(--clr-text-muted)", fontStyle: "italic" }}>
                    No personal notes recorded.
                  </div>
                )}
              </div>
            </section>

            {/* Memories */}
            <section className="passport-section animate-in visible" style={{ marginTop: "3rem" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", borderBottom: "1px solid var(--clr-border)", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
                Memories & Milestones
              </h2>
              {watch.memories && watch.memories.length > 0 ? (
                <div className="memories-list" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {watch.memories.map((mem, idx) => (
                    <div key={idx} className="memory-card" style={{
                      padding: "1.5rem",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--clr-border)",
                      borderRadius: "12px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ color: "var(--clr-gold)", fontWeight: 600 }}>{formatDate(mem.date)}</span>
                        <span style={{ color: "var(--clr-text-muted)", fontSize: "0.85rem" }}>📍 {mem.location || "Unknown"}</span>
                      </div>
                      <p style={{ lineHeight: 1.6, color: "var(--clr-text-secondary)" }}>{mem.story}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "2rem", textAlign: "center", border: "1px dashed var(--clr-border)", borderRadius: "12px", color: "var(--clr-text-muted)" }}>
                  No memories recorded for this timepiece yet.
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Taxonomy & Actions */}
          <div className="passport-sidebar">
            <div className="glass-panel" style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--clr-border)",
              borderRadius: "16px",
              padding: "1.5rem",
              position: "sticky",
              top: "2rem"
            }}>
              <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", textTransform: "uppercase", color: "var(--clr-text-muted)", marginBottom: "1rem", letterSpacing: "1px" }}>
                Taxonomy
              </h3>
              
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--clr-text-secondary)", marginBottom: "0.5rem" }}>Classification</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {watch.type?.map(t => (
                    <span key={t} className="tag" style={{ background: "rgba(255,255,255,0.1)", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.8rem" }}>{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--clr-text-secondary)", marginBottom: "0.5rem" }}>Complications</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {watch.complications?.length > 0 ? watch.complications.map(c => (
                    <span key={c} className="tag" style={{ background: "rgba(197,160,89,0.15)", color: "var(--clr-gold)", border: "1px solid rgba(197,160,89,0.3)", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.8rem" }}>{c}</span>
                  )) : <span style={{ color: "var(--clr-text-muted)", fontSize: "0.85rem" }}>None</span>}
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--clr-text-secondary)", marginBottom: "0.5rem" }}>Occasions</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {watch.occasions?.map(o => (
                    <span key={o} className="tag" style={{ border: "1px solid var(--clr-border)", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.8rem" }}>{o}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--clr-border)" }}>
                <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
                  <Link href={`/collection/${watch.id}/edit`} className="btn" style={{ width: "100%", textAlign: "center", textDecoration: "none", background: "var(--clr-bg-primary)", border: "1px solid var(--clr-border)", color: "white", padding: "0.75rem", borderRadius: "8px", transition: "all 0.2s" }}>
                    Edit Passport
                  </Link>
                  <DeleteButton watchId={watch.id} />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}

function SpecItem({ label, value }) {
  return (
    <div className="spec-item" style={{ 
      background: "rgba(255,255,255,0.02)", 
      padding: "1rem", 
      borderRadius: "8px",
      border: "1px solid var(--clr-border)"
    }}>
      <div style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem", fontFamily: "var(--font-mono)" }}>
        {label}
      </div>
      <div style={{ fontSize: "1rem", color: "var(--clr-text-primary)", fontWeight: 500 }}>
        {value || "—"}
      </div>
    </div>
  );
}


