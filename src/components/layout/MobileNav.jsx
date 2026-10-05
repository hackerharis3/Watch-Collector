"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    label: "Home",
    href: "/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Collection",
    href: "/collection",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    label: "Add",
    href: "/collection/add",
    isAdd: true,
  },
  {
    label: "Discover",
    href: "/discover",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" />
      </svg>
    ),
  },
  {
    label: "Match",
    href: "/match",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="mobile-header">
        <Link href="/" className="mobile-header-logo">
          <div className="sidebar-logo-icon">⌚</div>
          <div className="sidebar-logo-text">
            Horological <span>Vault</span>
          </div>
        </Link>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="mobile-nav">
        {items.map((item) =>
          item.isAdd ? (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-nav-add"
              title="Add Watch"
            >
              +
            </Link>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item ${isActive(item.href) ? "active" : ""}`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        )}
      </nav>
    </>
  );
}
