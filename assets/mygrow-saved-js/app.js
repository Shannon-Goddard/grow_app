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
  /////Retrieve Flowering Time
  document.getElementById("flowering").innerHTML = localStorage.plantGrow;
  /////Retrieve Plant Logo
  var plantLogo = localStorage.getItem('plantLogo');
  $("#mylogo").attr("src" , plantLogo);
};
  window.onload = getValues;


