//////////////////stores table after selection
$(function(){
  // append this attribute to the element you want the html stored of.
  $("#table2").attr("contenteditable", "true")
  var content = document.getElementById('table2');

  // retrieve local storage data
  var arr = JSON.parse( localStorage.getItem('page_html2') );
  if (arr) {
    content.innerHTML = arr;
    /////Retrieve Strain
    $('.strain').each(function(){
      $(this).html(localStorage.plant2Strain);
    });
  }
});
////////////show only note rows
$(function(){
  $('table tr:not(:first)').hide();
  $('.notes').show();
  $(":input").hide();
});
