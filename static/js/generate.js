// Function to show or hide elements by ID
function toggleDisplay(elementId, show) {
    const element = document.getElementById(elementId);
    element.style.display = show ? 'unset' : 'none';
}
document.getElementById('analyse-note-btn').addEventListener('click', () => {
    // Get the medication list and side effects note from the frontend
    const medicationListDiv = document.getElementById('medication-list');
    const patientNoteTextarea = document.getElementById('patient-note-text');

    // Extract the data from the elements
    const medications = Array.from(medicationListDiv.getElementsByClassName('medication-entry'))
        .map(entry => ({
            name: entry.querySelector('p:nth-of-type(1) strong').textContent,
            dosage: entry.querySelector('p:nth-of-type(2) strong').textContent,
            frequency: entry.querySelector('p:nth-of-type(3) strong').textContent
        }));
    const sideEffectsNote = patientNoteTextarea.value;

    // Send the data to the backend for analysis
    fetch('/doctor/analyse-note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ medications, sideEffectsNote })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Convert markdown to HTML using marked.js
        const renderedHTML = marked(data.analysis);
        // Show the 'analysis-result' element
        toggleDisplay('analysis-result', true);
        // Update the 'analysis-content' element with the rendered HTML
        document.getElementById('analysis-content').innerHTML = renderedHTML;
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally update the UI to show an error message
        document.getElementById('analysis-content').innerHTML = 'Error: ' + error.message;
    });
});
