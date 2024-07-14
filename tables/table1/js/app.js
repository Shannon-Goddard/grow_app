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
//////////Share///////////////////////////////////////////////////////////////////////

function shareList() {
  if (navigator.canShare) {
    navigator.share({
      title: "Page Title",
      text: "brief description",
      url: window.location.href,
    });
  } else {
    //functionality for desktop
  }
}

////////////PDF///////////////////////////////////////////////////////////////////////
//window.jsPDF = window.jspdf.jsPDF;
var doc = new jsPDF();
                var specialElementHandlers = {
                  '#editor': function (element, renderer) {
                return true;
            }
        };

        $('#pdfButton').click(function () {
            doc.fromHTML($('#table1').html(), 15, 15, {
                'width': 170,
                    'elementHandlers': specialElementHandlers
            });
            doc.save('SurveyReport.pdf');
        });
////////////////////////////////////////Download//////////////////
function downloadReference(){
  var dl = document.getElementById ("dl");
  dl.href="data:text/plain," + document.getElementById("table1").outerHTML;
  return true;
}