// ══════════════════════════════════════════════════════════
// HOROLOGICAL VAULT — Application Logic
// ══════════════════════════════════════════════════════════

// ── Watch Collection Data ───────────────────────────────
const defaultCollection = [
  {
    id: '1',
    brand: 'HMT',
    model: 'Vijay',
    movement: 'Manual-Wind',
    type: ['Dress', 'Vintage'],
    complications: ['Date'],
    features: ['White Dial', 'Gold Hands', 'Arabic Numerals'],
    occasions: ['Formal', 'Business Casual'],
    in_collection: true,
    image: 'images/watch_dress_classic.png',
    caliber: 'HMT 0231',
    case_material: 'Stainless Steel',
    crystal: 'Acrylic',
    water_resistance: '30m',
    case_diameter: '36mm',
    lug_width: '18mm',
    year: '1980s'
  },
  {
    id: '2',
    brand: 'Casio',
    model: 'GA-B2100LUU-8A',
    movement: 'Tough Solar',
    type: ['Sports', 'Digital-Analog'],
    complications: ['Chronograph', 'World Time', 'Timer', 'Alarm'],
    features: ['Bluetooth', 'Black Dial', 'Carbon Core Guard', 'LED Light'],
    occasions: ['Casual', 'Sports'],
    in_collection: true,
    image: 'images/watch_sports_gshock.png',
    caliber: 'Module 5680',
    case_material: 'Carbon/Resin',
    crystal: 'Mineral',
    water_resistance: '200m',
    case_diameter: '45.4mm',
    lug_width: '22mm',
    year: '2024'
  },
  {
    id: '3',
    brand: 'Swatch',
    model: 'New Gent',
    movement: 'Quartz',
    type: ['Casual', 'Fashion'],
    complications: [],
    features: ['Colorful Dial', 'Silicone Strap', 'Swiss Made'],
    occasions: ['Casual'],
    in_collection: true,
    image: 'images/watch_casual_swatch.png',
    caliber: 'ETA Normflatwerk',
    case_material: 'Bio-Sourced Plastic',
    crystal: 'Acrylic',
    water_resistance: '30m',
    case_diameter: '41mm',
    lug_width: '20mm',
    year: '2023'
  },
  {
    id: '4',
    brand: 'Orient',
    model: 'Bambino V2',
    movement: 'Automatic',
    type: ['Dress', 'Classic'],
    complications: ['Date'],
    features: ['Domed Crystal', 'Cream Dial', 'Exhibition Back'],
    occasions: ['Formal', 'Business Casual'],
    in_collection: true,
    image: 'images/watch_orient_bambino.png',
    caliber: 'F6722',
    case_material: 'Stainless Steel',
    crystal: 'Mineral (Domed)',
    water_resistance: '30m',
    case_diameter: '40.5mm',
    lug_width: '21mm',
    year: '2022'
  },
  {
    id: '5',
    brand: 'Casio',
    model: 'F-91W',
    movement: 'Quartz',
    type: ['Digital', 'Retro'],
    complications: ['Alarm', 'Chronograph'],
    features: ['LED Backlight', 'Iconic Design', '7-Year Battery'],
    occasions: ['Casual', 'Sports'],
    in_collection: true,
    image: 'images/watch_digital_retro.png',
    caliber: 'Module 593',
    case_material: 'Resin',
    crystal: 'Acrylic',
    water_resistance: '30m',
    case_diameter: '33.2mm',
    lug_width: '18mm',
    year: '1989'
  },
  {
    id: '6',
    brand: 'Seiko',
    model: 'SKX007',
    movement: 'Automatic',
    type: ['Diver', 'Sports'],
    complications: ['Date', 'Day'],
    features: ['Rotating Bezel', 'Lume', 'Exhibition Back'],
    occasions: ['Casual', 'Sports'],
    in_collection: false,
    image: 'images/watch_automatic_diver.png',
    caliber: '7S26',
    case_material: 'Stainless Steel',
    crystal: 'Hardlex',
    water_resistance: '200m',
    case_diameter: '42mm',
    lug_width: '22mm',
    year: '1996'
  }
];

let watchCollection = JSON.parse(localStorage.getItem('vault_watches')) || defaultCollection;
let newWatchTempImage = '';

function saveCollection() {
  localStorage.setItem('vault_watches', JSON.stringify(watchCollection));
}

function toggleAddWatchForm() {
  const form = document.getElementById('add-watch-form-container');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if (typeof syncCustomSelects === 'function') syncCustomSelects();
  }
}

async function autoFillWatch() {
  const ref = document.getElementById('new-watch-reference').value.trim();
  const statusEl = document.getElementById('autofill-status');
  if (!ref) {
    statusEl.textContent = 'Please enter a reference or serial number.';
    return;
  }
  
  statusEl.textContent = 'Searching global database...';
  
  try {
    const url = `/api/watch/model/search?search=${encodeURIComponent(ref)}&search_attributes=reference_number`;
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 402 || response.status === 429) {
         throw new Error("API Limit Reached. Please update your API token.");
      }
      throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    
    if (data && data.data && data.data.length > 0) {
      const watch = data.data[0];
      document.getElementById('new-watch-brand').value = watch.brand || '';
      document.getElementById('new-watch-model').value = watch.model || watch.name || '';
      document.getElementById('new-watch-movement').value = watch.movement || 'Automatic';
      document.getElementById('new-watch-year').value = watch.year || '';
      
      if (watch.image) {
         newWatchTempImage = watch.image;
      }
      
      statusEl.textContent = `Found: ${watch.brand} ${watch.model || watch.name}. Fields populated!`;
    } else {
      statusEl.textContent = 'No watch found with that reference number.';
    }
  } catch (error) {
    statusEl.textContent = `Search failed: ${error.message}`;
  }
}

