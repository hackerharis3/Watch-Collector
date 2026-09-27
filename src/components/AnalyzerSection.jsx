"use client";
import React, { useState, useEffect, useMemo } from "react";

const movementTypes = ['Automatic', 'Manual-Wind', 'Quartz', 'Solar/Tough Solar'];
const watchCategories = ['Dress', 'Casual', 'Sports', 'Diver', 'Chronograph', 'Field', 'Pilot', 'Digital'];

const priorityGaps = [
  { movement: 'Automatic', category: 'Diver', priority: 'high', reason: 'Essential for any serious collection—the automatic diver is a horological cornerstone.' },
  { movement: 'Manual-Wind', category: 'Chronograph', priority: 'high', reason: 'A hand-wound chronograph showcases pure mechanical artistry.' },
  { movement: 'Automatic', category: 'Field', priority: 'medium', reason: 'A rugged field watch fills the gap between dress and sports.' },
  { movement: 'Quartz', category: 'Pilot', priority: 'medium', reason: 'A quartz pilot watch offers precise aviation readability.' },
  { movement: 'Solar/Tough Solar', category: 'Diver', priority: 'low', reason: 'Solar-powered divers combine eco-consciousness with aquatic utility.' },
  { movement: 'Manual-Wind', category: 'Field', priority: 'low', reason: 'A vintage-inspired manual-wind field piece adds heritage character.' },
];

export default function AnalyzerSection() {
  const [watches, setWatches] = useState([]);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem("vault_watches");
    if (saved) {
      try {
        setWatches(JSON.parse(saved));
      } catch (e) {
        setWatches([]);
      }
    }
  }, []);

  const matrix = useMemo(() => {
    const m = {};
    movementTypes.forEach(movement => {
      m[movement] = {};
      watchCategories.forEach(category => {
        m[movement][category] = watches.some(watch => {
          // Check movement
          const movtStr = watch.movement || "";
          const movementMatch = movtStr.toLowerCase().includes(movement.toLowerCase()) ||
            (movement === 'Solar/Tough Solar' && (movtStr.includes('Solar') || movtStr.includes('Eco') || movtStr.includes('Tough')));
          
          // Check category
          const typeArray = Array.isArray(watch.type) ? watch.type : (typeof watch.type === 'string' ? [watch.type] : []);
          const compsArray = Array.isArray(watch.complications) ? watch.complications : (typeof watch.complications === 'string' ? [watch.complications] : []);
          
          const categoryMatch = typeArray.some(t => t.toLowerCase() === category.toLowerCase()) ||
            (category === 'Chronograph' && compsArray.some(c => c.toLowerCase() === 'chronograph')) ||
            (category === 'Digital' && typeArray.some(t => t.toLowerCase().includes('digital')));
            
          return movementMatch && categoryMatch;
        });
      });
    });
    return m;
  }, [watches]);

  const existingGaps = useMemo(() => {
    return priorityGaps.filter(gap => {
      const exists = watches.some(watch => {
        const movtStr = watch.movement || "";
        const movementMatch = movtStr.toLowerCase().includes(gap.movement.toLowerCase()) ||
          (gap.movement === 'Solar/Tough Solar' && (movtStr.includes('Solar') || movtStr.includes('Eco')));
          
        const typeArray = Array.isArray(watch.type) ? watch.type : (typeof watch.type === 'string' ? [watch.type] : []);
        const compsArray = Array.isArray(watch.complications) ? watch.complications : (typeof watch.complications === 'string' ? [watch.complications] : []);
        
        const categoryMatch = typeArray.some(t => t.toLowerCase() === gap.category.toLowerCase()) ||
          (gap.category === 'Chronograph' && compsArray.some(c => c.toLowerCase() === 'chronograph'));
          
        return movementMatch && categoryMatch;
      });
      return !exists;
    });
  }, [watches]);

  return (
    <section className="section" id="analyzer">
      <div className="container">
        <div className="section-header animate-in visible">
          <div className="section-tag">Analytics</div>
          <h2 className="section-title">
            Collection <span className="gold">Gap Analyzer</span>
          </h2>
          <p className="section-desc">
            Identify missing archetypes in your vault to plan your next strategic acquisition.
          </p>
        </div>

        <div className="gap-dashboard animate-in visible" style={{ marginTop: "var(--space-2xl)" }}>
          {/* Matrix */}
          <div className="gap-matrix">
            <div className="gap-matrix-title">📊 Coverage Matrix</div>
            <div className="matrix-grid" style={{ "--cols": watchCategories.length }}>
              <div className="matrix-row">
                <div className="matrix-header"></div>
                {watchCategories.map(c => (
                  <div key={c} className="matrix-header">{c.substring(0, 5)}</div>
                ))}
              </div>
              {movementTypes.map(m => (
                <div key={m} className="matrix-row">
                  <div className="matrix-label">{m}</div>
                  {watchCategories.map(c => (
                    <div 
                      key={`${m}-${c}`} 
                      className={`matrix-cell ${matrix[m][c] ? 'filled' : 'empty'}`}
                      title={`${m} ${c}`}
                    >
                      {matrix[m][c] ? '✓' : '·'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="gap-suggestions">
            <div className="gap-suggestions-title">💡 Suggested Acquisitions</div>
            {existingGaps.length > 0 ? existingGaps.map((gap, i) => (
              <div key={i} className="suggestion-item animate-in visible" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className={`suggestion-priority ${gap.priority}`}>
                  {gap.priority === 'high' ? '!' : gap.priority === 'medium' ? '~' : '○'}
                </div>
                <div className="suggestion-content">
                  <h4>{gap.movement} {gap.category}</h4>
                  <p>{gap.reason}</p>
                </div>
              </div>
            )) : (
              <div className="empty-state">
                <div className="empty-state-icon">🏆</div>
                <div className="empty-state-text">Impressive! Your collection covers all critical categories.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
