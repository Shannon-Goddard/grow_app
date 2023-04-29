//////retrieve local storage data
//  Retrieve Plant Logo
var plantLogo = localStorage.getItem('plantLogo');

if (plantLogo) {
  $("#mylogo").attr("src" , plantLogo);
  document.getElementById("MyGrowText").style.display = "block";
  document.getElementById("MyGrowAdd").style.display = "none";
  $("#taskButton").show();
};

//////retrieve local storage data
//  Retrieve Plant Logo
var plantLogo = localStorage.getItem('plant2Logo');

if (plantLogo) {
  $("#my2logo").attr("src" , plantLogo);
  document.getElementById("MyGrow2Text").style.display = "block";
  document.getElementById("MyGrow2Add").style.display = "none";
  $("#taskButton").show();
};

//////retrieve local storage data
//  Retrieve Plant Logo
var plantLogo = localStorage.getItem('plant3Logo');

if (plantLogo) {
  $("#my3logo").attr("src" , plantLogo);
  document.getElementById("MyGrow3Text").style.display = "block";
  document.getElementById("MyGrow3Add").style.display = "none";
  $("#taskButton").show();
};

//////retrieve local storage data
//  Retrieve Plant Logo
var plantLogo = localStorage.getItem('plant4Logo');

if (plantLogo) {
  $("#my4logo").attr("src" , plantLogo);
  document.getElementById("MyGrow4Text").style.display = "block";
  document.getElementById("MyGrow4Add").style.display = "none";
  $("#taskButton").show();
};



