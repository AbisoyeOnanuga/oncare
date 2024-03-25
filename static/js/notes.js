document.addEventListener('DOMContentLoaded', (event) => {
    // Initially hide the patient note form container
    document.querySelector('.patient-note').style.display = 'none';
    document.querySelector('.edit-note').style.display = 'none';

    document.getElementById('add-note-btn').addEventListener('click', function() {
        // Display the patient note form container
        var noteContainer = document.querySelector('.patient-note');
        noteContainer.style.display = noteContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Submit button functionality
    document.getElementById('patient-note-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var noteContent = document.querySelector('.patient-note .note-input').value;
        var date = new Date().toISOString();

        // Send the note content and date to the Flask app
        fetch('/add_note', {
            method: 'POST',
            body: JSON.stringify({ 
                user_id: 'demo',
                date: date,
                type: 'patient',
                content: noteContent
            }),
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
            newLink.addEventListener('click', function() {
                // Code to handle note click event
                // Fetch the note content and display it in the textarea for editing
            });
            notesLinksContainer.appendChild(newLink);

            // Clear the input field and hide the note form
            document.querySelector('.patient-note .note-input').value = '';
            document.querySelector('.patient-note').style.display = 'none';
        })
        .catch(error => console.error('Error:', error));
    });
});

// Notes Summary for list view
function truncateContent(content, maxLength) {
    if (content.length > maxLength) {
        return content.substring(0, maxLength) + '...';
    }
    return content;
}

// Fetch notes for edit, then close notes after edit with close-btn
function fetchNoteContent(noteId) {
    fetch('/get_note_content/' + noteId)
    .then(response => response.json())
    .then(noteContent => {
        var editForm = document.getElementById('edit-note-form');
        var editContainer = document.querySelector('.edit-note');
        var editInput = document.getElementById('edit-note-input');
        var closeButton = document.querySelector('.close-btn');

        // Populate the form with the fetched content
        editInput.value = noteContent;

        // Set the note ID as a data attribute on the update button
        document.getElementById('update-note-btn').dataset.noteId = noteId;

        // Display the form for editing
        editForm.style.display = 'block';
        editContainer.style.display = 'block'; // container is also displayed

        // Add event listener to the close button to hide the form and the container
        closeButton.addEventListener('click', function() {
            editForm.style.display = 'none';
            editContainer.style.display = 'none'; // Hide the container as well
        });
    })
    .catch(error => console.error('Error:', error));
}

// Open note fucntion
function fetchAndDisplayNotes() {
    fetch('/get_all_notes')
    .then(response => response.json())
    .then(notesList => {
        var notesContainer = document.getElementById('notes-links-container');
        notesContainer.innerHTML = '';  // Clear existing notes

        notesList.forEach(note => {
            var noteElement = document.createElement('div');
            var noteSummary = document.createElement('a');
            noteSummary.href = '#';
            noteSummary.className = 'note-summary';
            noteSummary.dataset.noteId = note.id;
            noteSummary.textContent = `Note - ${new Date(note.date).toLocaleString()}: ${truncateContent(note.content, 50)}`;
            noteElement.appendChild(noteSummary);

            // Attach the fetchNoteContent function to the click event of the note summary
            noteSummary.addEventListener('click', function() {
                fetchNoteContent(note.id);
            });

            notesContainer.appendChild(noteElement);
        });
    })
    .catch(error => console.error('Error:', error));
}
document.addEventListener('DOMContentLoaded', fetchAndDisplayNotes);
