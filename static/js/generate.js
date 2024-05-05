document.addEventListener('DOMContentLoaded', () => {
    const analyseNoteBtn = document.getElementById('analyse-note-btn');
    const analysisResultDiv = document.querySelector('.analysis-result');
    const patientNoteTextarea = document.getElementById('patient-note-text');

    analyseNoteBtn.addEventListener('click', () => {
        const noteContent = patientNoteTextarea.value; // Get the content of the note from the textarea

        fetch('/doctor/analyse-note', {
            method: 'POST',
            body: JSON.stringify({ note: noteContent }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.analysis) {
                analysisResultDiv.textContent = data.analysis; // Display the analysis result
            } else {
                analysisResultDiv.textContent = 'Analysis failed. Please try again.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            analysisResultDiv.textContent = 'An error occurred while analyzing the note.';
        });
    });
});