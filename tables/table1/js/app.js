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
    /////Retrieve Strain
    $('.strain').each(function(){
      $(this).html(localStorage.plantStrain);
    });
  }
});
////////////hide note rows
$(function(){
  $('table tr').show();
  $('.notes').hide();
});

$(function(){
  $('.notes').remove();
});

$(function(){
  $("th:hidden,td:hidden").remove();
});
//////////Get table data////

//https://www.loyal9.app/tables/table
/////////////////////share/////////////////////////////////////

//navigator.share({
//  url,
//  title: document.title,
//  text: 'Hello World',
//});

////////////////////////download table to excel ONLY WORKS ON PC *NOT MOBILE//////////////////////////////
function toExcel() { 
  $("#table1").table2excel({ 
    exclude: ".noExl",
    name: "MyGrow.xls",
    filename: "MyGrow.xls",
    fileext: ".xls",
    exclude_img: true,
    exclude_links: true,
    exclude_inputs: true,
    preserveColors: false
  })
  
}; 

//////////////////////////////////////////////////////

////////////////
function toShare() {
  //gets table
var oTable = document.getElementById('table1');

//gets rows of table
var rowLength = oTable.rows.length;

//loops through rows    
for (i = 0; i < rowLength; i++){

  //gets cells of current row  
   var oCells = oTable.rows.item(i).cells;

   //gets amount of cells of current row
   var cellLength = oCells.length;

   //loops through each cell in current row
   for(var j = 0; j < cellLength; j++){
      // get your cell info here

      var cellVal = oCells.item(j).innerHTML;
      console.log(cellVal);
   }
}
fetch(cellVal)
  .then(function(response) {
    return response.blob()
  })
  .then(function(blob) {

    var file = new File([blob], "myGrow.xls", {type: 'application/vnd.ms-excel'});
    var filesArray = [file];

    if(navigator.canShare && navigator.canShare({ file: filesArray })) {
      navigator.share({
        text: 'Information Overload',
        file: filesArray,
        title: 'MyGrow',
        url: 'https://www.loyal9.app/tables/table'
      })
    }
  })
};