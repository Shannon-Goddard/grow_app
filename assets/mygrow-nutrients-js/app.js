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
$("a").click(function() {
  const d = data;
  //Change logo, strain, Grow, Sativa, THC, CBD, info, and more_info on user selection of search drop
  for (let value of d.values()) {
    var name, pic, info, more_info, web, Index;
    
    name = value.name;
    info = value.info;
    more_info = value.more_info;
    pic = value.pic;
    web = value.web;
    Index = this.id;
    
    $("#image").attr("src" , d[Index].pic).show();
    $("#web").attr("href" , d[Index].web).show();
    $("#name").text(d[Index].name);
    $("#info").text(d[Index].info);
    $("#more_info").show();
    $("#taskButton").show();
  }
});
////////////////////////

$("#taskButton").click(function() {

  var node = document.getElementById('name'),
  //htmlContent = node.innerHTML,
  textContent = node.textContent;
/////Store Plant name
  localStorage.plantname = textContent;
})

