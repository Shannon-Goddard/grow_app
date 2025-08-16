// tablet.js
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const main = document.getElementById('main');
    const headerHeight = header.offsetHeight;
    main.style.paddingTop = `${headerHeight + 80}px`; /* Header height + breadcrumbs buffer */
    console.log('Header height:', headerHeight, 'Main padding-top:', main.style.paddingTop);
});
