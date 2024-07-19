////////////////////////get table from local storage/////////////////////////////////////
$(function(){
  var content = document.getElementById('table1');
  // retrieve local storage data
  var arr = JSON.parse( localStorage.getItem('page_html') );
  if (arr) {
    content.innerHTML = arr;
    $('#table1 > tbody  > tr').show();
  }
});
//show only note rows
$(function(){
  $('table tr:not(:first)').hide();
  $('.notes').show();
  $(":input").hide();
});
//////////add notes///////////////////////////////////////////////////////////////////////
//stores table after selection
$(function(){
  // append this attribute to the element you want the html stored of
  $("#table1").attr("contenteditable", "false")
  var content = document.getElementById('table1');
  // save the page's state after user selects and clicks "select"
  $('#SaveButton').bind("click",function(){
    //$("#SaveButton").click(function() {
    localStorage.setItem('page_html', JSON.stringify(content.innerHTML));
  });
    //get user input row
    $('#table1 > tbody  > tr').each(function() {

        $(this).closest('tr').find("input").each(function() {
          $(this).closest('td').html($(this).val()).attr("contenteditable", "true");
        })
      }
    )
  })
//////////////////////Save button hide/show////////////////////////////////////////////////
$('#SaveButton').hide();
$("#table1").on("click", "td", function() {
  $('#SaveButton').show();
});

$("#SaveButton").on("click", function() {
  $('#SaveButton').hide();
});
////////////////////////////////////////////////////////////////////////////////////////////