function handleAddWatchSubmit(event) {
  event.preventDefault();
  const brand = document.getElementById('new-watch-brand').value.trim();
  const model = document.getElementById('new-watch-model').value.trim();
  const movement = document.getElementById('new-watch-movement').value.trim();
  const year = document.getElementById('new-watch-year').value.trim();
  const type = document.getElementById('new-watch-type').value;
  const caseMaterial = document.getElementById('new-watch-case').value.trim();
  const waterResistance = document.getElementById('new-watch-water-resistance').value.trim();
  const crystal = document.getElementById('new-watch-crystal').value.trim();
  const caliber = document.getElementById('new-watch-caliber').value.trim();
  const imageInput = document.getElementById('new-watch-image');
  const userImage = imageInput ? imageInput.value.trim() : '';
  const compSelect = document.getElementById('new-watch-complications');
  const complications = compSelect ? Array.from(compSelect.selectedOptions).map(opt => opt.value) : [];
  const featSelect = document.getElementById('new-watch-features');
  const features = featSelect ? Array.from(featSelect.selectedOptions).map(opt => opt.value) : [];
  const occSelect = document.getElementById('new-watch-occasions');
  const occasions = occSelect ? Array.from(occSelect.selectedOptions).map(opt => opt.value) : [];

  const newWatch = {
    id: 'user_' + Date.now(),
    brand,
    model,
    movement,
    type: [type],
    complications,
    features,
    occasions,
    in_collection: true,
    image: userImage || newWatchTempImage || 'images/watch_dress_classic.png',
    caliber: caliber,
    case_material: caseMaterial,
    crystal: crystal,
    water_resistance: waterResistance,
    case_diameter: '',
    lug_width: '',
    year: year || ''
  };

  newWatchTempImage = ''; // reset after saving

  watchCollection.unshift(newWatch);
  saveCollection();
  toggleAddWatchForm();
  document.getElementById('add-watch-form').reset();
  
  // Re-render everything that depends on watchCollection
  renderGallery();
  updateStats();
  if (typeof renderGapAnalyzer === 'function') renderGapAnalyzer();
}

// ── Master Matrix for Gap Analysis ──────────────────────
const movementTypes = ['Manual-Wind', 'Automatic', 'Quartz', 'Solar/Tough Solar'];
const watchCategories = ['Dress', 'Diver', 'Sports', 'Chronograph', 'Field', 'Pilot', 'Digital'];

const masterMatrix = [];
movementTypes.forEach(movement => {
  watchCategories.forEach(category => {
    masterMatrix.push({ movement, category });
  });
});

// ── Occasion Definitions ────────────────────────────────
const occasions = [
  {
    id: 'formal',
    name: 'Formal',
    icon: '🎩',
    desc: 'Black-tie events, galas, and formal dinners demand understated elegance.',
    keywords: ['Dress', 'Classic', 'Vintage']
  },
  {
    id: 'business',
    name: 'Business Casual',
    icon: '💼',
    desc: 'Office meetings and professional settings call for refined yet approachable timepieces.',
    keywords: ['Dress', 'Classic', 'Fashion']
  },
  {
    id: 'casual',
    name: 'Casual',
    icon: '☕',
    desc: 'Weekend outings, cafes, and relaxed gatherings—comfort meets style.',
    keywords: ['Casual', 'Fashion', 'Retro', 'Digital']
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '🏃',
    desc: 'Active pursuits and outdoor adventures demand rugged, water-resistant construction.',
    keywords: ['Sports', 'Diver', 'Digital', 'Digital-Analog']
  }
];



// ══════════════════════════════════════════════════════════
// DOM & State
// ══════════════════════════════════════════════════════════

let currentFilter = 'all';
let activeOccasion = null;
let activeSection = 'hero';
let wishlist = new Set();

// ── Initialize ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderGallery();
  renderOccasionCards();
  renderGapAnalyzer();
  initDiscoveryAPI();
  updateStats();
  initScrollAnimations();
  initHeaderScroll();
  initNavigation();
});

// ══════════════════════════════════════════════════════════
// Header & Navigation
// ══════════════════════════════════════════════════════════

function initHeaderScroll() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initNavigation() {
  // Smooth scroll nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      const section = document.querySelector(target);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu
        document.querySelector('.nav').classList.remove('open');
      }
    });
  });

  // Mobile menu toggle
  const menuBtn = document.querySelector('.mobile-menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      document.querySelector('.nav').classList.toggle('open');
    });
  }

  // Active section tracking
  const sections = document.querySelectorAll('.section, .hero');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

// ══════════════════════════════════════════════════════════
// Gallery
// ══════════════════════════════════════════════════════════

