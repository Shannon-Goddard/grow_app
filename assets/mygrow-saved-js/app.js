/////Retrieve user selections
function getValues() {
  /////Retrieve Strain
  document.getElementById("strain").innerHTML = localStorage.plantStrain;
  /////Retrieve Plant Height
  document.getElementById("Grow").innerHTML = localStorage.plantHeight;

  /////Retrieve Plant Logo
  var plantLogo = localStorage.getItem('plantLogo');
  $("#image").attr("src" , plantLogo).show();
  /////Retrieve Grow Time
  var vegWeeks;
  vegWeeks = "";
  if(localStorage.plantHeight === "1-2 feet") {
    vegWeeks = "4";
  }
    if(localStorage.plantHeight === "3-4 feet") {
      vegWeeks = "8";
    }
      if(localStorage.plantHeight === "5-6 feet") {
        vegWeeks = "12";
      }
        if(localStorage.plantHeight === "7+ feet") {
          vegWeeks = "16";
        
        }
  document.getElementById("info").innerHTML = (localStorage.plantGrow*7)+(vegWeeks*7)+" days";
  $("#taskButton").show();

};
window.onload = getValues;

//////////////////stores table after selection
$(function(){
  
  // append this attribute to the element you want the html stored of.
  $("#table1").attr("contenteditable", "true")

  var content = document.getElementById('table1');

  // save the page's state after user selects and clicks "select"
  $(".get-started-btn").click(function() {
    localStorage.setItem('page_html', JSON.stringify(content.innerHTML));
  });

  // retrieve local storage data
  var arr = JSON.parse( localStorage.getItem('page_html') );
  if (arr) {
    content.innerHTML = arr;
  }
  ///////////////////////////////////////////////////////////////////
  //add Inches to LightDistance column _125W _250W _400W _600W _1000W
  if (localStorage.plantwatts === '125W')  {
      $(".lightInches").text("12 Inches");
    }
    if (localStorage.plantwatts === '250W')  {
      $(".lightInches").text("16 Inches");
    }
    if (localStorage.plantwatts === '400W')  {
      $(".lightInches").text("20 Inches");
    }
    if (localStorage.plantwatts === '600W')  {
      $(".lightInches").text("30 Inches");
    }
    if (localStorage.plantwatts === '1000W')  {
      $(".lightInches").text("36 Inches");
    }
    /////Filter table by user selection////////////////////////////
    //filter vegetative days by class in weeks
    if(localStorage.plantHeight === "1-2 feet") {
      $(".eightWeeks").hide();
      $(".twelveWeeks").hide();
      $(".sixteenWeeks").hide();
    }
    if(localStorage.plantHeight === "3-4 feet") {
      $(".twelveWeeks").hide();
      $(".sixteenWeeks").hide();
    }
    if(localStorage.plantHeight === " 5-6 feet") {
      $(".sixteenWeeks").hide();
    }
  
  //filter flowering days by class in weeks
  if (localStorage.plantGrow === '4')  {
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
    $(".twentyfourFlowering").hide();
  }
  if (localStorage.plantGrow === '5')  {
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
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '6')  {
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
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '7')  {
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
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '8')  {
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
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '9')  {
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
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '10')  {
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
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '11')  {
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
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '12')  {
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
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '13')  {
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
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '14')  {
  $(".fifteenFlowering").hide();
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '15')  {
  $(".sixteenFlowering").hide();
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '16')  {
  $(".seventeenFlowering").hide();
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '17')  {
  $(".eighteenFlowering").hide();
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '18')  {
  $(".nineteenFlowering").hide();
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '19')  {
  $(".twentyFlowering").hide();
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '20')  {
  $(".twentyoneFlowering").hide();
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '21')  {
  $(".twentytwoFlowering").hide();
  $(".twentythreeFlowering").hide();
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '22')  {
  $(".twentythreeFlowering").hide();
  $(".twentyfourFlowering").hide();
}
if (localStorage.plantGrow === '23')  {
  $(".twentyfourFlowering").hide();
}

});

