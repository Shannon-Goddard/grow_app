//////////////////stores table after selection
$(function(){
  // append this attribute to the element you want the html stored of.
  $("#table1").attr("contenteditable", "true")
  var content = document.getElementById('table1');

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
////////////show only note rows
$(function(){
  $('table tr:not(:first)').hide();
  $('.notes').show();
  $(":input").hide();
});
//////////export to pdf///////////////////////////////////////////////////////////////////////
function printDiv(table1) {
  var printContents=document.getElementById('table1').outerHTML;
  var originalContents = document.body.outerHTML;
  document.body.outerHTML = printContents;
  window.print();
  document.body.outerHTML = originalContents;
}
//////////////////////////////////////////////////////////////////////////////////////////////