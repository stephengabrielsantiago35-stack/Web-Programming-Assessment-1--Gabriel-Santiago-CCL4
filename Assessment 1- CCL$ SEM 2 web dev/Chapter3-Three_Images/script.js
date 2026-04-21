// Get all filter buttons on the page
const filterButtons = document.querySelectorAll('.filter-btn');
// Get all clear buttons on the page
const clearButtons = document.querySelectorAll('.clear-btn');

// Function to apply different filters to an image
// Parameters: imageElement (the img tag), filterType (grayscale, sepia, or blur)
function applyFilter(imageElement, filterType) {
    switch(filterType) {
        case 'grayscale':
            imageElement.style.filter = 'grayscale(100%)';  // Converts to black and white
            break;
        case 'sepia':
            imageElement.style.filter = 'sepia(100%)';      // Applies warm vintage tone
            break;
        case 'blur':
            imageElement.style.filter = 'blur(2px)';        // Applies 2px soft focus effect
            break;
        default:
            imageElement.style.filter = 'none';              // Removes any filter
    }
}

// Function to clear filters from an image
function clearFilter(imageElement) {
    imageElement.style.filter = 'none';  // Removes all filters, shows original image
}

// Add click event listener to each filter button
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        const imageId = this.getAttribute('data-image');     // Gets which image to target (img1, img2, img3)
        const filterType = this.getAttribute('data-filter'); // Gets which filter to apply
        const imageElement = document.getElementById(imageId); // Finds the image element by ID
        applyFilter(imageElement, filterType);               // Applies the selected filter
    });
});

// Add click event listener to each clear button
clearButtons.forEach(button => {
    button.addEventListener('click', function() {
        const imageId = this.getAttribute('data-image');     // Gets which image to target (img1, img2, img3)
        const imageElement = document.getElementById(imageId); // Finds the image element by ID
        clearFilter(imageElement);                            // Clears all filters from the image
    });
});