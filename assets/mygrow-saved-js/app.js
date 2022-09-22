/////Retrieve user selections

function getValues() {
  document.getElementById("mystrain").innerHTML = localStorage.plantStrain;
}
window.onload = getValues;

