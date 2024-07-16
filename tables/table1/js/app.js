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
//////////WORKS! renders table correctly and allows to share url TABLE.HTML ADD onclick=downloadReference()////
$(function(){
  $('.notes').remove();
});

$(function(){
  $("th:hidden,td:hidden").remove();
});

//$(function(){
//  var dl = document.getElementById ("dl");
//  dl.href="data:text/plain," + document.getElementById("table1").outerHTML;
//  return true;

//});

////////////////////////////////////////Download ios//////////////////
$(function(){
  var dl = document.getElementById ("dl");
  dl.href="data:text/plain," + document.getElementById("table1").outerHTML;
var download = document.getElementById("table1").outerHTML;
let tdownload = () => {
  if (download) {
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isChrome =
      navigator.userAgent.indexOf("CriOS") > -1 ||
      navigator.vendor.toLowerCase().indexOf("google") > -1;
    var iOSVersion = [];
    if (iOS) {
      iOSVersion = navigator.userAgent
        .match(/OS [\d_]+/i)[0]
        .substr(3)
        .split("_")
        .map((n) => parseInt(n));
    }
    var attachmentData = tdownload;
    var attachmentName = "Test.pdf";
    var contentType = "application/txt";

var binary = atob(attachmentData.replace(/\s/g, ""));
var len = binary.length;
var buffer = new ArrayBuffer(len);
var view = new Uint8Array(buffer);
for (var i = 0; i < len; i++) {
  view[i] = binary.charCodeAt(i);
}
var linkElement = document.createElement("a");
try {
  var hrefUrl = "";
  var blob = "";
  if (iOS && !isChrome && iOSVersion[0] <= 12) {
    blob = "data:text/plain," + download;
    hrefUrl = blob;
  } else {
    if (iOS && !isChrome) {
      contentType = "application/octet-stream";
    }
    blob = new Blob([view], { type: contentType });
    hrefUrl = window.URL.createObjectURL(blob);
  }
  linkElement.setAttribute("href", hrefUrl);
  linkElement.setAttribute("target", "_blank");
  if ((iOS && (iOSVersion[0] > 12 || isChrome)) || !iOS) {
    linkElement.setAttribute("download", attachmentName);
  }
  var clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: false
  });
  linkElement.dispatchEvent(clickEvent);


   } catch (ex) {}
  }
};
});
