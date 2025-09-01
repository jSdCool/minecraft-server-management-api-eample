// Function to show a notification
function showNotification(message, duration = 16000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    const container = document.getElementById('notifications');
    container.appendChild(notification);

    // Remove after duration
    setTimeout(() => {
        notification.classList.add('fade-out');
        notification.addEventListener('animationend', () => {
            notification.remove();
        });
    }, duration);
}

// // Example: Simulate receiving notifications from a server
// setInterval(() => {
//     const msg = "Server Message " + new Date().toLocaleTimeString();
//     showNotification(msg);
// }, 6000); // every 6 seconds