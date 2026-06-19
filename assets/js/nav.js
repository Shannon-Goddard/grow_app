(function(){
  var el = document.getElementById('nav-placeholder');
  if (!el) return;
  var depth = parseInt(el.getAttribute('data-depth')) || 0;
  var p = '../'.repeat(depth);

  // Random icon for Seed Money
  var icons=['fa-bomb','fa-ghost','fa-robot','fa-rocket','fa-pizza-slice','fa-dice','fa-hat-wizard','fa-skull','fa-skull-crossbones','fa-paw','fa-snowman','fa-piggy-bank','fa-face-meh-blank','fa-fire','fa-bolt','fa-meteor','fa-dragon','fa-biohazard','fa-cannabis'];
  var ri = icons[Math.floor(Math.random()*icons.length)];

  // Detect active page
  var path = window.location.pathname.toLowerCase();
  function active(keyword){ return path.includes(keyword) ? ' active' : ''; }

  var html = '<nav id="navbar" class="navbar order-last order-lg-0"><ul>'
    +'<li><a class="nav-link scrollto fa fa-home'+active('index')+'" href="'+p+'index.html" title="Home" aria-label="Navigate to Home"></a></li>'
    +'<li><a class="nav-link scrollto fa fa-leaf'+active('mygrow')+'" href="'+p+'mygrow/mygrow.html" title="My Grow" aria-label="Navigate to MyGrow"></a></li>'
    +'<li><a class="nav-link scrollto fa fa-book'+active('mydiary')+'" href="'+p+'mydiary/mydiary.html" title="My Diary" aria-label="Navigate to MyDiary"></a></li>'
    +'<li><a class="nav-link scrollto fa-solid '+ri+active('seed-money')+'" href="'+p+'shop/seed-money.html" title="Seed Money" aria-label="Navigate to Seed Money"></a></li>'
    +'<li><a class="nav-link scrollto fa fa-cogs'+active('tools')+'" href="'+p+'tools/tools.html" title="Tools" aria-label="Navigate to Tools"></a></li>'
    +'</ul></nav>';

  el.outerHTML = html;
})();
