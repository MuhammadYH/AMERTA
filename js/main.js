/* AMERTA — Smart Heritage Monitoring System
   Shared interactions + Chart.js setups.
   Each chart only initializes if its canvas exists on the current page. */

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

  const archiveTrendEl = document.getElementById('archiveTrendChart');
  if (archiveTrendEl) {
    new Chart(archiveTrendEl, {
      type: 'line',
      data: {
        labels: ['M1','M2','M3','M4','M5','M6','M7','M8'],
        datasets: [{
          label: 'Entri baru',
          data: [14,19,11,22,17,26,20,24],
          borderColor: '#B5482B',
          backgroundColor: (c) => {
            const {ctx, chartArea} = c.chart;
            if (!chartArea) return null;
            return gradient(ctx, chartArea, 'rgba(181,72,43,0.24)', 'rgba(181,72,43,0)');
          },
          tension: 0.4, fill: true, borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: '#B5482B',
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: gridColor }, beginAtZero: true }
        }
      }
    });
  }

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
