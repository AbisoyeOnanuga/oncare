// Function to show or hide elements by ID
function toggleDisplay(elementId, show) {
    const element = document.getElementById(elementId);
    element.style.display = show ? 'block' : 'none';
}

document.querySelector('.notes-content').style.display = 'none';
// Function to toggle visibility of the notes-content container
function toggleNotesContentVisibility(show) {
    const notesContent = document.querySelector('.notes-content');
    const doctorContent = document.querySelector('.doctor-note');
    const patientContent = document.getElementById('patient-note-form');
    var backBtn = document.getElementById('back-btn')
    notesContent.style.display = show ? 'flex' : 'none';
    patientContent.style.display = 'none';
    backBtn.style.display = 'none';
    doctorContent.style.display = 'none';
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
                toggleNotesContentVisibility(true); // Show the notes-content container
            });
            patientsContainer.appendChild(patientElement);
        });
    })
    .catch(error => console.error('Error:', error));
}


// Notes Summary for list view
function truncateContent(content, maxLength) {
    if (content.length > maxLength) {
        return content.substring(0, maxLength) + '...';
    }
    return content;
}

// Function to fetch and display the content of a specific note
function fetchNoteContent(noteId) {
    fetch('/doctor/get_patient_notes/' + noteId)
    .then(response => response.json())
    .then(noteContent => {
        // Assuming 'patient-note-text' is the correct ID for the textarea
        var patientNoteTextarea = document.getElementById('patient-note-text');

        // Populate the textarea with the fetched content
        patientNoteTextarea.value = noteContent.note; // Ensure you're accessing the note content correctly

        // Show the patient-note-form, back-btn, and doctor-note
        toggleDisplay('patient-note-form', true);
        toggleDisplay('back-btn', true);
        toggleDisplay('doctor-note', true);

        // Hide the notes-links-container
        toggleDisplay('notes-links-container', false);
    })
    .catch(error => console.error('Error:', error));
}

// Function to fetch and display notes for a patient
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
        document.getElementById('notes-links-container').style.display = 'block';
        // Hide the patient-note-form and back-btn by default
        document.getElementById('patient-note-form').style.display = 'none';
        document.getElementById('back-btn').style.display = 'none';
        // Hide the doctor-note by default
        document.querySelector('.doctor-note').style.display = 'none';
        togglePatientNoteContainer();
    })
    .catch(error => console.error('Error:', error));
}

// Event listener for the back button
document.getElementById('back-btn').addEventListener('click', function() {
    // Hide the patient-note-form, back-btn, and doctor-note
    toggleDisplay('patient-note-form', false);
    toggleDisplay('back-btn', false);
    toggleDisplay('doctor-note', false);

    // Show the notes-links-container
    toggleDisplay('notes-links-container', true);
});

// Event listener for the close button in the patient-note container
document.querySelector('.patient-note .close-btn').addEventListener('click', function() {
    // Hide the patient-note container and all its children
    toggleDisplay('patient-note', false);
    toggleDisplay('patient-note-form', false);
    toggleDisplay('back-btn', false);
    toggleDisplay('doctor-note', false);
});

// Event listener for the close button in the doctor-note container
document.querySelector('.doctor-note .close-btn').addEventListener('click', function() {
    toggleDoctorNoteVisibility(false); // Hide the doctor-note container
});

// Attach event listeners after the DOM content has loaded
document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayPatients();
    // Other initialization code...
    toggleDisplay('patient-note-form', false);
    toggleDisplay('back-btn', false);
    toggleDisplay('doctor-note', false);
});

// Attach event listeners after the DOM content has loaded
document.addEventListener('DOMContentLoaded', function() {
    // Attach event listeners to patient links
    document.querySelectorAll('.patient-link').forEach(link => {
        link.addEventListener('click', function() {
            handlePatientLinkClick(this.dataset.patientId);
        });
    });
});

document.querySelector('.close-btn').addEventListener('click', function() {
    toggleNotesContentVisibility(false); // Hide the notes-content container
});

document.getElementById('back-btn').addEventListener('click', function() {
    toggleNotesContentVisibility(false); // Hide the notes-content container
    this.style.display = 'none'; // Hide the back button
});
