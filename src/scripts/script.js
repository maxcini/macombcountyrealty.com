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
document.addEventListener('DOMContentLoaded', () => {
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
            
            // Requesting ONLY Essentials data keeps it free.
            await place.fetchFields({ fields: ['displayName', 'formattedAddress'] });
            
            console.log("User selected address:", place.formattedAddress);
        });
    }
});

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



// --- 3. Multi-Step Form & Email Submission Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('lead-form');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const successSection = document.getElementById('form-success');
    
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const addressInput = document.getElementById('address-input');
    const hiddenAddressField = document.getElementById('hidden-address-field');

    if (nextBtn && form) {
        // STEP 1 -> STEP 2 TRANSITION
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Safely pull the text value directly out of the Google component
            let addressValue = addressInput.value || '';
            
            // Fallback check if the component value is resting inside its shadow DOM input element
            if (!addressValue && addressInput.shadowRoot) {
                const innerInput = addressInput.shadowRoot.querySelector('input');
                if (innerInput) addressValue = innerInput.value;
            }

            // Prevent blank progress if they clicked ahead accidentally
            if (!addressValue || addressValue.trim() === '') {
                // Use our invisible anchor to trigger the native browser bubble!
                const validationAnchor = document.getElementById('validation-anchor');
                
                if (validationAnchor) {
                    validationAnchor.setCustomValidity("Please fill out this field.");
                    validationAnchor.reportValidity();
                    
                    // Clear the error bubble as soon as they click back into the address bar
                    addressInput.addEventListener('click', () => {
                        validationAnchor.setCustomValidity("");
                    }, { once: true });
                    
                    addressInput.addEventListener('keydown', () => {
                        validationAnchor.setCustomValidity("");
                    }, { once: true });
                }
                return;
            }

            // Sync the captured Google address to our hidden field so it emails cleanly
            hiddenAddressField.value = addressValue;

            // Swap visual views
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
        });

        // AJAX EMAIL SUBMISSION HANDLER
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Visual indicator to avoid duplicate double-clicks
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending Details...';

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let res = await response.json();
                if (response.status == 200) {
                    // Success! Hide form inputs completely, show nice custom confirmation message
                    step2.classList.add('hidden');
                    successSection.classList.remove('hidden');
                } else {
                    console.log(res);
                    alert('Something went wrong. Please try again.');
                    resetButton();
                }
            })
            .catch(error => {
                console.log(error);
                alert('Connection error. Please try again later.');
                resetButton();
            });
        });
    }

    function resetButton() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Info <span class="arrow">➔</span>';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Find all links that point to the lead form
    const scrollLinks = document.querySelectorAll('a[href="#top"]');
    const addressInput = document.getElementById('address-input');

    scrollLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Give the smooth scroll a tiny fraction of a second to finish, then focus the input
            setTimeout(() => {
                if (addressInput) {
                    addressInput.focus();
                }
            }, 800); // 800 milliseconds allows the scroll animation to complete
        });
    });
});