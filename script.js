// --- 1. Mobile Menu Logic ---
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


// --- 2. Google Places Autocomplete Setup ---
// Notice how this is now OUTSIDE the DOMContentLoaded block above!
let autocomplete;

function initAutocomplete() {
    const addressInput = document.querySelector('gmp-place-autocomplete.form-input-address');
    
    if (addressInput) {
        // Prevent form submission on enter
        addressInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); 
            }
        });

        // Listen for when a user selects a place from the dropdown
        addressInput.addEventListener('gmp-select', async function(event) {
            const place = event.placePrediction.toPlace();
            
            // FIX: Removed 'location'. Requesting ONLY Essentials data keeps it free.
            await place.fetchFields({ fields: ['displayName', 'formattedAddress'] });
            
            console.log("User selected address:", place.formattedAddress);
        });
    }
}