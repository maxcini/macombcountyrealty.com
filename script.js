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

// ==========================================
// BEFORE & AFTER LIGHTBOX MODAL CAPABILITIES
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".lightbox-close");
    const triggerImages = document.querySelectorAll(".image-wrapper img");

    if (!modal || !modalImg || triggerImages.length === 0) return;

    // Loop through before and after images to register open commands
    triggerImages.forEach(img => {
        img.addEventListener("click", function () {
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            modal.classList.add("show");
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden"; // Stop background page scrolling
        });
    });

    // Close window execution when clicking the 'X' button
    closeBtn.addEventListener("click", closeModal);

    // Close window execution when clicking anywhere in the dark backdrop space
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close window execution if escape button key is tapped
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("show")) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // Re-enable background page scrolling
        
        // Wait for the fade fade-out style transition to conclude before stripping out source asset target maps
        setTimeout(() => {
            modalImg.src = "";
        }, 300);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Select all the links inside your navigation menu
    const navLinks = document.querySelectorAll('#main-nav a');
    
    // 2. Select the mobile hamburger button
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    // 3. Loop through each link and add a click event listener
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // 4. Check if the menu is currently open 
            // (Based on your HTML, it uses aria-expanded="true" when open)
            if (mobileMenuBtn.getAttribute('aria-expanded') === 'true') {
                
                // Simulate a click on the hamburger button to close the menu
                mobileMenuBtn.click(); 
            }
        });
    });
});