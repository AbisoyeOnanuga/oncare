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

    function saveMedications() {
        const medications = [];
        document.querySelectorAll('.medication-row').forEach(row => {
            medications.push({
                name: row.querySelector('.medication-name').value,
                dosage: row.querySelector('.dosage').value,
                frequency: row.querySelector('.frequency').value
            });
        });
        // Send the medications array to the Flask backend
        fetch('/patient/update_medications', {
            method: 'POST',
            body: JSON.stringify({ user_id: 'user_id_here', medications }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                alert('Medications updated successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Call saveMedications when needed, e.g., on a save button click
    // Add a save button and its event listener as needed
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
