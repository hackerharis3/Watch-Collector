import React from "react";
import dbConnect from "@/lib/mongodb";
import { CollectionWatch } from "@/models/CollectionWatch";
import WatchCard from "@/components/WatchCard";
import Link from "next/link";

export const metadata = {
  title: "Wishlist | Horological Vault",
  description: "Track and manage your horological acquisition goals.",
};

async function getWishlist() {
  await dbConnect();
  const watches = await CollectionWatch.find({ in_collection: false }).lean();
  return watches.map(w => {
    const { _id, __v, ...rest } = w;
    return { ...rest, id: _id.toString() };
  });
}

export default async function WishlistPage() {
  const wishlist = await getWishlist();

  return (
    <section className="section" id="wishlist">
      <div className="container">
        <div className="section-header animate-in visible">
          <div className="section-tag">Acquisition Goals</div>
          <h2 className="section-title">
            The <span className="gold">Wishlist</span>
          </h2>
          <p className="section-desc">
            Track your targeted timepieces and plan your next strategic acquisition.
          </p>
        </div>

        <div className="gallery-filters animate-in visible" style={{ marginTop: "2rem" }}>
          <Link href="/collection/add" className="btn" style={{ background: "var(--clr-gold)", color: "black", fontWeight: "bold", textDecoration: "none", padding: "0.5rem 1rem", borderRadius: "8px" }}>
            + Add to Wishlist
          </Link>
        </div>

        <div className="gallery-grid" style={{ marginTop: "2rem" }}>
          {wishlist.length > 0 ? (
            wishlist.map(watch => (
              <WatchCard key={watch.id} watch={watch} />
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
              <div className="empty-state-icon">🎯</div>
              <div className="empty-state-text">Your wishlist is empty. Discover new watches to add to your acquisition goals!</div>
              <Link href="/discover" className="btn btn-secondary" style={{ marginTop: "1rem", display: "inline-block" }}>
                Explore Watches
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
