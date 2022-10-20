(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  });

})()
///////lazy load imgages on ul list//////////////////////////////
const observer = lozad();
observer.observe();
///////////////////////////////////////////////////////
//Function to hide search until user starts typing//
$(function() {
  
  $('#myInput').keyup(function() {
    if ($(this).val().length == 0) {
      $('#myUL').hide();
    } else {
      $('#myUL').show();
    }
  }).keyup();
});

//Function for search box to filter as user inputs

function myFunction() {
  
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName('li');
  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
};

//Function to change info on click//

$("li").on("click" , "a" , function(){
  const d = data;
  //Change logo, strain, Grow, Sativa, THC, CBD, info, and more_info on user selection of search drop
  for (let value of d.values()) {
    var logo, strain, Grow, Sativa, Indica, Hybrid, THC, CBD, info, more_info, Index;
    
    logo = value.logo;
    strain = value.strain;
    Grow = value.Grow;
    Sativa = value.Sativa;
    Indica = value.Indica;
    Hybrid = value.Hybrid;
    THC = value.THC;
    CBD = value.CBD;
    info = value.info;
    more_info = value.more_info;
    Index = this.id;
    
    $("#image").attr("src" , d[Index].logo).show();
    $("#strain").text(d[Index].strain);
    $("#Grow").text(d[Index].Grow);
    $("#Sativa").text(d[Index].Sativa);
    $("#Indica").text(d[Index].Indica);
    $("#Hybrid").text(d[Index].Hybrid);
    $("#THC").text('THC: '+d[Index].THC+'%');
    $("#CBD").text('CBD: '+d[Index].CBD+'%');
    $("#info").text(d[Index].info);
    $("#more_info").text(d[Index].more_info);
    document.getElementById("myInput").value = "";
    document.getElementById("myUL").style.display = "none";
    $("#taskButton").show();
    $("#weeks").show();
  }
});

////////function to store users selection onto mygrow-saved.html///

$(".get-started-btn").click(function() {
  
  var node, logoNode, growNode;
  
  node = document.getElementById('strain'),
  logoNode = document.getElementById('image'),
  growNode = document.getElementById('Grow'),

  ////image src
  logoSrc = logoNode.src;
  ////Strain text 
  textContent = node.textContent;
  ////Grow value
  growContent = growNode.textContent;

  /////Store Plant Height
  localStorage.plantStrain = textContent;
  localStorage.plantLogo = logoSrc;
  localStorage.plantGrow = growContent;
console.log(growContent);
});
