const SLIDES = [
    {
    name: "AA6925",
    file: "AA6925.svs",
    dimensions: [159359, 89525],
    tilesFound: 7749,
    tilesProcessed: 7749,
    deepzoomLevel: 17,
    tileSize: 784
    },
    {
    name: "M2532479",
    file: "M2532479.svs",
    dimensions: [145416, 94249],
    tilesFound: 7013,
    tilesProcessed: 7013,
    deepzoomLevel: 17,
    tileSize: 784
    },
    {
    name: "M2742956",
    file: "M2742956.svs",
    dimensions: [127487, 95866],
    tilesFound: 6957,
    tilesProcessed: 6957,
    deepzoomLevel: 17,
    tileSize: 784
    },
    {
    name: "Z1011803",
    file: "Z1011803.svs",
    dimensions: [113543, 80995],
    tilesFound: 4883,
    tilesProcessed: 4883,
    deepzoomLevel: 17,
    tileSize: 784
    },
    {
    name: "Z1230358",
    file: "Z1230358.svs",
    dimensions: [145416, 93269],
    tilesFound: 8338,
    tilesProcessed: 8338,
    deepzoomLevel: 17,
    tileSize: 784
    }
    ];
    
    const CELL_TYPES = [
    { name: "Epithelial", color: "#3b82f6" },
    { name: "Lymphocyte", color: "#8b5cf6" },
    { name: "Macrophage", color: "#ec4899" },
    { name: "Neutrophil", color: "#f59e0b" },
    { name: "Plasmocyte", color: "#10b981" },
    { name: "Fibroblast", color: "#06b6d4" },
    { name: "Endothelial", color: "#ef4444" },
    { name: "Mast", color: "#84cc16" },
    { name: "Adipocyte", color: "#f97316" },
    { name: "Muscle", color: "#a855f7" },
    { name: "Nerve", color: "#14b8a6" },
    { name: "Other", color: "#6b7280" },
    { name: "Undefined", color: "#9ca3af" }
    ];
    
    document.addEventListener('DOMContentLoaded', () => {
    renderStatsGrid();
    renderSlidesGrid();
    renderCharts();
    setupScrollSpy();
    updateHeroStats();
    });
    
    function updateHeroStats() {
    const totalTiles = SLIDES.reduce((sum, s) => sum + s.tilesProcessed, 0);
    const totalSlidesEl = document.getElementById('totalSlides');
    const totalTilesEl = document.getElementById('totalTiles');
    if (totalSlidesEl) totalSlidesEl.textContent = SLIDES.length;
    if (totalTilesEl) totalTilesEl.textContent = totalTiles.toLocaleString();
    }
    
    function renderStatsGrid() {
    const grid = document.getElementById('statsGrid');
    if (!grid) return;
    const totalTiles = SLIDES.reduce((sum, s) => sum + s.tilesProcessed, 0);
    const totalArea = SLIDES.reduce((sum, s) => sum + (s.dimensions[0] * s.dimensions[1]), 0);
    const avgTiles = Math.round(totalTiles / SLIDES.length);
    const stats = [
    { icon: '🔬', label: 'Total Slides', value: SLIDES.length, sub: 'H&E stained WSIs' },
    { icon: '🧩', label: 'Total Tiles', value: totalTiles.toLocaleString(), sub: 'Processed across all slides' },
    { icon: '📐', label: 'Average Tiles', value: avgTiles.toLocaleString(), sub: 'Per slide' },
    { icon: '🎯', label: 'Total Area', value: (totalArea / 1e9).toFixed(1) + ' Gpx²', sub: 'Combined slide area' }
    ];
    grid.innerHTML = stats.map(stat => `
    <div class="stat-card">
    <div class="stat-icon">${stat.icon}</div>
    <div class="stat-label">${stat.label}</div>
    <div class="stat-value">${stat.value}</div>
    <div class="stat-sub">${stat.sub}</div>
    </div>
    `).join('');
    }
    
    function renderSlidesGrid() {
    const grid = document.getElementById('slidesGrid');
    if (!grid) return;
    grid.innerHTML = SLIDES.map((slide, index) => `
    <div class="slide-card" style="animation-delay: ${index * 0.1}s">
    <div class="slide-header">
    <span class="slide-name">${slide.name}</span>
    <span class="slide-badge">Processed</span>
    </div>
    <div class="slide-body">
    <div class="slide-stats">
    <div class="slide-stat">
    <div class="slide-stat-label">Tiles</div>
    <div class="slide-stat-value">${slide.tilesProcessed.toLocaleString()}</div>
    </div>
    <div class="slide-stat">
    <div class="slide-stat-label">Dimensions</div>
    <div class="slide-stat-value" style="font-size: 0.75rem; font-weight: 600;">
    ${slide.dimensions[0].toLocaleString()} × ${slide.dimensions[1].toLocaleString()}
    </div>
    </div>
    </div>
    <div class="slide-actions">
    <button class="btn btn-primary" onclick="openModal('${slide.name}')">View Details</button>
    <button class="btn btn-secondary" onclick="openImageModal('${slide.name}')">Tile Map</button>
    </div>
    </div>
    </div>
    `).join('');
    }
    
    function renderCharts() {
    renderTileChart();
    renderCoverageChart();
    }
    
    function renderTileChart() {
    const canvas = document.getElementById('tileChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const labels = SLIDES.map(s => s.name);
    const data = SLIDES.map(s => s.tilesProcessed);
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 30, right: 20, bottom: 70, left: 55 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...data) * 1.15;
    const slotWidth = chartWidth / data.length;
    const barWidth = slotWidth * 0.5;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillStyle = '#b8bec7';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(maxValue - (maxValue / 5) * i).toLocaleString(), padding.left - 8, y);
    }
    data.forEach((value, i) => {
    const slotX = padding.left + slotWidth * i;
    const x = slotX + (slotWidth - barWidth) / 2;
    const barHeight = (value / maxValue) * chartHeight;
    const y = padding.top + chartHeight - barHeight;
    const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [5, 5, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#6b7280';
    ctx.font = '500 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(value.toLocaleString(), x + barWidth / 2, y - 4);
    ctx.save();
    ctx.translate(slotX + slotWidth / 2, padding.top + chartHeight + 12);
    ctx.rotate(-Math.PI / 5);
    ctx.fillStyle = '#9ca3af';
    ctx.font = '400 9px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(labels[i], 0, 0);
    ctx.restore();
    });
    }
    
    function renderCoverageChart() {
    const canvas = document.getElementById('coverageChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const labels = SLIDES.map(s => s.name);
    const data = SLIDES.map(s => s.tilesProcessed);
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2 - 30;
    const radius = Math.min(width * 0.16, height * 0.22);
    const innerRadius = radius * 0.72;
    const total = data.reduce((a, b) => a + b, 0);
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    let startAngle = -Math.PI / 2;
    ctx.clearRect(0, 0, width, height);
    data.forEach((value, i) => {
    const sliceAngle = (value / total) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    startAngle = endAngle;
    });
    ctx.fillStyle = '#374151';
    ctx.font = '600 13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toLocaleString(), centerX, centerY - 3);
    ctx.fillStyle = '#b8bec7';
    ctx.font = '400 9px Inter, sans-serif';
    ctx.fillText('Total Tiles', centerX, centerY + 11);
    const cols = 3;
    const rowGap = 20;
    const legendTop = height - 55;
    const colWidth = width / cols;
    labels.forEach((label, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = col * colWidth + colWidth / 2;
    const y = legendTop + row * rowGap;
    const dotX = x - 28;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(dotX, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9ca3af';
    ctx.font = '400 9px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, dotX + 8, y);
    });
    }
    
    function openModal(slideName) {
    const slide = SLIDES.find(s => s.name === slideName);
    if (!slide) return;
    const modal = document.getElementById('slideModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    title.textContent = slide.file;
    body.innerHTML = `
    <div class="modal-stat-grid">
    <div class="modal-stat">
    <div class="modal-stat-label">Tiles Found</div>
    <div class="modal-stat-value">${slide.tilesFound.toLocaleString()}</div>
    </div>
    <div class="modal-stat">
    <div class="modal-stat-label">Tiles Processed</div>
    <div class="modal-stat-value">${slide.tilesProcessed.toLocaleString()}</div>
    </div>
    <div class="modal-stat">
    <div class="modal-stat-label">Deepzoom Level</div>
    <div class="modal-stat-value">${slide.deepzoomLevel}</div>
    </div>
    <div class="modal-stat">
    <div class="modal-stat-label">Tile Size</div>
    <div class="modal-stat-value">${slide.tileSize}px</div>
    </div>
    </div>
    <div style="background: var(--gray-50); padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-5);">
    <h4 style="font-size: 0.6875rem; font-weight: 600; color: var(--gray-400); margin-bottom: var(--space-3); text-transform: uppercase; letter-spacing: 0.06em;">Slide Information</h4>
    <table style="width: 100%; font-size: 0.8125rem;">
    <tr style="border-bottom: 1px solid var(--gray-200);">
    <td style="padding: var(--space-2) 0; font-weight: 400; color: var(--gray-500);">Dimensions</td>
    <td style="padding: var(--space-2) 0; text-align: right; font-family: var(--font-mono); font-size: 0.75rem; color: var(--gray-700);">${slide.dimensions[0].toLocaleString()} × ${slide.dimensions[1].toLocaleString()} px</td>
    </tr>
    <tr style="border-bottom: 1px solid var(--gray-200);">
    <td style="padding: var(--space-2) 0; font-weight: 400; color: var(--gray-500);">Total Area</td>
    <td style="padding: var(--space-2) 0; text-align: right; font-family: var(--font-mono); font-size: 0.75rem; color: var(--gray-700);">${((slide.dimensions[0] * slide.dimensions[1]) / 1e9).toFixed(2)} Gpx²</td>
    </tr>
    <tr>
    <td style="padding: var(--space-2) 0; font-weight: 400; color: var(--gray-500);">Coverage</td>
    <td style="padding: var(--space-2) 0; text-align: right; font-family: var(--font-mono); font-size: 0.75rem; color: var(--gray-700);">100%</td>
    </tr>
    </table>
    </div>
    <div style="background: var(--gray-50); padding: var(--space-4); border-radius: var(--radius-lg);">
    <h4 style="font-size: 0.6875rem; font-weight: 600; color: var(--gray-400); margin-bottom: var(--space-3); text-transform: uppercase; letter-spacing: 0.06em;">Cell Types Detected</h4>
    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
    ${CELL_TYPES.map(ct => `
    <span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; background: white; border: 1px solid var(--gray-200); border-radius: var(--radius-full); font-size: 0.6875rem; font-weight: 400; color: var(--gray-500);">
    <span style="width: 6px; height: 6px; border-radius: 50%; background: ${ct.color};"></span>
    ${ct.name}
    </span>
    `).join('')}
    </div>
    </div>
    `;
    modal.classList.add('active');
    }
    
    function openImageModal(slideName) {
    const slide = SLIDES.find(s => s.name === slideName);
    if (!slide) return;
    const modal = document.getElementById('slideModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    title.textContent = slide.name + ' — Tile Map';
    body.innerHTML = `
    <img
    src="${slide.name}_tile_map.png"
    alt="${slide.name} tile map"
    style="width: 100%; height: auto; border-radius: var(--radius-lg); display: block;"
    />
    `;
    modal.classList.add('active');
    }
    
    function closeModal() {
    document.getElementById('slideModal').classList.remove('active');
    }
    
    document.addEventListener('click', (e) => {
    const modal = document.getElementById('slideModal');
    if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    });
    
    function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
    current = section.getAttribute('id');
    }
    });
    navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
    link.classList.add('active');
    }
    });
    });
    }
    
    if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    if (typeof radii === 'number') radii = [radii, radii, radii, radii];
    if (!Array.isArray(radii)) radii = [0, 0, 0, 0];
    const [tl, tr, br, bl] = radii;
    this.beginPath();
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br);
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
    return this;
    };
    }
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
    renderCharts();
    }, 250);
    });