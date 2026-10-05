"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function PhotoGallery({ photos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!photos || photos.length === 0) return null;

  return (
    <>
      <section className="passport-section animate-in visible" style={{ marginBottom: "3rem" }}>
        <h2 className="section-title" style={{ fontSize: "1.5rem", borderBottom: "1px solid var(--clr-border)", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
          Gallery
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "1rem"
        }}>
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setSelectedPhoto(photo)}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                borderRadius: "12px",
                overflow: "hidden",
                aspectRatio: "1/1",
                border: "1px solid var(--clr-border)",
                transition: "transform 0.2s, border-color 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.borderColor = "var(--clr-gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.borderColor = "var(--clr-border)";
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={photo} 
                alt={`Gallery photo ${index + 1}`} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </button>
          ))}
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(3, 7, 18, 0.95)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "2rem"
          }}
        >
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={selectedPhoto} 
              alt="Fullscreen gallery view" 
              style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain", borderRadius: "8px" }} 
            />
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); }}
              style={{
                position: "absolute", top: "-20px", right: "-20px",
                background: "var(--clr-bg-surface)", border: "1px solid var(--clr-border)",
                color: "var(--clr-gold)", width: "40px", height: "40px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.2rem", cursor: "pointer", transition: "var(--transition-fast)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "var(--clr-gold-glow)";
                e.currentTarget.style.borderColor = "var(--clr-gold)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "var(--clr-bg-surface)";
                e.currentTarget.style.borderColor = "var(--clr-border)";
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
