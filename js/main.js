document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    menuToggle?.addEventListener('click', () => {
        nav?.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            nav?.classList.remove('active');
        });
    });
});