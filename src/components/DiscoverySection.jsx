"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const WATCH_API_BASE = '/api/watch';

export default function DiscoverySection() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  
  const [selectedWatch, setSelectedWatch] = useState(null); // For modal

  useEffect(() => {
    loadBrandList();
    performSearch('Rolex', ''); // Initial search
  }, []);

  const loadBrandList = async () => {
    try {
      const res = await fetch(`${WATCH_API_BASE}/brand/list`);
      if (!res.ok) throw new Error("Failed to load brands");
      const data = await res.json();
      if (data.data) {
        setBrands(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const performSearch = async (brand, query) => {
    setIsLoading(true);
    setErrorMsg("");
    setSelectedBrand(brand);
    
    let url = `${WATCH_API_BASE}/model/search?`;
    if (query) url += `search=${encodeURIComponent(query)}&`;
    if (brand) url += `brand=${encodeURIComponent(brand)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setErrorMsg('Unauthorized: Your API token is invalid or expired.');
        } else if (res.status === 429) {
          setErrorMsg('Rate limit exceeded. Please wait before trying again.');
        } else {
          setErrorMsg(`API error: ${res.status}`);
        }
        setResults([]);
        setIsLoading(false);
        return;
      }
      
      const data = await res.json();
      if (data.error) {
        setErrorMsg(data.error);
        setResults([]);
      } else if (data.data) {
        setResults(data.data);
      } else {
        setResults([]);
      }
    } catch (err) {
      setErrorMsg('Network error — check your connection or token validity.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery && !selectedBrand) return;
    performSearch(selectedBrand, searchQuery);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleWishlist = (id) => {
    if (!id) return;
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(id)) {
      newWishlist.delete(id);
    } else {
      newWishlist.add(id);
    }
    setWishlist(newWishlist);
  };

  // Brands logic
  const popularBrands = ['Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'TAG Heuer', 'Cartier', 'IWC', 'Breitling', 'Panerai', 'Tudor', 'Seiko', 'Zenith', 'Hublot', 'Jaeger-LeCoultre', 'Vacheron Constantin'];
  const featured = brands.filter(b => popularBrands.includes(b));
  const remaining = brands.filter(b => !popularBrands.includes(b));

  return (
    <section className="section" id="discovery">
      <div className="container">
        <div className="section-header animate-in visible">
          <div className="section-tag">Global Database</div>
          <h2 className="section-title">
            <span className="gold">Discovery Engine</span>
          </h2>
          <p className="section-desc">
            Explore thousands of timepieces from the global watch database. Research reference numbers, historical models, and find your next grail.
          </p>
        </div>

        <div className="discovery-controls animate-in visible" id="discovery-controls">
          <div className="search-box">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              id="discovery-search-input"
              className="search-input"
              placeholder="Search by model, reference, or keywords (e.g., Daytona 116500LN)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>

        {brands.length > 0 && (
          <div className="brand-browse animate-in visible" id="brand-browse">
            <div className="brand-browse-header">
              <div className="brand-browse-title">Browse by Brand</div>
            </div>
            <div className="brand-pills" id="brand-pills">
              <button 
                className={`brand-pill ${selectedBrand === '' ? 'active' : ''}`}
                onClick={() => performSearch('', searchQuery)}
              >
                All
              </button>
              {featured.map(brand => (
                <button 
                  key={brand}
                  className={`brand-pill ${selectedBrand === brand ? 'active' : ''}`}
                  onClick={() => performSearch(brand, searchQuery)}
                >
                  {brand}
                </button>
              ))}
              {!showAllBrands && remaining.length > 0 && (
                <button 
                  className="brand-pill brand-pill-more" 
                  onClick={() => setShowAllBrands(true)}
                >
                  +{remaining.length} more
                </button>
              )}
              {showAllBrands && remaining.map(brand => (
                <button 
                  key={brand}
                  className={`brand-pill ${selectedBrand === brand ? 'active' : ''}`}
                  onClick={() => performSearch(brand, searchQuery)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}

            {results.length > 0 && !isLoading && (
              <div className="discovery-results-info animate-in visible" id="discovery-results-info" style={{ display: 'flex' }}>
                <span className="results-count">{results.length} result{results.length !== 1 ? 's' : ''}</span>
                {(searchQuery || selectedBrand) && (
                  <span className="results-query">for {selectedBrand ? `"${selectedBrand}" ` : ''}{searchQuery ? `"${searchQuery}"` : ''}</span>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="discovery-loading animate-in visible" id="discovery-loading" style={{ display: 'flex' }}>
                <div className="loading-spinner"></div>
                <div className="loading-text">SEARCHING GLOBAL DATABASE...</div>
              </div>
            ) : errorMsg ? (
              <div className="empty-state animate-in visible" style={{ gridColumn: "1 / -1" }}>
                <div className="empty-state-icon">⚠️</div>
                <div className="empty-state-text" style={{ color: "var(--clr-danger)" }}>{errorMsg}</div>
                <p style={{ color: "var(--clr-text-muted)", marginTop: "var(--space-md)", fontSize: "0.85rem" }}>
                  Make sure your API token is valid. <a href="https://www.thewatchapi.com/register" target="_blank" rel="noreferrer" style={{ color: "var(--clr-gold)" }}>Get a free token →</a>
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="discovery-grid animate-in visible" id="discovery-grid">
                {results.map((watch, i) => {
                  const watchId = watch.reference_number || watch.model || i.toString();
                  const isWishlisted = wishlist.has(watchId);
                  return (
                    <div 
                      key={i} 
                      className="discovery-card animate-in visible" 
                      style={{ transitionDelay: `${Math.min(i * 0.06, 1)}s` }}
                      onClick={() => setSelectedWatch(watch)}
                    >
                      <div className="discovery-card-accent"></div>
                      <div className="discovery-card-header">
                        <div>
                          <div className="discovery-card-brand">{watch.brand || 'Unknown'}</div>
                          <div className="discovery-card-model">{watch.model || 'Unknown Model'}</div>
                          {watch.reference_number && <div className="discovery-card-ref">Ref. {watch.reference_number}</div>}
                        </div>
                        <button 
                          className={`add-wishlist-btn ${isWishlisted ? 'added' : ''}`} 
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(watchId); }}
                          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          {isWishlisted ? '♥' : '♡'}
                        </button>
                      </div>
                      <div className="discovery-card-specs">
                        {watch.movement && <span className="discovery-spec"><span className="spec-icon">⏱️</span> {watch.movement}</span>}
                        {watch.case_material && <span className="discovery-spec">🔩 {watch.case_material}</span>}
                        {watch.case_diameter && <span className="discovery-spec">📐 {watch.case_diameter}</span>}
                        {watch.year_of_production && <span className="discovery-spec">📅 {watch.year_of_production}</span>}
                      </div>
                      {watch.description && (
                        <div className="discovery-card-desc">
                          {watch.description.substring(0, 150)}{watch.description.length > 150 ? '...' : ''}
                        </div>
                      )}
                      <div className="discovery-card-footer">
                        <span className="discovery-view-btn">View Details →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state animate-in visible" style={{ gridColumn: "1 / -1" }}>
                <div className="empty-state-icon">🔭</div>
                <div className="empty-state-text">No watches found. Try a different search or adjust filters.</div>
              </div>
            )}
      </div>
      
      <DiscoveryModal 
        watch={selectedWatch} 
        onClose={() => setSelectedWatch(null)}
        isWishlisted={selectedWatch ? wishlist.has(selectedWatch.reference_number || selectedWatch.model) : false}
        onToggleWishlist={() => toggleWishlist(selectedWatch.reference_number || selectedWatch.model)}
      />
    </section>
  );
}

function DiscoveryModal({ watch, onClose, isWishlisted, onToggleWishlist }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (watch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [watch]);

  if (!watch || !mounted) return null;

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return createPortal(
    <div className="modal-overlay open" onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="modal discovery-modal open" onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-body" style={{ paddingTop: "var(--space-3xl)" }}>
          <div className="modal-brand">{watch.brand || ''}</div>
          <div className="modal-model">{watch.model || ''}</div>
          {watch.reference_number && <div className="discovery-modal-ref">Ref. {watch.reference_number}</div>}

          <div className="modal-specs-grid" style={{ marginTop: "var(--space-xl)" }}>
            {watch.movement && (
              <div className="modal-spec">
                <div className="modal-spec-label">Movement</div>
                <div className="modal-spec-value">{watch.movement}</div>
              </div>
            )}
            {watch.case_material && (
              <div className="modal-spec">
                <div className="modal-spec-label">Case Material</div>
                <div className="modal-spec-value">{watch.case_material}</div>
              </div>
            )}
            {watch.case_diameter && (
              <div className="modal-spec">
                <div className="modal-spec-label">Case Diameter</div>
                <div className="modal-spec-value">{watch.case_diameter}</div>
              </div>
            )}
            {watch.year_of_production && (
              <div className="modal-spec">
                <div className="modal-spec-label">Years of Production</div>
                <div className="modal-spec-value">{watch.year_of_production}</div>
              </div>
            )}
            {watch.reference_number && (
              <div className="modal-spec">
                <div className="modal-spec-label">Reference</div>
                <div className="modal-spec-value">{watch.reference_number}</div>
              </div>
            )}
            {watch.last_updated && (
              <div className="modal-spec">
                <div className="modal-spec-label">Last Updated</div>
                <div className="modal-spec-value">{formatDate(watch.last_updated)}</div>
              </div>
            )}
          </div>

          {watch.description && (
            <div style={{ marginTop: "var(--space-xl)" }}>
              <div className="spec-label" style={{ marginBottom: "var(--space-sm)", fontSize: "0.7rem" }}>Description</div>
              <div className="discovery-modal-desc">{watch.description}</div>
            </div>
          )}

          <div style={{ marginTop: "var(--space-xl)", display: "flex", gap: "var(--space-md)" }}>
            <button className="btn btn-primary" onClick={onToggleWishlist}>
              {isWishlisted ? '♥ In Wishlist' : '♡ Add to Wishlist'}
            </button>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
