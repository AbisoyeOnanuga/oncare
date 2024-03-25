from flask import Flask, request, jsonify, render_template
from flask_pymongo import PyMongo
from bson.json_util import dumps
from bson.objectid import ObjectId
from datetime import datetime
from pymongo import DESCENDING
from os import getenv

app = Flask(__name__)
app.config["MONGO_URI"] = getenv('MONGO_URI')
mongo = PyMongo(app)

@app.route("/")
def home():
    return render_template("user.html")

@app.route('/add_note', methods=['POST'])
def add_note():
    try:
        data = request.get_json()
        note = {
            "user_id": data.get("user_id"),
            "type": data.get("type"),
            "content": data.get("content"),
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        date = datetime.now()  # Use server time for consistency
        # Add the note to the database
        result = mongo.db.patientnotes.insert_one(note)
        return jsonify({'result': 'Note added', 'id': str(result.inserted_id), 'date': date.isoformat()})
    except Exception as e:
        # Log the exception and return an error response
        app.logger.error(f"Error adding note: {e}")
        return jsonify({'error': 'An error occurred while adding the note'}), 500
        
@app.route('/get_all_notes', methods=['GET'])
def get_all_notes():
    # Fetch all notes from the 'patientnotes' collection
    patient_notes = mongo.db.patientnotes.find({}).sort('date', DESCENDING)
    notes_list = []
    for note in patient_notes:
        notes_list.append({
            'id': str(note['_id']),
            'content': note['content'],
            'date': note['created_at'],
            'last updated': note['updated_at']
        })
    return jsonify(notes_list)

@app.route('/get_note_content/<note_id>', methods=['GET'])
def get_note_content(note_id):
    try:
        note = mongo.db.patientnotes.find_one({'_id': ObjectId(note_id)})
        if note:
            return jsonify(note['content'])
        else:
            return jsonify({'error': 'Note not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update_note/<note_id>', methods=['POST'])
def update_note(note_id):
    try:
        data = request.get_json()
        result = mongo.db.patientnotes.update_one(
            {'_id': ObjectId(note_id)},
            {'$set': {'content': data['content'], 'updated_at': datetime.now()}}
        )
        if result.modified_count:
            return jsonify({'result': 'Note updated'}), 200
        else:
            return jsonify({'error': 'Note not found or not updated'}), 404
    except Exception as e:
        return jsonify({'error': 'An error occurred'}), 500

@app.route('/delete_note/<note_id>', methods=['DELETE'])
def delete_note(note_id):
    try:
        # Convert the string ID to a MongoDB ObjectId
        object_id = ObjectId(note_id)
        result = mongo.db.patientnotes.delete_one({'_id': object_id})
        if result.deleted_count:
            return jsonify({'result': 'Note deleted'}), 200
        else:
            return jsonify({'error': 'Note not found'}), 404
    except Exception as e:
        app.logger.error(f"Error deleting note: {e}")
        return jsonify({'error': 'An error occurred while deleting the note'}), 500

@app.route('/add_doctor_note', methods=['POST'])
def add_doctor_note():
    data = request.get_json()
    patient_id = data['patient_id']
    date = data['date']
    # Only add a doctor's note if a patient's note exists for the date
    patient_note = mongo.db.patientnotes.find_one({'patient_id': patient_id, 'date': date})
    if patient_note:
        result = mongo.db.doctornotes.insert_one({'doctor_note': data['note'], 'date': date, 'patient_id': patient_id})
        return jsonify({'result': 'Doctor note added', 'id': str(result.inserted_id)})
    else:
        return jsonify({'error': 'Patient note does not exist for this date'}), 400
        
    
# Run the app
if __name__ == "__main__":
    app.run(debug=True)
