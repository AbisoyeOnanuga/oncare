/*===== MENU TOGGLE =====*/ 
document.getElementById('nav-toggle').addEventListener('click', function() {
  var navMenu = document.getElementById('nav-menu');
  if (navMenu.style.display === 'flex') {
      navMenu.style.display = 'none';
  } else {
      navMenu.style.display = 'flex';
  }
});

/*==================== REMOVE MENU MOBILE ====================*/ 
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== PROFILE TOGGLE ====================*/ 
// Toggle profile card visibility
const profileImage = document.getElementById("profile-image");
const profileCard = document.getElementById("profile-card");

profileImage.addEventListener("click", () => {
    profileCard.style.display = profileCard.style.display === "block" ? "none" : "block";
});

// Close profile card when clicking outside
document.addEventListener("click", (event) => {
    if (!profileCard.contains(event.target) && event.target !== profileImage) {
        profileCard.style.display = "none";
    }
});

/*==================== SPEECH RECOGNITION ====================*/ 
// Function to start speech recognition
function startSpeechRecognition(inputId, buttonId) {
    var speechBtn = document.getElementById(buttonId);
    // Check if the browser supports speech recognition
    if ('webkitSpeechRecognition' in window) {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        // Change the button color to green when active
        speechBtn.style.backgroundColor = 'rgba(0, 128, 0)'; // Green with transparency

        recognition.start();

        recognition.onresult = function(event) {
            var speechResult = event.results[0][0].transcript;
            document.getElementById(inputId).value = speechResult;
            // Change the button color to grey when inactive
            speechBtn.style.backgroundColor = 'rgba(128, 128, 128)'; // Grey with transparency
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            // Change the button color to red when there is an error
            speechBtn.style.backgroundColor = 'rgba(255, 0, 0)'; // Red with transparency
        };

        recognition.onend = function() {
            // Reset the button color to grey when the microphone stops
            speechBtn.style.backgroundColor = 'rgba(128, 128, 128)'; // Grey with transparency
        };
    } else {
        alert('Your browser does not support speech recognition.');
    }
}


/*==================== NOTIFICATION PROTOTYPE ====================*/ 
function showNotification(message) {
    const notificationContainer = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notificationContainer.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 5000); // Remove after 5 seconds
}

// Example usage:
showNotification('New doctor response received!');

/*
// Call showToast when starting and stopping speech recognition
recognition.start();
showToast('Microphone is active');

recognition.onend = function() {
    showToast('Microphone has stopped recording');
};


// Function to start speech recognition
function startSpeechRecognition(inputId) {
    // Check for SpeechRecognition object in the global scope
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    // If SpeechRecognition is not supported, alert the user
    if (!SpeechRecognition) {
        alert('Speech recognition is not supported in this browser.');
        return;
    }

    var recognition = new SpeechRecognition();
    recognition.continuous = false; // Set to false for single-shot mode
    recognition.interimResults = false; // We don't need interim results
    recognition.lang = 'en-US'; // Set the language of the recognition

    // Start the speech recognition
    recognition.start();

    // Visual feedback when the microphone is on
    document.getElementById('mic-status').textContent = '🎤 Listening...';

    // This event is triggered when the speech recognition service returns a result
    recognition.onresult = function(event) {
        var speechResult = event.results[0][0].transcript;
        document.getElementById(inputId).value = speechResult;
        // Update the microphone status
        document.getElementById('mic-status').textContent = '✅ Finished listening.';
    };

    // Handle errors
    recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
        // Update the microphone status
        document.getElementById('mic-status').textContent = '❌ Error occurred.';
    };

    // When the microphone is turned off
    recognition.onend = function() {
        // Update the microphone status
        document.getElementById('mic-status').textContent = '🛑 Microphone off.';
    };
}
*/