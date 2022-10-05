/////Retrieve user selections
function getValues() {
  /////Retrieve Strain
  document.getElementById("mystrain").innerHTML = localStorage.plantStrain;
  /////Retrieve Plant Height
  document.getElementById("size").innerHTML = localStorage.plantHeight;
  /////Retrieve Plant Watts
  document.getElementById("mywatts").innerHTML = localStorage.plantwatts;
  /////Retrieve Plant Nutrients
  document.getElementById("mynutes").innerHTML = localStorage.plantname;
  /////Retrieve Plant Logo
  var plantLogo = localStorage.getItem('plantLogo');
  $("#mylogo").attr("src" , plantLogo);
  /////Retrieve Grow Time
  document.getElementById("flowering").innerHTML = localStorage.plantGrow;

};
  window.onload = getValues;


