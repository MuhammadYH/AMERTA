/* AMERTA — Smart Heritage Monitoring System
   Shared interactions + Chart.js setups.
   Each chart only initializes if its canvas exists on the current page. */

/* Foto situs — Wikimedia Commons (Special:FilePath, dilisensikan CC).
   Dipakai bersama oleh modal Detail Situs dan penanda Peta & Lokasi. */
const SITE_PHOTOS = {
  'Candi Tikus': 'https://commons.wikimedia.org/wiki/Special:FilePath/Candi%20Tikus.jpg?width=600',
  'Candi Bajang Ratu': 'https://commons.wikimedia.org/wiki/Special:FilePath/Candi%20Bajang%20Ratu.jpg?width=600',
  'Candi Brahu': 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahu%20Temple%20Trowulan.jpg?width=600',
  'Gapura Wringin Lawang': 'https://commons.wikimedia.org/wiki/Special:FilePath/Wringin%20Lawang%2C%20Trowulan.jpg?width=600',
  'Kolam Segaran': 'https://commons.wikimedia.org/wiki/Special:FilePath/Kolam%20Segaran%20di%20Kawasan%20Arkeologis%20Trowulan%20Mojokerto.jpg?width=600',
  'Pendopo Agung Trowulan': 'https://commons.wikimedia.org/wiki/Special:FilePath/TEMPAT%20IKRAR%20PATIH%20GADJAH%20MADA.jpg?width=600',
};

/* Koordinat asli 6 situs di Kawasan Trowulan (BPCB Jatim / Wikidata). */
const SITE_LOCATIONS = [
  { name: 'Candi Tikus', lat: -7.5718, lng: 112.4035, status: 'up', zone: 'Zona inti A · zona bata merah' },
  { name: 'Candi Bajang Ratu', lat: -7.5677, lng: 112.3988, status: 'up', zone: 'Zona inti A · zona bata merah' },
  { name: 'Candi Brahu', lat: -7.5430, lng: 112.3745, status: 'up', zone: 'Zona inti B' },
  { name: 'Gapura Wringin Lawang', lat: -7.5419, lng: 112.3910, status: 'warn', zone: 'Zona inti B · getaran di atas ambang' },
  { name: 'Kolam Segaran', lat: -7.5578, lng: 112.3818, status: 'up', zone: 'Zona penyangga' },
  { name: 'Pendopo Agung Trowulan', lat: -7.5663, lng: 112.3800, status: 'up', zone: 'Zona penyangga (gateway pusat)', gateway: true },
];

