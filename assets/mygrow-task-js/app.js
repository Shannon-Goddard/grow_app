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
 

///////////////

/////////////////////
var date = document.getElementsByClassName("datetime").innerHTML;

$('#table1 > tbody  > tr').each(function() {
  var d = new Date();
  var date = $(this).find(".datetime").html();
  var day = d.getDate();
  var month = d.getMonth()+1;
  var year = d.getFullYear();
  var today = (month+"/"+day+"/"+year);
 
  if (date != today) {
    $(this).hide();

    
    //console.log(date);
    
  };
 
});

});