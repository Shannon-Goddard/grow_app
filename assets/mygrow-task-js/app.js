////////////////////////get table from local storage
$(function(){
  var content = document.getElementById('table1');
  // retrieve local storage data//////////////////////////
  var arr = JSON.parse( localStorage.getItem('page_html') );
  if (arr) {
    content.innerHTML = arr;
    $('#table1 > tbody  > tr').show();
  }

/////////////////////get todays guide row
$('#table1 > tbody  > tr').each(function() {
  var d = new Date();
  var date = $(this).find(".datetime").html();
  var day = d.getDate();
  var month = d.getMonth()+1;
  var year = d.getFullYear();
  var today = (month+"/"+day+"/"+year);
  if (date != today) {
    $(this).hide();
    $('.notesRow').show();
  };
});

/////////////////////get todays note row
$('#table1 > tbody  > tr').each(function() {
  var d = new Date();
  var date = $(this).find(".datetime2").html();
  var day = d.getDate();
  var month = d.getMonth()+1;
  var year = d.getFullYear();
  var today = (month+"/"+day+"/"+year);
  if (date == today) {
    $(this).show();
    $('.notesRow').show();
  };
});


//////////////////stores table after selection
$(function(){
  ////////////////////// append this attribute to the element you want the html stored of
  $("#table1").attr("contenteditable", "false")
  var content = document.getElementById('table1');
  //////////////////// save the page's state after user selects and clicks "select"
  $('#SaveButton').bind("click",function(){
    //$("#SaveButton").click(function() {
    localStorage.setItem('page_html', JSON.stringify(content.innerHTML));
  });//
    //////////////////////////////////get user input row
    $('#table1 > tbody  > tr').each(function() {
      var d = new Date();
      var date = $(this).find(".datetime2").html();
      var day = d.getDate();
      var month = d.getMonth()+1;
      var year = d.getFullYear();
      var today = (month+"/"+day+"/"+year);
      if (date == today) {
        $(this).closest('tr').find("input").each(function() {
          $(this).closest('td').html($(this).val()).attr("contenteditable", "true");
       
      })
    }
  })
});
});
    
  



//////////////////////Save button hide/show
$("#table1").on("click", "td", function() {
  $('#SaveButton').show();
});

$("#SaveButton").on("click", function() {
  $('#SaveButton').hide();
});