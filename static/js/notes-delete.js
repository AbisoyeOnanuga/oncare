function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        fetch('/patient/delete_note/' + noteId, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                alert('Note deleted successfully!');
                // Optionally, remove the note from the DOM or refresh the notes list
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the note.');
        });
    }
}

// Attach this function to the delete button's click event in your HTML
document.getElementById('delete-note-btn').addEventListener('click', function() {
    var noteId = this.dataset.noteId; // The note ID should be stored in the button's data attribute
    deleteNote(noteId);
});