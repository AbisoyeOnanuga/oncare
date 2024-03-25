function updateNote(noteId) {
    var content = document.getElementById('edit-note-input').value;
    fetch('/update_note/' + noteId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content })
    })
    .then(response => response.json())
    .then(data => {
        if (data.result) {
            alert('Note updated successfully!');
            window.location.reload();
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the note.');
    });
}

// Attach this function to the update button's click event in your HTML
document.getElementById('update-note-btn').addEventListener('click', function() {
    var noteId = this.dataset.noteId; // The note ID should be stored in the button's data attribute
    updateNote(noteId);
});