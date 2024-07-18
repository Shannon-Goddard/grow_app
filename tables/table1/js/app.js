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
  $('table tr').show();
  $('.notes').hide();
});

$(function(){
  $('.notes').remove();
});

$(function(){
  $("th:hidden,td:hidden").remove();
});
//////////WORKS WITH ERROR! renders table correctly and allows to share url TABLE.HTML ADD onclick=downloadReference()////
//function downloadReference(){
//  var dl = document.getElementById ("dl");
//  dl.href="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," + document.getElementById("table1").outerHTML;
//  return true;
//}

/////////////////////share/////////////////////////////////////

//navigator.share({
//  url,
//  title: document.title,
//  text: 'Hello World',
//});

/////////////////////////////////////////////////////////
function downloadReference(){
  fetch("https://www.loyal9.app/tables/table.html")
  .then(function(response) {
    return response.blob()
  })
  .then(function(blob) {

    var file = new File([blob], "MyGrow.jpg", {type: 'image/jpeg'});
    var filesArray = [file];

    if(navigator.canShare && navigator.canShare({ files: filesArray })) {
      navigator.share({
        text: 'MyGrow',
        files: filesArray,
        title: 'Information Overload',
        url: 'https://www.loyal9.app/tables/table.html'
      });
    };
  })
}