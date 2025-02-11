///////lazy load imgages on ul list///////////////////////
document.addEventListener('DOMContentLoaded', function() {
  // Force layout recalculation
  window.dispatchEvent(new Event('resize'));
  
  // Initialize lazy loading
  const observer = lozad();
  observer.observe();
  
  // Add fade-in effect to elements
  document.querySelectorAll('.fade-in').forEach(element => {
      element.classList.add('visible');
  });
});
//Function to hide search until user starts typing//
$(function() {
  $('#myInput').keyup(function() {
    if ($(this).val().length == 0) {
      $('#myUL').hide();
    } else {
      $('#myUL').show();
    }
  }).keyup();
});
//Function for search box to filter as user inputs/////////
function myFunction() {
  // Get the input element
  const input = document.getElementById("myInput");
  if (!input) return; // Guard clause if input doesn't exist
  // Get the filter value and convert to uppercase
  const filter = input.value.toUpperCase();
  // Get the list element
  const ul = document.getElementById("myUL");
  if (!ul) return; // Guard clause if ul doesn't exist
  // Get all li elements
  const li = ul.getElementsByTagName("li");
  // Loop through list items
  for (let i = 0; i < li.length; i++) {
      const a = li[i].getElementsByTagName("a")[0]; // Get first anchor in li
      if (a) { // Check if anchor exists
          const txtValue = a.textContent || a.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
              li[i].style.display = "";
          } else {
              li[i].style.display = "none";
          }
      }
  }
}
//Function to change info on click////////////////////
$("li").on("click", "a", function() {
  // First check if data exists
  if (typeof data === 'undefined') {
    console.error('Data is not defined');
    return;
  }

  const d = data;
  const Index = this.id;

  // Check if the index exists in the data object
  if (!d[Index]) {
    console.error('No data found for index:', Index);
    return;
  }

  // Now safely access the properties
  try {
    $("#image").attr("src", d[Index].logo || '').show();
    $("#strain").text(d[Index].strain || '');
    $("#Grow").text(d[Index].Grow || '');
    $("#Sativa").text(d[Index].Sativa || '');
    $("#Indica").text(d[Index].Indica || '');
    $("#Hybrid").text(d[Index].Hybrid || '');
    $("#THC").text('THC: ' + (d[Index].THC || '0') + '%');
    $("#CBD").text('CBD: ' + (d[Index].CBD || '0') + '%');
    $("#info").text(d[Index].info || '');
    $("#more").text(d[Index].more || '');

    // Clear search and hide results
    document.getElementById("myInput").value = "";
    document.getElementById("myUL").style.display = "none";
    $("#taskButton").show();
    $("#weeks").show();
  } catch (error) {
    console.error('Error updating content:', error);
  }
});

//function to store users selection onto mygrow-saved.html///
$(".get-started-btn").click(function() {
  var node, logoNode, growNode;
  node = document.getElementById('strain'),
  logoNode = document.getElementById('image'),
  growNode = document.getElementById('Grow'),
  // image src
  logoSrc = logoNode.src;
  // Strain text 
  textContent = node.textContent;
  ////Grow value
  growContent = growNode.textContent;
  // Store in localStorage
  localStorage.setItem('plant2Strain', node.textContent);
  localStorage.setItem('plant2Logo', logoNode.src);
  localStorage.setItem('plant2Grow', growNode.textContent);
});
