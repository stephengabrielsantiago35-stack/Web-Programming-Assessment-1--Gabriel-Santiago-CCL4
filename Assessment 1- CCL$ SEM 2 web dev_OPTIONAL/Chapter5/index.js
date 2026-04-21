// ==================== CONFIGURATION ====================
// Set the folder where your audio files are stored
const AUDIO_PATH = 'audio/';  // Path to audio files subfolder - all sounds loaded from here

// ==================== SAMPLE DATA (filenames only) ====================
const allSamples = [                                  // Array of all sound samples
    { name: "ah-ha", file: "ah-ha.mp3" },             // First sample: display name and filename
    { name: "back-of-the-net", file: "back-of-the-net.mp3" }, // Classic Alan Partridge phrase
    { name: "bangoutoforder", file: "bangoutoforder.mp3" },   // "Bang out of order!"
    { name: "dan", file: "dan.mp3" },                 // "Dan!" - his radio producer
    { name: "emailoftheevening", file: "emailoftheevening.mp3" }, // "Email of the evening"
    { name: "hellopartridge", file: "hellopartridge.mp3" },     // "Hello Partridge!"
    { name: "iateascotchegg", file: "iateascotchegg.mp3" },     // "I ate a scotch egg"
    { name: "imconfused", file: "imconfused.mp3" }   // "I'm confused!"
];

// ==================== STATE ====================
const samplesPerPage = 9;                             // Number of sound buttons to show per page (3×3 grid)
let currentPage = 0;                                   // Current page index (0-based: Page 1 = index 0)
const totalPages = Math.ceil(allSamples.length / samplesPerPage); // Calculate total pages: 8 samples ÷ 9 = 1 page
let sampleDurations = new Array(allSamples.length).fill(null); // Array to store audio durations (initialized with null)

// ==================== DOM ELEMENTS ====================
const grid = document.getElementById('soundboard-grid'); // Get reference to the grid container element
const prevBtn = document.getElementById('prev-page');    // Get reference to previous page button
const nextBtn = document.getElementById('next-page');    // Get reference to next page button
const pageIndicator = document.getElementById('page-indicator'); // Get reference to page indicator span
const ttsTextarea = document.getElementById('tts-text'); // Get reference to textarea for TTS input
const ttsButton = document.getElementById('tts-button'); // Get reference to TTS speak button

// ==================== LOAD DURATIONS ====================
function loadAllDurations() {                           // Function to load duration metadata for all audio files
    allSamples.forEach((sample, index) => {             // Loop through each sample with its index
        const audio = new Audio(AUDIO_PATH + sample.file); // Create new Audio object with file path
        audio.addEventListener('loadedmetadata', () => {   // Event fires when audio metadata (duration) is loaded
            sampleDurations[index] = audio.duration;       // Store duration in seconds at matching index
            updateVisibleDurations();                       // Update durations shown on current page
        });
        audio.addEventListener('error', () => {           // Event fires if audio fails to load
            sampleDurations[index] = '?';                  // Mark as unknown with question mark
            updateVisibleDurations();                       // Update display to show '?'
        });
    });
}

function updateVisibleDurations() {                      // Updates duration displays for currently visible buttons
    const start = currentPage * samplesPerPage;          // Calculate starting index for current page
    const pageSamples = allSamples.slice(start, start + samplesPerPage); // Get samples for current page
    const buttons = grid.children;                        // Get all button elements in the grid
    
    for (let i = 0; i < pageSamples.length; i++) {       // Loop through each button on current page
        if (buttons[i]) {                                  // Check if button exists
            const sampleIndex = start + i;                  // Calculate global index of this sample
            const duration = sampleDurations[sampleIndex];  // Get duration from array
            const durationSpan = buttons[i].querySelector('.duration'); // Find duration span in button
            
            if (durationSpan) {                             // If duration span exists
                if (duration && duration !== '?') {          // If we have a valid duration number
                    const mins = Math.floor(duration / 60);    // Calculate minutes (floor division)
                    const secs = Math.floor(duration % 60);    // Calculate seconds (remainder)
                    durationSpan.textContent = `${mins}:${secs.toString().padStart(2, '0')}`; // Format as MM:SS with leading zero
                } else {                                      // If duration is '?' or still loading
                    durationSpan.textContent = duration === '?' ? '?' : 'loading...'; // Show '?' or 'loading...'
                }
            }
        }
    }
}

