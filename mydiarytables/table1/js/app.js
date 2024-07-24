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
  $('table tr:not(:first)').hide();
  $('.notes').show();
  $(":input").hide();
});

$(function(){
  $("tr:hidden,td:hidden").remove();
});

$(function(){
  $("th:hidden,td:hidden").remove();
});

//download table to excel ONLY WORKS ON PC *NOT MOBILE! navigator.share is added on table2excel.js//
function toExcel() { 
  $("#table1").table2excel({ 
    exclude: ".noExl",
    name: "MyDiary.xls",
    filename: "MyDiary.xls",
    fileext: ".xls",
    exclude_img: true,
    exclude_links: true,
    exclude_inputs: true,
    preserveColors: false
  })
  
}; 