document.addEventListener('DOMContentLoaded', (event) => {
    // Initially hide the patient note form container
    document.querySelector('.patient-note').style.display = 'none';

    document.getElementById('add-note-btn').addEventListener('click', function() {
        // Display the patient note form container
        var noteContainer = document.querySelector('.patient-note');
        noteContainer.style.display = noteContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Submit Button Functionality
    document.getElementById('patient-note-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var noteContent = document.querySelector('.patient-note .note-input').value;
        var date = new Date().toISOString();

        // Send the note content and date to the Flask app
        fetch('/add_note', {
            method: 'POST',
            body: JSON.stringify({ note: noteContent, date: date }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Updating the Notes-Date Container
            var notesLinksContainer = document.getElementById('notes-links-container');
            var newLink = document.createElement('a');
            newLink.href = '#';
            newLink.textContent = `Note - ${new Date(data.date).toLocaleString()}`;
            newLink.dataset.noteId = data.id; // Store the note ID as data attribute
            notesLinksContainer.appendChild(newLink);

            // Clear the input field and hide the note form
            document.querySelector('.patient-note .note-input').value = '';
            document.querySelector('.patient-note').style.display = 'none';
        })
        .catch(error => console.error('Error:', error));
    });

    // Close Note Functionality
    document.querySelectorAll('.close-note-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Hide the note-container
            this.parentElement.style.display = 'none';
        });
    });
});

document.getElementById('patient-note-form').addEventListener('submit', addPatientNote);

function filterNotesByDate(date) {
    // Logic to filter notes by date
}
document.getElementById('date-filter').addEventListener('change', filterNotesByDate);