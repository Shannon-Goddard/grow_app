(function () {
  var el = document.getElementById('hamburger-placeholder');
  if (!el) return;

  var depth = parseInt(el.getAttribute('data-depth')) || 0;
  var p = '../'.repeat(depth);

  var path = window.location.pathname.toLowerCase();
  function active(keyword) { return path.includes(keyword) ? ' hb-active' : ''; }

  var html = `
<style>
  #hb-btn {
    position: fixed; top: 14px; right: 16px; z-index: 9000;
    width: 40px; height: 40px; border: none; border-radius: 8px;
    background: rgba(19,24,29,0.92); backdrop-filter: blur(8px);
    border: 1px solid #2a333d;
    color: #e8eaed; font-size: 18px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  #hb-btn:hover { background: #1c2329; color: #04AA6D; }

  #hb-overlay {
    display: none; position: fixed; inset: 0; z-index: 9001;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(2px);
    opacity: 0; transition: opacity 0.25s;
  }
  #hb-overlay.open { display: block; opacity: 1; }

  #hb-panel {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 9002;
    width: 300px; max-width: 85vw;
    background: #13181d; border-left: 1px solid #2a333d;
    transform: translateX(100%); transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
    display: flex; flex-direction: column; overflow-y: auto;
  }
  #hb-panel.open { transform: translateX(0); }

  #hb-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 20px; border-bottom: 1px solid #2a333d; flex-shrink: 0;
  }
  #hb-header .hb-logo { font-size: 1.1rem; font-weight: 800; color: #e8eaed; }
  #hb-header .hb-logo span { color: #04AA6D; }
  #hb-close {
    background: none; border: none; color: #8b949e;
    font-size: 20px; cursor: pointer; padding: 4px;
  }
  #hb-close:hover { color: #e8eaed; }

  #hb-nav { flex: 1; padding: 8px 0; }

  .hb-section { border-bottom: 1px solid #1c2329; }

  .hb-section-btn {
    width: 100%; background: none; border: none;
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 20px; color: #e8eaed; font-size: 0.9rem; font-weight: 600;
    cursor: pointer; text-align: left; transition: background 0.15s;
  }
  .hb-section-btn:hover { background: #1c2329; }
  .hb-section-btn .hb-section-left { display: flex; align-items: center; gap: 10px; }
  .hb-section-btn i.hb-icon { color: #04AA6D; width: 18px; text-align: center; }
  .hb-section-btn i.hb-chevron { color: #8b949e; font-size: 12px; transition: transform 0.2s; }
  .hb-section-btn.expanded i.hb-chevron { transform: rotate(90deg); }

  .hb-links { display: none; background: #0d1117; }
  .hb-links.open { display: block; }
  .hb-links a {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 20px 10px 48px;
    color: #8b949e; font-size: 0.85rem; text-decoration: none;
    transition: color 0.15s, background 0.15s;
    border-left: 2px solid transparent;
  }
  .hb-links a:hover { color: #e8eaed; background: #13181d; }
  .hb-links a.hb-active { color: #04AA6D; border-left-color: #04AA6D; }
  .hb-links a i { width: 16px; text-align: center; font-size: 0.8rem; }

  .hb-direct-link {
    display: flex; align-items: center; gap: 10px;
    padding: 13px 20px; color: #e8eaed; font-size: 0.9rem; font-weight: 600;
    text-decoration: none; transition: background 0.15s;
    border-bottom: 1px solid #1c2329;
  }
  .hb-direct-link:hover { background: #1c2329; color: #04AA6D; }
  .hb-direct-link i.hb-icon { color: #04AA6D; width: 18px; text-align: center; }
  .hb-direct-link.hb-active { color: #04AA6D; }

  #hb-footer {
    padding: 16px 20px; border-top: 1px solid #2a333d;
    display: flex; gap: 12px; flex-wrap: wrap; flex-shrink: 0;
  }
  #hb-footer a { color: #8b949e; font-size: 0.75rem; text-decoration: none; }
  #hb-footer a:hover { color: #04AA6D; }

  .hb-app-badges { padding: 12px 20px 4px; display: flex; gap: 8px; flex-wrap: wrap; }
  .hb-app-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #1c2329; border: 1px solid #2a333d; border-radius: 6px;
    padding: 6px 12px; color: #e8eaed; font-size: 0.78rem; font-weight: 600;
    text-decoration: none; transition: border-color 0.2s;
  }
  .hb-app-badge:hover { border-color: #04AA6D; color: #04AA6D; }
  .hb-app-badge i { font-size: 1rem; }
</style>

<button id="hb-btn" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
<div id="hb-overlay"></div>
<div id="hb-panel">

  <div id="hb-header">
    <div class="hb-logo">Grow<span>App</span></div>
    <button id="hb-close" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>
  </div>

  <nav id="hb-nav">

    <!-- Home -->
    <a href="${p}index.html" class="hb-direct-link${active('index')}">
      <i class="fa-solid fa-house hb-icon"></i> Home
    </a>

    <!-- Grow Space & Setup -->
    <div class="hb-section">
      <button class="hb-section-btn" data-target="hb-grow-space">
        <span class="hb-section-left"><i class="fa-solid fa-tent hb-icon"></i> Grow Space & Setup</span>
        <i class="fa-solid fa-chevron-right hb-chevron"></i>
      </button>
      <div class="hb-links" id="hb-grow-space">
        <a href="${p}grow-space/grow-space.html${active('grow-space')}"><i class="fa-solid fa-tent"></i> Tent Kits by Size</a>
        <a href="${p}grow-space/grow-space.html#calculator"><i class="fa-solid fa-ruler-combined"></i> Space Calculator</a>
        <a href="${p}grow-space/grow-space.html#article"><i class="fa-solid fa-book-open"></i> How to Measure Your Space</a>
      </div>
    </div>

    <!-- Lighting -->
    <div class="hb-section">
      <button class="hb-section-btn" data-target="hb-lighting">
        <span class="hb-section-left"><i class="fa-solid fa-sun hb-icon"></i> Lighting</span>
        <i class="fa-solid fa-chevron-right hb-chevron"></i>
      </button>
      <div class="hb-links" id="hb-lighting">
        <a href="${p}lighting/lighting.html"${active('lighting') ? ' class="hb-active"' : ''}><i class="fa-solid fa-calculator"></i> Grow Cost Calculator</a>
        <a href="${p}lighting/lighting.html"><i class="fa-solid fa-tent"></i> Best Light For My Tent</a>
        <a href="${p}lighting/lighting.html"><i class="fa-solid fa-sun"></i> DLI Calculator</a>
        <a href="${p}lighting/lighting.html"><i class="fa-solid fa-scale-balanced"></i> Compare & Shop Lights</a>
      </div>
    </div>

    <!-- Airflow & Climate -->
    <div class="hb-section">
      <button class="hb-section-btn" data-target="hb-airflow">
        <span class="hb-section-left"><i class="fa-solid fa-wind hb-icon"></i> Airflow & Climate</span>
        <i class="fa-solid fa-chevron-right hb-chevron"></i>
      </button>
      <div class="hb-links" id="hb-airflow">
        <a href="${p}airflow/airflow.html"${active('airflow') ? ' class="hb-active"' : ''}><i class="fa-solid fa-wind"></i> Fan & Filter Kits</a>
        <a href="${p}airflow/airflow.html#calculator"><i class="fa-solid fa-calculator"></i> CFM Calculator</a>
      </div>
    </div>

    <!-- Growing Medium & Feeding -->
    <div class="hb-section">
      <button class="hb-section-btn" data-target="hb-medium">
        <span class="hb-section-left"><i class="fa-solid fa-flask hb-icon"></i> Medium & Feeding</span>
        <i class="fa-solid fa-chevron-right hb-chevron"></i>
      </button>
      <div class="hb-links" id="hb-medium">
        <a href="${p}medium-feeding/medium-feeding.html"${active('medium-feeding') ? ' class="hb-active"' : ''}><i class="fa-solid fa-flask"></i> Medium & Feeding</a>
        <a href="${p}medium-feeding/schedule-viewer.html"${active('schedule-viewer') ? ' class="hb-active"' : ''}><i class="fa-solid fa-seedling"></i> MyGrow Dashboard</a>
      </div>
    </div>

    <!-- Tools & Essentials -->
    <div class="hb-section">
      <button class="hb-section-btn" data-target="hb-tools">
        <span class="hb-section-left"><i class="fa-solid fa-screwdriver-wrench hb-icon"></i> Tools & Essentials</span>
        <i class="fa-solid fa-chevron-right hb-chevron"></i>
      </button>
      <div class="hb-links" id="hb-tools">
        <a href="${p}tools/tools.html"${active('/tools/tools') ? ' class="hb-active"' : ''}><i class="fa-solid fa-screwdriver-wrench"></i> All Tools</a>
        <a href="${p}strain-search/strain-search.html"${active('strain-search') ? ' class="hb-active"' : ''}><i class="fa-solid fa-magnifying-glass"></i> Strain Search</a>
        <a href="${p}plant-doctor/plant-doctor.html"${active('plant-doctor') ? ' class="hb-active"' : ''}><i class="fa-solid fa-stethoscope"></i> Plant Doctor</a>
        <a href="${p}harvest-window/harvest-window.html"${active('harvest-window') ? ' class="hb-active"' : ''}><i class="fa-solid fa-microscope"></i> Harvest Window</a>
        <a href="${p}how-to/how-to.html"${active('how-to') ? ' class="hb-active"' : ''}><i class="fa-brands fa-youtube"></i> How-To Videos</a>
        <a href="${p}blog/blog.html"${active('blog') ? ' class="hb-active"' : ''}><i class="fa-solid fa-newspaper"></i> Grow Blog</a>
      </div>
    </div>

    <!-- Seeds -->
    <div class="hb-section">
      <button class="hb-section-btn" data-target="hb-seeds">
        <span class="hb-section-left"><i class="fa-solid fa-cannabis hb-icon"></i> Seeds</span>
        <i class="fa-solid fa-chevron-right hb-chevron"></i>
      </button>
      <div class="hb-links" id="hb-seeds">
        <a href="${p}seeds/seeds.html"${active('seeds') ? ' class="hb-active"' : ''}><i class="fa-solid fa-store"></i> Seed Money</a>
      </div>
    </div>

    <!-- Get the App -->
    <div class="hb-app-badges">
      <a href="https://apps.apple.com/us/app/growapp-cannabis-guide/id6471381461" target="_blank" class="hb-app-badge">
        <i class="fa-brands fa-apple"></i> App Store
      </a>
      <a href="https://play.google.com/store/apps/details?id=com.growappcannabiscannabis.guide" target="_blank" class="hb-app-badge">
        <i class="fa-brands fa-google-play"></i> Google Play
      </a>
    </div>

  </nav>

  <div id="hb-footer">
    <a href="${p}assets/policies/PrivacyPolicy.html">Privacy</a>
    <a href="${p}assets/policies/TermsOfUse.html">Terms</a>
    <a href="${p}assets/policies/disclosure.html">Disclosure</a>
    <a href="${p}assets/policies/contact-us.html">Contact</a>
  </div>

</div>`;

  el.outerHTML = html;

  // Toggle logic
  var btn = document.getElementById('hb-btn');
  var panel = document.getElementById('hb-panel');
  var overlay = document.getElementById('hb-overlay');
  var closeBtn = document.getElementById('hb-close');

  function open() { panel.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { panel.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }

  btn.addEventListener('click', open);
  overlay.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  // Accordion sections
  document.querySelectorAll('.hb-section-btn').forEach(function (sBtn) {
    sBtn.addEventListener('click', function () {
      var target = document.getElementById(sBtn.getAttribute('data-target'));
      var isOpen = target.classList.contains('open');
      // Close all
      document.querySelectorAll('.hb-links').forEach(function (l) { l.classList.remove('open'); });
      document.querySelectorAll('.hb-section-btn').forEach(function (b) { b.classList.remove('expanded'); });
      // Open clicked if it was closed
      if (!isOpen) { target.classList.add('open'); sBtn.classList.add('expanded'); }
    });
  });

  // Auto-expand active section on load
  document.querySelectorAll('.hb-links').forEach(function (links) {
    if (links.querySelector('.hb-active')) {
      links.classList.add('open');
      var parentBtn = links.previousElementSibling;
      if (parentBtn) parentBtn.classList.add('expanded');
    }
  });

})();
