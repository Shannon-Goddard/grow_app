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

//////////////////stores table after selection
$(function(){
  
  // append this attribute to the element you want the html stored of.
  $("#table1").attr("contenteditable", "true")

  var content = document.getElementById('table1');

  // save the page's state after user selects and clicks "select"
  $("#savedButton").click(function() {
    localStorage.setItem('page_html', JSON.stringify(content.innerHTML));
  });

  // retrieve local storage data
  var arr = JSON.parse( localStorage.getItem('page_html') );
  if (arr) {
    content.innerHTML = arr;
  }
  //add Inches to LightDistance column _125W _250W _400W _600W _1000W
if($("#mywatts").text(" 125W")) {
  $(".lightInches").text("12 Inches");
}
if($("#mywatts").text(" 250W")) {
  $(".lightInches").text("16 Inches");
}
if($("#mywatts").text(" 400W")) {
  $(".lightInches").text("20 Inches");
}
if($("#mywatts").text(" 600W")) {
  $(".lightInches").text("30 Inches");
}
if($("#mywatts").text(" 1000W")) {
  $(".lightInches").text("36 Inches");
}

/////Filter table by user selection
//filter vegetative days by class in weeks
if($("#size").text(" 1-2 Foot")) {
  $(".eightWeeks").hide();
  $(".twelveWeeks").hide();
  $(".sixteenWeeks").hide();
}
if($("#size").text(" 3-4 Foot")) {
  $(".twelveWeeks").hide();
  $(".sixteenWeeks").hide();
}
if($("#size").text(" 5-6 Foot")) {
  $(".sixteenWeeks").hide();
}
//filter flowering days by class in weeks
if($("#flowering").text("4")) {
  $(".fiveFlowering").hide();
  $(".sixFlowering").hide();
  $(".sevenFlowering").hide();
  $(".eightFlowering").hide();
  $(".nineFlowering").hide();
  $(".tenFlowering").hide();
  $(".elevenFlowering").hide();
  $(".twelveFlowering").hide();
  $(".thirteenFlowering").hide();
  $(".fourteenFlowering").hide();
  $(".fifteenFlowering").hide();
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("5")) {
  $(".sixFlowering").hide();
  $(".sevenFlowering").hide();
  $(".eightFlowering").hide();
  $(".nineFlowering").hide();
  $(".tenFlowering").hide();
  $(".elevenFlowering").hide();
  $(".twelveFlowering").hide();
  $(".thirteenFlowering").hide();
  $(".fourteenFlowering").hide();
  $(".fifteenFlowering").hide();
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("6")) {
  $(".sevenFlowering").hide();
  $(".eightFlowering").hide();
  $(".nineFlowering").hide();
  $(".tenFlowering").hide();
  $(".elevenFlowering").hide();
  $(".twelveFlowering").hide();
  $(".thirteenFlowering").hide();
  $(".fourteenFlowering").hide();
  $(".fifteenFlowering").hide();
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("7")) {
  $(".eightFlowering").hide();
  $(".nineFlowering").hide();
  $(".tenFlowering").hide();
  $(".elevenFlowering").hide();
  $(".twelveFlowering").hide();
  $(".thirteenFlowering").hide();
  $(".fourteenFlowering").hide();
  $(".fifteenFlowering").hide();
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("8")) {
  $(".nineFlowering").hide();
  $(".tenFlowering").hide();
  $(".elevenFlowering").hide();
  $(".twelveFlowering").hide();
  $(".thirteenFlowering").hide();
  $(".fourteenFlowering").hide();
  $(".fifteenFlowering").hide();
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("9")) {
  $(".tenFlowering").hide();
  $(".elevenFlowering").hide();
  $(".twelveFlowering").hide();
  $(".thirteenFlowering").hide();
  $(".fourteenFlowering").hide();
  $(".fifteenFlowering").hide();
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("10")) {
  $(".tenFlowering").hide();
  $(".elevenFlowering").hide();
  $(".twelveFlowering").hide();
  $(".thirteenFlowering").hide();
  $(".fourteenFlowering").hide();
  $(".fifteenFlowering").hide();
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("11")) {
  $(".elevenFlowering").hide();
  $(".twelveFlowering").hide();
  $(".thirteenFlowering").hide();
  $(".fourteenFlowering").hide();
  $(".fifteenFlowering").hide();
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("12")) {
  $(".twelveFlowering").hide();
  $(".thirteenFlowering").hide();
  $(".fourteenFlowering").hide();
  $(".fifteenFlowering").hide();
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("13")) {
  $(".thirteenFlowering").hide();
  $(".fourteenFlowering").hide();
  $(".fifteenFlowering").hide();
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("14")) {
  $(".fourteenFlowering").hide();
  $(".fifteenFlowering").hide();
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("15")) {
  $(".fifteenFlowering").hide();
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("16")) {
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("17")) {
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("18")) {
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("19")) {
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("20")) {
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("21")) {
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("22")) {
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
}
if($("#flowering").text("23")) {
  $(".twentythreeFlowering").hide();
}

});



