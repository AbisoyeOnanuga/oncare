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
    document.getElementById('save-btn').addEventListener('click', function(event) {
        event.preventDefault();
        var noteContent = document.getElementById('patient-note-input').value;
        var date = new Date().toISOString();
        var userId = document.getElementById('userId').value;
        var userName = document.getElementById('userName').value;
        // Send the note content and date to the Flask app
        fetch('/patient/add_note', {
            method: 'POST',
            body: JSON.stringify({ 
                user_id: userId,
                name: userName,
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

            if (data.result) {
                alert('Note saved successfully!');
                window.location.reload();
            } else {
                alert('Error: ' + data.error);
            }
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
    fetch('/patient/get_note_content/' + noteId)
    .then(response => response.json())
    .then(noteContent => {
        var editForm = document.getElementById('edit-note-form');
        var editContainer = document.querySelector('.edit-note');
        var editInput = document.getElementById('edit-note-input');
        var doctorNote = document.querySelector('.doctor-note');
        var closeButton = document.querySelector('.close-btn');

        // Populate the form with the fetched content
        editInput.value = noteContent;

        // Set the note ID as a data attribute on the update button
        document.getElementById('update-note-btn').dataset.noteId = noteId;

        // Display the form for editing
        editForm.style.display = 'block';
        editContainer.style.display = 'block'; // container is also displayed
        doctorNote.style.display = 'block';

        // Add event listener to the close button to hide the form and the container
        closeButton.addEventListener('click', function() {
            doctorNote.style.display = 'none';
            editForm.style.display = 'none';
            editContainer.style.display = 'none'; // Hide the container as well
        });
    })
    .catch(error => console.error('Error:', error));
}

// Function to fetch the doctor's note based on the noteId for the patient account
function fetchDoctorNoteForPatient(noteId) {
    fetch(`/doctor/get_doctor_note/${noteId}`)
    .then(response => response.json())
    .then(doctorNote => {
        var doctorNoteContainer = document.querySelector('.doctor-note');
        var doctorNoteTextarea = document.querySelector('[name="doctor-note-input"]');
        // Unhide the doctor-note container
        doctorNoteContainer.classList.remove('hidden');
        // Check if there is a doctor's response and populate it
        if (doctorNote && doctorNote.response_content) {
            // Access the doctor's response content correctly
            doctorNoteTextarea.value = doctorNote.response_content;
        } else {
            // If there is no doctor's response, display a placeholder message
            doctorNoteTextarea.value = 'No doctor response yet.';
        }
    })
    .catch(error => console.error('Error fetching doctor note:', error));
}

// Open note fucntion
// Global variable to store all notes
var allNotes = [];

// Function to fetch all notes on page load and store them in allNotes
function fetchAndDisplayNotes() {
    fetch('/patient/get_all_notes')
    .then(response => response.json())
    .then(notesList => {
        allNotes = notesList; // Store all notes
        displayNotes(allNotes); // Display all notes initially
    })
    .catch(error => console.error('Error:', error));
}
document.addEventListener('DOMContentLoaded', fetchAndDisplayNotes);

// Function to display notes
function displayNotes(notesList) {
    var notesContainer = document.getElementById('notes-links-container');
    notesContainer.innerHTML = '';  // Clear existing notes
    
    if (notesList.length === 0) {
        // Display a message if no notes are found
        var noNotesMessage = document.createElement('p');
        noNotesMessage.textContent = 'No notes created on this date.';
        notesContainer.appendChild(noNotesMessage);
    } else {
        // Otherwise, display the notes
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
                fetchDoctorNoteForPatient(note.id);
            });
    
            notesContainer.appendChild(noteElement);
        });
    }
}

// Function to filter notes by date
function filterNotesByDate() {
    const startDate = document.getElementById('start-date-filter').value;
    const endDate = document.getElementById('end-date-filter').value || startDate; // Use the same date if end date is not provided

    // Filter notes based on the selected date(s)
    const filteredNotes = allNotes.filter(note => {
        const noteDate = new Date(note.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return noteDate >= start && noteDate <= end;
    });

    displayNotes(filteredNotes); // Display filtered notes
}

// Event listener for the filter button
document.getElementById('filter-notes-btn').addEventListener('click', filterNotesByDate);


// Event listener for the note-summary link in the patient account
document.querySelectorAll('.note-summary').forEach(item => {
    item.addEventListener('click', function() {
        var noteId = this.dataset.noteId;
        fetchDoctorNoteForPatient(noteId);
        // Additional code to display the patient note content goes here
    });
});
