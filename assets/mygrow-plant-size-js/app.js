//When the user clicks on the button, toggle between hiding and showing the dropdown content
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('#dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

//Function to change info on click//
$("#myDropdown a").click(function() {
  const d = data;
  // Change logo, strain, Grow, Sativa, THC, CBD, info, and more_info on user selection of search drop
  for (let value of d.values()) {
    var height, logo, info, Index;
    height = value.height;
    info = value.info;
    logo = value.logo;
    Index = this.id;
    $("#image").attr("src" , d[Index].logo).show();
    $("#height").text(d[Index].height);
    $("#info").text(d[Index].info);
    $("#more_info").show();
    $("#taskButton").show();
  }
});
//localStorage//////////////////////
$(".get-started-btn").click(function() {
  var node = document.getElementById('height'),
  // htmlContent = node.innerHTML,
  textContent = node.textContent;
  // Store Plant Height
  localStorage.plantHeight = textContent;
});