//////////////////stores table after selection
$(function(){
  // append this attribute to the element you want the html stored of.
  $("#table1").attr("contenteditable", "true")
  var content = document.getElementById('table1');
  // save the page's state after user selects and clicks "select"////////////////////////////////////
  $(".get-started-btn").click(function() {
    //////////////////////////////////Save user input/////////////////////////// 
    $('#table1 > tbody  > tr').each(function() {
      
      var d = new Date();
      var date = $(this).find(".datetime2").html();
      var day = d.getDate();
      var month = d.getMonth()+1;
      var year = d.getFullYear();
      var today = (month+"/"+day+"/"+year);
      if (date == today) {
        
        $(this).closest('tr').find("input").each(function() {
          //console.log(this.value);
          $(this).closest('td').html($(this).val());
                    
        })
      }
    })
    //////////////////////////////////////////////////////////////

    localStorage.setItem('page_html', JSON.stringify(content.innerHTML));
  });
  // retrieve local storage data
  var arr = JSON.parse( localStorage.getItem('page_html') );
  if (arr) {
    content.innerHTML = arr;
    $('#table1 > tbody  > tr').show();
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
});