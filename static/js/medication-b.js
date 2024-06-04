// Global variable to store all medications
var allMedications = [];

// Reusable function to create a medication row
function createMedicationRow() {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'medication-row';
    rowDiv.innerHTML = `
        <div class="medication-form">
            <div class="medication-row">
                <input type="text" class="medication-name" placeholder="Medication Name" required>
                <input type="number" class="dosage" placeholder="Dosage" required>
                <select class="dosage-unit">
                    <option value="mg">mg</option>
                    <option value="g">g</option>
                    <option value="mcg">mcg</option>
                    <!-- Add more options as needed -->
                </select>
                <input type="number" class="frequency-value" placeholder="Frequency" required>
                <select class="frequency-unit">
                    <option value="daily">a day</option>
                    <option value="weekly">a week</option>
                    <option value="biweekly">bi-weekly</option>
                    <option value="monthly">a month</option>
                    <!-- Add more options as needed -->
                </select>
                <button class="remove-medication-btn">-</button>
            </div>
        </div>
    `;
    // Event listener for the remove button
    rowDiv.querySelector('.remove-medication-btn').addEventListener('click', () => {
        rowDiv.remove();
    });
    return rowDiv;
}

// Function to display medications
function displayMedications(medications) {
    const medicationListDiv = document.getElementById('medication-group');
    if (medications.length === 0) {
        medicationListDiv.innerHTML = '<p>You have not created a medication list yet.</p>';
    } else {
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

// Function to fetch and display medications
function fetchAndDisplayMedications() {
    fetch('/patient/get_medications')
        .then(response => response.json())
        .then(medicationsList => {
            allMedications = medicationsList;
            displayMedications(allMedications);
        })
        .catch(error => console.error('Error:', error));
}

// Function to collect medication data from the form
function collectMedicationData() {
    const medications = [];
    document.querySelectorAll('.medication-row').forEach(row => {
        const name = row.querySelector('.medication-name').value;
        const dosage = row.querySelector('.dosage').value;
        const dosageUnit = row.querySelector('.dosage-unit').value;
        const frequencyValue = row.querySelector('.frequency-value').value;
        const frequencyUnit = row.querySelector('.frequency-unit').value;

        medications.push({
            name: name,
            dosage: `${dosage} ${dosageUnit}`,
            frequency: `${frequencyValue} ${frequencyUnit}`
        });
    });
    return medications;
}

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayMedications();

    const medicationList = document.getElementById('medication-list');
    const addMedicationBtn = document.getElementById('add-medication-btn');
    const saveMedicationsBtn = document.getElementById('save-medications-btn');

    addMedicationBtn.addEventListener('click', () => {
        const newMedicationRow = createMedicationRow();
        medicationList.appendChild(newMedicationRow);
        medicationList.appendChild(addMedicationBtn);
    });

    saveMedicationsBtn.addEventListener('click', function(event) {
        event.preventDefault();
        const medications = collectMedicationData();
        const date = new Date().toISOString();
        const userId = document.getElementById('userId').value;

        // Check for existing medications with the same name, dosage, and frequency
        const existing_medications = new Set();
        const unique_medications = [];
        for (const med of medications) {
            const med_key = `${med.name}-${med.dosage}-${med.frequency}`;
            if (!existing_medications.has(med_key)) {
                existing_medications.add(med_key);
                unique_medications.push(med);
            }
        }

        // Send the unique medication data and date to the Flask app
        fetch('/patient/save_medications', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                medications: unique_medications,
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
                window.location.reload();
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
