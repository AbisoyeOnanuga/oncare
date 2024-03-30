from flask import Flask, request, jsonify, render_template
from flask_pymongo import PyMongo
from bson.json_util import dumps
from bson.objectid import ObjectId
from datetime import datetime
from pymongo import DESCENDING
from os import getenv
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = getenv('MONGO_URI')
mongo = PyMongo(app)

@app.route("/")
def home():
    return render_template("index.html")
@app.route("/patient")
def user():
    return render_template("user.html")
@app.route("/doctor")
def doctor():
    return render_template("doctor.html")

@app.route('/patient/add_note', methods=['POST'])
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
        
@app.route('/patient/get_all_notes', methods=['GET'])
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

@app.route('/patient/get_note_content/<note_id>', methods=['GET'])
def get_note_content(note_id):
    try:
        note = mongo.db.patientnotes.find_one({'_id': ObjectId(note_id)})
        if note:
            return jsonify(note['content'])
        else:
            return jsonify({'error': 'Note not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/patient/update_note/<note_id>', methods=['POST'])
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

@app.route('/patient/delete_note/<note_id>', methods=['DELETE'])
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

@app.route('/doctor/get_all_patients', methods=['GET'])
def get_all_patients():
    # Use aggregation to get a distinct list of user_ids
    pipeline = [
        {"$group": {"_id": "$user_id", "count": {"$sum": 1}}}
    ]
    patients = mongo.db.patientnotes.aggregate(pipeline)
    patients_list = [{"id": patient["_id"], "name": "Patient " + patient["_id"]} for patient in patients]
    return jsonify(patients_list)

@app.route('/doctor/get_patient_notes/<patientId>', methods=['GET'])
def get_patient_notes(patientId):
    # Fetch notes for a specific patient from the 'patientnotes' collection
    patient_notes = mongo.db.patientnotes.find({'user_id': patientId}).sort('date', DESCENDING)
    notes_list = []
    for note in patient_notes:
        notes_list.append({
            'id': str(note['_id']),
            'content': note['content'],
            'date': note['created_at'],
            'last updated': note['updated_at']
        })
    return jsonify(notes_list)

@app.route('/doctor/get_patient_content/<note_id>', methods=['GET'])
def get_patient_content(note_id):
    try:
        note = mongo.db.patientnotes.find_one({'_id': ObjectId(note_id)})
        if note:
            return jsonify(note['content'])
        else:
            return jsonify({'error': 'Note not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/doctor/add_response_to_note/<note_id>', methods=['POST'])
def add_response_to_note(note_id):
    try:
        data = request.get_json()
        # Add the doctor's response to the patient's note
        result = mongo.db.patientnotes.update_one(
            {'_id': ObjectId(note_id)},
            {'$push': {'doctor_responses': {
                'doctor_id': data['doctor_id'],  # Replace with actual doctor ID
                'response_content': data['response_content'],
                'timestamp': datetime.now()
            }}}
        )
        if result.modified_count:
            return jsonify({'result': 'Response added'}), 200
        else:
            return jsonify({'error': 'Note not found or response not added'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
