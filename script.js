// Handles mobile menu expanding/collapsing and smooth hamburger morphing
document.addEventListener('DOMContentLoaded', () => {
    const menuToggleBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    if (menuToggleBtn && mainNav) {
        menuToggleBtn.addEventListener('click', () => {
            // Toggle active visual states smoothly
            mainNav.classList.toggle('active');
            menuToggleBtn.classList.toggle('is-active');
            
            // Sync accessibility parameters safely without destroying DOM elements
            const isExpanded = mainNav.classList.contains('active');
            menuToggleBtn.setAttribute('aria-expanded', isExpanded);
        });
    }
});