// Cache DOM elements
const dropbtn = document.getElementById('dropbtn');
const myDropdown = document.getElementById('myDropdown');
const image = document.getElementById('image');
const height = document.getElementById('height');
const info = document.getElementById('info');
const taskButton = document.getElementById('taskButton');

// Initialize dropdown functionality
document.addEventListener('DOMContentLoaded', () => {
    // Toggle dropdown on button click
    if (dropbtn) {
        dropbtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            myDropdown.classList.toggle('show');
        });
    }

    // Handle dropdown item selection
    if (myDropdown) {
        myDropdown.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const selectedId = e.target.id;
                const selectedData = data[selectedId] || plantData[selectedId];

                if (selectedData) {
                    // Update image
                    if (image) {
                        image.src = selectedData.logo;
                        image.style.display = 'block';
                    }

                    // Update height text
                    if (height) {
                        height.textContent = selectedData.height;
                    }

                    // Update info text
                    if (info) {
                        info.textContent = selectedData.info;
                    }

                    // Show task button
                    if (taskButton) {
                        taskButton.style.display = 'block';
                    }

                    // Store selection in localStorage
                    localStorage.setItem('plantHeight', selectedData.height);

                    // Close dropdown
                    myDropdown.classList.remove('show');
                }
            }
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropbtn.contains(e.target) && !myDropdown.contains(e.target)) {
            if (myDropdown.classList.contains('show')) {
                myDropdown.classList.remove('show');
            }
        }
    });
});