function addPatientNote(event) {
    event.preventDefault(); // Prevent the default form submit action
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
        // Update the notes-dates container with a new link
        var notesLinksContainer = document.getElementById('notes-links-container');
        var newLink = document.createElement('a');
        newLink.href = '#';
        newLink.textContent = `Note - ${date}`;
        notesLinksContainer.appendChild(newLink);
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('patient-note-form').addEventListener('submit', addPatientNote);
document.getElementById('note-entry-form').addEventListener('submit', addPatientNote);
document.getElementById('filter-options').addEventListener('change', filterNotesByDate);

function filterNotesByDate(date) {
    // Logic to filter notes by date
}