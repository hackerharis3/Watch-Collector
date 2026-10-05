"use client";

import React from "react";

export default function DeleteButton({ watchId }) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this watch? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/collection/${watchId}`, { method: "DELETE" });
        if (res.ok) {
          window.location.href = "/collection";
        } else {
          alert("Failed to delete watch.");
        }
      } catch (err) {
        alert("Error deleting watch: " + err.message);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      className="btn" 
      style={{ width: "100%", background: "transparent", border: "1px solid rgba(248,113,113,0.3)", color: "var(--clr-danger)", padding: "0.75rem", borderRadius: "8px", transition: "all 0.2s", cursor: "pointer" }}
    >
      Delete Watch
    </button>
  );
}
