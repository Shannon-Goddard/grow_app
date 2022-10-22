//////////////////stores table after selection
$(function(){
  // append this attribute to the element you want the html stored of.
  $("#table1").attr("contenteditable", "true")
  var content = document.getElementById('table1');
  // retrieve local storage data
  var arr = JSON.parse( localStorage.getItem('page_html') );
  if (arr) {
    content.innerHTML = arr;
  }
/////////////////////get todays row
$('#table1 > tbody  > tr').each(function() {
  var d = new Date();
  var date = $(this).find(".datetime").html();
  var day = d.getDate();
  var month = d.getMonth()+1;
  var year = d.getFullYear();
  var today = (month+"/"+day+"/"+year);
  if (date != today) {
    $(this).hide();
  };
});
});