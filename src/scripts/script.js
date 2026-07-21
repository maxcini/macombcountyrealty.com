// ==========================================
// BEFORE & AFTER LIGHTBOX MODAL CAPABILITIES
// ==========================================
// CHANGE THIS LINE: from "DOMContentLoaded" to "astro:page-load"
document.addEventListener("astro:page-load", function () {
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

document.addEventListener('astro:page-load', () => {
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
document.addEventListener('astro:page-load', () => {
    const form = document.getElementById('lead-form');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const successSection = document.getElementById('form-success');

    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const addressInput = document.getElementById('address-input');
    const hiddenAddressField = document.getElementById('hidden-address-field');

    // Prevent Enter from submitting the form while the user is still typing the address
    if (addressInput) {
        addressInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    }

    if (nextBtn && form) {
        // STEP 1 -> STEP 2 TRANSITION
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Pull the text value directly out of the address input
            let addressValue = addressInput.value || '';

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

            // Sync the captured address to our hidden field so it emails cleanly
            hiddenAddressField.value = addressValue;

            // Swap visual views
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
        });

        // AJAX EMAIL SUBMISSION HANDLER
        form.addEventListener('submit', function (e) {
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

document.addEventListener('astro:page-load', () => {
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


// --- 4. Contact Page Form Submission Logic ---
{
    const form = document.getElementById('contact-page-form');

    // Only run if the form exists on the current page
    if (form) {
        const submitBtn = form.querySelector('.submit-btn-full');
        const formContent = document.getElementById('contact-form-content');
        const successSection = document.getElementById('contact-form-success');
        const originalBtnHTML = submitBtn.innerHTML;

        form.addEventListener('submit', function (e) {
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
                        // Success! Hide the form fields and image, show the confirmation message
                        formContent.classList.add('hidden');
                        successSection.classList.remove('hidden');
                    } else {
                        console.log(res);
                        alert('Something went wrong. Please try again.');
                        resetContactButton();
                    }
                })
                .catch(error => {
                    console.log(error);
                    alert('Connection error. Please try again later.');
                    resetContactButton();
                });
        });

        function resetContactButton() {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    }
}

// ==========================================
// GOOGLE PLACES ADDRESS AUTOCOMPLETE (Data API, custom dropdown)
// ==========================================
// We deliberately do NOT use <gmp-place-autocomplete> (PlaceAutocompleteElement)
// here. That widget switches to a fullscreen takeover UI on narrow/mobile
// viewports as part of its built-in "mobile support" behavior, and there's no
// public option to turn that off since it lives inside a closed shadow DOM.
// Instead we use the same underlying Autocomplete (New) data (AutocompleteSuggestion)
// against your original <input>, and render our own simple dropdown. This gives
// identical, non-fullscreen behavior on every screen size.
async function initGoogleAutocomplete() {
    const addressInput = document.getElementById('address-input');
    const suggestionsList = document.getElementById('address-predictions');

    // Safety check: only run if these exist on the current page
    if (!addressInput || !suggestionsList) return;

    try {
        const { AutocompleteSessionToken, AutocompleteSuggestion } = await google.maps.importLibrary("places");

        // Sessions group a search + selection together for billing purposes.
        // We mint a new one after each completed selection.
        let sessionToken = new AutocompleteSessionToken();

        let debounceTimer = null;
        let activeRequestId = 0; // guards against slow/out-of-order responses

        function closeSuggestions() {
            suggestionsList.innerHTML = '';
            suggestionsList.classList.remove('is-open');
        }

        function renderSuggestions(suggestions) {
            suggestionsList.innerHTML = '';

            if (!suggestions || suggestions.length === 0) {
                closeSuggestions();
                return;
            }

            suggestions.forEach(suggestion => {
                const prediction = suggestion.placePrediction;
                if (!prediction) return;

                const item = document.createElement('li');
                item.className = 'address-prediction-item';
                item.setAttribute('role', 'option');

                const mainText = document.createElement('span');
                mainText.className = 'address-prediction-main';
                mainText.textContent = prediction.mainText ? prediction.mainText.text : prediction.text.text;
                item.appendChild(mainText);

                if (prediction.secondaryText && prediction.secondaryText.text) {
                    const secondaryText = document.createElement('span');
                    secondaryText.className = 'address-prediction-secondary';
                    secondaryText.textContent = prediction.secondaryText.text;
                    item.appendChild(document.createElement('br'));
                    item.appendChild(secondaryText);
                }

                // Use mousedown (fires before the input's blur) so the selection
                // registers before any blur-triggered close logic runs.
                item.addEventListener('mousedown', async (e) => {
                    e.preventDefault();

                    try {
                        const place = prediction.toPlace();
                        await place.fetchFields({ fields: ['formattedAddress'] });
                        addressInput.value = place.formattedAddress || prediction.text.text;
                    } catch (err) {
                        // Fall back to the prediction's own text if fetchFields fails
                        addressInput.value = prediction.text.text;
                    }

                    closeSuggestions();

                    // Clear any validation error state now that we have a value
                    const validationAnchor = document.getElementById('validation-anchor');
                    if (validationAnchor) {
                        validationAnchor.setCustomValidity("");
                    }

                    // Start a fresh session for the next search
                    sessionToken = new AutocompleteSessionToken();
                });

                suggestionsList.appendChild(item);
            });

            suggestionsList.classList.add('is-open');
        }

        async function fetchSuggestions(value) {
            const requestId = ++activeRequestId;

            const request = {
                input: value,
                sessionToken: sessionToken,
                includedRegionCodes: ['us'], // Restrict results to the United States
            };

            try {
                const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

                // Ignore this response if the user kept typing and a newer request is in flight
                if (requestId !== activeRequestId) return;

                renderSuggestions(suggestions);
            } catch (error) {
                console.error("Error fetching address suggestions:", error);
            }
        }

        addressInput.addEventListener('input', () => {
            const value = addressInput.value.trim();

            clearTimeout(debounceTimer);

            if (!value) {
                closeSuggestions();
                return;
            }

            // Small debounce so we're not firing a request on every keystroke
            debounceTimer = setTimeout(() => fetchSuggestions(value), 200);
        });

        // Close the dropdown when clicking anywhere outside of it
        document.addEventListener('click', (e) => {
            if (e.target !== addressInput && !suggestionsList.contains(e.target)) {
                closeSuggestions();
            }
        });

        // Close the dropdown on Escape
        addressInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSuggestions();
            }
        });

    } catch (error) {
        console.error("Error loading Google Places API:", error);
    }
}

// Initialize when the window loads
window.addEventListener('load', () => {
    initGoogleAutocomplete();
});