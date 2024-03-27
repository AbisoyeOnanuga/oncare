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
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayPatients);