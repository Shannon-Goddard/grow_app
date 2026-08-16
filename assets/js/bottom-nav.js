(function () {
  var el = document.getElementById('bottom-nav-placeholder');
  if (!el) return;

  var depth = parseInt(el.getAttribute('data-depth')) || 0;
  var p = '../'.repeat(depth);

  var path = window.location.pathname.toLowerCase();
  function active(keyword) { return path.includes(keyword); }

  var html = `
<style>
  #bn-bar {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 9000;
    height: 60px;
    background: #13181d; border-top: 1px solid #2a333d;
    display: flex; align-items: stretch;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
  .bn-item {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 3px; cursor: pointer;
    color: #8b949e; font-size: .62rem; font-weight: 600;
    text-decoration: none; border: none; background: none;
    transition: color .15s; -webkit-tap-highlight-color: transparent;
    padding: 0;
  }
  .bn-item i { font-size: 1.1rem; }
  .bn-item:hover, .bn-item.bn-active { color: #04AA6D; }

  #bn-overlay {
    display: none; position: fixed; inset: 0; z-index: 9001;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(2px);
  }
  #bn-overlay.open { display: block; }

  #bn-drawer {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 9002;
    background: #13181d; border-top: 1px solid #2a333d;
    border-radius: 16px 16px 0 0;
    transform: translateY(100%);
    transition: transform .28s cubic-bezier(0.4,0,0.2,1);
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
  #bn-drawer.open { transform: translateY(0); }

  #bn-drawer-handle {
    display: flex; justify-content: center; padding: 12px 0 4px;
  }
  #bn-drawer-handle div {
    width: 36px; height: 4px; background: #2a333d; border-radius: 2px;
  }

  .bn-drawer-links { padding: 4px 0 16px; }
  .bn-drawer-link {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 24px; color: #e8eaed; font-size: .95rem; font-weight: 600;
    text-decoration: none; transition: background .15s;
  }
  .bn-drawer-link:hover { background: #1c2329; }
  .bn-drawer-link i { color: #04AA6D; width: 20px; text-align: center; font-size: 1rem; }
  .bn-drawer-link.bn-active { color: #04AA6D; }

  .bn-drawer-footer {
    display: flex; flex-wrap: wrap; gap: 8px 16px;
    padding: 12px 24px 16px;
    border-top: 1px solid #1c2329;
  }
  .bn-drawer-footer a {
    color: #8b949e; font-size: .75rem; text-decoration: none;
  }
  .bn-drawer-footer a:hover { color: #04AA6D; }

  body { padding-bottom: calc(60px + env(safe-area-inset-bottom, 0px)); }
</style>

<!-- Bottom Bar -->
<div id="bn-bar">
  <a href="${p}medium-feeding/mytask.html" class="bn-item${active('mytask') ? ' bn-active' : ''}">
    <i class="fa-solid fa-gauge-high"></i>
    <span>Today</span>
  </a>
  <a href="${p}medium-feeding/schedule-viewer.html" class="bn-item${active('schedule-viewer') ? ' bn-active' : ''}">
    <i class="fa-solid fa-leaf"></i>
    <span>Schedule</span>
  </a>
  <a href="${p}medium-feeding/mydiary.html" class="bn-item${active('mydiary') ? ' bn-active' : ''}">
    <i class="fa-solid fa-camera"></i>
    <span>Diary</span>
  </a>
  <a href="${p}tools/tools.html" class="bn-item${active('/tools/') ? ' bn-active' : ''}">
    <i class="fa-solid fa-screwdriver-wrench"></i>
    <span>Tools</span>
  </a>
  <button class="bn-item" id="bn-more-btn">
    <i class="fa-solid fa-ellipsis"></i>
    <span>More</span>
  </button>
</div>

<!-- Overlay -->
<div id="bn-overlay"></div>

<!-- More Drawer -->
<div id="bn-drawer">
  <div id="bn-drawer-handle"><div></div></div>
  <div class="bn-drawer-links">
    <a href="${p}strain-search/strain-search.html" class="bn-drawer-link${active('strain-search') ? ' bn-active' : ''}">
      <i class="fa-solid fa-magnifying-glass"></i> Strain Search
    </a>
    <a href="${p}plant-doctor/plant-doctor.html" class="bn-drawer-link${active('plant-doctor') ? ' bn-active' : ''}">
      <i class="fa-solid fa-stethoscope"></i> Plant Doctor
    </a>
    <a href="${p}seeds/seeds.html" class="bn-drawer-link${active('seeds') ? ' bn-active' : ''}">
      <i class="fa-solid fa-cannabis"></i> Seeds
    </a>
    <a href="${p}blog/blog.html" class="bn-drawer-link${active('blog') ? ' bn-active' : ''}">
      <i class="fa-solid fa-newspaper"></i> Blog
    </a>
    <a href="${p}games/games.html" class="bn-drawer-link${active('games') ? ' bn-active' : ''}">
      <i class="fa-solid fa-gamepad"></i> Games
    </a>
  </div>
  <div class="bn-drawer-footer">
    <a href="${p}assets/policies/PrivacyPolicy.html">Privacy</a>
    <a href="${p}assets/policies/TermsOfUse.html">Terms</a>
    <a href="${p}assets/policies/disclosure.html">Disclosure</a>
    <a href="${p}assets/policies/contact-us.html">Contact</a>
  </div>
</div>`;

  el.outerHTML = html;

  var overlay = document.getElementById('bn-overlay');
  var drawer  = document.getElementById('bn-drawer');
  var moreBtn = document.getElementById('bn-more-btn');

  function openDrawer()  { drawer.classList.add('open');  overlay.classList.add('open');  document.body.style.overflow = 'hidden'; }
  function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }

  moreBtn.addEventListener('click', openDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Swipe down to close
  var startY = 0;
  drawer.addEventListener('touchstart', function(e) { startY = e.touches[0].clientY; }, { passive: true });
  drawer.addEventListener('touchend', function(e) {
    if (e.changedTouches[0].clientY - startY > 60) closeDrawer();
  }, { passive: true });
})();
