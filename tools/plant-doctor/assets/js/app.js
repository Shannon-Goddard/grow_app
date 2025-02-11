/////////////check boxes//////////////
function hide_show_table(col_name) {
  var checkbox_val = document.getElementById(col_name).value;
  if (checkbox_val == "show") {
    var all_col = document.getElementsByClassName(col_name);
    for (var i = 0; i < all_col.length; i++) {
      all_col[i].style.display = "none";
    }
    document.getElementById(col_name + "_head").style.display = "none";
    document.getElementById(col_name).value = "hide";
  } else {
    var all_col = document.getElementsByClassName(col_name);

    for (var i = 0; i < all_col.length; i++) {
      all_col[i].style.display = "table-cell";
    }
    document.getElementById(col_name + "_head").style.display = "table-cell";
    document.getElementById(col_name).value = "show";
  }
  hide_show_rows();
}
function hide_show_rows() {
  var checkboxes = document.querySelectorAll(".listPrint [type=checkbox]");
  var rows = document.querySelectorAll("#table2 tbody tr");
  rows.forEach(function(row) {
    var cells = [...row.querySelectorAll("td:not(:first-child)")]
    var empty = cells.filter(function(cell, index) {
      return !cell.innerHTML && checkboxes[index].checked
    })
    if (empty.length) {
      row.style.display = 'none'
    } else {
      row.style.display = ''
    }
  })
}
/////// show table
$("li").on("click" , "input" , function(){
 
  $('#hide-table').show();
})