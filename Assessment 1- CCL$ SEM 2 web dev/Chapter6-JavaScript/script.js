// ========================================
// Petrol Calculator JavaScript
// Author: Gabriel Santiago
// Description: Handles calculation logic
// ========================================

// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // Get DOM elements
    // ========================================
    
    // Get the cost per liter input field
    const costPerLiterInput = document.getElementById('costPerLiter');
    
    // Get the liters purchased input field
    const litersInput = document.getElementById('liters');
    
    // Get the calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    
    // Get the paragraph element where we'll display the total cost
    const totalCostDisplay = document.getElementById('totalCost');
    
    // ========================================
    // Add event listener to the calculate button
    // ========================================
    calculateBtn.addEventListener('click', function() {
        
        // ========================================
        // Get values from input fields
        // ========================================
        
        // Get the cost per liter value and convert to number
        // parseFloat converts the string to a decimal number
        const costPerLiter = parseFloat(costPerLiterInput.value);
        
        // Get the liters value and convert to number
        const liters = parseFloat(litersInput.value);
        
        // ========================================
        // Validate the inputs
        // ========================================
        
        // Check if costPerLiter is a valid number and not negative
        if (isNaN(costPerLiter) || costPerLiter < 0) {
            alert('Please enter a valid cost per liter (positive number)');
            totalCostDisplay.textContent = '£0.00';
            return; // Exit the function early
        }
        
        // Check if liters is a valid number and not negative
        if (isNaN(liters) || liters < 0) {
            alert('Please enter a valid number of liters (positive number)');
            totalCostDisplay.textContent = '£0.00';
            return; // Exit the function early
        }
        
        // ========================================
        // Calculate the total cost
        // ========================================
        
        // Calculate total cost (cost per liter × number of liters)
        const totalCost = costPerLiter * liters;
        
        // ========================================
        // Display the result
        // ========================================
        
        // Format the total cost to 2 decimal places and add £ symbol
        // toFixed(2) ensures we always show 2 decimal places
        totalCostDisplay.textContent = `£${totalCost.toFixed(2)}`;
        
        // ========================================
        // Optional: Add visual feedback
        // ========================================
        
        // Briefly highlight the result
        totalCostDisplay.style.transform = 'scale(1.1)';
        setTimeout(function() {
            totalCostDisplay.style.transform = 'scale(1)';
        }, 200);
    });
    
    // ========================================
    // Optional: Add enter key functionality
    // ========================================
    
    // Allow pressing Enter key in either input to trigger calculation
    [costPerLiterInput, litersInput].forEach(input => {
        input.addEventListener('keypress', function(event) {
            // Check if the pressed key is Enter
            if (event.key === 'Enter') {
                // Trigger the calculate button click
                calculateBtn.click();
            }
        });
    });
    
    // ========================================
    // Optional: Format inputs on blur (when user leaves the field)
    // ========================================
    
    costPerLiterInput.addEventListener('blur', function() {
        // If input is empty, reset to default
        if (this.value === '') {
            this.value = '1.72';
        }
    });
    
    litersInput.addEventListener('blur', function() {
        // If input is empty, reset to default
        if (this.value === '') {
            this.value = '0';
        }
    });
});