document.addEventListener('DOMContentLoaded', () => {

  /* ---- generic Chart.js defaults ---- */
  if (window.Chart) {
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#8C7A60';
    Chart.defaults.font.size = 11;
  }

  const gridColor = 'rgba(43,35,24,0.07)';

  function gradient(ctx, area, c1, c2) {
    const g = ctx.createLinearGradient(0, area.top, 0, area.bottom);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    return g;
  }

  /* ================= DASHBOARD PAGE ================= */

  const climateTrendEl = document.getElementById('climateTrendChart');
  if (climateTrendEl) {
    new Chart(climateTrendEl, {
      type: 'line',
      data: {
        labels: ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'],
        datasets: [
          {
            label: 'Kelembapan (%)',
            data: [82,84,86,85,80,74,69,66,68,73,78,81],
            borderColor: '#B5482B',
            backgroundColor: (c) => {
              const {ctx, chartArea} = c.chart;
              if (!chartArea) return null;
              return gradient(ctx, chartArea, 'rgba(181,72,43,0.26)', 'rgba(181,72,43,0)');
            },
            tension: 0.45, fill: true, borderWidth: 2.5, pointRadius: 0, yAxisID: 'y',
          },
          {
            label: 'Suhu (°C)',
            data: [27.1,26.6,26.2,26.4,27.8,29.6,31.4,32.1,31.6,30.2,28.7,27.6],
            borderColor: '#C2872F',
            backgroundColor: (c) => {
              const {ctx, chartArea} = c.chart;
              if (!chartArea) return null;
              return gradient(ctx, chartArea, 'rgba(194,135,47,0.22)', 'rgba(194,135,47,0)');
            },
            tension: 0.45, fill: true, borderWidth: 2.5, pointRadius: 0, yAxisID: 'y1',
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: true, position: 'top', align: 'end', labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, padding: 14 } } },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 6 } },
          y: { grid: { color: gridColor }, ticks: { callback: (v) => v + '%' }, position: 'left' },
          y1: { grid: { display: false }, ticks: { callback: (v) => v + '°C' }, position: 'right' }
        }
      }
    });
  }

  const vibrationEl = document.getElementById('vibrationChart');
  if (vibrationEl) {
    new Chart(vibrationEl, {
      type: 'bar',
      data: {
        labels: ['Candi Tikus','Bajang Ratu','Candi Brahu','Wringin Lawang','Kolam Segaran','Pendopo Agung'],
        datasets: [
          { label: 'Getaran terukur (mm/s)', data: [0.9,1.1,0.8,2.4,0.6,0.7], backgroundColor: '#B5482B', borderRadius: 6, barPercentage: 0.55 },
          { label: 'Ambang batas (mm/s)', data: [2,2,2,2,2,2], backgroundColor: 'rgba(43,35,24,0.16)', borderRadius: 6, barPercentage: 0.55 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top', align: 'end', labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, padding: 14 } } },
        scales: {
          x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: false, font: { size: 10 } } },
          y: { grid: { color: gridColor } }
        }
      }
    });
  }

  /* sparkline generator for site cards on dashboard + detail situs page */
  document.querySelectorAll('canvas[data-spark]').forEach((el) => {
    const trend = JSON.parse(el.dataset.spark);
    const status = el.dataset.status || 'up';
    const colorMap = { up: '#4C7A4A', warn: '#C2872F', down: '#B23A28' };
    const bgMap = { up: 'rgba(76,122,74,0.2)', warn: 'rgba(194,135,47,0.2)', down: 'rgba(178,58,40,0.18)' };
    const color = colorMap[status] || colorMap.up;
    new Chart(el, {
      type: 'line',
      data: {
        labels: trend.map((_, i) => i),
        datasets: [{
          data: trend,
          borderColor: color,
          backgroundColor: (c) => {
            const {ctx, chartArea} = c.chart;
            if (!chartArea) return null;
            return gradient(ctx, chartArea, bgMap[status] || bgMap.up, 'rgba(255,255,255,0)');
          },
          borderWidth: 2, tension: 0.4, fill: true, pointRadius: 0,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  });

  /* ================= ARSIP DIGITAL PAGE ================= */

  const archiveTypeEl = document.getElementById('archiveTypeChart');
  if (archiveTypeEl) {
    new Chart(archiveTypeEl, {
      type: 'doughnut',
      data: {
        labels: ['Foto','Laporan inspeksi','Video','Model 3D'],
        datasets: [{
          data: [42, 31, 17, 10],
          backgroundColor: ['#B5482B','#C2872F','#4C7A4A','#8C7A60'],
          borderColor: '#FFFDF7', borderWidth: 3, hoverOffset: 6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, padding: 14, font: { size: 11 } } } }
      }
    });
  }

  /* ---- arsip: card grid filter + pagination ---- */
  const archiveGrid = document.getElementById('archiveGrid');
  if (archiveGrid) {
    const archiveCards = Array.from(archiveGrid.querySelectorAll('.arc-card'));
    const archivePagination = document.getElementById('archivePagination');
    const archiveNoResults = document.getElementById('archiveNoResults');
    const archiveFilterBtns = document.querySelectorAll('.arsip-filter-pills .pill-btn');
    const PAGE_SIZE = 6;
    let activeFilter = 'semua';
    let activePage = 1;

    function filteredCards() {
      return archiveCards.filter((card) => activeFilter === 'semua' || card.dataset.type === activeFilter);
    }

    function renderArchive() {
      const filtered = filteredCards();
      const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      if (activePage > totalPages) activePage = totalPages;

      archiveCards.forEach((card) => { card.style.display = 'none'; });
      const start = (activePage - 1) * PAGE_SIZE;
      filtered.slice(start, start + PAGE_SIZE).forEach((card) => { card.style.display = ''; });

      if (archiveNoResults) archiveNoResults.style.display = filtered.length === 0 ? 'block' : 'none';
      renderArchivePagination(totalPages);
    }

    function renderArchivePagination(totalPages) {
      if (!archivePagination) return;
      archivePagination.innerHTML = '';
      if (totalPages <= 1) return;

      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'arc-page-btn';
      prevBtn.setAttribute('aria-label', 'Halaman sebelumnya');
      prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m15 18-6-6 6-6"/></svg>';
      prevBtn.disabled = activePage === 1;
      prevBtn.addEventListener('click', () => { activePage -= 1; renderArchive(); });
      archivePagination.appendChild(prevBtn);

      for (let i = 1; i <= totalPages; i += 1) {
        const pageBtn = document.createElement('button');
        pageBtn.type = 'button';
        pageBtn.className = 'arc-page-btn' + (i === activePage ? ' active' : '');
        pageBtn.textContent = String(i);
        pageBtn.addEventListener('click', () => { activePage = i; renderArchive(); });
        archivePagination.appendChild(pageBtn);
      }

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'arc-page-btn';
      nextBtn.setAttribute('aria-label', 'Halaman berikutnya');
      nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m9 18 6-6-6-6"/></svg>';
      nextBtn.disabled = activePage === totalPages;
      nextBtn.addEventListener('click', () => { activePage += 1; renderArchive(); });
      archivePagination.appendChild(nextBtn);
    }

    archiveFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter || 'semua';
        activePage = 1;
        renderArchive();
      });
    });

    archiveGrid.querySelectorAll('.arc-icon-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('active');
      });
    });

    renderArchive();
  }

  /* ================= tab / filter interactions (visual only) ================= */
  document.querySelectorAll('.tabs').forEach((group) => {
    group.querySelectorAll('.tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        group.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  });

  document.querySelectorAll('.period-pills').forEach((group) => {
    group.querySelectorAll('.pill-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.pill-btn').forEach((b) => b.classList.remove('primary'));
        btn.classList.add('primary');
      });
    });
  });

  /* ================= site detail modal (Detail Situs page) ================= */
  const modalOverlay = document.getElementById('siteModal');
  if (modalOverlay) {
    const modalName = document.getElementById('modalName');
    const modalType = document.getElementById('modalType');
    const modalStatus = document.getElementById('modalStatus');
    const modalStatusLabel = document.getElementById('modalStatusLabel');
    const modalTemp = document.getElementById('modalTemp');
    const modalHum = document.getElementById('modalHum');
    const modalVib = document.getElementById('modalVib');
    const modalBattery = document.getElementById('modalBattery');
    const modalSync = document.getElementById('modalSync');
    const modalNotesList = document.getElementById('modalNotesList');
    const modalChartEl = document.getElementById('modalChart');
    const modalCloseEls = [document.getElementById('modalClose'), document.getElementById('modalCloseBtn')];
    let modalChartInstance = null;

    const modalPhoto = document.getElementById('modalPhoto');

    function openModal(card) {
      const d = card.dataset;
      modalName.textContent = d.name || '—';
      if (modalPhoto) {
        const photo = SITE_PHOTOS[d.name];
        if (photo) { modalPhoto.src = photo; modalPhoto.alt = d.name; modalPhoto.closest('.modal-photo').style.display = ''; }
        else { modalPhoto.closest('.modal-photo').style.display = 'none'; }
      }
      modalType.textContent = d.sync ? ('Diperbarui ' + d.sync) : '—';
      modalStatus.className = 'badge ' + (d.status || 'up');
      modalStatusLabel.textContent = d.statusLabel || 'Normal';
      modalTemp.textContent = d.temp || '—';
      modalHum.textContent = d.hum || '—';
      modalVib.textContent = d.vib || '—';
      modalBattery.textContent = d.battery || '—';
      modalSync.textContent = d.sync || '—';

      modalNotesList.innerHTML = '';
      (d.notes || '').split('|').filter(Boolean).forEach((note) => {
        const li = document.createElement('li');
        li.textContent = note;
        modalNotesList.appendChild(li);
      });

      const tempTrend = JSON.parse(d.tempSpark || '[]');
      const humTrend = JSON.parse(d.humSpark || '[]');
      const vibTrend = JSON.parse(d.vibSpark || '[]');

      if (modalChartInstance) modalChartInstance.destroy();
      modalChartInstance = new Chart(modalChartEl, {
        type: 'line',
        data: {
          labels: tempTrend.map((_, i) => i),
          datasets: [
            {
              label: 'Suhu (°C)',
              data: tempTrend,
              borderColor: '#C2872F',
              backgroundColor: 'transparent',
              tension: 0.4, borderWidth: 2.5, pointRadius: 0, yAxisID: 'y',
            },
            {
              label: 'Kelembapan (%)',
              data: humTrend,
              borderColor: '#B5482B',
              backgroundColor: 'transparent',
              tension: 0.4, borderWidth: 2.5, pointRadius: 0, yAxisID: 'y1',
            },
            {
              label: 'Getaran (mm/s)',
              data: vibTrend,
              borderColor: '#4C7A4A',
              backgroundColor: 'transparent',
              tension: 0.4, borderWidth: 2.5, pointRadius: 0, yAxisID: 'y2',
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: true, position: 'top', align: 'start', labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, padding: 12, font: { size: 10.5 } } },
            tooltip: { enabled: true }
          },
          scales: {
            x: { display: true, grid: { display: false }, ticks: { maxTicksLimit: 6, font: { size: 10 } } },
            y:  { display: true, position: 'left',  grid: { color: gridColor }, ticks: { maxTicksLimit: 5, font: { size: 10 }, callback: (v) => v + '°' } },
            y1: { display: true, position: 'right', grid: { display: false }, ticks: { maxTicksLimit: 5, font: { size: 10 }, callback: (v) => v + '%' } },
            y2: { display: true, position: 'right', offset: true, grid: { display: false }, ticks: { maxTicksLimit: 5, font: { size: 10 } } }
          }
        }
      });

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.monitor-card').forEach((card) => {
      card.addEventListener('click', () => openModal(card));
    });
    modalCloseEls.forEach((el) => el && el.addEventListener('click', closeModal));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
    });
  }

  /* ================= mobile topbar search toggle ================= */
  document.querySelectorAll('.topbar').forEach((topbar) => {
    const search = topbar.querySelector('.search');
    const toggleBtn = topbar.querySelector('.search-toggle');
    const closeBtn = topbar.querySelector('.search-close');
    const input = topbar.querySelector('.search input');
    if (!search || !toggleBtn) return;

    function openSearch() {
      topbar.classList.add('search-active');
      if (input) setTimeout(() => input.focus(), 150);
    }
    function closeSearch() {
      topbar.classList.remove('search-active');
      if (input) input.blur();
    }

    toggleBtn.addEventListener('click', () => {
      if (topbar.classList.contains('search-active')) return; // toggle is inert while open; use closeBtn
      openSearch();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && topbar.classList.contains('search-active')) closeSearch();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 880 && topbar.classList.contains('search-active')) closeSearch();
    });
  });

  /* ================= functional search (navbar) ================= */
  const searchInput = document.querySelector('.search input');
  if (searchInput) {
    const monitorCards = document.querySelectorAll('.monitor-card');
    const noResultsEl = document.getElementById('noResults');

    function filterSites(query) {
      const q = query.trim().toLowerCase();
      let visibleCount = 0;
      monitorCards.forEach((card) => {
        const name = (card.dataset.name || '').toLowerCase();
        const type = (card.dataset.type || '').toLowerCase();
        const match = !q || name.includes(q) || type.includes(q);
        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });
      if (noResultsEl) noResultsEl.style.display = (q && visibleCount === 0) ? 'block' : 'none';
    }

    if (monitorCards.length) {
      // we're on the Detail Situs page: filter live as the user types
      searchInput.addEventListener('input', () => filterSites(searchInput.value));

      const params = new URLSearchParams(window.location.search);
      const initialQuery = params.get('q');
      if (initialQuery) {
        searchInput.value = initialQuery;
        filterSites(initialQuery);
      }
    } else {
      // other pages: Enter jumps to Detail Situs with the query applied
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
          window.location.href = 'situs.html?q=' + encodeURIComponent(searchInput.value.trim());
        }
      });
    }
  }

  /* ================= Peta & Lokasi (Leaflet, koordinat asli) ================= */
  const petaEl = document.getElementById('petaSitus');
  if (petaEl && window.L) {
    const map = L.map(petaEl, { scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const statusColor = { up: '#4C7A4A', warn: '#C2872F', down: '#B23A28' };
    const statusLabel = { up: 'Normal', warn: 'Perhatian', down: 'Kritis' };
    const markers = [];

    SITE_LOCATIONS.forEach((site) => {
      const cls = 'site-pin' + (site.status === 'warn' ? ' warn' : '') + (site.gateway ? ' gateway' : '');
      const icon = L.divIcon({
        className: '',
        html: '<div class="' + cls + '"></div>',
        iconSize: site.gateway ? [28, 28] : [22, 22],
        iconAnchor: site.gateway ? [14, 14] : [11, 11],
      });
      const marker = L.marker([site.lat, site.lng], { icon }).addTo(map);
      const photo = SITE_PHOTOS[site.name];
      const gmaps = 'https://www.google.com/maps/search/?api=1&query=' + site.lat + ',' + site.lng;
      const popupHtml =
        '<div class="site-popup">' +
          (photo ? '<img src="' + photo + '" alt="' + site.name + '" style="width:100%;height:90px;object-fit:cover;border-radius:8px;margin-bottom:8px;">' : '') +
          '<div class="sp-eyebrow">' + (site.gateway ? 'Node gateway pusat' : 'Situs terpantau') + '</div>' +
          '<div class="sp-name">' + site.name + '</div>' +
          '<div class="sp-row"><span class="pip" style="background:' + statusColor[site.status] + '"></span>' + statusLabel[site.status] + '</div>' +
          '<div class="sp-row">' + site.zone + '</div>' +
          '<div class="sp-links">' +
            '<a href="situs.html?q=' + encodeURIComponent(site.name) + '">Lihat sensor →</a>' +
            '<a href="' + gmaps + '" target="_blank" rel="noopener">Google Maps →</a>' +
          '</div>' +
        '</div>';
      marker.bindPopup(popupHtml);
      markers.push(marker);
    });

    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds(), { padding: [28, 28] });
  }

  /* ================= Pengaturan (settings tabs + fake save) ================= */
  const settingsNav = document.querySelectorAll('.settings-nav-item');
  if (settingsNav.length) {
    const panels = document.querySelectorAll('.settings-panel');
    const settingsLayout = document.querySelector('.settings-layout');
    const backBtn = document.querySelector('.settings-back-btn');
    const backTitle = document.querySelector('.settings-back-title');
    const mobileQuery = window.matchMedia('(max-width: 880px)');

    function activateSection(key) {
      settingsNav.forEach((btn) => btn.classList.toggle('active', btn.dataset.section === key));
      panels.forEach((p) => p.classList.toggle('active', p.dataset.section === key));
      const activeBtn = [...settingsNav].find((b) => b.dataset.section === key);
      const label = activeBtn ? activeBtn.querySelector('.settings-nav-label') : null;
      if (backTitle && label) backTitle.textContent = label.textContent.trim();
    }

    function openDetail() {
      if (settingsLayout) settingsLayout.classList.add('is-detail-open');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function closeDetail() {
      if (settingsLayout) settingsLayout.classList.remove('is-detail-open');
    }

    settingsNav.forEach((btn) => {
      btn.addEventListener('click', () => {
        activateSection(btn.dataset.section);
        history.replaceState(null, '', '#' + btn.dataset.section);
        if (mobileQuery.matches) openDetail();
      });
    });

    if (backBtn) backBtn.addEventListener('click', closeDetail);

    // switching from mobile → desktop width shouldn't leave the detail-only state stuck
    mobileQuery.addEventListener('change', (e) => {
      if (!e.matches) closeDetail();
    });

    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && [...settingsNav].some((b) => b.dataset.section === initialHash)) {
      activateSection(initialHash);
      if (mobileQuery.matches) openDetail();
    }

    const toastEl = document.getElementById('saveToast');
    document.querySelectorAll('.js-save-settings').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!toastEl) return;
        toastEl.classList.add('show');
        clearTimeout(toastEl._t);
        toastEl._t = setTimeout(() => toastEl.classList.remove('show'), 2600);
      });
    });

    document.querySelectorAll('.js-toggle-2fa').forEach((cb) => {
      cb.addEventListener('change', () => {
        const label = document.getElementById('twoFaStatus');
        if (label) label.textContent = cb.checked ? 'Aktif' : 'Nonaktif';
      });
    });
  }

  /* ================= custom overlay scrollbar ================= */
  /* Body owns the real scroll; native scrollbar is hidden via CSS
     and this floating track/thumb overlays the content instead of
     reserving space, so the page never shifts width when a
     scrollbar appears/disappears or grows/shrinks. */
  (function () {
    const track = document.createElement('div');
    track.className = 'custom-scrollbar-track';
    const thumb = document.createElement('div');
    thumb.className = 'custom-scrollbar-thumb';
    track.appendChild(thumb);
    document.body.appendChild(track);

    let hideTimer;
    function flash() {
      track.classList.add('visible');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!dragging) track.classList.remove('visible');
      }, 900);
    }

    function update() {
      const scrollTop = document.body.scrollTop;
      const scrollHeight = document.body.scrollHeight;
      const clientHeight = document.body.clientHeight;
      if (scrollHeight <= clientHeight + 1) {
        track.style.display = 'none';
        return;
      }
      track.style.display = '';
      const trackHeight = track.clientHeight;
      const thumbHeight = Math.max(30, (clientHeight / scrollHeight) * trackHeight);
      const maxThumbTop = trackHeight - thumbHeight;
      const maxScroll = scrollHeight - clientHeight;
      const thumbTop = maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbTop : 0;
      thumb.style.height = thumbHeight + 'px';
      thumb.style.transform = 'translateY(' + thumbTop + 'px)';
    }

    let dragging = false, dragStartY = 0, dragStartScroll = 0;

    thumb.addEventListener('mousedown', (e) => {
      dragging = true;
      thumb.classList.add('dragging');
      track.classList.add('visible');
      dragStartY = e.clientY;
      dragStartScroll = document.body.scrollTop;
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const scrollHeight = document.body.scrollHeight;
      const clientHeight = document.body.clientHeight;
      const trackHeight = track.clientHeight;
      const thumbHeight = thumb.offsetHeight;
      const maxThumbTop = trackHeight - thumbHeight;
      if (maxThumbTop <= 0) return;
      const maxScroll = scrollHeight - clientHeight;
      const deltaY = e.clientY - dragStartY;
      document.body.scrollTop = dragStartScroll + (deltaY / maxThumbTop) * maxScroll;
    });
    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      thumb.classList.remove('dragging');
      document.body.style.userSelect = '';
      hideTimer = setTimeout(() => track.classList.remove('visible'), 900);
    });

    document.body.addEventListener('scroll', () => { update(); flash(); }, { passive: true });
    window.addEventListener('resize', update);
    new MutationObserver(update).observe(document.body, { childList: true, subtree: true });

    update();
  })();

  /* ================= mobile menu toggle ================= */
  const sidebarEl = document.querySelector('.sidebar');
  const overlayEl = document.querySelector('.sidebar-overlay');
  const toggleEls = document.querySelectorAll('.menu-toggle');

  function openSidebar(){
    if (!sidebarEl || !overlayEl) return;
    sidebarEl.classList.add('open');
    overlayEl.classList.add('visible');
  }
  function closeSidebar(){
    if (!sidebarEl || !overlayEl) return;
    sidebarEl.classList.remove('open');
    overlayEl.classList.remove('visible');
  }

  toggleEls.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (sidebarEl.classList.contains('open')) closeSidebar();
      else openSidebar();
    });
  });
  if (overlayEl) overlayEl.addEventListener('click', closeSidebar);
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880) closeSidebar();
  });

});