function renderGallery(filter = 'all') {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? watchCollection
    : filter === 'owned'
      ? watchCollection.filter(w => w.in_collection)
      : filter === 'wishlist'
        ? watchCollection.filter(w => !w.in_collection)
        : watchCollection.filter(w =>
            w.type.some(t => t.toLowerCase() === filter.toLowerCase()) ||
            w.movement.toLowerCase().includes(filter.toLowerCase())
          );

  grid.innerHTML = filtered.map((watch, i) => `
    <div class="watch-card animate-in" style="transition-delay: ${i * 0.08}s" onclick="openWatchModal('${watch.id}')">
      <div class="watch-card-image">
        <img src="${watch.image}" alt="${watch.brand} ${watch.model}" loading="lazy">
        <span class="watch-card-badge">${watch.movement}</span>
        <span class="watch-card-status ${watch.in_collection ? 'owned' : 'wishlist'}" title="${watch.in_collection ? 'In Collection' : 'Wishlist'}"></span>
      </div>
      <div class="watch-card-body">
        <div class="watch-card-brand">${watch.brand}</div>
        <div class="watch-card-model">${watch.model}</div>
        <div class="watch-card-movement">
          <span class="icon">${getMovementIcon(watch.movement)}</span>
          ${watch.movement} · ${watch.year}
        </div>
        <div class="watch-card-specs">
          <div class="spec-item">
            <span class="spec-label">Case</span>
            <span class="spec-value">${watch.case_diameter}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Water Res.</span>
            <span class="spec-value">${watch.water_resistance}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Crystal</span>
            <span class="spec-value">${watch.crystal}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Caliber</span>
            <span class="spec-value">${watch.caliber}</span>
          </div>
        </div>
        <div class="watch-card-tags">
          ${watch.type.map(t => `<span class="tag gold">${t}</span>`).join('')}
          ${watch.complications.slice(0, 2).map(c => `<span class="tag">${c}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  // Trigger scroll animations for newly rendered cards
  requestAnimationFrame(() => {
    grid.querySelectorAll('.animate-in').forEach(el => {
      el.classList.add('visible');
    });
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">⌚</div>
        <div class="empty-state-text">No watches match this filter</div>
      </div>
    `;
  }
}

function getMovementIcon(movement) {
  const icons = {
    'Manual-Wind': '⚙️',
    'Automatic': '🔄',
    'Quartz': '⚡',
    'Tough Solar': '☀️',
    'Solar': '☀️',
    'Eco-Drive': '🌿'
  };
  return icons[movement] || '⏱️';
}

function setFilter(filter, btn) {
  currentFilter = filter;

  // Update active state
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  renderGallery(filter);
}

// ── Watch Detail Modal ──────────────────────────────────
function openWatchModal(id) {
  const watch = watchCollection.find(w => w.id === id);
  if (!watch) return;

  const modal = document.getElementById('watch-modal');
  modal.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="closeModal()" style="z-index: 100; position: absolute; top: var(--space-md); right: var(--space-md); background: rgba(0,0,0,0.6); padding: 6px 10px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
      <button class="modal-edit-btn" onclick="openEditModal('${watch.id}')" style="position: absolute; top: var(--space-md); right: 60px; z-index: 100; background: rgba(0,0,0,0.6); padding: 6px 12px; border-radius: 4px; border: 1px solid rgba(197, 160, 89, 0.4); color: var(--clr-gold); cursor: pointer; font-size: 1rem; font-family: inherit; font-weight: bold; text-shadow: 0 1px 3px rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center;">✎ Edit</button>
      <div class="modal-image">
        <img src="${watch.image}" alt="${watch.brand} ${watch.model}">
      </div>
      <div class="modal-body">
        <div class="modal-brand">${watch.brand}</div>
        <div class="modal-model">${watch.model}</div>
        
        <div class="modal-specs-grid">
          <div class="modal-spec">
            <div class="modal-spec-label">Movement</div>
            <div class="modal-spec-value">${watch.movement}</div>
          </div>
          <div class="modal-spec">
            <div class="modal-spec-label">Caliber</div>
            <div class="modal-spec-value">${watch.caliber}</div>
          </div>
          <div class="modal-spec">
            <div class="modal-spec-label">Case</div>
            <div class="modal-spec-value">${watch.case_diameter}</div>
          </div>
          <div class="modal-spec">
            <div class="modal-spec-label">Material</div>
            <div class="modal-spec-value">${watch.case_material}</div>
          </div>
          <div class="modal-spec">
            <div class="modal-spec-label">Crystal</div>
            <div class="modal-spec-value">${watch.crystal}</div>
          </div>
          <div class="modal-spec">
            <div class="modal-spec-label">Water Res.</div>
            <div class="modal-spec-value">${watch.water_resistance}</div>
          </div>
          <div class="modal-spec">
            <div class="modal-spec-label">Lug Width</div>
            <div class="modal-spec-value">${watch.lug_width}</div>
          </div>
          <div class="modal-spec">
            <div class="modal-spec-label">Year</div>
            <div class="modal-spec-value">${watch.year}</div>
          </div>
          <div class="modal-spec">
            <div class="modal-spec-label">Status</div>
            <div class="modal-spec-value" style="color: ${watch.in_collection ? 'var(--clr-success)' : 'var(--clr-warning)'}">
              ${watch.in_collection ? '● Owned' : '○ Wishlist'}
            </div>
          </div>
        </div>

        <div style="margin-top: var(--space-lg);">
          <div class="spec-label" style="margin-bottom: var(--space-sm);">Complications</div>
          <div class="watch-card-tags">
            ${watch.complications.length
              ? watch.complications.map(c => `<span class="tag">${c}</span>`).join('')
              : '<span class="tag">None</span>'}
          </div>
        </div>

        <div style="margin-top: var(--space-md);">
          <div class="spec-label" style="margin-bottom: var(--space-sm);">Features</div>
          <div class="watch-card-tags">
            ${watch.features.map(f => `<span class="tag gold">${f}</span>`).join('')}
          </div>
        </div>

        <div style="margin-top: var(--space-md);">
          <div class="spec-label" style="margin-bottom: var(--space-sm);">Best For</div>
          <div class="watch-card-tags">
            ${watch.occasions.map(o => `<span class="tag">${o}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('watch-modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Add / Edit Watch ──────────────────────────────────────
function openEditModal(id = null) {
  closeModal(); // close details modal if open
  
  const modal = document.getElementById('edit-watch-modal');
  const title = document.getElementById('edit-modal-title');
  const idInput = document.getElementById('edit-watch-id');
  const brandInput = document.getElementById('edit-watch-brand');
  const modelInput = document.getElementById('edit-watch-model');
  const imageInput = document.getElementById('edit-watch-image');
  const movementInput = document.getElementById('edit-watch-movement');
  const yearInput = document.getElementById('edit-watch-year');
  const typeInput = document.getElementById('edit-watch-type');
  const compInput = document.getElementById('edit-watch-complications');
  const featInput = document.getElementById('edit-watch-features');
  const occInput = document.getElementById('edit-watch-occasions');
  const caseInput = document.getElementById('edit-watch-case');
  const wrInput = document.getElementById('edit-watch-water-resistance');
  const crystalInput = document.getElementById('edit-watch-crystal');
  const caliberInput = document.getElementById('edit-watch-caliber');

  if (id) {
    const watch = watchCollection.find(w => w.id === id);
    if (!watch) return;
    title.innerText = 'Edit Watch';
    idInput.value = watch.id;
    brandInput.value = watch.brand;
    modelInput.value = watch.model;
    imageInput.value = watch.image;
    movementInput.value = watch.movement || '';
    yearInput.value = watch.year || '';
    typeInput.value = (watch.type && watch.type[0]) ? watch.type[0] : 'Casual';
    if (caseInput) caseInput.value = watch.case_material || '';
    if (wrInput) wrInput.value = watch.water_resistance || '';
    if (crystalInput) crystalInput.value = watch.crystal || '';
    if (caliberInput) caliberInput.value = watch.caliber || '';
    if (compInput) {
      Array.from(compInput.options).forEach(opt => {
        opt.selected = (watch.complications || []).includes(opt.value);
      });
    }
    if (featInput) {
      Array.from(featInput.options).forEach(opt => {
        opt.selected = (watch.features || []).includes(opt.value);
      });
    }
    if (occInput) {
      Array.from(occInput.options).forEach(opt => {
        opt.selected = (watch.occasions || []).includes(opt.value);
      });
    }
  } else {
    title.innerText = 'Add Watch';
    idInput.value = '';
    brandInput.value = '';
    modelInput.value = '';
    imageInput.value = '';
    movementInput.value = '';
    yearInput.value = '';
    typeInput.value = 'Casual';
    if (caseInput) caseInput.value = '';
    if (wrInput) wrInput.value = '';
    if (crystalInput) crystalInput.value = '';
    if (caliberInput) caliberInput.value = '';
    if (compInput) {
      Array.from(compInput.options).forEach(opt => opt.selected = false);
    }
    if (featInput) {
      Array.from(featInput.options).forEach(opt => opt.selected = false);
    }
    if (occInput) {
      Array.from(occInput.options).forEach(opt => opt.selected = false);
    }
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof syncCustomSelects === 'function') syncCustomSelects();
}

function closeEditModal(e) {
  if (e && e.target.id !== 'edit-watch-modal' && !e.target.classList.contains('modal-close')) return;
  const modal = document.getElementById('edit-watch-modal');
  if (modal) {
    modal.classList.remove('open');
  }
  document.body.style.overflow = '';
}

function handleSaveWatch(e) {
  e.preventDefault();
  
  const id = document.getElementById('edit-watch-id').value;
  const brand = document.getElementById('edit-watch-brand').value.trim();
  const model = document.getElementById('edit-watch-model').value.trim();
  const image = document.getElementById('edit-watch-image').value.trim();
  const movement = document.getElementById('edit-watch-movement').value.trim();
  const year = document.getElementById('edit-watch-year').value.trim();
  const type = document.getElementById('edit-watch-type').value;
  const caseMaterial = document.getElementById('edit-watch-case').value.trim();
  const waterResistance = document.getElementById('edit-watch-water-resistance').value.trim();
  const crystal = document.getElementById('edit-watch-crystal').value.trim();
  const caliber = document.getElementById('edit-watch-caliber').value.trim();
  const compSelect = document.getElementById('edit-watch-complications');
  const complications = compSelect ? Array.from(compSelect.selectedOptions).map(opt => opt.value) : [];
  const featSelect = document.getElementById('edit-watch-features');
  const features = featSelect ? Array.from(featSelect.selectedOptions).map(opt => opt.value) : [];
  const occSelect = document.getElementById('edit-watch-occasions');
  const occasions = occSelect ? Array.from(occSelect.selectedOptions).map(opt => opt.value) : [];

  if (id) {
    // Edit existing
    const index = watchCollection.findIndex(w => w.id === id);
    if (index !== -1) {
      watchCollection[index] = {
        ...watchCollection[index],
        brand,
        model,
        image: image || 'images/watch_dress_classic.png',
        movement: movement || watchCollection[index].movement,
        year: year || watchCollection[index].year,
        type: type ? [type] : watchCollection[index].type,
        complications: complications,
        features: features,
        occasions: occasions,
        case_material: caseMaterial || watchCollection[index].case_material,
        water_resistance: waterResistance || watchCollection[index].water_resistance,
        crystal: crystal || watchCollection[index].crystal,
        caliber: caliber || watchCollection[index].caliber
      };
    }
  } else {
    // Add new (fallback)
    const newWatch = {
      id: 'user_' + Date.now().toString(),
      brand,
      model,
      image,
      movement: 'Automatic',
      type: ['Casual'],
      complications: [],
      features: [],
      occasions: ['Casual'],
      in_collection: true,
      caliber: 'Unknown',
      case_material: 'Stainless Steel',
      crystal: 'Sapphire',
      water_resistance: '50m',
      case_diameter: '40mm',
      lug_width: '20mm',
      year: new Date().getFullYear().toString()
    };
    watchCollection.unshift(newWatch);
  }

  saveCollection();
  closeEditModal();
  renderGallery();
  updateStats();
}

// ══════════════════════════════════════════════════════════
// Occasion Matcher
// ══════════════════════════════════════════════════════════

function renderOccasionCards() {
  const grid = document.getElementById('occasion-grid');
  if (!grid) return;

  grid.innerHTML = occasions.map(occ => {
    const matchCount = getMatchesForOccasion(occ).length;
    return `
      <div class="occasion-card" id="occ-${occ.id}" onclick="selectOccasion('${occ.id}')">
        <span class="occasion-count">${matchCount} match${matchCount !== 1 ? 'es' : ''}</span>
        <div class="occasion-icon">${occ.icon}</div>
        <div class="occasion-title">${occ.name}</div>
        <div class="occasion-desc">${occ.desc}</div>
      </div>
    `;
  }).join('');
}

function getMatchesForOccasion(occasion) {
  return watchCollection.filter(watch => {
    // Check direct occasion match
    if (watch.occasions.some(o => o.toLowerCase() === occasion.name.toLowerCase())) return true;
    // Check type/keyword overlap
    return watch.type.some(t => occasion.keywords.some(k => t.toLowerCase() === k.toLowerCase()));
  });
}

function selectOccasion(id) {
  const occasion = occasions.find(o => o.id === id);
  if (!occasion) return;

  // Toggle active
  if (activeOccasion === id) {
    activeOccasion = null;
    document.querySelectorAll('.occasion-card').forEach(c => c.classList.remove('active'));
    document.getElementById('occasion-results').innerHTML = '';
    return;
  }

  activeOccasion = id;
  document.querySelectorAll('.occasion-card').forEach(c => c.classList.remove('active'));
  document.getElementById(`occ-${id}`).classList.add('active');

  const matches = getMatchesForOccasion(occasion);
  const resultsDiv = document.getElementById('occasion-results');

  resultsDiv.innerHTML = `
    <div class="occasion-results-header">
      <div class="occasion-results-title">${occasion.icon} ${occasion.name} — ${matches.length} Recommended</div>
    </div>
    <div class="gallery-grid">
      ${matches.map((watch, i) => `
        <div class="watch-card animate-in" style="transition-delay: ${i * 0.1}s" onclick="openWatchModal('${watch.id}')">
          <div class="watch-card-image">
            <img src="${watch.image}" alt="${watch.brand} ${watch.model}" loading="lazy">
            <span class="watch-card-badge">${watch.movement}</span>
            <span class="watch-card-status ${watch.in_collection ? 'owned' : 'wishlist'}"></span>
          </div>
          <div class="watch-card-body">
            <div class="watch-card-brand">${watch.brand}</div>
            <div class="watch-card-model">${watch.model}</div>
            <div class="watch-card-movement">
              <span class="icon">${getMovementIcon(watch.movement)}</span>
              ${watch.movement} · ${watch.year}
            </div>
            <div class="watch-card-tags">
              ${watch.type.map(t => `<span class="tag gold">${t}</span>`).join('')}
              ${watch.occasions.map(o => `<span class="tag">${o}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Animate in
  requestAnimationFrame(() => {
    resultsDiv.querySelectorAll('.animate-in').forEach(el => el.classList.add('visible'));
  });

  if (matches.length === 0) {
    resultsDiv.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">No watches matched for ${occasion.name}. Consider adding one via Discovery.</div>
      </div>
    `;
  }
}

// ══════════════════════════════════════════════════════════
// Gap Analyzer
// ══════════════════════════════════════════════════════════

function renderGapAnalyzer() {
  renderMatrix();
  renderSuggestions();
}

function renderMatrix() {
  const container = document.getElementById('gap-matrix');
  if (!container) return;

  // Build matrix
  const matrix = {};
  movementTypes.forEach(m => {
    matrix[m] = {};
    watchCategories.forEach(c => {
      matrix[m][c] = watchCollection.some(watch => {
        const movementMatch = watch.movement.toLowerCase().includes(m.toLowerCase()) ||
          (m === 'Solar/Tough Solar' && (watch.movement.includes('Solar') || watch.movement.includes('Eco')));
        const categoryMatch = watch.type.some(t => t.toLowerCase() === c.toLowerCase()) ||
          (c === 'Chronograph' && watch.complications.includes('Chronograph')) ||
          (c === 'Digital' && watch.type.some(t => t.toLowerCase().includes('digital')));
        return movementMatch && categoryMatch;
      });
    });
  });

  container.innerHTML = `
    <div class="gap-matrix-title">📊 Coverage Matrix</div>
    <div class="matrix-grid" style="--cols: ${watchCategories.length}">
      <div class="matrix-row">
        <div class="matrix-header"></div>
        ${watchCategories.map(c => `<div class="matrix-header">${c.substring(0, 5)}</div>`).join('')}
      </div>
      ${movementTypes.map(m => `
        <div class="matrix-row">
          <div class="matrix-label">${m}</div>
          ${watchCategories.map(c => `
            <div class="matrix-cell ${matrix[m][c] ? 'filled' : 'empty'}" title="${m} ${c}">
              ${matrix[m][c] ? '✓' : '·'}
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

function renderSuggestions() {
  const container = document.getElementById('gap-suggestions');
  if (!container) return;

  // Find gaps
  const gaps = [];
  const priorityGaps = [
    { movement: 'Automatic', category: 'Diver', priority: 'high', reason: 'Essential for any serious collection—the automatic diver is a horological cornerstone.' },
    { movement: 'Manual-Wind', category: 'Chronograph', priority: 'high', reason: 'A hand-wound chronograph showcases pure mechanical artistry.' },
    { movement: 'Automatic', category: 'Field', priority: 'medium', reason: 'A rugged field watch fills the gap between dress and sports.' },
    { movement: 'Quartz', category: 'Pilot', priority: 'medium', reason: 'A quartz pilot watch offers precise aviation readability.' },
    { movement: 'Solar/Tough Solar', category: 'Diver', priority: 'low', reason: 'Solar-powered divers combine eco-consciousness with aquatic utility.' },
    { movement: 'Manual-Wind', category: 'Field', priority: 'low', reason: 'A vintage-inspired manual-wind field piece adds heritage character.' },
  ];

  // Check which gaps actually exist
  priorityGaps.forEach(gap => {
    const exists = watchCollection.some(watch => {
      const movementMatch = watch.movement.toLowerCase().includes(gap.movement.toLowerCase()) ||
        (gap.movement === 'Solar/Tough Solar' && (watch.movement.includes('Solar') || watch.movement.includes('Eco')));
      const categoryMatch = watch.type.some(t => t.toLowerCase() === gap.category.toLowerCase()) ||
        (gap.category === 'Chronograph' && watch.complications.includes('Chronograph'));
      return movementMatch && categoryMatch;
    });
    if (!exists) {
      gaps.push(gap);
    }
  });

  container.innerHTML = `
    <div class="gap-suggestions-title">💡 Suggested Acquisitions</div>
    ${gaps.length > 0 ? gaps.map((gap, i) => `
      <div class="suggestion-item animate-in" style="transition-delay: ${i * 0.1}s">
        <div class="suggestion-priority ${gap.priority}">
          ${gap.priority === 'high' ? '!' : gap.priority === 'medium' ? '~' : '○'}
        </div>
        <div class="suggestion-content">
          <h4>${gap.movement} ${gap.category}</h4>
          <p>${gap.reason}</p>
        </div>
      </div>
    `).join('') : `
      <div class="empty-state">
        <div class="empty-state-icon">🏆</div>
        <div class="empty-state-text">Impressive! Your collection covers all critical categories.</div>
      </div>
    `}
  `;

  // Animate
  requestAnimationFrame(() => {
    container.querySelectorAll('.animate-in').forEach(el => el.classList.add('visible'));
  });
}

// ══════════════════════════════════════════════════════════
// Discovery Engine — Powered by thewatchapi.com
// ══════════════════════════════════════════════════════════

const WATCH_API_BASE = '/api/watch';
let discoveryCache = {};
let selectedBrand = '';
let isLoading = false;

function initDiscoveryAPI() {
  loadBrandList();
  // Auto-search popular watches on load
  selectBrand('Rolex', null);
}


// ── Brand List ──────────────────────────────────────────
async function loadBrandList() {
  try {
    const response = await fetch(`${WATCH_API_BASE}/brand/list`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();

    if (data.data && Array.isArray(data.data)) {
      renderBrandPills(data.data);
    }
  } catch (err) {
    console.error('Failed to load brand list:', err);
  }
}

function renderBrandPills(brands) {
  const container = document.getElementById('brand-pills');
  if (!container) return;

  // Show popular brands first, then allow "Show All"
  const popularBrands = ['Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'TAG Heuer',
    'Cartier', 'IWC', 'Breitling', 'Panerai', 'Tudor', 'Seiko', 'Zenith',
    'Hublot', 'Jaeger-LeCoultre', 'Vacheron Constantin'];
  
  const featured = brands.filter(b => popularBrands.includes(b));
  const remaining = brands.filter(b => !popularBrands.includes(b));

  container.innerHTML = `
    <button class="brand-pill ${selectedBrand === '' ? 'active' : ''}" onclick="selectBrand('', this)">All</button>
    ${featured.map(brand => `
      <button class="brand-pill ${selectedBrand === brand ? 'active' : ''}" 
              onclick="selectBrand('${brand.replace(/'/g, "\\'")}', this)">${brand}</button>
    `).join('')}
    <button class="brand-pill brand-pill-more" id="show-all-brands-btn" onclick="showAllBrands()">
      +${remaining.length} more
    </button>
  `;

  // Store for "show all"
  container.dataset.allBrands = JSON.stringify(remaining);
}

function showAllBrands() {
  const container = document.getElementById('brand-pills');
  const moreBtn = document.getElementById('show-all-brands-btn');
  if (!container || !moreBtn) return;

  const remaining = JSON.parse(container.dataset.allBrands || '[]');
  const extraHtml = remaining.map(brand => `
    <button class="brand-pill" onclick="selectBrand('${brand.replace(/'/g, "\\'")}', this)">${brand}</button>
  `).join('');

  moreBtn.outerHTML = extraHtml;
}

function selectBrand(brand, btn) {
  selectedBrand = brand;

  // Update active state
  document.querySelectorAll('.brand-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  // Search with selected brand
  const searchInput = document.getElementById('discovery-search-input');
  const query = searchInput ? searchInput.value.trim() : '';

  if (brand || query) {
    performApiSearch(query);
  } else {
    document.getElementById('discovery-grid').innerHTML = '';
  }
}

// ── API Search ──────────────────────────────────────────
function searchDiscovery() {
  const input = document.getElementById('discovery-search-input');
  const query = input ? input.value.trim() : '';
  
  if (!query && !selectedBrand) {
    // Show hint
    const grid = document.getElementById('discovery-grid');
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">Enter a search term or select a brand to explore watches</div>
      </div>
    `;
    return;
  }

  performApiSearch(query);
}

async function performApiSearch(query) {
  if (isLoading) return;

  isLoading = true;
  showLoading(true);

  const searchAttrs = document.getElementById('search-attributes');
  const filterMovement = document.getElementById('filter-movement');
  const filterCaseMaterial = document.getElementById('filter-case-material');

  // Build URL
  const params = new URLSearchParams();
  
  if (query) params.append('search', query);
  if (searchAttrs && searchAttrs.value && query) params.append('search_attributes', searchAttrs.value);
  if (selectedBrand) params.append('brand', selectedBrand);
  if (filterMovement && filterMovement.value) params.append('movement', filterMovement.value);
  if (filterCaseMaterial && filterCaseMaterial.value) params.append('case_material', filterCaseMaterial.value);

  const url = `${WATCH_API_BASE}/model/search?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 400) {
        try {
          const errData = await response.json();
          if (errData && errData.error && errData.error.code === 'too_many_results') {
             showApiError('There are too many watches in this brand! Please type a specific model or reference number in the search bar above to narrow down your results.');
             return;
          }
        } catch(e) {}
      }
      
      if (response.status === 401 || response.status === 403) {
        showApiError('Unauthorized: Your API token is invalid or expired.');
      } else if (response.status === 429 || response.status === 402) {
        showApiError('API Limit Reached. Please wait before trying again or check your token credits.');
      } else {
        showApiError(`API error: ${response.status} ${response.statusText}`);
      }
      return;
    }
    const data = await response.json();

    if (data.error) {
      showApiError(data.error);
      return;
    }

    if (data.data && Array.isArray(data.data)) {
      renderDiscoveryResults(data.data, query);
    } else {
      renderDiscoveryResults([], query);
    }
  } catch (err) {
    console.error('API request failed:', err);
    if (err.message && err.message.includes('Failed to fetch')) {
      showApiError('Network error — this is often caused by an invalid API Token (CORS block). Please verify your token.');
    } else {
      showApiError('Network error — please check your connection and try again.');
    }
  } finally {
    isLoading = false;
    showLoading(false);
  }
}

function showLoading(show) {
  const loader = document.getElementById('discovery-loading');
  const grid = document.getElementById('discovery-grid');
  
  if (loader) loader.style.display = show ? 'flex' : 'none';
  if (grid && show) grid.innerHTML = '';
}

function showApiError(message) {
  const grid = document.getElementById('discovery-grid');
  grid.innerHTML = `
    <div class="empty-state" style="grid-column: 1 / -1;">
      <div class="empty-state-icon">⚠️</div>
      <div class="empty-state-text" style="color: var(--clr-danger);">${message}</div>
      <p style="color: var(--clr-text-muted); margin-top: var(--space-md); font-size: 0.85rem;">
        Make sure your API token is valid. <a href="https://www.thewatchapi.com/register" target="_blank" style="color: var(--clr-gold);">Get a free token →</a>
      </p>
    </div>
  `;
}

// ── Render Discovery Results ────────────────────────────
function renderDiscoveryResults(watches, query) {
  const grid = document.getElementById('discovery-grid');
  const info = document.getElementById('discovery-results-info');
  if (!grid) return;

  // Show results info
  if (info) {
    info.style.display = 'flex';
    info.innerHTML = `
      <span class="results-count">${watches.length} result${watches.length !== 1 ? 's' : ''}</span>
      <span class="results-query">for "${query}"</span>
    `;
  }

  if (watches.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🔭</div>
        <div class="empty-state-text">No watches found for "${query}". Try a different search or adjust filters.</div>
      </div>
    `;
    return;
  }

  grid.innerHTML = watches.map((watch, i) => `
    <div class="discovery-card animate-in" style="transition-delay: ${Math.min(i * 0.06, 1)}s" onclick="openDiscoveryModal(${i})">
      <div class="discovery-card-accent"></div>
      ${watch.image ? `<div class="discovery-card-img"><img src="${watch.image}" alt="${watch.brand} ${watch.model}" onerror="this.onerror=null;this.src='/default_watch_bg.jpg';this.style.objectFit='cover';"></div>` : `<div class="discovery-card-img"><img src="/default_watch_bg.jpg" alt="No image available" style="object-fit: cover;"></div>`}
      <div class="discovery-card-header">
        <div>
          <div class="discovery-card-brand">${watch.brand || 'Unknown'}</div>
          <div class="discovery-card-model">${watch.model || 'Unknown Model'}</div>
          ${watch.reference_number ? `<div class="discovery-card-ref">Ref. ${watch.reference_number}</div>` : ''}
        </div>
        <button class="add-wishlist-btn ${wishlist.has(watch.reference_number || watch.model) ? 'added' : ''}" 
                onclick="event.stopPropagation(); toggleWishlist('${(watch.reference_number || watch.model || '').replace(/'/g, "\\'")}')" 
                title="${wishlist.has(watch.reference_number || watch.model) ? 'Remove from Wishlist' : 'Add to Wishlist'}">
          ${wishlist.has(watch.reference_number || watch.model) ? '♥' : '♡'}
        </button>
      </div>
      <div class="discovery-card-specs">
        ${watch.movement ? `<span class="discovery-spec"><span class="spec-icon">${getMovementIcon(watch.movement)}</span> ${watch.movement}</span>` : ''}
        ${watch.case_material ? `<span class="discovery-spec">🔩 ${watch.case_material}</span>` : ''}
        ${watch.case_diameter ? `<span class="discovery-spec">📐 ${watch.case_diameter}</span>` : ''}
        ${watch.year_of_production ? `<span class="discovery-spec">📅 ${watch.year_of_production}</span>` : ''}
      </div>
      ${watch.description ? `<div class="discovery-card-desc">${watch.description.substring(0, 150)}${watch.description.length > 150 ? '...' : ''}</div>` : ''}
      <div class="discovery-card-footer">
        <span class="discovery-view-btn">View Details →</span>
        ${watch.last_updated ? `<span class="discovery-updated">Updated ${formatDate(watch.last_updated)}</span>` : ''}
      </div>
    </div>
  `).join('');

  // Store results for modal access
  window._discoveryResults = watches;

  // Animate in
  requestAnimationFrame(() => {
    grid.querySelectorAll('.animate-in').forEach(el => el.classList.add('visible'));
  });
}

function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// ── Discovery Detail Modal ──────────────────────────────
function openDiscoveryModal(index) {
  const watches = window._discoveryResults;
  if (!watches || !watches[index]) return;

  const watch = watches[index];
  const modal = document.getElementById('watch-modal');

  modal.innerHTML = `
    <div class="modal discovery-modal" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="closeModal()">✕</button>
      <div class="modal-body" style="padding-top: var(--space-3xl);">
        ${watch.image ? `<div style="text-align: center; margin-bottom: var(--space-lg);"><img src="${watch.image}" alt="${watch.brand} ${watch.model}" style="max-height: 250px; max-width: 100%; object-fit: contain; border-radius: var(--radius-md);" onerror="this.onerror=null;this.src='/default_watch_bg.jpg';this.style.objectFit='cover';"></div>` : `<div style="text-align: center; margin-bottom: var(--space-lg);"><img src="/default_watch_bg.jpg" alt="No image available" style="max-height: 250px; max-width: 100%; object-fit: cover; border-radius: var(--radius-md);"></div>`}
        <div class="modal-brand">${watch.brand || ''}</div>
        <div class="modal-model">${watch.model || ''}</div>
        ${watch.reference_number ? `<div class="discovery-modal-ref">Ref. ${watch.reference_number}</div>` : ''}

        <div class="modal-specs-grid" style="margin-top: var(--space-xl);">
          ${watch.movement ? `
          <div class="modal-spec">
            <div class="modal-spec-label">Movement</div>
            <div class="modal-spec-value">${watch.movement}</div>
          </div>` : ''}
          ${watch.case_material ? `
          <div class="modal-spec">
            <div class="modal-spec-label">Case Material</div>
            <div class="modal-spec-value">${watch.case_material}</div>
          </div>` : ''}
          ${watch.case_diameter ? `
          <div class="modal-spec">
            <div class="modal-spec-label">Case Diameter</div>
            <div class="modal-spec-value">${watch.case_diameter}</div>
          </div>` : ''}
          ${watch.crystal ? `
          <div class="modal-spec">
            <div class="modal-spec-label">Crystal</div>
            <div class="modal-spec-value">${watch.crystal}</div>
          </div>` : ''}
          ${watch.water_resistance ? `
          <div class="modal-spec">
            <div class="modal-spec-label">Water Resistance</div>
            <div class="modal-spec-value">${watch.water_resistance}</div>
          </div>` : ''}
          ${watch.caliber ? `
          <div class="modal-spec">
            <div class="modal-spec-label">Caliber</div>
            <div class="modal-spec-value">${watch.caliber}</div>
          </div>` : ''}
          ${watch.year_of_production ? `
          <div class="modal-spec">
            <div class="modal-spec-label">Years of Production</div>
            <div class="modal-spec-value">${watch.year_of_production}</div>
          </div>` : ''}
          ${watch.reference_number ? `
          <div class="modal-spec">
            <div class="modal-spec-label">Reference</div>
            <div class="modal-spec-value">${watch.reference_number}</div>
          </div>` : ''}
          ${watch.last_updated ? `
          <div class="modal-spec">
            <div class="modal-spec-label">Last Updated</div>
            <div class="modal-spec-value">${formatDate(watch.last_updated)}</div>
          </div>` : ''}
        </div>

        ${watch.description ? `
        <div style="margin-top: var(--space-xl);">
          <div class="spec-label" style="margin-bottom: var(--space-sm); font-size: 0.7rem;">Description</div>
          <div class="discovery-modal-desc">${watch.description}</div>
        </div>` : ''}

        <div style="margin-top: var(--space-xl); display: flex; gap: var(--space-md);">
          <button class="btn btn-primary" onclick="toggleWishlist('${(watch.reference_number || watch.model || '').replace(/'/g, "\\'")}'); openDiscoveryModal(${index});">
            ${wishlist.has(watch.reference_number || watch.model) ? '♥ In Wishlist' : '♡ Add to Wishlist'}
          </button>
          <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ── Legacy Discovery (fallback when not connected) ──────
function renderDiscovery(query = '') {
  if (apiToken) return; // API mode active, skip fallback
  
  const grid = document.getElementById('discovery-grid');
  if (!grid) return;

  // Show setup prompt when no API key
  grid.innerHTML = `
    <div class="empty-state" style="grid-column: 1 / -1;">
      <div class="empty-state-icon">🌐</div>
      <div class="empty-state-text">Connect your API key above to explore thousands of watches from the global database.</div>
    </div>
  `;
}

function toggleWishlist(id) {
  if (!id) return;
  if (wishlist.has(id)) {
    wishlist.delete(id);
  } else {
    wishlist.add(id);
  }
  // Re-render if we have results
  if (window._discoveryResults) {
    renderDiscoveryResults(window._discoveryResults, document.getElementById('discovery-search-input')?.value || '');
  }
}

// ══════════════════════════════════════════════════════════
// Stats
// ══════════════════════════════════════════════════════════

function updateStats() {
  const owned = watchCollection.filter(w => w.in_collection).length;
  const wishlistCount = watchCollection.filter(w => !w.in_collection).length;
  const brands = new Set(watchCollection.map(w => w.brand)).size;
  const movements = new Set(watchCollection.map(w => w.movement)).size;

  const els = {
    'stat-total': owned,
    'stat-wishlist': wishlistCount,
    'stat-brands': brands,
    'stat-movements': movements
  };

  Object.entries(els).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) animateNumber(el, val);
  });

  // Hero stats
  const heroTotal = document.getElementById('hero-stat-total');
  const heroBrands = document.getElementById('hero-stat-brands');
  const heroMovements = document.getElementById('hero-stat-movements');
  if (heroTotal) animateNumber(heroTotal, owned);
  if (heroBrands) animateNumber(heroBrands, brands);
  if (heroMovements) animateNumber(heroMovements, movements);
}

function animateNumber(el, target) {
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ══════════════════════════════════════════════════════════
// Scroll Animations
// ══════════════════════════════════════════════════════════

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

// ── Keyboard handler for modal ──────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ── Search on Enter key ─────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.id === 'discovery-search-input') {
    searchDiscovery();
  }
});

// -- Custom Glass Select ---------------------------------
function getTriggerText(select) {
  if (select.multiple) {
    const selected = Array.from(select.selectedOptions).filter(opt => !opt.disabled && opt.value !== "");
    if (selected.length === 0) return 'Select...';
    if (selected.length === 1) return selected[0].text;
    return `${selected.length} Selected`;
  } else {
    const selectedOption = select.options[select.selectedIndex];
    return selectedOption ? selectedOption.text : 'Select...';
  }
}

function initCustomSelects() {
  const selects = document.querySelectorAll('select.filter-select');
  selects.forEach(select => {
    if (select.nextElementSibling && select.nextElementSibling.classList.contains('custom-select-wrapper')) return;
    
    select.style.display = 'none';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';
    
    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';
    trigger.textContent = getTriggerText(select);
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'custom-select-options';
    
    Array.from(select.options).forEach((opt, index) => {
      if (opt.disabled) return;
      const optionEl = document.createElement('div');
      optionEl.className = 'custom-select-option';
      if (opt.selected) optionEl.classList.add('selected');
      optionEl.textContent = opt.text;
      
      optionEl.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (select.multiple) {
          opt.selected = !opt.selected;
          optionEl.classList.toggle('selected');
          trigger.textContent = getTriggerText(select);
        } else {
          select.selectedIndex = index;
          trigger.textContent = opt.text;
          optionsContainer.classList.remove('open');
          Array.from(optionsContainer.children).forEach(c => c.classList.remove('selected'));
          optionEl.classList.add('selected');
        }
        select.dispatchEvent(new Event('change'));
      });
      optionsContainer.appendChild(optionEl);
    });
    
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.custom-select-options.open').forEach(el => {
        if (el !== optionsContainer) el.classList.remove('open');
      });
      optionsContainer.classList.toggle('open');
    });
    
    wrapper.appendChild(trigger);
    wrapper.appendChild(optionsContainer);
    select.parentNode.insertBefore(wrapper, select.nextSibling);
  });
  
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
      if (!wrapper.contains(e.target)) {
        const options = wrapper.querySelector('.custom-select-options');
        if (options) options.classList.remove('open');
      }
    });
  }, { capture: true });
}

function syncCustomSelects() {
  const selects = document.querySelectorAll('select.filter-select');
  selects.forEach(select => {
    const wrapper = select.nextElementSibling;
    if (wrapper && wrapper.classList.contains('custom-select-wrapper')) {
      const trigger = wrapper.querySelector('.custom-select-trigger');
      trigger.textContent = getTriggerText(select);
      
      const optionsContainer = wrapper.querySelector('.custom-select-options');
      Array.from(optionsContainer.children).forEach((child) => {
        const matchingOpt = Array.from(select.options).find(o => !o.disabled && o.text === child.textContent);
        if (matchingOpt && matchingOpt.selected) {
          child.classList.add('selected');
        } else {
          child.classList.remove('selected');
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => setTimeout(initCustomSelects, 100));
const originalRenderGalleryGlass = typeof renderGallery !== 'undefined' ? renderGallery : null;
if (originalRenderGalleryGlass) {
  renderGallery = function(filter = 'all') {
    originalRenderGalleryGlass(filter);
    setTimeout(initCustomSelects, 50);
  }
}

function predictOccasions(mode) {
  const prefix = mode === 'new' ? 'new-watch-' : 'edit-watch-';
  
  const typeStr = (document.getElementById(prefix + 'type').value || '').toLowerCase();
  
  const compSelect = document.getElementById(prefix + 'complications');
  const comps = compSelect ? Array.from(compSelect.selectedOptions).map(c => c.value.toLowerCase()) : [];
  
  const featSelect = document.getElementById(prefix + 'features');
  const feats = featSelect ? Array.from(featSelect.selectedOptions).map(f => f.value.toLowerCase()) : [];
  
  const wrStr = (document.getElementById(prefix + 'water-resistance').value || '').toLowerCase();
  
  let wrValue = 0;
  if (wrStr.includes('m')) {
    const match = wrStr.match(/(\d+)/);
    if (match) wrValue = parseInt(match[1]);
  } else if (wrStr.includes('atm') || wrStr.includes('bar')) {
    const match = wrStr.match(/(\d+)/);
    if (match) wrValue = parseInt(match[1]) * 10;
  }
  
  let predicted = new Set();
  
  if (typeStr.includes('casual') || typeStr.includes('field') || typeStr.includes('pilot') || typeStr.includes('ana-digi') || typeStr.includes('solar')) {
    predicted.add('Everyday');
    predicted.add('Casual');
  }
  
  if (typeStr.includes('dress') || typeStr.includes('luxury') || comps.includes('moonphase') || comps.includes('tourbillon') || comps.includes('perpetual calendar') || comps.includes('minute repeater') || feats.includes('enamel dial') || feats.includes('guilloche dial')) {
    predicted.add('Formal / Dress');
  }
  
  if (typeStr.includes('sport') || typeStr.includes('diver') || typeStr.includes('racing') || wrValue >= 100 || comps.includes('chronograph') || feats.includes('rotating bezel') || feats.includes('screw-down crown') || feats.includes('lume')) {
    predicted.add('Sport / Active');
  }
  
  if (typeStr.includes('gmt') || typeStr.includes('worldtimer') || comps.includes('gmt hand') || comps.includes('world time') || comps.includes('dual time')) {
    predicted.add('Travel');
  }
  
  if (typeStr.includes('tool') || feats.includes('helium escape valve') || feats.includes('anti-magnetic') || wrValue >= 200 || comps.includes('stopwatch/timing') || comps.includes('countdown timer')) {
    predicted.add('Professional / Tool');
  }
  
  if (predicted.size === 0) {
    predicted.add('Everyday');
  }
  
  const occSelect = document.getElementById(prefix + 'occasions');
  if (occSelect) {
    Array.from(occSelect.options).forEach(opt => {
      opt.selected = predicted.has(opt.value);
    });
    if (typeof syncCustomSelects === 'function') syncCustomSelects();
  }
}
