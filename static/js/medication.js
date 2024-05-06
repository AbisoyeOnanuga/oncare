document.addEventListener('DOMContentLoaded', () => {
    fetchMedicationContent(); // Call this function when needed (e.g., after the user logs in or when the page loads)
});

document.addEventListener('DOMContentLoaded', () => {
    const medicationList = document.getElementById('medication-list');
    const addMedicationBtn = document.getElementById('add-medication-btn');

    addMedicationBtn.addEventListener('click', () => {
        const newMedicationRow = createMedicationRow();
        medicationList.appendChild(newMedicationRow);
        // Move the add button below the last row
        medicationList.appendChild(addMedicationBtn);
    });

    function createMedicationRow() {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'medication-row';
        rowDiv.innerHTML = `
            <input type="text" class="medication-name" placeholder="Medication Name" required>
            <input type="text" class="dosage" placeholder="Dosage" required>
            <select class="frequency">
                <option value="daily">Once a day</option>
                <option value="weekly">Once a week</option>
                <!-- Add more options as needed -->
            </select>
            <button class="remove-medication-btn">-</button>
        `;
        // Add event listener to remove button
        rowDiv.querySelector('.remove-medication-btn').addEventListener('click', () => {
            rowDiv.remove();
        });
        return rowDiv;
    }

});

/*==================== SAVE MEDICATIONS ====================*/

document.addEventListener('DOMContentLoaded', (event) => {
    // Functionality for adding and removing medication rows is assumed to be defined elsewhere

    // Save button functionality
    document.getElementById('save-medications-btn').addEventListener('click', function(event) {
        event.preventDefault();
        const medications = [];
        document.querySelectorAll('.medication-row').forEach(row => {
            medications.push({
                name: row.querySelector('.medication-name').value,
                dosage: row.querySelector('.dosage').value,
                frequency: row.querySelector('.frequency').value
            });
        });
        var date = new Date().toISOString();
        var userId = document.getElementById('userId').value; // Assuming this value is set correctly

        // Send the medication data and date to the Flask app
        fetch('/patient/save_medications', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                medications: medications,
                date: date
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                alert('Medications saved successfully!');
                window.location.reload(); // Reload the page to reflect the changes
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

/*==================== FETCH MEDICATIONS ====================*/
// Fetch medication data for edit and display it
// Global variable to store all medications
var allMedications = [];

// Function to fetch all medications on page load and store them in allMedications
function fetchAndDisplayMedications() {
    fetch('/patient/get_medications')
    .then(response => response.json())
    .then(medicationsList => {
        allMedications = medicationsList; // Store all medications
        displayMedications(allMedications); // Display all medications initially
    })
    .catch(error => console.error('Error:', error));
}
document.addEventListener('DOMContentLoaded', fetchAndDisplayMedications);

function displayMedications(medications) {
    const medicationListDiv = document.getElementById('medication-list');
    // Check if the medications array is empty and display a message
    if (medications.length === 0) {
        medicationListDiv.innerHTML = '<p>You have not created a medication list yet.</p>';
    } else {
        // Existing code to display medications
        medications.forEach(med => {
            const medEntryDiv = document.createElement('div');
            medEntryDiv.classList.add('medication-entry');
            medEntryDiv.innerHTML = `
                <p>Medication: <strong>${med.name}</strong></p>
                <p>Dosage: <strong>${med.dosage}</strong></p>
                <p>Frequency: <strong>${med.frequency}</strong></p>
            `;
            medicationListDiv.appendChild(medEntryDiv);
        });
    }
}
