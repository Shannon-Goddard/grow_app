// Cache DOM elements once
const elements = {
  dropdown: document.getElementById('myDropdown'),
  watts: document.getElementById('watts'),
  image: document.getElementById('image'),
  info: document.getElementById('info'),
  taskButton: document.getElementById('taskButton')
};

// Toggle dropdown
const toggleDropdown = () => {
  if (elements.dropdown) {
    elements.dropdown.classList.toggle('show');
  }
};

// Close dropdown on outside click using event delegation
document.addEventListener('click', (event) => {
  if (!event.target.matches('#dropbtn')) {
    const dropdowns = document.getElementsByClassName('dropdown-content');
    Array.from(dropdowns).forEach(dropdown => {
      dropdown.classList.contains('show') && dropdown.classList.remove('show');
    });
  }
});

// Handle dropdown selection with optimized event delegation
$('#myDropdown').on('click', 'a', function() {
  const selectedId = this.id;
  
  // Early return if no data
  if (!data || !data[selectedId]) return;
  
  const selectedData = data[selectedId];
  
  // Update UI elements using destructured data
  const { pic, watts, info: infoText } = selectedData;
  
  // Update DOM elements safely using optional chaining
  elements.image?.setAttribute('src', pic);
  elements.image?.style.setProperty('display', 'block');
  elements.watts && (elements.watts.textContent = watts);
  elements.info && (elements.info.textContent = infoText);
  elements.taskButton?.style.setProperty('display', 'block');
});

// Store watts value in localStorage
$('.get-started-btn').on('click', () => {
  const wattsValue = elements.watts?.textContent;
  if (wattsValue) {
    localStorage.setItem('plantwatts', wattsValue);
  }
});
