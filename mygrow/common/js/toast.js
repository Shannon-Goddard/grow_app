// toast.js
export function showToast(message) {
    const existingContainer = document.querySelector('.toast-container');
    if (existingContainer) existingContainer.remove();

    const container = document.createElement('div');
    container.className = 'toast-container';
    container.style.position = 'fixed';
    container.style.top = '80px';
    container.style.right = '20px';
    container.style.zIndex = '10000';
    container.style.maxWidth = '300px';
    document.body.appendChild(container);

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    toast.style.color = 'white';
    toast.style.padding = '12px 15px';
    toast.style.borderRadius = '4px';
    toast.style.marginBottom = '10px';
    toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => container.remove(), 3000);
}