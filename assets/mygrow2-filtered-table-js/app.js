//////////////////stores table after selection
$(function(){
  // append this attribute to the element you want the html stored of.
  $("#table2").attr("contenteditable", "true")
  var content = document.getElementById('table2');
  // save the page's state after user selects and clicks "select"
  $(".get-started-btn").click(function() {
    localStorage.setItem('page_html2', JSON.stringify(content.innerHTML));
  });
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
////////////hide note rows
$(function(){
  $('table tr').show();
  $('.notes').hide();
});
////////////////////download button hide/show
if (!navigator.canShare) {
  $('#tablePage2').hide()
} else { (navigator.canShare()) 
  $('#tablePage2').show()
} 