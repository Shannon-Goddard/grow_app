(function () {
  var KEY = 'ag_v1';
  if (localStorage.getItem(KEY) === '1') return;

  var style = document.createElement('style');
  style.textContent = [
    '.age-gate{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center;padding:1rem;}',
    '.gate-content{background:#13181d;border:1px solid #2a333d;border-radius:14px;padding:2.5rem 2rem;max-width:420px;width:100%;text-align:center;color:#e8eaed;}',
    '.gate-content h2{font-size:1.4rem;font-weight:800;margin-bottom:.75rem;}',
    '.gate-content p{color:#8b949e;font-size:.9rem;line-height:1.6;margin-bottom:.5rem;}',
    '.gate-buttons{display:flex;gap:.75rem;justify-content:center;margin-top:1.5rem;flex-wrap:wrap;}',
    '.btn-enter{background:#04AA6D;color:#000;font-weight:700;font-size:.95rem;padding:.7rem 1.6rem;border:none;border-radius:8px;cursor:pointer;}',
    '.btn-enter:hover{opacity:.85;}',
    '.btn-exit{background:transparent;color:#8b949e;font-size:.85rem;padding:.7rem 1.2rem;border:1px solid #2a333d;border-radius:8px;cursor:pointer;}',
    '.btn-exit:hover{color:#e8eaed;border-color:#8b949e;}'
  ].join('');
  document.head.appendChild(style);

  var gate = document.createElement('div');
  gate.id = 'ageGate';
  gate.className = 'age-gate';
  gate.innerHTML = [
    '<div class="gate-content">',
    '  <h2>Age Verification</h2>',
    '  <p>Cannabis content is intended for adults 21+ (or legal age in your jurisdiction).</p>',
    '  <p>By entering you confirm you are of legal age.</p>',
    '  <div class="gate-buttons">',
    '    <button id="ag-enter" class="btn-enter">I\'m 21+&nbsp;Enter</button>',
    '    <button id="ag-exit" class="btn-exit">Under 21</button>',
    '  </div>',
    '</div>'
  ].join('');

  document.body.appendChild(gate);
  document.body.style.overflow = 'hidden';

  document.getElementById('ag-enter').addEventListener('click', function () {
    localStorage.setItem(KEY, '1');
    gate.remove();
    document.body.style.overflow = '';
  });

  document.getElementById('ag-exit').addEventListener('click', function () {
    window.location.href = 'https://www.google.com';
  });
})();
