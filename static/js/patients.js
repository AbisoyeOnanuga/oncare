// Function to toggle visibility of containers
function toggleContainerVisibility(containerClass, show) {
    const containers = document.querySelectorAll(`.${containerClass}`);
    containers.forEach(container => {
        container.style.display = show ? 'block' : 'none';
    });
}

// Function to handle the click event on a patient link
function handlePatientLinkClick(patientId) {
    fetchAndDisplayNotes(patientId);
    // Show the patient-note container and hide the doctor-note container
    toggleContainerVisibility('patient-note', true);
    toggleContainerVisibility('doctor-note', false);
}


// Function to handle the click event on a patient link
function handlePatientLinkClick(patientId) {
    fetchAndDisplayNotes(patientId);
}

// Function to close the note and open a new one from the notes-links-container
function handleBackButtonClick() {
    var notesContainer = document.getElementById('notes-links-container');
    var patientNoteTextarea = document.getElementById('patient-note-textarea');
    var backButton = document.getElementById('back-btn');

    // Hide the textarea and back button, and show the notes container
    patientNoteTextarea.style.display = 'none';
    backButton.style.display = 'none';
    notesContainer.style.display = 'block';
}

// Function to toggle the patient note container
function togglePatientNoteContainer(display) {
    var patientNoteForm = document.getElementById('patient-note-form');
    patientNoteForm.style.display = display === 'none' ? 'block' : 'none';
}

// Notes Summary for list view
function truncateContent(content, maxLength) {
    if (content.length > maxLength) {
        return content.substring(0, maxLength) + '...';
    }
    return content;
}

function fetchAndDisplayNotes(patientId) {
    fetch(`/doctor/get_patient_notes/${patientId}`)
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
        // After fetching, call togglePatientNoteContainer to show the notes
        togglePatientNoteContainer();
    })
    .catch(error => console.error('Error:', error));
}

// Function to fetch and display patients
function fetchAndDisplayPatients() {
    fetch('/doctor/get_all_patients')
    .then(response => response.json())
    .then(patientsList => {
        var patientsContainer = document.getElementById('patients-links-container');
        patientsContainer.innerHTML = '';  // Clear existing patients
        patientsList.forEach(patient => {
            var patientElement = document.createElement('div');
            var patientLink = document.createElement('a');
            patientLink.href = '#';
            patientLink.className = 'patient-link';
            patientLink.dataset.patientId = patient.id;
            patientLink.textContent = patient.name;
            patientElement.appendChild(patientLink);
            // Attach an event to fetch and display this patient's notes when clicked
            patientLink.addEventListener('click', function() {
                fetchAndDisplayNotes(patient.id);
            });
            patientsContainer.appendChild(patientElement);
        });
    })
    .catch(error => console.error('Error:', error));
    togglePatientNoteContainer();
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayPatients);



// Function to show patient notes
function showPatientNotes(notes) {
    var notesContainer = document.getElementById('notes-links-container');
    var patientNoteTextarea = document.getElementById('patient-note-textarea');
    var backButton = document.getElementById('back-btn');

    // Clear the notes container and hide the textarea and back button
    notesContainer.innerHTML = '';
    patientNoteTextarea.style.display = 'none';
    backButton.style.display = 'none';

    // Populate the notes container with clickable links
    notes.forEach(note => {
        var noteElement = document.createElement('div');
        noteElement.textContent = `Note - ${new Date(note.date).toLocaleString()}: ${note.content}`;
        noteElement.onclick = function() {
            // When a note is clicked, show the textarea and back button, and populate the textarea
            notesContainer.style.display = 'none';
            patientNoteTextarea.style.display = 'block';
            patientNoteTextarea.value = note.content;
            backButton.style.display = 'block';
        };
        notesContainer.appendChild(noteElement);
    });

    // Show the notes container
    notesContainer.style.display = 'block';
}

// Attach event listeners after the DOM content has loaded
document.addEventListener('DOMContentLoaded', function() {
    // Attach event listeners to patient links
    document.querySelectorAll('.patient-link').forEach(link => {
        link.addEventListener('click', function() {
            handlePatientLinkClick(this.dataset.patientId);
        });
    });

    // Attach event listener to the back button
    document.getElementById('back-btn').addEventListener('click', handleBackButtonClick);

    // Attach event listener to the close button
    document.querySelector('.close-btn').addEventListener('click', function() {
        togglePatientNoteContainer(false);
    });
});