// ==================== RENDER PAGE ====================
function renderPage() {                                   // Creates and displays buttons for current page
    const start = currentPage * samplesPerPage;           // Calculate starting index
    const pageSamples = allSamples.slice(start, start + samplesPerPage); // Get samples for this page
    
    grid.innerHTML = '';                                   // Clear the grid (remove all existing buttons)
    
    pageSamples.forEach((sample, idx) => {                 // Loop through samples for this page
        const actualIndex = start + idx;                    // Calculate global index
        const button = document.createElement('button');    // Create new button element
        button.className = 'sample-button';                 // Add CSS class for styling
        
        const nameSpan = document.createElement('span');    // Create span for sample name
        nameSpan.className = 'sample-name';                 // Add class for styling
        nameSpan.textContent = sample.name;                  // Set text to sample name (e.g., "ah-ha")
        
        const durationSpan = document.createElement('span'); // Create span for duration
        durationSpan.className = 'duration';                 // Add class for styling
        const duration = sampleDurations[actualIndex];       // Get duration from array
        
        if (duration && duration !== '?') {                  // If we have valid duration
            const mins = Math.floor(duration / 60);            // Calculate minutes
            const secs = Math.floor(duration % 60);            // Calculate seconds
            durationSpan.textContent = `${mins}:${secs.toString().padStart(2, '0')}`; // Format as MM:SS
        } else if (duration === '?') {                        // If failed to load
            durationSpan.textContent = '?';                     // Show question mark
        } else {                                               // If still loading
            durationSpan.textContent = 'loading...';            // Show loading message
        }
        
        button.appendChild(nameSpan);                         // Add name span to button
        button.appendChild(durationSpan);                     // Add duration span to button
        
        button.addEventListener('click', () => {              // Add click event listener to button
            const audio = new Audio(AUDIO_PATH + sample.file); // Create new audio object for this sample
            audio.play().catch(e => console.log('Playback failed:', e)); // Play audio and catch any errors
        });
        
        grid.appendChild(button);                             // Add completed button to grid
    });
    
    // Update pagination controls
    prevBtn.disabled = currentPage === 0;                     // Disable prev button if on first page
    nextBtn.disabled = currentPage === totalPages - 1;        // Disable next button if on last page
    pageIndicator.textContent = `Page ${currentPage + 1} of ${totalPages}`; // Update page display (convert to 1-based)
}

// ==================== PAGINATION ====================
prevBtn.addEventListener('click', () => {                    // Event listener for previous page button
    if (currentPage > 0) {                                    // Check if not on first page
        currentPage--;                                         // Decrement page number
        renderPage();                                          // Re-render with new page
    }
});

nextBtn.addEventListener('click', () => {                    // Event listener for next page button
    if (currentPage < totalPages - 1) {                       // Check if not on last page
        currentPage++;                                         // Increment page number
        renderPage();                                          // Re-render with new page
    }
});

// ==================== TEXT‑TO‑SPEECH ====================
ttsButton.addEventListener('click', () => {                   // Event listener for TTS speak button
    const text = ttsTextarea.value.trim();                    // Get text from textarea and remove whitespace
    if (text === '') return;                                   // If empty, do nothing
    
    const utterance = new SpeechSynthesisUtterance(text);     // Create new speech utterance with the text
    utterance.lang = 'en-GB';                                  // Set language to British English (Alan is British!)
    utterance.rate = 1.0;                                      // Normal speaking speed (1.0 = default)
    utterance.pitch = 1.0;                                     // Normal pitch (1.0 = default)
    window.speechSynthesis.cancel();                           // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);                   // Speak the new utterance
});

// ==================== INIT ====================
loadAllDurations();                                           // Start loading audio durations on page load
renderPage();                                                  // Render the first page of buttons