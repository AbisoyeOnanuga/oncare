document.addEventListener('DOMContentLoaded', () => {
    const analyseNoteBtn = document.getElementById('analyse-note-btn');
    const analysisResultDiv = document.querySelector('.analysis-result');

    analyseNoteBtn.addEventListener('click', () => {
        const noteContent = { note: 'The content of the note to be analyzed' }; // Replace with actual note content retrieval logic

        fetch('/doctor/analyse-note', {
            method: 'POST',
            body: JSON.stringify(noteContent),
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
