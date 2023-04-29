//////retrieve local storage data////////////////////////////////
var plantLogo = localStorage.getItem('plantLogo');

if (plantLogo) {
  $("#mylogo").attr("src" , plantLogo);
  document.getElementById("MyGrowText").style.display = "block";
  document.getElementById("DeleteButton").style.display = "block";
  document.getElementById("MyGrowAdd").style.display = "none";
  $("#taskButton").show();
};
/////////////delete button////////
DeleteButton.addEventListener('click', function () {
  localStorage.removeItem('page_html');
  localStorage.removeItem('plantGrow');
  localStorage.removeItem('plantHeight');
  localStorage.removeItem('plantStrain');
  localStorage.removeItem('plantwatts');
  localStorage.removeItem('plantLogo');
  location.reload();
});

//////retrieve local storage data////////////////////////////////
var plantLogo = localStorage.getItem('plant2Logo');
console.log(plantLogo);
if (plantLogo) {
  $("#my2logo").attr("src" , plantLogo);
  document.getElementById("MyGrow2Text").style.display = "block";
  document.getElementById("Delete2Button").style.display = "block";
  document.getElementById("MyGrow2Add").style.display = "none";
  $("#taskButton").show();
};
/////////////delete button////////
Delete2Button.addEventListener('click', function () {
  localStorage.removeItem('page_html2');
  localStorage.removeItem('plant2Grow');
  localStorage.removeItem('plant2Height');
  localStorage.removeItem('plant2Strain');
  localStorage.removeItem('plant2watts');
  localStorage.removeItem('plant2Logo');
  location.reload();
});

//////retrieve local storage data/////////////////////////////////
var plantLogo = localStorage.getItem('plant3Logo');
console.log(plantLogo);
if (plantLogo) {
  $("#my3logo").attr("src" , plantLogo);
  document.getElementById("MyGrow3Text").style.display = "block";
  document.getElementById("Delete3Button").style.display = "block";
  document.getElementById("MyGrow3Add").style.display = "none";
  $("#taskButton").show();
};
/////////////delete button////////
Delete3Button.addEventListener('click', function () {
  localStorage.removeItem('page_html3');
  localStorage.removeItem('plant3Grow');
  localStorage.removeItem('plant3Height');
  localStorage.removeItem('plant3Strain');
  localStorage.removeItem('plant3watts');
  localStorage.removeItem('plant3Logo');
  location.reload();
});

//////retrieve local storage data/////////////////////////////////
var plantLogo = localStorage.getItem('plant4Logo');
console.log(plantLogo);
if (plantLogo) {
  $("#my4logo").attr("src" , plantLogo);
  document.getElementById("MyGrow4Text").style.display = "block";
  document.getElementById("Delete4Button").style.display = "block";
  document.getElementById("MyGrow4Add").style.display = "none";
  $("#taskButton").show();
};
/////////////delete button////////
Delete4Button.addEventListener('click', function () {
  localStorage.removeItem('page_html4');
  localStorage.removeItem('plant4Grow');
  localStorage.removeItem('plant4Height');
  localStorage.removeItem('plant4Strain');
  localStorage.removeItem('plant4watts');
  localStorage.removeItem('plant4Logo');
  location.reload();
});

console.log(localStorage);


