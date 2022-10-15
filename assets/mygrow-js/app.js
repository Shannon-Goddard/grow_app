// retrieve local storage data
/////Retrieve Plant Logo
var plantLogo = localStorage.getItem('plantLogo');

if (plantLogo) {
  $("#mylogo").attr("src" , plantLogo);
  document.getElementById("MyGrowText").style.display = "block";
  document.getElementById("DeleteButton").style.display = "block";
  document.getElementById("MyGrowAdd").style.display = "none";
};
  



/////////////delete button
//localStorage.clear();
// //BUTTON CLEAR
DeleteButton.addEventListener('click', function () {
  localStorage.clear();
  location.reload();
});

console.log(localStorage)

/////////////////hide taskButton button unless localStorage
$(function(){
  
  // retrieve local storage data
  var arr = JSON.parse( localStorage.getItem('page_html') );
  if (arr) {
    $("#taskButton").show();
  }
 
});