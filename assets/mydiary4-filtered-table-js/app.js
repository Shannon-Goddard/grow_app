//////////////////stores table after selection
$(function(){
  // append this attribute to the element you want the html stored of.
  $("#table4").attr("contenteditable", "true")
  var content = document.getElementById('table4');

  // retrieve local storage data
  var arr = JSON.parse( localStorage.getItem('page_html4') );
  if (arr) {
    content.innerHTML = arr;
    /////Retrieve Strain
    $('.strain').each(function(){
      $(this).html(localStorage.plant4Strain);
    });
  }
});
////////////show only note rows
$(function(){
  $('table tr:not(:first)').hide();
  $('.notes').show();
  $(":input").hide();
});
