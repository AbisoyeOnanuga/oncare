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

document.addEventListener('DOMContentLoaded', fetchAndDisplayNotes);
document.getElementById('date-filter').addEventListener('change', fetchAndDisplayNotes);

document.addEventListener('DOMContentLoaded', fetchAndDisplayNotes);

function truncateContent(content, maxLength) {
    if (content.length > maxLength) {
        return content.substring(0, maxLength) + '...';
    }
    return content;
}

document.getElementsByClassName('.note-summary').addEventListener('click', function() {
    // Display the patient note form container
    var noteContainer = document.querySelector('.edit-note');
    noteContainer.style.display = noteContainer.style.display === 'none' ? 'block' : 'none';
});

// Close Note Functionality
document.querySelector('.close-btn').addEventListener('click', function() {
    document.querySelector('.edit-note').style.display = 'none';
});

function fetchNoteContent(noteId) {
    fetch('/get_note_content/' + noteId)
    .then(response => response.json())
    .then(noteContent => {
        // Assuming 'noteContent' is the actual content of the note
        var editForm = document.getElementById('edit-note-form');
        var editInput = document.getElementById('edit-note-input');

        // Populate the form with the fetched content
        editInput.value = noteContent;

        // Set the note ID as a data attribute on the update button
        document.getElementById('update-note-btn').dataset.noteId = noteId;

        // Display the form for editing
        editForm.style.display = 'block';
    })
    .catch(error => console.error('Error:', error));
}

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


document.getElementById('update-note-btn').addEventListener('click', function() {
    var noteId = this.dataset.noteId;
    var updatedContent = document.getElementById('edit-note-input').value;

    fetch('/update_note/' + noteId, {
        method: 'POST',
        body: JSON.stringify({ content: updatedContent }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'Note updated') {
            // Handle successful update
            // Update the note summary in the list and hide the edit form
            var noteSummary = document.querySelector(`[data-note-id="${noteId}"]`);
            if (noteSummary) {
                noteSummary.textContent = truncateContent(updatedContent, 50);
            }
            document.getElementById('edit-note-form').style.display = 'none';
        }
    })
    .catch(error => console.error('Error:', error));
});

// Delete Note Functionality
Array.from(document.getElementsByClassName('delete-note-btn')).forEach(button => {
    button.addEventListener('click', function() {
        var noteId = this.closest('.edit-note').querySelector('a').dataset.noteId;
        fetch('/delete_note/' + noteId, {
            method: 'DELETE', // Using DELETE method for deletion
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.result === 'Note deleted') {
                // Remove the note element from the DOM
                this.closest('.notes-content').remove();
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

function filterNotesByDate(date) {
    // Logic to filter notes by date
}
document.getElementById('date-filter').addEventListener('change', filterNotesByDate);