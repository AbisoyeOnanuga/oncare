// Placeholder for user ID obtained from Auth0 after login
const userId = 'demo'; // Replace with dynamic ID after implementing Auth0

function updateDoctorResponse(noteId) {
    var responseContent = document.getElementById('doctor-note-input').value;
    fetch('/doctor/add_response_to_note/' + noteId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            doctor_id: userId, // Use the dynamic ID here
            response_content: responseContent
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.result) {
            alert('Response added successfully!');
            window.location.reload();
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the response.');
    });
}

// Event listener for the close button in the doctor-note container
document.querySelector('.doctor-note .close-btn').addEventListener('click', function() {
    toggleDisplay('doctor-note', false); // Hide the doctor-note container
});

// Event listener for the note-summary link
document.querySelectorAll('.note-summary').forEach(item => {
    item.addEventListener('click', function() {
        // Set the noteId on the update button when a note-summary is clicked
        var noteId = this.dataset.noteId;
        document.querySelector('.update-note-btn').dataset.noteId = noteId;
        // Code to display the note content goes here
    });
});

// Ensure the update button has the correct ID and is within the form
document.getElementById('doctor-note-form').addEventListener('submit', function(event) {
    var noteId = this.querySelector('.update-note-btn').dataset.noteId; // The note ID should be stored in the button's data attribute
    updateDoctorResponse(noteId);
});
