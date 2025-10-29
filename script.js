// Variable assignments match the new IDs in index.html
const outputCard = document.getElementById('dynamic-question-output');
const outputText = outputCard.querySelector('.question-text'); // This holds the placeholder/loading text
const outputAnswer = outputCard.querySelector('.question-answer'); // This holds the final generated question
const contextInput = document.getElementById('question-context');
const loadingText = document.getElementById('loading-text');

// Function to call the secure backend endpoint
async function getQuestionFromGemini(context) {
    const API_ENDPOINT = '/.netlify/functions/generate-question';
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ context: context }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // The backend returns an object like { question: "..." }
        return data.question; 

    } catch (error) {
        console.error("Error calling backend API:", error);
        return "Sorry, there was an error generating the question. Try again!";
    }
}

/**
 * Main function to generate and display the question.
 */
async function generateQuestion() {
    // 1. Get user context (defaults to a general prompt)
    const userContext = contextInput.value.trim() || "thoughtful date question";

    // 2. Update UI for loading state
    outputAnswer.textContent = ""; // Clear previous answer
    outputText.textContent = ""; // Clear the placeholder text
    outputCard.classList.remove('revealed'); // Reset state to show loading
    outputCard.classList.add('active'); // Optional: Add a subtle active/generating style
    loadingText.style.display = 'block';

    // Scroll to the card
    outputCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // 3. Call the API (via the secure backend)
    const newQuestion = await getQuestionFromGemini(userContext);

    // 4. Update UI with the result
    loadingText.style.display = 'none';
    outputAnswer.textContent = newQuestion; // Put the actual question in the answer field
    outputText.textContent = "Click to reveal the question!"; // Restore the click-to-reveal prompt
    outputCard.classList.remove('active');

    // 5. Instantly reveal the answer (optional, but good UX for dynamic content)
    outputCard.classList.add('revealed');
}

// Function to toggle the reveal on static cards
function revealQuestion(card) {
    // Only toggle for cards that don't have the dynamic-question-output ID
    if (card.id !== 'dynamic-question-output') {
        card.classList.toggle('revealed');
    }
}

// Add event listener to the output card to clear/reset it
outputCard.addEventListener('click', () => {
    // We'll let the generateQuestion handle the initial reveal, 
    // but a subsequent click can clear it back to the original state.
    if (outputCard.classList.contains('revealed')) {
        outputCard.classList.remove('revealed');
        outputText.textContent = "Your next date question will appear here!";
        outputAnswer.textContent = "";
    }
});

// Initial accessibility setup and script for static buttons
document.addEventListener('DOMContentLoaded', function() {
    // Correct script name in the HTML
    const scriptTag = document.querySelector('script[src="script-static.js"]');
    if (scriptTag) scriptTag.src = 'script.js';
    
    // Accessibility for the dynamic card
    outputCard.setAttribute('tabindex', '0');
    outputCard.setAttribute('role', 'status');

    // Handle initial button clicks that were removed
    const exploreBtn = document.querySelector('.hero-buttons .btn-primary');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
             // Scroll to the categories section
             document.querySelector('.questions-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    const randomBtn = document.querySelector('.hero-buttons .btn-outline');
    if (randomBtn && randomBtn.getAttribute('onclick')) {
        // We've already added the onclick to the button in the HTML.
    }
});