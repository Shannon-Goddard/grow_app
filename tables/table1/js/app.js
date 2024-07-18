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
//////////Get table data////

//https://www.loyal9.app/tables/table
/////////////////////share/////////////////////////////////////

//navigator.share({
//  url,
//  title: document.title,
//  text: 'Hello World',
//});

/////////////////////////////////////////////////////////test
function toExcel() { 
  $("#table1").table2excel({ 
    exclude: ".noExl",
    name: "MyGrow.xls",
    filename: "MyGrow.xls",
    fileext: ".xls",
    exclude_img: true,
    exclude_links: true,
    exclude_inputs: true,
    preserveColors: false
});         
    
    
}; 
///////////////////////////////////////////////////////////////end test
const button = document.querySelector('button');
const img =  document.querySelector('table1');

// Feature detection
const webShareSupported = 'canShare' in navigator;
// Update the button action text.
button.textContent = webShareSupported ? 'Share' : 'Download';

const shareOrDownload = async (blob, fileName, title, text) => {
  // Using the Web Share API.
  if (webShareSupported) {
    const data = {
      files: [
        new File([blob], fileName, {
          type: blob.type,
        }),
      ],
      title,
      text,
    };
    if (navigator.canShare(data)) {
      try {
        await navigator.share(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err.name, err.message);
        }
      } finally {
        return;
      }
    }
  }
  // Fallback implementation.
  const a = document.createElement('a');
  a.download = fileName;
  a.style.display = 'none';
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', () => {
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000)
  });
  document.body.append(a);
  a.click();
};

button.addEventListener('click', async () => {
  const blob = await fetch(img.src).then(res => res.blob());
  await shareOrDownload(blob, 'MyGrow.xls', 'MyGrow', 'Information Overload');
});