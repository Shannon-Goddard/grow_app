/////////////check boxes//////////////
function hide_show_table(col_name)
{
 var checkbox_val=document.getElementById(col_name).value;
 if(checkbox_val=="show")
 {
  var all_col=document.getElementsByClassName(col_name);
  for(var i=0;i<all_col.length;i++)
  {
   all_col[i].style.display="none";
  }
  document.getElementById(col_name+"_head").style.display="none";
  document.getElementById(col_name).value="hide";
 }
 else
 {
  var all_col=document.getElementsByClassName(col_name);
  for(var i=0;i<all_col.length;i++)
  {
   all_col[i].style.display="table-cell";
  }
  document.getElementById(col_name+"_head").style.display="table-cell";
  document.getElementById(col_name).value="show";
  $("#taskButton").show();
 }
 
}
//////////////////stores table after selection
$(function(){
  // append this attribute to the element you want the html stored of.
  $("#table4").attr("contenteditable", "true")
  var content = document.getElementById('table4');
  // save the page's state after user selects and clicks "select"
  $(".get-started-btn").click(function() {
    localStorage.setItem('page_html4', JSON.stringify(content.innerHTML));
  });
  // retrieve local storage data
  var arr = JSON.parse( localStorage.getItem('page_html4') );
  if (arr) {
    content.innerHTML = arr;
  }
});